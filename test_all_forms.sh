#!/bin/bash

# Test script to test all form submissions with their correct interestType values

echo "===== Testing Family Trip Form ====="
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
    "formName": "family-trip-form",
    "formData": {
      "numberOfChildren": "2",
      "notes": "Looking for a family-friendly resort",
      "checkIn": "2025-06-15",
      "checkOut": "2025-06-22",
      "preferredContactMethod": "Email",
      "specificType": "family_trip"
    }
  }'
echo -e "\n"

echo "===== Testing Bachelorette Form ====="
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "555-987-6543",
    "interestType": "group_trip",
    "source": "website",
    "status": "new",
    "formName": "bachelorette-form",
    "formData": {
      "notes": "Planning a bachelorette trip for 8 people",
      "checkIn": "2025-07-10",
      "checkOut": "2025-07-15",
      "preferredContactMethod": "Phone",
      "specificType": "bachelorette"
    }
  }'
echo -e "\n"

echo "===== Testing Bachelor-Bachelorette Page Form ====="
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mike",
    "lastName": "Johnson",
    "email": "mike.johnson@example.com",
    "phone": "555-555-5555",
    "interestType": "group_trip",
    "source": "website",
    "status": "new",
    "formName": "bachelor-bachelorette-form",
    "formData": {
      "notes": "Bachelor party for 10 people",
      "checkIn": "2025-08-15",
      "checkOut": "2025-08-20",
      "preferredContactMethod": "Email",
      "specificType": "bachelor"
    }
  }'
echo -e "\n"

echo "===== Testing Luxury Concierge Form ====="
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Robert",
    "lastName": "Smith",
    "email": "robert.smith@example.com",
    "phone": "555-444-3333",
    "interestType": "concierge",
    "source": "website",
    "status": "new",
    "formName": "luxury-concierge-form",
    "formData": {
      "notes": "Need premium concierge services for family of 4",
      "checkIn": "2025-09-01",
      "checkOut": "2025-09-10",
      "preferredContactMethod": "Email",
      "specificType": "concierge"
    }
  }'
echo -e "\n"

echo "===== Testing Influencer Form ====="
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Samantha",
    "lastName": "Influencer",
    "email": "samantha.influencer@example.com",
    "phone": "555-222-1111",
    "interestType": "influencer",
    "source": "website",
    "status": "new",
    "formName": "influencer-form",
    "formData": {
      "notes": "Travel influencer with 100k followers",
      "checkIn": "2025-10-01",
      "checkOut": "2025-10-07",
      "preferredContactMethod": "Email",
      "specificType": "influencer",
      "instagramUsername": "@samantha_travels",
      "followerCount": "100000"
    }
  }'
echo -e "\n"

echo "===== Testing Work with Us Form (using LeadGenTemplate) ====="
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "David",
    "lastName": "Professional",
    "email": "david.professional@example.com",
    "phone": "555-777-8888",
    "interestType": "concierge",
    "source": "website",
    "status": "new",
    "formName": "work-with-us-form",
    "formData": {
      "notes": "Interested in partnership opportunities",
      "preferredContactMethod": "Email",
      "specificType": "work_with_us"
    }
  }'
echo -e "\n"

echo "If all responses show success, it means all forms are correctly configured with the proper interestType values."