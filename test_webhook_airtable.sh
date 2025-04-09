#!/bin/bash

# Test script for sending data to the webhook server and Airtable

echo "Testing webhook server with Airtable integration..."

# Test 1: Submit a lead
echo -e "\n=== Test 1: Submitting a lead request ==="
curl -X POST http://localhost:8000/api/leads/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test.user@example.com",
    "phone": "+1 555-123-4567",
    "interest_type": "villa",
    "source": "website",
    "budget": "5000-10000",
    "timeline": "next 3 months",
    "form_data": {
      "referral_source": "Google",
      "preferred_contact_time": "Morning" 
    },
    "tags": ["Lead", "Website", "Villa Interest"]
  }'

sleep 2

# Test 2: Submit a booking
echo -e "\n=== Test 2: Submitting a booking request ==="
curl -X POST http://localhost:8000/api/bookings/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "Booker",
    "email": "test.booker@example.com",
    "phone": "+1 555-987-6543",
    "booking_type": "villa",
    "start_date": "2025-07-15",
    "end_date": "2025-07-22",
    "guests": 4,
    "total_amount": 6500.00,
    "special_requests": "Ocean view preferred, early check-in if possible",
    "form_data": {
      "property_name": "Casa Vista Del Mar",
      "payment_method": "credit_card"
    },
    "tags": ["Booking", "Website", "Villa"]
  }'

sleep 2

# Test 3: Submit a guide request
echo -e "\n=== Test 3: Submitting a guide request ==="
curl -X POST http://localhost:8000/api/guides/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Guide",
    "last_name": "Requester",
    "email": "guide.requester@example.com",
    "phone": "+1 555-456-7890",
    "guide_type": "Cabo Adventure Guide",
    "interest_areas": ["Snorkeling", "Restaurants", "Excursions"],
    "form_data": {
      "how_heard": "Instagram",
      "travel_date": "2025-08"
    },
    "tags": ["Guide Request", "Website"]
  }'

echo -e "\n\nTests completed. Check the webhook server logs and Airtable for results."