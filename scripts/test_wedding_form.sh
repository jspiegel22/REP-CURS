#!/bin/bash

# Test script to send form submissions for the wedding form
# Test the webhook functionality and mapping to proper columns

echo "Testing Wedding Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Olivia",
    "lastName": "Martinez",
    "email": "olivia.martinez@example.com",
    "phone": "5558889999",
    "interestType": "wedding",
    "source": "website",
    "status": "new",
    "budget": "$20000-$50000",
    "timeline": "2025-02-14 to 2025-02-21",
    "tags": "Wedding, Destination Wedding",
    "formName": "wedding-form",
    "formData": {
      "weddingDate": "2025-02-15",
      "guestCount": "80",
      "specialRequests": "Beachfront ceremony, reception venue with ocean view",
      "checkIn": "2025-02-14",
      "checkOut": "2025-02-21",
      "preferredContactMethod": "Phone",
      "partnersName": "Carlos Rodriguez",
      "weddingStyle": "Beach casual"
    }
  }'

echo ""
echo "This test simulates a submission from the wedding form with the following mapping:"
echo "- First Name: Olivia"
echo "- Last Name: Martinez"
echo "- Email: olivia.martinez@example.com"
echo "- Phone: 5558889999"
echo "- Interest Type: wedding"
echo "- Source: website"
echo "- Budget: $20000-$50000"
echo "- Timeline: 2025-02-14 to 2025-02-21"
echo "- Tags: Wedding, Destination Wedding"
echo "- Form Name: wedding-form"
echo "- Form Data:"
echo "  - Wedding Date: 2025-02-15"
echo "  - Guest Count: 80"
echo "  - Special Requests: Beachfront ceremony, reception venue with ocean view"
echo "  - Check-in: 2025-02-14"
echo "  - Check-out: 2025-02-21"
echo "  - Preferred Contact Method: Phone"
echo "  - Partner's Name: Carlos Rodriguez"
echo "  - Wedding Style: Beach casual"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"