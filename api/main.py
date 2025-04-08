from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import requests
import json
import logging
from datetime import datetime, date
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("webhook-api")

app = FastAPI(
    title="Cabo Travels Webhook API",
    description="API for sending webhook notifications to external services",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(os.environ.get("DATABASE_URL"))
        conn.cursor_factory = RealDictCursor
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Webhook configurations
class WebhookTarget(BaseModel):
    id: Optional[int] = None
    name: str
    url: str
    service_type: str = Field(..., example="zapier, make, airtable, custom")
    auth_header: Optional[str] = None
    is_active: bool = True
    events: List[str] = Field(..., example=["lead.created", "booking.created", "guide.requested"])
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class WebhookDelivery(BaseModel):
    id: Optional[int] = None
    webhook_id: int
    event: str
    payload: Dict[Any, Any]
    response_status: Optional[int] = None
    response_body: Optional[str] = None
    created_at: Optional[datetime] = None
    attempts: int = 0
    success: bool = False

# Event types
class LeadEvent(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    interest_type: str
    source: str = "website"
    budget: Optional[str] = None
    timeline: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None

class BookingEvent(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    booking_type: str
    start_date: Union[str, datetime, date]
    end_date: Union[str, datetime, date]
    guests: int
    total_amount: Optional[float] = None
    special_requests: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None

class GuideRequestEvent(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    guide_type: str
    interest_areas: Optional[List[str]] = None
    form_data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None

# API Routes

@app.get("/")
async def root():
    return {"message": "Cabo Travels Webhook API is running"}

@app.post("/api/webhooks/setup")
async def setup_webhook(webhook: WebhookTarget, conn=Depends(get_db_connection)):
    """
    Create or update a webhook target configuration
    """
    try:
        cursor = conn.cursor()
        
        # Check if webhook exists
        if webhook.id:
            cursor.execute(
                """
                SELECT id FROM webhook_targets WHERE id = %s
                """,
                (webhook.id,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Webhook not found")
                
            cursor.execute(
                """
                UPDATE webhook_targets 
                SET name = %s, url = %s, service_type = %s, auth_header = %s, 
                    is_active = %s, events = %s, updated_at = NOW()
                WHERE id = %s
                RETURNING id, created_at, updated_at
                """,
                (
                    webhook.name, webhook.url, webhook.service_type, 
                    webhook.auth_header, webhook.is_active, 
                    webhook.events, webhook.id
                )
            )
        else:
            cursor.execute(
                """
                INSERT INTO webhook_targets 
                (name, url, service_type, auth_header, is_active, events, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
                RETURNING id, created_at, updated_at
                """,
                (
                    webhook.name, webhook.url, webhook.service_type, 
                    webhook.auth_header, webhook.is_active, webhook.events
                )
            )
            
        result = cursor.fetchone()
        conn.commit()
        
        # Update the webhook model
        webhook.id = result["id"]
        webhook.created_at = result.get("created_at")
        webhook.updated_at = result.get("updated_at")
        
        return webhook
    except Exception as e:
        conn.rollback()
        logger.error(f"Error setting up webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/api/webhooks")
async def list_webhooks(conn=Depends(get_db_connection)):
    """
    List all webhook targets
    """
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM webhook_targets ORDER BY created_at DESC")
        webhooks = cursor.fetchall()
        return {"webhooks": webhooks}
    except Exception as e:
        logger.error(f"Error listing webhooks: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/webhooks/lead")
async def send_lead_webhook(lead: LeadEvent, conn=Depends(get_db_connection)):
    """
    Send a lead event to all registered webhooks
    """
    try:
        # Set created_at if not provided
        if not lead.created_at:
            lead.created_at = datetime.now()
            
        # Generate a unique tracking ID
        tracking_id = str(uuid.uuid4())
        
        # Prepare the payload
        payload = lead.dict()
        payload["event_type"] = "lead.created"
        payload["tracking_id"] = tracking_id
        
        # Get active webhooks for this event type
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM webhook_targets 
            WHERE is_active = TRUE AND %s = ANY(events)
            """,
            ("lead.created",)
        )
        webhooks = cursor.fetchall()
        
        if not webhooks:
            return {"status": "success", "message": "No active webhooks for lead events", "tracking_id": tracking_id}
        
        results = []
        for webhook in webhooks:
            # Send the webhook
            delivery = await _send_webhook(webhook, "lead.created", payload, conn)
            results.append({
                "webhook_name": webhook["name"],
                "success": delivery.success,
                "status": delivery.response_status
            })
        
        return {
            "status": "success", 
            "tracking_id": tracking_id,
            "results": results
        }
    except Exception as e:
        logger.error(f"Error sending lead webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/webhooks/booking")
async def send_booking_webhook(booking: BookingEvent, conn=Depends(get_db_connection)):
    """
    Send a booking event to all registered webhooks
    """
    try:
        # Set created_at if not provided
        if not booking.created_at:
            booking.created_at = datetime.now()
            
        # Generate a unique tracking ID
        tracking_id = str(uuid.uuid4())
        
        # Convert dates to string format if they're datetime objects
        if isinstance(booking.start_date, (datetime, date)):
            booking.start_date = booking.start_date.isoformat()
        if isinstance(booking.end_date, (datetime, date)):
            booking.end_date = booking.end_date.isoformat()
            
        # Prepare the payload
        payload = booking.dict()
        payload["event_type"] = "booking.created"
        payload["tracking_id"] = tracking_id
        
        # Get active webhooks for this event type
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM webhook_targets 
            WHERE is_active = TRUE AND %s = ANY(events)
            """,
            ("booking.created",)
        )
        webhooks = cursor.fetchall()
        
        if not webhooks:
            return {"status": "success", "message": "No active webhooks for booking events", "tracking_id": tracking_id}
        
        results = []
        for webhook in webhooks:
            # Send the webhook
            delivery = await _send_webhook(webhook, "booking.created", payload, conn)
            results.append({
                "webhook_name": webhook["name"],
                "success": delivery.success,
                "status": delivery.response_status
            })
        
        return {
            "status": "success", 
            "tracking_id": tracking_id,
            "results": results
        }
    except Exception as e:
        logger.error(f"Error sending booking webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/webhooks/guide-request")
async def send_guide_request_webhook(guide: GuideRequestEvent, conn=Depends(get_db_connection)):
    """
    Send a guide request event to all registered webhooks
    """
    try:
        # Set created_at if not provided
        if not guide.created_at:
            guide.created_at = datetime.now()
            
        # Generate a unique tracking ID
        tracking_id = str(uuid.uuid4())
        
        # Prepare the payload
        payload = guide.dict()
        payload["event_type"] = "guide.requested"
        payload["tracking_id"] = tracking_id
        
        # Get active webhooks for this event type
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM webhook_targets 
            WHERE is_active = TRUE AND %s = ANY(events)
            """,
            ("guide.requested",)
        )
        webhooks = cursor.fetchall()
        
        if not webhooks:
            return {"status": "success", "message": "No active webhooks for guide request events", "tracking_id": tracking_id}
        
        results = []
        for webhook in webhooks:
            # Send the webhook
            delivery = await _send_webhook(webhook, "guide.requested", payload, conn)
            results.append({
                "webhook_name": webhook["name"],
                "success": delivery.success,
                "status": delivery.response_status
            })
        
        return {
            "status": "success", 
            "tracking_id": tracking_id,
            "results": results
        }
    except Exception as e:
        logger.error(f"Error sending guide request webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/webhooks/deliveries")
async def list_webhook_deliveries(
    limit: int = 100, 
    event_type: Optional[str] = None,
    webhook_id: Optional[int] = None,
    success: Optional[bool] = None,
    conn=Depends(get_db_connection)
):
    """
    List webhook delivery history with filtering options
    """
    try:
        cursor = conn.cursor()
        
        # Build the query based on filters
        query = "SELECT * FROM webhook_deliveries"
        params = []
        where_clauses = []
        
        if event_type:
            where_clauses.append("event = %s")
            params.append(event_type)
            
        if webhook_id:
            where_clauses.append("webhook_id = %s")
            params.append(webhook_id)
            
        if success is not None:
            where_clauses.append("success = %s")
            params.append(success)
            
        if where_clauses:
            query += " WHERE " + " AND ".join(where_clauses)
            
        query += " ORDER BY created_at DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(query, tuple(params))
        deliveries = cursor.fetchall()
        
        return {"deliveries": deliveries}
    except Exception as e:
        logger.error(f"Error listing webhook deliveries: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/webhooks/retry/{delivery_id}")
async def retry_webhook(delivery_id: int, conn=Depends(get_db_connection)):
    """
    Retry a failed webhook delivery
    """
    try:
        cursor = conn.cursor()
        
        # Get the delivery record
        cursor.execute(
            "SELECT * FROM webhook_deliveries WHERE id = %s",
            (delivery_id,)
        )
        delivery = cursor.fetchone()
        
        if not delivery:
            raise HTTPException(status_code=404, detail="Webhook delivery not found")
        
        # Get the webhook target
        cursor.execute(
            "SELECT * FROM webhook_targets WHERE id = %s",
            (delivery["webhook_id"],)
        )
        webhook = cursor.fetchone()
        
        if not webhook or not webhook["is_active"]:
            raise HTTPException(status_code=400, detail="Associated webhook is not active or doesn't exist")
        
        # Retry the webhook
        new_delivery = await _send_webhook(
            webhook, 
            delivery["event"], 
            delivery["payload"],
            conn,
            is_retry=True,
            original_delivery_id=delivery_id
        )
        
        return {
            "status": "success",
            "delivery": new_delivery.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrying webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Helper function to send a webhook
async def _send_webhook(webhook, event, payload, conn, is_retry=False, original_delivery_id=None):
    """
    Send a webhook notification and record the delivery
    """
    delivery = WebhookDelivery(
        webhook_id=webhook["id"],
        event=event,
        payload=payload,
        attempts=1
    )
    
    headers = {"Content-Type": "application/json"}
    if webhook["auth_header"]:
        # Parse auth header which should be in format "Name: Value"
        try:
            header_name, header_value = webhook["auth_header"].split(":", 1)
            headers[header_name.strip()] = header_value.strip()
        except ValueError:
            logger.warning(f"Invalid auth header format for webhook {webhook['id']}")
    
    try:
        response = requests.post(
            webhook["url"],
            json=payload,
            headers=headers,
            timeout=10
        )
        
        delivery.response_status = response.status_code
        delivery.response_body = response.text[:1000]  # Limit response size
        delivery.success = 200 <= response.status_code < 300
        
        # Update retry information if needed
        if is_retry and original_delivery_id:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE webhook_deliveries 
                SET retried = TRUE, retry_delivery_id = %s
                WHERE id = %s
                """,
                (delivery.id, original_delivery_id)
            )
            conn.commit()
            cursor.close()
            
    except requests.RequestException as e:
        delivery.response_status = 0
        delivery.response_body = str(e)
        delivery.success = False
        logger.error(f"Webhook delivery error: {e}")
    
    # Record the delivery in database
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO webhook_deliveries 
        (webhook_id, event, payload, response_status, response_body, created_at, attempts, success)
        VALUES (%s, %s, %s, %s, %s, NOW(), %s, %s)
        RETURNING id, created_at
        """,
        (
            delivery.webhook_id, delivery.event, 
            json.dumps(delivery.payload), delivery.response_status,
            delivery.response_body, delivery.attempts, delivery.success
        )
    )
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    delivery.id = result["id"]
    delivery.created_at = result["created_at"]
    
    return delivery

# Create the required tables if they don't exist
@app.on_event("startup")
async def startup_event():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Create webhook_targets table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS webhook_targets (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            service_type TEXT NOT NULL,
            auth_header TEXT,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            events TEXT[] NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
        """)
        
        # Create webhook_deliveries table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS webhook_deliveries (
            id SERIAL PRIMARY KEY,
            webhook_id INTEGER NOT NULL REFERENCES webhook_targets(id),
            event TEXT NOT NULL,
            payload JSONB NOT NULL,
            response_status INTEGER,
            response_body TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            attempts INTEGER NOT NULL DEFAULT 1,
            success BOOLEAN NOT NULL DEFAULT FALSE,
            retried BOOLEAN DEFAULT FALSE,
            retry_delivery_id INTEGER
        )
        """)
        
        conn.commit()
        logger.info("Database tables initialized")
    except Exception as e:
        logger.error(f"Error initializing database tables: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)