#!/bin/bash

# Test script to verify the webhook sends first_name and last_name fields correctly

echo "===== Testing webhook client with first_name and last_name fields ====="
echo "This script sends a test lead to verify the first_name and last_name are properly"
echo "included in the webhook data sent to Make.com"
echo ""

curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "555-123-7890",
    "interestType": "group_trip",
    "source": "website",
    "status": "new",
    "formName": "name-field-test-form",
    "formData": {
      "notes": "Testing first_name and last_name fields in webhook",
      "checkIn": "2025-07-01",
      "checkOut": "2025-07-08",
      "preferredContactMethod": "Email"
    }
  }'
echo -e "\n"

echo "If successful, the Make.com webhook should receive both 'first_name' and 'last_name' fields"
echo "as top-level properties in the webhook payload."
echo "Check the API logs to confirm the payload contains both fields."