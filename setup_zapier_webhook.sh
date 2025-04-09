#!/bin/bash

# Replace this URL with your Zapier webhook URL
ZAPIER_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/XXXXXXX/YYYYYYY/"

# Helper script to set up a webhook target for Zapier
echo "Setting up Zapier webhook integration..."

curl -X POST http://localhost:8000/api/webhooks/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zapier Integration",
    "url": "'"$ZAPIER_WEBHOOK_URL"'",
    "service_type": "zapier",
    "events": ["lead.created", "booking.created", "guide.requested"],
    "is_active": true
  }'

echo -e "\n\nZapier webhook setup complete. Check the webhook server logs for results."
echo "To verify the setup, run: curl http://localhost:8000/api/webhooks"