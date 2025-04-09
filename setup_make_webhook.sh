#!/bin/bash

# Script to set up a Make.com webhook in the database
# This assumes you have the FastAPI webhook server running

echo "Setting up Make.com webhook integration..."
echo ""

# Get the Make.com webhook URL from environment or prompt user
if [ -z "$MAKE_WEBHOOK_URL" ]; then
  echo "MAKE_WEBHOOK_URL not found in environment"
  echo "Please enter your Make.com webhook URL:"
  read MAKE_WEBHOOK_URL

  if [ -z "$MAKE_WEBHOOK_URL" ]; then
    echo "No webhook URL provided. Exiting."
    exit 1
  fi
fi

echo "Using webhook URL: $MAKE_WEBHOOK_URL"
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

# Register the Make.com webhook
echo "Registering Make.com webhook..."
curl -X POST "$API_URL/webhooks/setup" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Make.com Integration\",
    \"url\": \"$MAKE_WEBHOOK_URL\",
    \"service_type\": \"make\",
    \"is_active\": true,
    \"events\": [\"lead.created\", \"booking.created\", \"guide.requested\"]
  }"

echo ""
echo ""
echo "Make.com webhook setup complete!"
echo "Your webhook will now receive events from the Cabo application."
echo ""
echo "To test the webhook, run: ./test_webhook_make.sh"