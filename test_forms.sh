#!/bin/bash

# Test script to send form submissions to all form endpoints
# This helps test the webhook functionality for all forms

echo "Testing Family Trip Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "phone": "5551234567",
    "interest_type": "group_trip",
    "source": "website",
    "status": "new",
    "budget": "$5000-$10000",
    "timeline": "2024-07-15 to 2024-07-22",
    "tags": ["Family Trip", "Group Travel"],
    "form_name": "family-trip-form",
    "form_data": {
      "numberOfChildren": "2",
      "notes": "Looking for family-friendly activities and accommodations",
      "checkIn": "2024-07-15",
      "checkOut": "2024-07-22",
      "preferredContactMethod": "Email",
      "specificType": "family_trip"
    }
  }'

echo -e "\n\nTesting Influencer Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Sarah",
    "last_name": "Johnson",
    "email": "sarah.j@example.com",
    "phone": "5559876543",
    "interest_type": "influencer",
    "source": "website",
    "status": "new",
    "budget": "$10000+",
    "timeline": "2024-08-01 to 2024-08-07",
    "tags": ["Influencer", "Content Creation"],
    "form_name": "influencer-partnership-form",
    "form_data": {
      "socialHandle": "@sarahjtravels",
      "platform": "Instagram",
      "followers": "50000",
      "checkIn": "2024-08-01",
      "checkOut": "2024-08-07",
      "notes": "Looking to create content about luxury travel experiences",
      "preferredContactMethod": "Email",
      "specificType": "influencer"
    }
  }'

echo -e "\n\nTesting Bachelorette Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Emily",
    "last_name": "Davis",
    "email": "emily.d@example.com",
    "phone": "5552345678",
    "interest_type": "group_trip",
    "source": "website",
    "status": "new",
    "budget": "$5000-$10000",
    "timeline": "2024-09-10 to 2024-09-15",
    "tags": ["Bachelorette Party", "Group Travel", "Event Planning"],
    "form_name": "bachelorette-party-form",
    "form_data": {
      "groupSize": "8",
      "specialRequests": "Looking for yacht party and VIP club access",
      "eventType": "Bachelorette Party",
      "preferredContactMethod": "Email",
      "specificType": "bachelorette"
    }
  }'

echo -e "\n\nTesting Luxury Concierge Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Michael",
    "last_name": "Brown",
    "email": "michael.b@example.com",
    "phone": "5553456789",
    "interest_type": "concierge",
    "source": "website",
    "status": "new",
    "budget": "$10000+",
    "timeline": "2024-10-01 to 2024-10-10",
    "tags": ["Luxury", "Concierge", "VIP"],
    "form_name": "luxury-concierge-form",
    "form_data": {
      "checkIn": "2024-10-01",
      "checkOut": "2024-10-10",
      "groupSize": "2",
      "notes": "Looking for exclusive experiences and VIP services",
      "preferredContactMethod": "Email",
      "specificType": "luxury_concierge"
    }
  }'

echo -e "\n\nTesting Wedding Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jessica",
    "last_name": "Wilson",
    "email": "jessica.w@example.com",
    "phone": "5554567890",
    "interest_type": "wedding",
    "source": "website",
    "status": "new",
    "budget": "$10000+",
    "timeline": "2025-06-15",
    "tags": ["Wedding", "Event Planning"],
    "form_name": "wedding-planning-form",
    "form_data": {
      "date": "2025-06-15",
      "guestCount": "100",
      "notes": "Looking for a beachfront wedding venue with reception",
      "preferredContactMethod": "Email",
      "specificType": "wedding"
    }
  }'

echo -e "\n\nAll form tests completed." 