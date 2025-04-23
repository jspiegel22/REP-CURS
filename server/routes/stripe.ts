import Stripe from 'stripe';
import type { Express } from 'express';
import { storage } from '../storage';
import { db } from '../db';
import * as schema from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';

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
          // Add required notes field to capture adventure name
          const notes = `Booking for ${bookingData.adventure_name}`;
          
          // Create booking record with right schema format
          const booking = await storage.createBooking({
            firstName: bookingData.first_name,
            lastName: bookingData.last_name || null,
            email: bookingData.email,
            phone: bookingData.phone || null,
            bookingType: bookingData.booking_type || 'adventure',
            startDate: new Date(bookingData.date),
            endDate: new Date(bookingData.date), // Same day for adventures
            guests: bookingData.guests,
            totalAmount: (amount / 100).toString(), // Convert cents to dollars and to string
            specialRequests: bookingData.special_requests || null,
            status: 'pending', // Will be updated to 'confirmed' on successful payment
            paymentIntentId: paymentIntent.id,
            source: 'website',
            tags: null,
            notes: notes,
            referrer: null,
            formData: bookingData,
            formName: 'stripe_checkout',
            createdAt: new Date(),
            updatedAt: new Date(),
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
    // Get the booking by payment intent ID using our storage interface
    const booking = await storage.getBookingByPaymentIntentId(paymentIntentId);
    
    if (!booking) {
      console.warn(`No booking found for payment intent ${paymentIntentId}`);
      return;
    }
    
    // Update the booking status in the database
    const updatedBooking = await storage.updateBookingStatus(booking.id, status);
    
    console.log(`Booking for payment ${paymentIntentId} updated to ${status}`);
    
    // Send webhook notification with updated booking data
    try {
      const webhookClient = require('../services/webhookClient');
      if (typeof webhookClient.sendBookingWebhook === 'function') {
        const result = await webhookClient.sendBookingWebhook(updatedBooking);
        if (result && result.status === 'success') {
          console.log(`Updated booking webhook sent. Tracking ID: ${result.tracking_id}`);
        } else {
          console.warn(`Updated booking webhook warning: ${result ? result.message : 'No result returned'}`);
        }
      } else {
        console.warn('sendBookingWebhook function not found in webhookClient');
      }
    } catch (webhookError) {
      console.error("Error sending updated booking webhook:", webhookError);
    }
    
    // If payment is confirmed, send confirmation email
    if (status === 'confirmed') {
      try {
        // Load email service safely
        let emailService;
        try {
          emailService = require('../services/emailService');
        } catch (emailModuleError) {
          console.warn('Email service module not found, skipping confirmation email');
          return;
        }
        
        if (typeof emailService.sendEmail === 'function' && 
            typeof emailService.createBookingConfirmationEmail === 'function') {
          const emailOptions = emailService.createBookingConfirmationEmail({
            ...booking,
            status: 'confirmed'
          });
          
          const success = await emailService.sendEmail(emailOptions);
          if (success) {
            console.log(`Payment confirmation email sent to ${booking.email}`);
          } else {
            console.error(`Failed to send payment confirmation email to ${booking.email}`);
          }
        } else {
          console.warn('Email service functions not available');
        }
      } catch (emailError) {
        console.error("Error sending payment confirmation email:", emailError);
      }
    }
  } catch (mainError) {
    console.error('Error updating booking status:', mainError);
    throw mainError;
  }
}