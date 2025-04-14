#!/bin/bash

# Test script to send form submissions for the influencer form
# Test the webhook functionality and mapping to proper columns

echo "Testing Influencer Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emma",
    "lastName": "Wilson",
    "email": "emma.wilson@example.com",
    "phone": "5557778888",
    "interestType": "influencer",
    "source": "website",
    "status": "new",
    "budget": "Negotiable",
    "timeline": "2024-09-10 to 2024-09-17",
    "tags": "Influencer, Partnership",
    "formName": "influencer-form",
    "formData": {
      "instagramHandle": "@emmawilson_travel",
      "followerCount": "150000",
      "previousBrands": "Hotel X, Resort Y, Travel Agency Z",
      "contentTypes": "Photos, Reels, Stories",
      "preferredContactMethod": "Email",
      "travelStyle": "Luxury travel, Food & Drink, Adventure",
      "websiteUrl": "https://emmawilson.example.com"
    }
  }'

echo ""
echo "This test simulates a submission from the influencer form with the following mapping:"
echo "- First Name: Emma"
echo "- Last Name: Wilson"
echo "- Email: emma.wilson@example.com"
echo "- Phone: 5557778888"
echo "- Interest Type: influencer"
echo "- Source: website"
echo "- Budget: Negotiable"
echo "- Timeline: 2024-09-10 to 2024-09-17"
echo "- Tags: Influencer, Partnership"
echo "- Form Name: influencer-form"
echo "- Form Data:"
echo "  - Instagram Handle: @emmawilson_travel"
echo "  - Follower Count: 150000"
echo "  - Previous Brands: Hotel X, Resort Y, Travel Agency Z"
echo "  - Content Types: Photos, Reels, Stories"
echo "  - Preferred Contact Method: Email"
echo "  - Travel Style: Luxury travel, Food & Drink, Adventure"
echo "  - Website URL: https://emmawilson.example.com"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"