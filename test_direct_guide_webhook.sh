#!/bin/bash

# Test script to send a guide request directly to Make.com webhook
# This bypasses the app completely to test if the webhook works

echo "Sending test guide request directly to Make.com webhook..."

# Generate a unique timestamp-based ID
TRACKING_ID=$(date +%s)

curl -X POST https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "5551234567",
    "guideType": "Ultimate Cabo Guide 2025",
    "source": "website",
    "formName": "guide_download",
    "status": "pending",
    "submissionId": "test-'$TRACKING_ID'",
    "interestAreas": "Restaurants, Activities, Villas",
    "tags": "Guide, Travel Planning, Cabo",
    "formData": {
      "interests": "Beachfront dining, water activities",
      "travel_dates": "Summer 2025"
    },
    "tracking_id": "'$TRACKING_ID'",
    "webhook_type": "guide"
  }'

echo "Direct guide webhook test completed. Check Make.com for the event."