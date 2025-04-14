#!/bin/bash

# Test script to send form submissions for the family trip form
# Test the webhook functionality and mapping to proper columns

echo "Testing Family Trip Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "5551234567",
    "interestType": "family_trip",
    "source": "website",
    "status": "new",
    "budget": "$5000-$10000",
    "timeline": "2024-07-15 to 2024-07-22",
    "tags": "Family Trip, Group Travel",
    "formName": "family-trip-form",
    "formData": {
      "numberOfChildren": "2",
      "notes": "Looking for family-friendly activities and accommodations",
      "checkIn": "2024-07-15",
      "checkOut": "2024-07-22",
      "preferredContactMethod": "Email",
      "specificType": "family_trip"
    }
  }'

echo ""
echo "This test simulates a submission from the family trip form with the following mapping:"
echo "- First Name: John"
echo "- Last Name: Smith"
echo "- Email: john.smith@example.com"
echo "- Phone: 5551234567"
echo "- Interest Type: family_trip"
echo "- Source: website"
echo "- Budget: $5000-$10000"
echo "- Timeline: 2024-07-15 to 2024-07-22"
echo "- Tags: Family Trip, Group Travel"
echo "- Form Name: family-trip-form"
echo "- Form Data:"
echo "  - Number of Children: 2"
echo "  - Notes: Looking for family-friendly activities and accommodations"
echo "  - Check-in: 2024-07-15"
echo "  - Check-out: 2024-07-22"
echo "  - Preferred Contact Method: Email"
echo "  - Specific Type: family_trip"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"