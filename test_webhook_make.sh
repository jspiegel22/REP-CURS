#!/bin/bash

# Script to test the Make.com webhook integration through the FastAPI server
# This assumes you have the FastAPI webhook server running

echo "Testing Make.com webhook integration via API server..."
echo ""

# Define API URL
API_URL=${WEBHOOK_API_URL:-"http://localhost:8000/api"}

# Check if webhook server is running
echo "Checking webhook server status..."
if ! curl -s "$API_URL/health" > /dev/null; then
  echo "ERROR: Webhook server not running at $API_URL"
  echo "Please start the webhook server first:"
  echo "cd api && uvicorn main:app --host 0.0.0.0 --port 8000"
  exit 1
fi

echo "Webhook server is running!"
echo ""

# Test guide request webhook
echo "Sending test guide request webhook..."
curl -X POST "$API_URL/guides/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "guide_type": "Cabo Travel Guide",
    "interest_areas": ["Restaurants", "Beaches", "Activities"],
    "form_data": {
      "source": "Test Script",
      "formName": "test-webhook",
      "preferredContactMethod": "Email"
    },
    "tags": ["Test", "Webhook", "Make.com"]
  }'

echo ""
echo ""
echo "Test completed!"
echo "Check the webhook server logs and Make.com scenario for incoming webhook data."
echo ""
echo "If you want to check webhook delivery history, run:"
echo "curl $API_URL/admin/webhook-deliveries"