from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from datetime import datetime, date
import uuid
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import requests
import logging
from airtable_connector import AirtableConnector

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("webhook-server")

# Create FastAPI app
app = FastAPI(title="Cabo Webhook API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection helper
def get_db_connection():
    """Get a connection to the PostgreSQL database"""
    conn = psycopg2.connect(
        os.environ.get("DATABASE_URL"),
        cursor_factory=RealDictCursor
    )
    try:
        yield conn
    finally:
        conn.close()

# Initialize Airtable connector
try:
    airtable = AirtableConnector()
    logger.info("Airtable connector initialized successfully")
except Exception as e:
    logger.warning(f"Airtable connector initialization failed: {e}")
    airtable = None

# Pydantic models for request validation

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
    return {"message": "Cabo Webhook API is running. See /docs for API documentation."}

# AutoBlogger webhook model
class AutoBlogPost(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    slug: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = "travel"
    tags: Optional[List[str]] = None
    publish: bool = True
    
@app.post("/api/webhooks/autoblogger")
async def autoblogger_webhook(
    post: AutoBlogPost, 
    background_tasks: BackgroundTasks,
    x_webhook_signature: Optional[str] = Header(None, alias="X-Webhook-Signature")
):
    """
    Receive and process new blog posts from AutoBlogger AI
    
    This endpoint accepts blog posts from the AutoBlogger system with proper authentication.
    The webhook requires a signature header that matches the configured webhook secret.
    
    - **title**: The blog post title
    - **content**: The full HTML content of the blog post
    - **excerpt**: Optional summary of the post (generated if not provided)
    - **slug**: Optional URL slug (generated from title if not provided)
    - **image_url**: Optional featured image URL
    - **category**: Blog category (defaults to "travel")
    - **tags**: Optional list of tags for the post
    - **publish**: Whether to publish immediately (true) or save as draft (false)
    """
    # Verify webhook secret
    webhook_secret = os.environ.get("WEBHOOK_SECRET")
    if not webhook_secret:
        logger.error("WEBHOOK_SECRET not set in environment")
        raise HTTPException(status_code=500, detail="Webhook secret not configured")
    
    # Verify the signature if provided
    if webhook_secret and x_webhook_signature:
        if x_webhook_signature != webhook_secret:
            logger.warning("Invalid webhook signature")
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
    elif webhook_secret:
        # Secret is set but no signature provided
        logger.warning("Missing webhook signature")
        raise HTTPException(status_code=401, detail="Missing webhook signature")
        
    # Process the blog post
    try:
        # Add unique slug if none provided
        if not post.slug:
            from slugify import slugify
            post.slug = slugify(post.title)
            
        # Add excerpt if none provided
        if not post.excerpt and post.content:
            # Create an excerpt from the first 150 chars of content
            post.excerpt = post.content[:150].rsplit(' ', 1)[0] + '...'
            
        logger.info(f"Received new blog post: {post.title}")
        
        # Save the blog post to the database
        conn = await get_db_connection()
        try:
            status = "published" if post.publish else "draft"
            
            # Convert tags to JSON array if provided
            tags_json = "[]"
            if post.tags:
                tags_json = json.dumps(post.tags)
                
            # Convert category to array for categories field
            categories_json = json.dumps([post.category]) if post.category else "[]"
            
            # Insert the blog post into the database
            cur = await conn.cursor()
            await cur.execute(
                """
                INSERT INTO blog_posts (title, slug, content, excerpt, image_url, 
                                      categories, tags, status, pub_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, slug
                """,
                (post.title, post.slug, post.content, post.excerpt, post.image_url,
                 categories_json, tags_json, status, datetime.now())
            )
            
            result = await cur.fetchone()
            await cur.close()
            
            logger.info(f"Successfully saved blog post to database with ID: {result[0]}")
            
            return {
                "status": "success", 
                "message": "Blog post saved to database",
                "post_id": result[0],
                "post_slug": result[1],
                "callback_url": f"https://{os.environ.get('REPLIT_SLUG', 'localhost')}.replit.app/api/webhooks/autoblogger"
            }
        finally:
            await conn.close()
    except Exception as e:
        logger.error(f"Error processing blog post from AutoBlogger: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing blog post: {str(e)}")

@app.post("/api/webhooks/setup", response_model=WebhookTarget)
async def setup_webhook(webhook: WebhookTarget, conn=Depends(get_db_connection)):
    """
    Create or update a webhook target configuration
    """
    cur = conn.cursor()
    
    try:
        # Create webhook_targets table if it doesn't exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS webhook_targets (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                service_type VARCHAR(100) NOT NULL,
                auth_header TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                events JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create webhook_deliveries table if it doesn't exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS webhook_deliveries (
                id SERIAL PRIMARY KEY,
                webhook_id INTEGER REFERENCES webhook_targets(id),
                event VARCHAR(100) NOT NULL,
                payload JSONB NOT NULL,
                response_status INTEGER,
                response_body TEXT,
                attempts INTEGER DEFAULT 0,
                success BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert or update webhook
        if webhook.id:
            cur.execute("""
                UPDATE webhook_targets 
                SET name = %s, url = %s, service_type = %s, auth_header = %s, 
                    is_active = %s, events = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, url, service_type, auth_header, is_active, events, created_at, updated_at
            """, (
                webhook.name, webhook.url, webhook.service_type, webhook.auth_header,
                webhook.is_active, json.dumps(webhook.events), webhook.id
            ))
        else:
            cur.execute("""
                INSERT INTO webhook_targets (name, url, service_type, auth_header, is_active, events)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, name, url, service_type, auth_header, is_active, events, created_at, updated_at
            """, (
                webhook.name, webhook.url, webhook.service_type, webhook.auth_header,
                webhook.is_active, json.dumps(webhook.events)
            ))
        
        result = cur.fetchone()
        conn.commit()
        
        # Convert events from JSON string to list
        result["events"] = json.loads(result["events"])
        
        return result
    except Exception as e:
        conn.rollback()
        logger.error(f"Error setting up webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Error setting up webhook: {str(e)}")
    finally:
        cur.close()

@app.get("/api/webhooks", response_model=List[WebhookTarget])
async def list_webhooks(conn=Depends(get_db_connection)):
    """
    List all webhook targets
    """
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id, name, url, service_type, auth_header, is_active, events, created_at, updated_at
            FROM webhook_targets
            ORDER BY created_at DESC
        """)
        
        results = cur.fetchall()
        
        # Convert events from JSON string to list for each result
        for result in results:
            result["events"] = json.loads(result["events"])
        
        return results
    except Exception as e:
        logger.error(f"Error listing webhooks: {e}")
        raise HTTPException(status_code=500, detail=f"Error listing webhooks: {str(e)}")
    finally:
        cur.close()

@app.post("/api/leads/webhook")
async def send_lead_webhook(lead: LeadEvent, background_tasks: BackgroundTasks, conn=Depends(get_db_connection)):
    """
    Send a lead event to all registered webhooks
    """
    # Add event type and tracking ID
    lead_dict = lead.dict()
    lead_dict["event_type"] = "lead.created"
    lead_dict["tracking_id"] = str(uuid.uuid4())
    
    # Set created_at if not provided
    if not lead_dict.get("created_at"):
        lead_dict["created_at"] = datetime.now().isoformat()
    
    # Check if Airtable connector is available and send directly to Airtable
    if airtable:
        try:
            background_tasks.add_task(
                airtable.send_lead_to_airtable,
                lead_dict
            )
            logger.info(f"Lead sent to Airtable. Tracking ID: {lead_dict['tracking_id']}")
        except Exception as e:
            logger.error(f"Error sending lead to Airtable: {e}")
    
    # Also send to any registered webhooks
    background_tasks.add_task(
        _send_webhooks_for_event,
        "lead.created",
        lead_dict,
        conn
    )
    
    return {"status": "success", "tracking_id": lead_dict["tracking_id"]}

@app.post("/api/bookings/webhook")
async def send_booking_webhook(booking: BookingEvent, background_tasks: BackgroundTasks, conn=Depends(get_db_connection)):
    """
    Send a booking event to all registered webhooks
    """
    # Add event type and tracking ID
    booking_dict = booking.dict()
    booking_dict["event_type"] = "booking.created"
    booking_dict["tracking_id"] = str(uuid.uuid4())
    
    # Set created_at if not provided
    if not booking_dict.get("created_at"):
        booking_dict["created_at"] = datetime.now().isoformat()
    
    # Check if Airtable connector is available and send directly to Airtable
    if airtable:
        try:
            background_tasks.add_task(
                airtable.send_booking_to_airtable,
                booking_dict
            )
            logger.info(f"Booking sent to Airtable. Tracking ID: {booking_dict['tracking_id']}")
        except Exception as e:
            logger.error(f"Error sending booking to Airtable: {e}")
    
    # Also send to any registered webhooks
    background_tasks.add_task(
        _send_webhooks_for_event,
        "booking.created",
        booking_dict,
        conn
    )
    
    return {"status": "success", "tracking_id": booking_dict["tracking_id"]}

@app.post("/api/guides/webhook")
async def send_guide_request_webhook(guide: GuideRequestEvent, background_tasks: BackgroundTasks, conn=Depends(get_db_connection)):
    """
    Send a guide request event to all registered webhooks
    """
    # Add event type and tracking ID
    guide_dict = guide.dict()
    guide_dict["event_type"] = "guide.requested"
    guide_dict["tracking_id"] = str(uuid.uuid4())
    
    # Set created_at if not provided
    if not guide_dict.get("created_at"):
        guide_dict["created_at"] = datetime.now().isoformat()
    
    # Check if Airtable connector is available and send directly to Airtable
    if airtable:
        try:
            background_tasks.add_task(
                airtable.send_guide_request_to_airtable,
                guide_dict
            )
            logger.info(f"Guide request sent to Airtable. Tracking ID: {guide_dict['tracking_id']}")
        except Exception as e:
            logger.error(f"Error sending guide request to Airtable: {e}")
    
    # Also send to any registered webhooks
    background_tasks.add_task(
        _send_webhooks_for_event,
        "guide.requested",
        guide_dict,
        conn
    )
    
    return {"status": "success", "tracking_id": guide_dict["tracking_id"]}

# Admin routes

@app.get("/api/admin/webhook-deliveries")
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
    cur = conn.cursor()
    
    try:
        query = """
            SELECT d.*, w.name as webhook_name, w.url as webhook_url
            FROM webhook_deliveries d
            JOIN webhook_targets w ON d.webhook_id = w.id
            WHERE 1=1
        """
        params = []
        
        if event_type:
            query += " AND d.event = %s"
            params.append(event_type)
        
        if webhook_id:
            query += " AND d.webhook_id = %s"
            params.append(webhook_id)
        
        if success is not None:
            query += " AND d.success = %s"
            params.append(success)
        
        query += " ORDER BY d.created_at DESC LIMIT %s"
        params.append(limit)
        
        cur.execute(query, tuple(params))
        
        results = cur.fetchall()
        
        return results
    except Exception as e:
        logger.error(f"Error listing webhook deliveries: {e}")
        raise HTTPException(status_code=500, detail=f"Error listing webhook deliveries: {str(e)}")
    finally:
        cur.close()

@app.post("/api/admin/webhook-retry/{delivery_id}")
async def retry_webhook(delivery_id: int, background_tasks: BackgroundTasks, conn=Depends(get_db_connection)):
    """
    Retry a failed webhook delivery
    """
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT d.*, w.url, w.auth_header
            FROM webhook_deliveries d
            JOIN webhook_targets w ON d.webhook_id = w.id
            WHERE d.id = %s
        """, (delivery_id,))
        
        delivery = cur.fetchone()
        
        if not delivery:
            raise HTTPException(status_code=404, detail="Webhook delivery not found")
        
        # Retry the webhook in the background
        background_tasks.add_task(
            _send_webhook,
            {
                "id": delivery["webhook_id"],
                "url": delivery["url"],
                "auth_header": delivery["auth_header"]
            },
            delivery["event"],
            delivery["payload"],
            conn,
            is_retry=True,
            original_delivery_id=delivery_id
        )
        
        return {"status": "success", "message": "Webhook retry initiated"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrying webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrying webhook: {str(e)}")
    finally:
        cur.close()

# Helper functions

async def _send_webhooks_for_event(event: str, payload: Dict[Any, Any], conn):
    """
    Send an event to all registered webhooks that are subscribed to the event type
    """
    try:
        cur = conn.cursor()
        
        # Get all active webhooks that are subscribed to this event
        cur.execute("""
            SELECT id, url, auth_header
            FROM webhook_targets
            WHERE is_active = TRUE AND events::jsonb ? %s
        """, (event,))
        
        webhooks = cur.fetchall()
        
        for webhook in webhooks:
            await _send_webhook(webhook, event, payload, conn)
            
    except Exception as e:
        logger.error(f"Error sending webhooks for event {event}: {e}")
    finally:
        if 'cur' in locals():
            cur.close()

async def _send_webhook(webhook, event, payload, conn, is_retry=False, original_delivery_id=None):
    """
    Send a webhook notification and record the delivery
    """
    cur = conn.cursor()
    
    try:
        # Record the delivery attempt
        if not is_retry:
            cur.execute("""
                INSERT INTO webhook_deliveries (webhook_id, event, payload)
                VALUES (%s, %s, %s)
                RETURNING id
            """, (webhook["id"], event, json.dumps(payload)))
            
            delivery_id = cur.fetchone()["id"]
            conn.commit()
        else:
            delivery_id = original_delivery_id
            
            # Update attempt count
            cur.execute("""
                UPDATE webhook_deliveries 
                SET attempts = attempts + 1
                WHERE id = %s
            """, (delivery_id,))
            conn.commit()
        
        # Send the webhook
        headers = {"Content-Type": "application/json"}
        
        if webhook.get("auth_header"):
            # Parse the auth header (expected format: "Key: Value")
            try:
                key, value = webhook["auth_header"].split(":", 1)
                headers[key.strip()] = value.strip()
            except ValueError:
                # If no colon, use as Bearer token
                headers["Authorization"] = f"Bearer {webhook['auth_header'].strip()}"
        
        response = requests.post(
            webhook["url"],
            json=payload,
            headers=headers,
            timeout=10  # 10 second timeout
        )
        
        # Record the result
        cur.execute("""
            UPDATE webhook_deliveries 
            SET response_status = %s, response_body = %s, success = %s
            WHERE id = %s
        """, (
            response.status_code,
            response.text[:1000],  # Limit response text to 1000 chars
            response.status_code >= 200 and response.status_code < 300,
            delivery_id
        ))
        conn.commit()
        
        logger.info(f"Webhook sent: event={event}, url={webhook['url']}, status={response.status_code}")
        
        if response.status_code < 200 or response.status_code >= 300:
            logger.warning(f"Webhook error: status={response.status_code}, response={response.text[:100]}")
            
    except Exception as e:
        conn.rollback()
        
        # Record the error
        try:
            cur.execute("""
                UPDATE webhook_deliveries 
                SET response_status = 0, response_body = %s, success = FALSE
                WHERE id = %s
            """, (str(e)[:1000], delivery_id))
            conn.commit()
        except Exception as inner_e:
            logger.error(f"Error updating webhook delivery: {inner_e}")
            
        logger.error(f"Error sending webhook: {e}")
    finally:
        cur.close()

# Startup event handler
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Cabo Webhook API...")
    
    # Test database connection
    try:
        conn = next(get_db_connection())
        cur = conn.cursor()
        
        # Create webhook tables if they don't exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS webhook_targets (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                service_type VARCHAR(100) NOT NULL,
                auth_header TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                events JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS webhook_deliveries (
                id SERIAL PRIMARY KEY,
                webhook_id INTEGER REFERENCES webhook_targets(id),
                event VARCHAR(100) NOT NULL,
                payload JSONB NOT NULL,
                response_status INTEGER,
                response_body TEXT,
                attempts INTEGER DEFAULT 0,
                success BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        logger.info("Database tables initialized")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
    
    logger.info("Cabo Webhook API started successfully")

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)