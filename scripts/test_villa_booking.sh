#!/bin/bash

# Test script to send form submissions for the villa booking form
# Test the webhook functionality and mapping to proper columns

echo "Testing Villa Booking Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Williams",
    "email": "sarah.williams@example.com",
    "phone": "5557891234",
    "interestType": "villa",
    "source": "website",
    "status": "new",
    "budget": "$7500-$15000",
    "timeline": "2024-09-05 to 2024-09-12",
    "tags": "Villa Booking, Beachfront",
    "formName": "villa-booking-form",
    "formData": {
      "guestCount": "4",
      "specialRequests": "Ocean view, pool, nearby restaurants",
      "checkIn": "2024-09-05",
      "checkOut": "2024-09-12",
      "preferredContactMethod": "Email",
      "villaName": "Casa del Mar"
    }
  }'

echo ""
echo "This test simulates a submission from the villa booking form with the following mapping:"
echo "- First Name: Sarah"
echo "- Last Name: Williams"
echo "- Email: sarah.williams@example.com"
echo "- Phone: 5557891234"
echo "- Interest Type: villa"
echo "- Source: website"
echo "- Budget: $7500-$15000"
echo "- Timeline: 2024-09-05 to 2024-09-12"
echo "- Tags: Villa Booking, Beachfront"
echo "- Form Name: villa-booking-form"
echo "- Form Data:"
echo "  - Guest Count: 4"
echo "  - Special Requests: Ocean view, pool, nearby restaurants"
echo "  - Check-in: 2024-09-05"
echo "  - Check-out: 2024-09-12"
echo "  - Preferred Contact Method: Email"
echo "  - Villa Name: Casa del Mar"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"