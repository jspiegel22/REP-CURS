# Cabo Travel Platform

A comprehensive travel platform for Cabo San Lucas that connects travelers with unique destination experiences through intelligent matching and innovative multimedia interactions.

## Key Features

- Responsive, mobile-first design
- YouTube video hero section with autoplay and looping
- Interactive villa, resort, adventure, and restaurant listings
- Dual booking flows (form-fill and direct booking)
- Lead generation forms with webhook integration
- Custom guide request system with interest tracking
- Automated email notifications
- Admin dashboard for managing submissions

## Tech Stack

- **Frontend**: React/TypeScript with Vite
- **UI Framework**: Shadcn UI + Tailwind CSS
- **Backend**: Express/Node.js + FastAPI (webhooks)
- **Database**: PostgreSQL with Drizzle ORM
- **External Integrations**: Make.com, Zapier, TrackHS API
- **Deployment**: Replit

## Environment Variables

The application requires the following environment variables:

```
# Database
DATABASE_URL=postgresql://...

# Airtable Integration (via Make.com)
AIRTABLE_API_KEY=key...  # Only needed if using direct Airtable connection
AIRTABLE_BASE_ID=app...  # Only needed if using direct Airtable connection

# TrackHS API (Property Management System)
TRACKHS_API_KEY=...
TRACKHS_API_SECRET=...

# Webhook Configuration
VITE_WEBHOOK_API_URL=http://localhost:8000/api  # URL to the webhook API server
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the main application: `npm run dev`
4. Start the webhook server: `cd api && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

## Webhook System

The platform includes a powerful webhook system to integrate with external services like Make.com, Zapier, and Airtable.

### Setting Up Make.com Integration

1. Create a Make.com account at [https://www.make.com](https://www.make.com)
2. Create a new scenario with a "Webhook" trigger as the first module
3. Copy the webhook URL provided by Make.com
4. Run the setup script: `./setup_make_webhook.sh` and follow the prompts
5. In Make.com, set up the data mapping from the webhook to Airtable or other services
6. Turn on your scenario to start receiving data

### Setting Up Zapier Integration

1. Create a Zapier account at [https://www.zapier.com](https://www.zapier.com)
2. Create a new Zap with a "Webhook" trigger as the first step
3. Copy the webhook URL provided by Zapier
4. Run the setup script: `./setup_zapier_webhook.sh` and follow the prompts
5. Set up the actions in Zapier to process the data
6. Turn on your Zap to start receiving data

### Webhook Event Types

The system supports three main event types:

1. **lead.created** - Sent when a lead form is submitted
2. **booking.created** - Sent when a booking is made
3. **guide.requested** - Sent when a travel guide is requested

### Testing Webhooks

You can use the included test scripts to verify your webhook setup:

```bash
./test_webhook_airtable.sh  # Test direct Airtable integration
```

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/api` - FastAPI webhook server
- `/shared` - Shared types and schema definitions
- `/scripts` - Utility scripts for data import/export

## API Endpoints

### Main API

- `/api/guide-submissions` - Submit guide download requests
- `/api/bookings` - Create and manage bookings
- `/api/leads` - Capture and process leads
- `/api/listings` - Get property listings
- `/api/resorts` - Get resort information
- `/api/villas` - Get villa information from TrackHS API

### Webhook API

- `/api/leads/webhook` - Send lead data to registered webhooks
- `/api/bookings/webhook` - Send booking data to registered webhooks
- `/api/guides/webhook` - Send guide request data to registered webhooks
- `/api/webhooks/setup` - Register a new webhook endpoint
- `/api/webhooks` - List all registered webhooks
- `/api/admin/webhook-retry/:id` - Retry a failed webhook delivery

## License

Copyright © 2025 Cabo Travel Platform. All rights reserved.