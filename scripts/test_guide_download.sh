#!/bin/bash

# Test script to send form submissions for the guide download form
# Test the webhook functionality and mapping to proper columns

echo "Testing Guide Download Form..."
curl -X POST http://localhost:3000/api/guide-submissions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "5559876543",
    "guideType": "Ultimate Cabo Guide 2025",
    "source": "website",
    "status": "pending",
    "interestAreas": "Ultimate Cabo Guide 2025",
    "tags": "Guide Request, Website",
    "formName": "ultimate-cabo-guide-2025-guide",
    "formData": {
      "investmentLevel": "$5000-$10000",
      "agentInterest": true,
      "preferredContactMethod": "Email",
      "requestType": "Guide Download"
    }
  }'

echo ""
echo "This test simulates a submission from the guide download popup with the following mapping:"
echo "- First Name: Jane"
echo "- Last Name: Doe"
echo "- Email: jane.doe@example.com"
echo "- Phone: 5559876543"
echo "- Guide Type: Ultimate Cabo Guide 2025"
echo "- Source: website"
echo "- Tags: Guide Request, Website"
echo "- Form Name: ultimate-cabo-guide-2025-guide"
echo "- Form Data:"
echo "  - Investment Level: $5000-$10000"
echo "  - Agent Interest: true"
echo "  - Preferred Contact Method: Email"
echo "  - Request Type: Guide Download"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"