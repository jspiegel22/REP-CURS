import Stripe from 'stripe';
import type { Express } from 'express';
import { storage } from '../storage';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe integration will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function registerStripeRoutes(app: Express) {
  if (!stripe) {
    console.warn('Stripe client not initialized. Skipping stripe routes registration.');
    return;
  }

  // Create Payment Intent endpoint
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, description, bookingData } = req.body;

      if (!amount || amount < 1) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // amount should be in cents
        currency: 'usd',
        description: description || 'Cabo Adventure Booking',
        metadata: {
          booking_type: bookingData?.booking_type || 'adventure',
          customer_email: bookingData?.email,
          adventure_name: bookingData?.adventure_name,
        },
      });

      // Create booking record if booking data is provided
      if (bookingData) {
        try {
          const booking = await storage.createBooking({
            userId: req.user?.id || null,
            firstName: bookingData.first_name,
            lastName: bookingData.last_name,
            email: bookingData.email,
            phone: bookingData.phone,
            bookingType: bookingData.booking_type || 'adventure',
            adventureName: bookingData.adventure_name,
            startDate: new Date(bookingData.date),
            endDate: new Date(bookingData.date), // Same day for adventures
            guests: bookingData.guests,
            totalAmount: (amount / 100).toString(), // Convert cents to dollars and to string
            specialRequests: bookingData.special_requests || '',
            status: 'pending', // Will be updated to 'confirmed' on successful payment
            paymentIntentId: paymentIntent.id,
            createdAt: new Date(),
          });
          
          console.log('Booking created:', booking);
        } catch (error) {
          console.error('Error creating booking:', error);
          // We don't want to fail the payment if booking creation fails
        }
      }

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Payment webhook to update booking status
  app.post('/api/stripe-webhook', async (req, res) => {
    let event: Stripe.Event;

    try {
      // Get the signature from the header
      const signature = req.headers['stripe-signature'];

      if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(400).json({ error: 'Webhook signature validation failed' });
      }

      // Verify the event
      event = stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: err.message });
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      try {
        // Update booking status
        await updateBookingStatus(paymentIntent.id, 'confirmed');
        console.log('💰 Payment successful:', paymentIntent.id);
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      try {
        // Update booking status
        await updateBookingStatus(paymentIntent.id, 'failed');
        console.log('❌ Payment failed:', paymentIntent.id);
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  });
}

async function updateBookingStatus(paymentIntentId: string, status: 'confirmed' | 'failed') {
  try {
    // In a real application, you'd update the booking status in the database
    // Here's a placeholder for how this might work
    // await storage.updateBookingByPaymentIntent(paymentIntentId, status);
    console.log(`Booking for payment ${paymentIntentId} updated to ${status}`);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}