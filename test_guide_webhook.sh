#!/bin/bash

# Test script to send a guide request form submission directly to the API
# This helps test the webhook functionality without going through the UI

echo "Sending test guide request form submission..."

curl -X POST http://localhost:5000/api/guide-submissions \
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
    "submissionId": "test-'$(date +%s)'",
    "interestAreas": "Restaurants, Activities, Villas",
    "tags": "Guide, Travel Planning, Cabo",
    "formData": {
      "interests": "Beachfront dining, water activities",
      "travel_dates": "Summer 2025"
    }
  }'

echo "Test guide submission completed."