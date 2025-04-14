#!/bin/bash

# Test script to send form submissions for the bachelorette trip form
# Test the webhook functionality and mapping to proper columns

echo "Testing Bachelorette Trip Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jessica",
    "lastName": "Davis",
    "email": "jessica.davis@example.com",
    "phone": "5556667777",
    "interestType": "group_trip",
    "source": "website",
    "status": "new",
    "budget": "$5000-$10000",
    "timeline": "2024-08-20 to 2024-08-27",
    "tags": "Bachelorette Trip, Group Travel",
    "formName": "bachelorette-trip-form",
    "formData": {
      "partySize": "8",
      "notes": "Looking for accommodations and activities for bachelorette party",
      "checkIn": "2024-08-20",
      "checkOut": "2024-08-27",
      "preferredContactMethod": "Email",
      "specificType": "bachelorette_trip",
      "nightlifeInterest": "Yes",
      "villaPreference": "Beachfront"
    }
  }'

echo ""
echo "This test simulates a submission from the bachelorette trip form with the following mapping:"
echo "- First Name: Jessica"
echo "- Last Name: Davis"
echo "- Email: jessica.davis@example.com"
echo "- Phone: 5556667777"
echo "- Interest Type: group_trip"
echo "- Source: website"
echo "- Budget: $5000-$10000"
echo "- Timeline: 2024-08-20 to 2024-08-27"
echo "- Tags: Bachelorette Trip, Group Travel"
echo "- Form Name: bachelorette-trip-form"
echo "- Form Data:"
echo "  - Party Size: 8"
echo "  - Notes: Looking for accommodations and activities for bachelorette party"
echo "  - Check-in: 2024-08-20"
echo "  - Check-out: 2024-08-27"
echo "  - Preferred Contact Method: Email"
echo "  - Specific Type: bachelorette_trip"
echo "  - Nightlife Interest: Yes"
echo "  - Villa Preference: Beachfront"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"