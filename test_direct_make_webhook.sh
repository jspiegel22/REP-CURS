#!/bin/bash

# Test script to send data directly to Make.com webhook
# This bypasses the app completely to test if the webhook works

echo "Sending test data directly to Make.com webhook..."

curl -X POST https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "5551234567",
    "interestType": "group_trip",
    "budget": "$5000-$10000",
    "timeline": "Next 3 months",
    "source": "website",
    "status": "new",
    "formName": "bachelorette-party",
    "formData": {
      "groupSize": "8",
      "specialRequests": "We would like to do a yacht party and VIP club access",
      "eventType": "Bachelorette Party"
    },
    "tags": "Bachelorette Party, Group Travel, Event Planning",
    "webhook_type": "lead"
  }'

echo "Direct webhook test completed. Check Make.com for the event."