/**
 * Dual Database Service
 * 
 * This service handles synchronizing submissions to both Supabase and Airtable.
 * It's designed as middleware to be used in API route handlers.
 */

import { syncToAirtable, retryFailedSync } from './airtable';
import { storage } from '../storage';
import type { 
  Lead, 
  Booking, 
  GuideSubmission,
  InsertLead,
  InsertGuideSubmission
} from '@shared/schema';
import { z } from 'zod';
import { insertBookingSchema } from '@shared/schema';

type SubmissionType = 'lead' | 'booking' | 'guide';

/**
 * Dual database submission handler
 * Saves data to both Supabase (primary) and Airtable (secondary)
 */
export class DualDatabaseService {

  /**
   * Submit a lead to both Supabase and Airtable
   * @param leadData Lead data to submit
   * @returns The created lead with IDs from both databases
   */
  async submitLead(leadData: InsertLead): Promise<Lead> {
    try {
      // 1. First save to primary database (Supabase via storage interface)
      const lead = await storage.createLead(leadData);
      console.log(`✅ Lead saved to primary database: ${lead.email}`);

      // 2. Then sync to Airtable (secondary database)
      // We use the retryFailedSync to attempt the sync multiple times if needed
      try {
        const airtableId = await retryFailedSync(syncToAirtable, lead);
        console.log(`✅ Lead synced to Airtable: ${lead.email} (${airtableId})`);
        
        // Optionally update the lead in the primary database with the Airtable ID
        // await storage.updateLead(lead.id, { airtableId });
      } catch (airtableError) {
        // Log but don't fail the whole operation if Airtable sync fails
        console.error(`⚠️ Failed to sync lead to Airtable: ${lead.email}`, airtableError);
        // You could add this to a queue for retry later
      }

      return lead;
    } catch (error) {
      console.error('❌ Error in dual database lead submission:', error);
      throw error;
    }
  }

  /**
   * Submit a booking to both Supabase and Airtable
   * @param bookingData Booking data to submit
   * @returns The created booking with IDs from both databases
   */
  async submitBooking(bookingData: z.infer<typeof insertBookingSchema>): Promise<Booking> {
    try {
      // 1. First save to primary database (Supabase via storage interface)
      const booking = await storage.createBooking(bookingData);
      console.log(`✅ Booking saved to primary database: ${booking.email}`);

      // 2. Then sync to Airtable (secondary database)
      try {
        const airtableId = await retryFailedSync(syncToAirtable, booking);
        console.log(`✅ Booking synced to Airtable: ${booking.email} (${airtableId})`);
        
        // Optionally update the booking in the primary database with the Airtable ID
        // await storage.updateBooking(booking.id, { airtableId });
      } catch (airtableError) {
        // Log but don't fail the whole operation if Airtable sync fails
        console.error(`⚠️ Failed to sync booking to Airtable: ${booking.email}`, airtableError);
        // You could add this to a queue for retry later
      }

      return booking;
    } catch (error) {
      console.error('❌ Error in dual database booking submission:', error);
      throw error;
    }
  }

  /**
   * Submit a guide submission to both Supabase and Airtable
   * @param submissionData Guide submission data to submit
   * @returns The created guide submission with IDs from both databases
   */
  async submitGuideRequest(submissionData: InsertGuideSubmission): Promise<GuideSubmission> {
    try {
      // 1. First save to primary database (Supabase via storage interface)
      const submission = await storage.createGuideSubmission(submissionData);
      console.log(`✅ Guide submission saved to primary database: ${submission.email}`);

      // 2. Then sync to Airtable (secondary database)
      try {
        const airtableId = await retryFailedSync(syncToAirtable, submission);
        console.log(`✅ Guide submission synced to Airtable: ${submission.email} (${airtableId})`);
        
        // Optionally update the submission in the primary database with the Airtable ID
        // await storage.updateGuideSubmission(submission.id, { airtableId });
      } catch (airtableError) {
        // Log but don't fail the whole operation if Airtable sync fails
        console.error(`⚠️ Failed to sync guide submission to Airtable: ${submission.email}`, airtableError);
        // You could add this to a queue for retry later
      }

      return submission;
    } catch (error) {
      console.error('❌ Error in dual database guide submission:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const dualDb = new DualDatabaseService();