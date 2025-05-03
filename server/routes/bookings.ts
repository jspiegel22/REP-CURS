import type { Express } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { format } from 'date-fns';

const bookingSchema = z.object({
  villaId: z.number().or(z.string().transform(val => parseInt(val))),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().min(1),
  totalAmount: z.number().min(0),
  specialRequests: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
});

export function registerBookingRoutes(app: Express) {
  // Create a new booking
  app.post('/api/bookings', async (req, res) => {
    try {
      // Validate input
      const bookingData = bookingSchema.parse(req.body);
      
      // Create booking record
      const booking = await storage.createBooking({
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        bookingType: 'villa',
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate),
        guests: bookingData.guests,
        totalAmount: bookingData.totalAmount.toString(),
        specialRequests: bookingData.specialRequests || null,
        status: bookingData.paymentStatus || 'pending',
        paymentIntentId: null,
        source: 'website',
        tags: null,
        notes: `Villa Booking - ${bookingData.firstName} ${bookingData.lastName}`,
        referrer: req.headers.referer || null,
        formData: bookingData,
        formName: 'villa_booking',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Send webhook notification if webhook client is available
      try {
        const webhookClient = require('../services/webhookClient');
        if (typeof webhookClient.sendBookingWebhook === 'function') {
          const result = await webhookClient.sendBookingWebhook({
            ...booking,
            type: 'villa'
          });
          
          if (result && result.status === 'success') {
            console.log(`Booking webhook sent. Tracking ID: ${result.tracking_id}`);
          } else {
            console.warn(`Booking webhook warning: ${result ? result.message : 'No result returned'}`);
          }
        }
      } catch (webhookError) {
        console.error("Error sending booking webhook:", webhookError);
      }
      
      // Send email notification if email service is available
      try {
        const emailService = require('../services/emailService');
        if (typeof emailService.sendEmail === 'function' && 
            typeof emailService.createBookingConfirmationEmail === 'function') {
          const emailOptions = emailService.createBookingConfirmationEmail({
            ...booking,
            villaName: 'Cabo Villa', // In a real implementation, we would fetch the actual villa name
            formattedStartDate: format(new Date(bookingData.startDate), 'MMMM d, yyyy'),
            formattedEndDate: format(new Date(bookingData.endDate), 'MMMM d, yyyy')
          });
          
          const success = await emailService.sendEmail(emailOptions);
          if (success) {
            console.log(`Booking confirmation email sent to ${booking.email}`);
          } else {
            console.error(`Failed to send booking confirmation email to ${booking.email}`);
          }
        }
      } catch (emailError) {
        console.error("Error sending booking confirmation email:", emailError);
      }
      
      // Return the booking data
      res.status(201).json({
        success: true,
        booking: {
          id: booking.id,
          bookingDate: booking.createdAt,
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get a single booking by ID
  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBookingById(id);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json({ booking });
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}