import os
import requests
import logging
import json
from typing import Dict, Any, List, Optional

logger = logging.getLogger("airtable-connector")

class AirtableConnector:
    """
    Connector class for Airtable API integration
    """
    def __init__(self, api_key: str = None, base_id: str = None):
        # Get API key from parameter or environment variable, explicitly cast to string
        api_key_env = os.environ.get("AIRTABLE_API_KEY")
        self.api_key = api_key if api_key is not None else str(api_key_env) if api_key_env is not None else None
        
        # Get Base ID from parameter or environment variable, explicitly cast to string
        base_id_env = os.environ.get("AIRTABLE_BASE_ID")
        self.base_id = base_id if base_id is not None else str(base_id_env) if base_id_env is not None else None
        
        if not self.api_key:
            raise ValueError("Missing Airtable API key. Please provide it or set AIRTABLE_API_KEY environment variable.")
        
        if not self.base_id:
            raise ValueError("Missing Airtable Base ID. Please provide it or set AIRTABLE_BASE_ID environment variable.")
            
        self.api_url = f"https://api.airtable.com/v0/{self.base_id}"
        
        # Set up headers for API requests
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Ensure required tables exist
        self._ensure_tables_exist()
    
    def create_record(self, table_name: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new record in the specified Airtable table
        
        Args:
            table_name: Name of the table to add record to
            fields: Dictionary of field names and values
            
        Returns:
            The created record as returned by Airtable API
        """
        url = f"{self.api_url}/{table_name}"
        payload = {"fields": fields}
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()  # Raise exception for HTTP errors
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error creating Airtable record: {e}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Response: {e.response.text}")
            raise
    
    def get_records(self, table_name: str, formula: Optional[str] = None, 
                   max_records: Optional[int] = None, view: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get records from the specified Airtable table with optional filtering
        
        Args:
            table_name: Name of the table to retrieve records from
            formula: Optional formula to filter records (Airtable formula syntax)
            max_records: Optional maximum number of records to return
            view: Optional view name to use
            
        Returns:
            List of records
        """
        url = f"{self.api_url}/{table_name}"
        params = {}
        
        if formula:
            params["filterByFormula"] = formula
        if max_records:
            params["maxRecords"] = max_records
        if view:
            params["view"] = view
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("records", [])
        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting Airtable records: {e}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Response: {e.response.text}")
            raise
    
    def update_record(self, table_name: str, record_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing record in the specified Airtable table
        
        Args:
            table_name: Name of the table to update record in
            record_id: ID of the record to update
            fields: Dictionary of field names and values to update
            
        Returns:
            The updated record as returned by Airtable API
        """
        url = f"{self.api_url}/{table_name}/{record_id}"
        payload = {"fields": fields}
        
        try:
            response = requests.patch(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error updating Airtable record: {e}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Response: {e.response.text}")
            raise
    
    def delete_record(self, table_name: str, record_id: str) -> Dict[str, Any]:
        """
        Delete a record from the specified Airtable table
        
        Args:
            table_name: Name of the table to delete record from
            record_id: ID of the record to delete
            
        Returns:
            The deleted record ID and confirmation
        """
        url = f"{self.api_url}/{table_name}/{record_id}"
        
        try:
            response = requests.delete(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error deleting Airtable record: {e}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Response: {e.response.text}")
            raise
    
    def find_record(self, table_name: str, field_name: str, field_value: Any) -> Optional[Dict[str, Any]]:
        """
        Find a record by a specific field value
        
        Args:
            table_name: Name of the table to search in
            field_name: Name of the field to search by
            field_value: Value to search for
            
        Returns:
            The first matching record or None if not found
        """
        formula = f"{{{field_name}}} = '{field_value}'"
        if isinstance(field_value, (int, float)):
            formula = f"{{{field_name}}} = {field_value}"
            
        records = self.get_records(table_name, formula=formula, max_records=1)
        return records[0] if records else None
    
    def _ensure_tables_exist(self) -> None:
        """
        Ensure that the required tables exist in Airtable
        If tables don't exist, this will at least verify API access
        """
        required_tables = ["Leads", "Bookings", "Guide Requests"]
        
        try:
            # Get list of tables (bases) from Airtable
            url = f"https://api.airtable.com/v0/meta/bases/{self.base_id}/tables"
            response = requests.get(url, headers=self.headers)
            
            if response.status_code == 200:
                tables = response.json().get("tables", [])
                existing_table_names = [table.get("name") for table in tables]
                
                logger.info(f"Airtable tables found: {existing_table_names}")
                
                # Check for missing tables and log a warning
                for required_table in required_tables:
                    if required_table not in existing_table_names:
                        logger.warning(f"Required Airtable table '{required_table}' not found. Make.com integration is recommended.")
            else:
                logger.warning(f"Could not verify Airtable tables: {response.status_code} - {response.text}")
                logger.info("Make.com integration is recommended for more reliable data delivery.")
        except Exception as e:
            logger.warning(f"Failed to check Airtable tables: {e}")
            logger.info("Make.com integration is recommended for more reliable data delivery.")
    
    # Helper methods specifically for our webhook events
    
    def send_lead_to_airtable(self, lead_data: Dict[str, Any], table_name: str = "Leads") -> Dict[str, Any]:
        """
        Process a lead webhook event and send it to Airtable
        """
        # Map the lead data to Airtable fields
        airtable_fields = {
            "First Name": lead_data.get("first_name"),
            "Last Name": lead_data.get("last_name"),
            "Email": lead_data.get("email"),
            "Phone": lead_data.get("phone"),
            "Interest Type": lead_data.get("interest_type"),
            "Source": lead_data.get("source"),
            "Budget": lead_data.get("budget"),
            "Timeline": lead_data.get("timeline"),
            "Tags": ", ".join(lead_data.get("tags", [])) if lead_data.get("tags") else None,
            "Event Type": lead_data.get("event_type"),
            "Tracking ID": lead_data.get("tracking_id"),
            "Notes": json.dumps(lead_data.get("form_data")) if lead_data.get("form_data") else None
        }
        
        # Remove None values
        airtable_fields = {k: v for k, v in airtable_fields.items() if v is not None}
        
        # Send to Airtable
        return self.create_record(table_name, airtable_fields)
    
    def send_booking_to_airtable(self, booking_data: Dict[str, Any], table_name: str = "Bookings") -> Dict[str, Any]:
        """
        Process a booking webhook event and send it to Airtable
        """
        # Map the booking data to Airtable fields
        airtable_fields = {
            "First Name": booking_data.get("first_name"),
            "Last Name": booking_data.get("last_name"),
            "Email": booking_data.get("email"),
            "Phone": booking_data.get("phone"),
            "Booking Type": booking_data.get("booking_type"),
            "Start Date": booking_data.get("start_date"),
            "End Date": booking_data.get("end_date"),
            "Guests": booking_data.get("guests"),
            "Total Amount": booking_data.get("total_amount"),
            "Special Requests": booking_data.get("special_requests"),
            "Event Type": booking_data.get("event_type"),
            "Tracking ID": booking_data.get("tracking_id"),
            "Notes": json.dumps(booking_data.get("form_data")) if booking_data.get("form_data") else None
        }
        
        # Remove None values
        airtable_fields = {k: v for k, v in airtable_fields.items() if v is not None}
        
        # Send to Airtable
        return self.create_record(table_name, airtable_fields)
    
    def send_guide_request_to_airtable(self, guide_data: Dict[str, Any], table_name: str = "Guide Requests") -> Dict[str, Any]:
        """
        Process a guide request webhook event and send it to Airtable
        """
        # Map the guide request data to Airtable fields
        airtable_fields = {
            "First Name": guide_data.get("first_name"),
            "Last Name": guide_data.get("last_name"),
            "Email": guide_data.get("email"),
            "Phone": guide_data.get("phone"),
            "Guide Type": guide_data.get("guide_type"),
            "Interest Areas": ", ".join(guide_data.get("interest_areas", [])) if guide_data.get("interest_areas") else None,
            "Event Type": guide_data.get("event_type"),
            "Tracking ID": guide_data.get("tracking_id"),
            "Notes": json.dumps(guide_data.get("form_data")) if guide_data.get("form_data") else None
        }
        
        # Remove None values
        airtable_fields = {k: v for k, v in airtable_fields.items() if v is not None}
        
        # Send to Airtable
        return self.create_record(table_name, airtable_fields)