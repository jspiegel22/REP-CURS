#!/bin/bash

# Test script to test the family trip form submission directly with the server
echo "Testing Family Trip Form with correct interestType (group_trip)..."

curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "555-123-4567",
    "interestType": "group_trip",
    "source": "website",
    "status": "new",
    "budget": "$5000-$10000",
    "timeline": "2025-06-15 to 2025-06-22",
    "tags": "Family Trip, Group Travel",
    "formName": "family-trip-form",
    "formData": {
      "numberOfChildren": "2",
      "notes": "Looking for a family-friendly resort with kid activities",
      "checkIn": "2025-06-15",
      "checkOut": "2025-06-22",
      "preferredContactMethod": "Email",
      "specificType": "family_trip"
    }
  }'

echo ""
echo "If the response shows success, it means the form data is being accepted with the correct interestType."
echo "This verifies that our changes to the family trip form are working correctly."