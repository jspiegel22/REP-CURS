#!/bin/bash

# Test script to send form submissions for the resort booking form
# Test the webhook functionality and mapping to proper columns

echo "Testing Resort Booking Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Robert",
    "lastName": "Brown",
    "email": "robert.brown@example.com",
    "phone": "5553334444",
    "interestType": "resort",
    "source": "website",
    "status": "new",
    "budget": "$3000-$5000",
    "timeline": "2024-10-15 to 2024-10-22",
    "tags": "Resort Booking, All-Inclusive",
    "formName": "resort-booking-form",
    "formData": {
      "adultCount": "2",
      "childrenCount": "1",
      "specialRequests": "Spa access, dining packages",
      "checkIn": "2024-10-15",
      "checkOut": "2024-10-22",
      "preferredContactMethod": "Email",
      "resortName": "Grand Velas Los Cabos"
    }
  }'

echo ""
echo "This test simulates a submission from the resort booking form with the following mapping:"
echo "- First Name: Robert"
echo "- Last Name: Brown"
echo "- Email: robert.brown@example.com"
echo "- Phone: 5553334444"
echo "- Interest Type: resort"
echo "- Source: website"
echo "- Budget: $3000-$5000"
echo "- Timeline: 2024-10-15 to 2024-10-22"
echo "- Tags: Resort Booking, All-Inclusive"
echo "- Form Name: resort-booking-form"
echo "- Form Data:"
echo "  - Adult Count: 2"
echo "  - Children Count: 1"
echo "  - Special Requests: Spa access, dining packages"
echo "  - Check-in: 2024-10-15"
echo "  - Check-out: 2024-10-22"
echo "  - Preferred Contact Method: Email"
echo "  - Resort Name: Grand Velas Los Cabos"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"