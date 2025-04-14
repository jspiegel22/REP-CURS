#!/bin/bash

# Test script to send form submissions for the luxury concierge form
# Test the webhook functionality and mapping to proper columns

echo "Testing Luxury Concierge Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Michael",
    "lastName": "Johnson",
    "email": "michael.johnson@example.com",
    "phone": "5553214567",
    "interestType": "concierge",
    "source": "website",
    "status": "new",
    "budget": "$10000+",
    "timeline": "2024-08-10 to 2024-08-17",
    "tags": "Luxury Concierge, VIP",
    "formName": "luxury-concierge-form",
    "formData": {
      "partySize": "6",
      "specialRequests": "Airport transfers, private chef, yacht rental",
      "checkIn": "2024-08-10",
      "checkOut": "2024-08-17",
      "preferredContactMethod": "Phone",
      "accommodationType": "Beachfront Villa"
    }
  }'

echo ""
echo "This test simulates a submission from the luxury concierge form with the following mapping:"
echo "- First Name: Michael"
echo "- Last Name: Johnson"
echo "- Email: michael.johnson@example.com"
echo "- Phone: 5553214567"
echo "- Interest Type: concierge"
echo "- Source: website"
echo "- Budget: $10000+"
echo "- Timeline: 2024-08-10 to 2024-08-17"
echo "- Tags: Luxury Concierge, VIP"
echo "- Form Name: luxury-concierge-form"
echo "- Form Data:"
echo "  - Party Size: 6"
echo "  - Special Requests: Airport transfers, private chef, yacht rental"
echo "  - Check-in: 2024-08-10"
echo "  - Check-out: 2024-08-17"
echo "  - Preferred Contact Method: Phone" 
echo "  - Accommodation Type: Beachfront Villa"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"