#!/bin/bash

# Test script to send a bachelorette party form submission directly to the API
# This helps test the webhook functionality without going through the UI

echo "Sending test bachelorette party form submission..."

curl -X POST http://localhost:5000/api/leads \
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
    "tags": ["Bachelorette Party", "Group Travel", "Event Planning"]
  }'

echo "Test submission completed."