#!/bin/bash

# This script helps you set up a webhook integration with Make.com
# Make.com provides a more flexible way to connect to Airtable and other services

# Replace this URL with your Make.com webhook URL
# You can get this by:
# 1. Going to Make.com (https://www.make.com)
# 2. Creating a new scenario
# 3. Adding a "Webhook" trigger as the first module
# 4. Copying the webhook URL

echo "================================================================"
echo "SETUP GUIDE: Creating a Make.com integration for your Cabo site"
echo "================================================================"
echo ""
echo "This script will help you set up a webhook to send data to Make.com"
echo "which can then route it to Airtable, CRM tools, or other systems."
echo ""
echo "Before running this script, you need to:"
echo "1. Create a Make.com account if you don't have one already"
echo "2. Create a new scenario in Make.com with a webhook trigger"
echo "3. Copy the webhook URL provided by Make.com"
echo ""
read -p "Enter your Make.com webhook URL: " MAKE_WEBHOOK_URL

if [ -z "$MAKE_WEBHOOK_URL" ]; then
  echo "Error: You must provide a webhook URL"
  exit 1
fi

if [[ ! $MAKE_WEBHOOK_URL == https://hook* ]]; then
  echo "Error: Invalid webhook URL format. It should start with https://hook"
  exit 1
fi

# Helper script to set up a webhook target for Make.com
echo "Setting up Make.com webhook integration..."

curl -X POST http://localhost:8000/api/webhooks/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Make.com Integration",
    "url": "'"$MAKE_WEBHOOK_URL"'",
    "service_type": "make",
    "events": ["lead.created", "booking.created", "guide.requested"],
    "is_active": true
  }'

echo -e "\n\nMake.com webhook setup complete. Check the webhook server logs for results."
echo "To verify the setup, run: curl http://localhost:8000/api/webhooks"
echo ""
echo "NEXT STEPS IN MAKE.COM:"
echo "1. In your Make.com scenario, set up the data mapping from the webhook"
echo "2. Add a connection to Airtable as the next step"
echo "3. Map the incoming data fields to the appropriate Airtable fields"
echo "4. Turn on your scenario to start receiving data"