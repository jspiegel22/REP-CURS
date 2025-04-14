#!/bin/bash

# Test script to send form submissions for the work with us form
# Test the webhook functionality and mapping to proper columns

echo "Testing Work With Us Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "David",
    "lastName": "Thompson",
    "email": "david.thompson@example.com",
    "phone": "5552223333",
    "interestType": "concierge",
    "source": "website",
    "status": "new",
    "budget": "Not Applicable",
    "timeline": "Immediate",
    "tags": "Job Application, Career",
    "formName": "work-with-us-form",
    "formData": {
      "position": "Travel Consultant",
      "experience": "5 years in travel industry",
      "resume": "https://example.com/david-thompson-resume.pdf",
      "coverLetter": "I am excited to apply for the Travel Consultant position...",
      "preferredContactMethod": "Email",
      "currentEmployer": "Travel Agency XYZ",
      "availableDate": "2024-05-15",
      "languages": "English, Spanish"
    }
  }'

echo ""
echo "This test simulates a submission from the work with us form with the following mapping:"
echo "- First Name: David"
echo "- Last Name: Thompson"
echo "- Email: david.thompson@example.com"
echo "- Phone: 5552223333"
echo "- Interest Type: concierge"
echo "- Source: website"
echo "- Tags: Job Application, Career"
echo "- Form Name: work-with-us-form"
echo "- Form Data:"
echo "  - Position: Travel Consultant"
echo "  - Experience: 5 years in travel industry"
echo "  - Resume: https://example.com/david-thompson-resume.pdf"
echo "  - Cover Letter: I am excited to apply for the Travel Consultant position..."
echo "  - Preferred Contact Method: Email"
echo "  - Current Employer: Travel Agency XYZ"
echo "  - Available Date: 2024-05-15"
echo "  - Languages: English, Spanish"
echo ""
echo "This should map to the appropriate columns in your webhook destination (Airtable, Make.com, etc.)"