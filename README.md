# Cabo Travel Platform

A comprehensive travel platform for Cabo San Lucas that connects travelers with unique destination experiences through intelligent matching and innovative multimedia interactions.

## Key Features

- Responsive, mobile-first design
- YouTube video hero section with autoplay and looping
- Interactive villa, resort, adventure, and restaurant listings
- Dual booking flows (form-fill and direct booking)
- Lead generation forms with Airtable integration
- Custom guide request system with interest tracking
- Automated email notifications
- Admin dashboard for managing submissions

## Tech Stack

- **Frontend**: React/TypeScript with Vite
- **UI Framework**: Shadcn UI + Tailwind CSS
- **Backend**: Express/Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **External Integrations**: Airtable, TrackHS API
- **Authentication**: Passport.js with session-based auth
- **Deployment**: Replit

## Environment Variables

The application requires the following environment variables:

```
# Database
DATABASE_URL=postgresql://...

# Airtable Integration
AIRTABLE_API_KEY=key...
AIRTABLE_BASE_ID=app...

# TrackHS API (Property Management System)
TRACKHS_API_KEY=...
TRACKHS_API_SECRET=...

# Optional: Make.com Webhook (for bi-directional API integration)
MAKE_WEBHOOK_URL=https://hook.make.com/...
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared types and schema definitions
- `/scripts` - Utility scripts for data import/export

## API Endpoints

- `/api/guide-submissions` - Submit guide download requests
- `/api/bookings` - Create and manage bookings
- `/api/leads` - Capture and process leads
- `/api/listings` - Get property listings
- `/api/resorts` - Get resort information
- `/api/villas` - Get villa information from TrackHS API

## License

Copyright © 2025 Cabo Travel Platform. All rights reserved.