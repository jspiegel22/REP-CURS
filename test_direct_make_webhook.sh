#!/bin/bash

# Direct test for Make.com webhook
echo "Testing direct Make.com webhook integration..."
echo "This will send test data directly to your Make.com webhook URL"
echo ""

# Get the Make.com webhook URL from environment or use the provided one
MAKE_URL=${MAKE_WEBHOOK_URL:-"https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2"}

echo "Using webhook URL: $MAKE_URL"
echo ""
echo "Sending sample guide request to Make.com..."

curl -X POST -H "Content-Type: application/json" -d '{
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
}' $MAKE_URL

echo ""
echo ""
echo "Request completed! Check your Make.com scenario to see if it was received."
echo ""
echo "If your scenario is set up correctly in Make.com, you should see a webhook"
echo "execution with the test data. If not, make sure your scenario is turned ON"
echo "and the webhook module is configured to receive data."