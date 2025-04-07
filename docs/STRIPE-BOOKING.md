# Stripe Booking Integration

This document explains how to use the Stripe booking integration in the Cabo Travel application.

## Overview

The Stripe booking integration provides a secure way to process payments for villa and activity bookings. The system uses:
- Stripe Elements for secure payment form rendering
- Payment Intents API for processing payments
- Client-side form validation with real-time feedback

## Components

### 1. StripeBookingButton

The main entry point for the booking flow is the `StripeBookingButton` component:

```tsx
<StripeBookingButton 
  listingId="villa-123"
  listingTitle="Luxury Villa with Ocean View"
  listingType="villa"
  buttonText="Book Now"
  buttonSize="lg"
  buttonVariant="default"
/>
```

**Props:**
- `listingId` (required): Unique identifier for the listing
- `listingTitle` (required): Display name of the property or activity
- `listingType` (required): Type of listing (villa, resort, adventure, etc.)
- `buttonText` (optional): Custom text for the button (default: "Book Now with Stripe")
- `buttonSize` (optional): Button size (default, sm, lg)
- `buttonVariant` (optional): Button style variant

### 2. VillaDetailBooking

For villa detail pages, you can use the `VillaDetailBooking` component:

```tsx
<VillaDetailBooking
  listingId="villa-123"
  title="Luxury Villa with Ocean View"
  price={499}
  maxGuests={8}
  bedrooms={4}
  bathrooms={3}
  amenities={[
    "Ocean View", 
    "Private Pool", 
    "Free WiFi", 
    "Air Conditioning", 
    "Full Kitchen", 
    "Concierge Service"
  ]}
/>
```

**Props:**
- `listingId` (required): Unique identifier for the villa
- `title` (required): Villa name
- `price` (required): Nightly rate in USD
- `maxGuests` (required): Maximum guest capacity
- `bedrooms` (required): Number of bedrooms
- `bathrooms` (required): Number of bathrooms
- `amenities` (required): Array of amenity strings

### 3. Checkout Flow

The booking process follows these steps:

1. User clicks the booking button and fills in their booking details
2. Form data is validated and stored in localStorage
3. User is redirected to the checkout page with the Stripe payment form
4. Payment intent is created on the server
5. User completes payment with Stripe Elements
6. On successful payment, user is redirected to the booking confirmation page

## API Endpoints

The following API endpoints support the Stripe integration:

- **POST /api/create-payment-intent**: Creates a new payment intent for processing the payment
- **GET /api/payment-intent/:paymentIntentId**: Retrieves status of a payment intent
- **POST /api/bookings**: Creates a new booking record after successful payment

## Environment Variables

The Stripe integration requires the following environment variables:

- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key (starts with `pk_`)

## Error Handling

The system provides robust error handling:

- Form validation errors with specific feedback
- Payment processing errors with user-friendly messages
- Server connection issues with appropriate fallbacks
- Duplicate booking prevention

## Testing Stripe Integration

You can test the Stripe integration using Stripe's test card numbers:

- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 0002

For more test card numbers, see [Stripe's documentation](https://stripe.com/docs/testing).

## Implementation Example

Here's a complete example of implementing the booking flow in a villa detail page:

```tsx
import { VillaDetailBooking } from "@/components/ui/villa-detail-booking";

export default function VillaDetailPage() {
  const villa = {
    id: "villa-123",
    title: "Luxury Ocean View Villa",
    price: 599,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: [
      "Ocean View", 
      "Private Pool", 
      "Free WiFi", 
      "Air Conditioning", 
      "Full Kitchen", 
      "Concierge Service"
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Villa content here */}
      </div>
      <div className="lg:col-span-1">
        <VillaDetailBooking
          listingId={villa.id}
          title={villa.title}
          price={villa.price}
          maxGuests={villa.maxGuests}
          bedrooms={villa.bedrooms}
          bathrooms={villa.bathrooms}
          amenities={villa.amenities}
        />
      </div>
    </div>
  );
}
```
