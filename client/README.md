# Cabo Adventures Website

A modern website for Cabo Adventures, featuring integrations with various services for enhanced functionality.

## Features

- Restaurant listings and details
- Villa rentals
- Adventure bookings
- Image upload and management
- Payment processing (Stripe, Apple Pay, PayPal)
- Email marketing (ActiveCampaign)
- CRM integration (Airtable)
- Analytics tracking (Google Analytics)
- Form security (reCAPTCHA, Cloudflare)
- Automation workflows (Make.com)

## Integrations

### Google Drive
- Used for image storage and management
- Automatically organizes images into folders
- Provides public access to uploaded images

### Airtable
- Serves as the CRM system
- Stores user data, bookings, and image uploads
- Manages contact information and preferences

### ActiveCampaign
- Handles email marketing campaigns
- Sends automated notifications
- Manages subscriber lists

### Google Analytics
- Tracks user behavior and engagement
- Monitors page views and conversions
- Provides insights into user demographics

### Make.com
- Automates workflows between services
- Processes image uploads
- Triggers notifications and updates

### Payment Processing
- Stripe integration for card payments
- Apple Pay support for iOS devices
- PayPal integration for alternative payment methods

### Security
- reCAPTCHA for form protection
- Cloudflare for DDoS protection
- Secure API endpoints

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for a complete list of required environment variables.

## API Routes

### `/api/upload`
- Handles image uploads to Google Drive
- Creates Airtable records
- Sends notification emails
- Triggers automation workflows

### `/api/webhooks/make`
- Processes webhooks from Make.com
- Updates Airtable records
- Sends status notification emails

## Components

### SEO
- Dynamic meta tags
- Schema markup
- Open Graph support

### LoadingState
- Full-screen loading overlay
- Inline loading indicators
- Customizable loading text

### Analytics
- Page view tracking
- Event tracking
- User engagement monitoring

## Utilities

### Image Upload
- Google Drive integration
- Automatic folder organization
- Public access management

### Email
- ActiveCampaign integration
- Template management
- Newsletter subscription

### Analytics
- Event tracking
- User engagement monitoring
- Conversion tracking

### Form Security
- reCAPTCHA integration
- Cloudflare protection
- Form validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 