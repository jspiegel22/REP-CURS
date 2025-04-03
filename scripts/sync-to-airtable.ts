import { db } from '../server/db';
import { guideSubmissions, bookings, leads } from '../server/db/schema';
import { syncToAirtable } from '../server/services/airtable';

async function syncAllToAirtable() {
  try {
    console.log('Starting sync to Airtable...');

    // Sync Guide Submissions
    const guideSubs = await db.select().from(guideSubmissions);
    console.log(`Found ${guideSubs.length} guide submissions to sync`);
    
    for (const submission of guideSubs) {
      try {
        // Enrich guide submission with additional fields
        const enrichedSubmission = {
          ...submission,
          formName: submission.formName || 'Guide Download',
          source: submission.source || 'website',
          status: submission.status || 'pending',
          tags: ['Guide', submission.guideType],
          formData: submission.formData || {},
          createdAt: submission.createdAt || new Date(),
          updatedAt: submission.updatedAt || new Date()
        };
        
        await syncToAirtable(enrichedSubmission);
        console.log(`Synced guide submission: ${submission.email}`);
      } catch (error) {
        console.error(`Failed to sync guide submission ${submission.email}:`, error);
      }
    }

    // Sync Bookings
    const bookingSubs = await db.select().from(bookings);
    console.log(`Found ${bookingSubs.length} bookings to sync`);
    
    for (const booking of bookingSubs) {
      try {
        // Enrich booking with additional fields
        const enrichedBooking = {
          ...booking,
          formName: 'Booking Request',
          source: 'website',
          status: booking.status || 'pending',
          tags: ['Booking', booking.bookingType],
          formData: booking.formData || {},
          createdAt: booking.createdAt || new Date(),
          updatedAt: booking.updatedAt || new Date()
        };
        
        await syncToAirtable(enrichedBooking);
        console.log(`Synced booking: ${booking.email}`);
      } catch (error) {
        console.error(`Failed to sync booking ${booking.email}:`, error);
      }
    }

    // Sync Leads
    const leadSubs = await db.select().from(leads);
    console.log(`Found ${leadSubs.length} leads to sync`);
    
    for (const lead of leadSubs) {
      try {
        // Enrich lead with additional fields
        const enrichedLead = {
          ...lead,
          formName: 'Lead Generation',
          source: lead.source || 'website',
          status: lead.status || 'new',
          tags: ['Lead', lead.interestType],
          formData: lead.formData || {},
          createdAt: lead.createdAt || new Date(),
          updatedAt: lead.updatedAt || new Date()
        };
        
        await syncToAirtable(enrichedLead);
        console.log(`Synced lead: ${lead.email}`);
      } catch (error) {
        console.error(`Failed to sync lead ${lead.email}:`, error);
      }
    }

    console.log('Sync completed successfully');
  } catch (error) {
    console.error('Error during sync:', error);
  }
}

// Run the sync
syncAllToAirtable(); 