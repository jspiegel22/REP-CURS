# Make.com Integration Guide

This document explains how to integrate the Cabo Travel application with Make.com (formerly Integromat) for automating workflows based on form submissions and other events.

## Overview

The Cabo Travel website supports direct webhook integration with Make.com, allowing you to:

1. Process guide requests (travel guide downloads)
2. Handle lead generation form submissions
3. Process booking requests
4. Build custom workflows for marketing automation, CRM integration, etc.

## Setup Instructions

### 1. Create a Make.com Account

If you don't already have a Make.com account:
1. Go to [Make.com](https://www.make.com)
2. Sign up for a free account
3. Create a new workspace or use an existing one

### 2. Create a Webhook Scenario

To create a scenario that receives data from the Cabo Travel website:

1. In Make.com, click "Create a new scenario"
2. Search for and select "Webhooks" as your trigger module
3. Select "Custom webhook" as the webhook type
4. Click "Add" to create the webhook
5. In the webhook settings, make sure "Determine data structure" is enabled
   - This helps Make.com understand the data format
6. Leave other settings at their defaults and click "Save"
7. Make.com will generate a unique webhook URL that looks like:
   `https://hook.us1.make.com/xxxxxxxxxxxxxxxxxxxxxxxxx`
8. **Important:** Copy this webhook URL as you'll need it in step 3

### 3. Configure the Application

Add the Make.com webhook URL to your application's environment:

1. Open your `.env` file
2. Add or update the following environment variables:
   ```
   MAKE_WEBHOOK_URL=https://hook.us1.make.com/your_webhook_id
   VITE_MAKE_WEBHOOK_URL=https://hook.us1.make.com/your_webhook_id
   ```
3. Restart the application to apply the changes

### 4. Test the Webhook Connection

1. In your Make.com scenario, click "Run once" to put the webhook in listening mode
2. Use the included test script to send test data to Make.com:
   ```bash
   ./test_direct_make_webhook.sh
   ```
3. In Make.com, you should see data received from the webhook
4. Use this data to determine the structure for the next modules in your scenario

## Data Structure

### Guide Request Format

```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "phone": "555-123-4567",
  "guide_type": "Cabo Travel Guide",
  "interest_areas": ["Restaurants", "Beaches", "Activities"],
  "form_data": {
    "source": "Website",
    "formName": "guide-download",
    "preferredContactMethod": "Email"
  },
  "tags": ["Guide Request", "Website"]
}
```

### Lead Format

```json
{
  "first_name": "Lead",
  "last_name": "User",
  "email": "lead@example.com",
  "phone": "555-123-4567",
  "interest_type": "Villa Rental",
  "source": "website",
  "budget": "$5000-$10000",
  "timeline": "Next 3 months",
  "form_data": {
    "source": "Villa Detail Page",
    "formName": "villa-inquiry"
  },
  "tags": ["Lead", "Villa"]
}
```

### Booking Format

```json
{
  "first_name": "Booking",
  "last_name": "User",
  "email": "booking@example.com",
  "phone": "555-123-4567",
  "booking_type": "villa",
  "start_date": "2025-06-15",
  "end_date": "2025-06-22",
  "guests": 4,
  "total_amount": 5600.00,
  "special_requests": "Ocean view preferred",
  "form_data": {
    "propertyName": "Villa Bella Vista",
    "source": "Website Booking"
  },
  "tags": ["Booking", "Villa"]
}
```

## Building Automation Scenarios

With Make.com, you can create powerful workflows to:

1. Add contacts to your CRM (Salesforce, HubSpot, etc.)
2. Send personalized emails via services like Gmail, Mailchimp, or SendGrid
3. Create tasks in project management tools (Asana, Trello, etc.)
4. Update Google Sheets or Airtable with submission data
5. Send notifications to Slack or other messaging platforms
6. Trigger SMS messages for immediate follow-up

### Example Scenario Steps

A typical scenario might follow these steps:

1. **Webhook Trigger**: Receives form submission data
2. **Router**: Routes data based on form type (lead, booking, guide)
3. **CRM Integration**: Adds or updates contact in your CRM
4. **Notification**: Sends internal notification to your team
5. **Follow-up**: Schedules a follow-up activity or email

## Advanced Options

### Using the Python FastAPI Server

For more advanced integrations, you can use the included FastAPI webhook server:

1. Start the webhook server:
   ```bash
   cd api && uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. Add webhook targets to the database:
   ```bash
   ./setup_make_webhook.sh
   ```

3. This provides additional features like:
   - Webhook delivery tracking and retry
   - Multiple webhook endpoints for different systems
   - Failover capability if a webhook endpoint is down

## Troubleshooting

If you're having issues with the Make.com integration:

1. **Check Make.com Logs**: In your scenario, check the execution history and logs
2. **Test Direct Connection**: Use the `test_direct_make_webhook.sh` script
3. **Environment Variables**: Make sure both `MAKE_WEBHOOK_URL` and `VITE_MAKE_WEBHOOK_URL` are set correctly
4. **Verify Webhook Status**: Make sure your Make.com scenario is turned ON
5. **Check Console for Errors**: Look for webhook-related errors in browser console and server logs

## Need Help?

If you need additional help with the Make.com integration, contact our support team at support@cabotravels.com.