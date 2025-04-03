import { db } from '../server/db';
import { guideSubmissions, bookings, leads } from '../shared/schema';
import { syncToAirtable, retryFailedSync } from '../server/services/airtable';
import { eq } from 'drizzle-orm';

async function syncAllToAirtable() {
  console.log('======================================================');
  console.log(`SYNC TO AIRTABLE STARTED AT ${new Date().toISOString()}`);
  console.log('======================================================');
  
  const syncStats = {
    guideSubmissions: { total: 0, success: 0, failed: 0 },
    bookings: { total: 0, success: 0, failed: 0 },
    leads: { total: 0, success: 0, failed: 0 },
    total: { total: 0, success: 0, failed: 0 }
  };

  try {
    // Check if Airtable is configured
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Airtable credentials missing. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.');
    }

    console.log('Connected to database successfully, beginning sync process...\n');

    // GUIDE SUBMISSIONS
    console.log('-------------------------------------------');
    console.log('SYNCING GUIDE SUBMISSIONS');
    console.log('-------------------------------------------');
    
    // Select just the basic fields we know exist in the DB
    // Using the snake_case column names directly for safety
    const guideSubs = await db.execute(
      `SELECT 
        id, 
        first_name, 
        email, 
        guide_type, 
        source, 
        status, 
        form_name, 
        submission_id, 
        created_at, 
        updated_at 
      FROM guide_submissions`
    ).then(result => {
      return result.rows.map(row => ({
        id: row.id,
        firstName: row.first_name,
        email: row.email,
        guideType: row.guide_type,
        source: row.source,
        status: row.status,
        formName: row.form_name,
        submissionId: row.submission_id,
        createdAt: row.created_at ? new Date(row.created_at) : null,
        updatedAt: row.updated_at ? new Date(row.updated_at) : null
      }));
    });
    
    syncStats.guideSubmissions.total = guideSubs.length;
    syncStats.total.total += guideSubs.length;
    
    console.log(`Found ${guideSubs.length} guide submissions to sync`);
    
    for (const [index, submission] of guideSubs.entries()) {
      try {
        // Enrich guide submission with additional fields
        const enrichedSubmission = {
          ...submission,
          formName: submission.formName || 'Guide Download',
          source: submission.source || 'website',
          status: submission.status || 'pending',
          tags: ['Guide', submission.guideType],
          createdAt: submission.createdAt || new Date(),
          updatedAt: submission.updatedAt || new Date(),
          // Add extra fields for Airtable
          lastName: '',
          preference: 'Email'
        };
        
        await retryFailedSync(syncToAirtable, enrichedSubmission);
        syncStats.guideSubmissions.success++;
        syncStats.total.success++;
        console.log(`✅ [${index + 1}/${guideSubs.length}] Synced guide submission: ${submission.email}`);
      } catch (error) {
        syncStats.guideSubmissions.failed++;
        syncStats.total.failed++;
        console.error(`❌ [${index + 1}/${guideSubs.length}] Failed to sync guide submission ${submission.email}:`, error);
      }
    }

    // BOOKINGS
    console.log('\n-------------------------------------------');
    console.log('SYNCING BOOKINGS');
    console.log('-------------------------------------------');
    
    // Using raw SQL to select only the fields we know exist
    const bookingSubs = await db.execute(
      `SELECT 
        id, 
        start_date, 
        end_date, 
        form_data, 
        status, 
        listing_id,
        adventure_id,
        user_id,
        points_earned
      FROM bookings`
    ).then(result => {
      return result.rows.map(row => ({
        id: row.id,
        startDate: row.start_date ? new Date(row.start_date) : null,
        endDate: row.end_date ? new Date(row.end_date) : null,
        formData: row.form_data,
        status: row.status,
        listingId: row.listing_id,
        adventureId: row.adventure_id,
        userId: row.user_id,
        pointsEarned: row.points_earned
      }));
    });
    
    syncStats.bookings.total = bookingSubs.length;
    syncStats.total.total += bookingSubs.length;
    
    console.log(`Found ${bookingSubs.length} bookings to sync`);
    
    for (const [index, booking] of bookingSubs.entries()) {
      try {
        // Parse formData if it's a string
        const formDataObj = typeof booking.formData === 'string' 
          ? JSON.parse(booking.formData) 
          : (booking.formData || {});
        
        // Extract email from formData if available
        const email = formDataObj.email || `booking-${booking.id}@example.com`;
        
        // Enrich booking with additional fields
        const enrichedBooking = {
          ...booking,
          formName: 'Booking Request',
          source: 'website',
          status: booking.status || 'pending',
          tags: ['Booking'],
          formData: formDataObj,
          // Add default values for any missing fields Airtable expects
          email: email,
          firstName: formDataObj.firstName || '',
          lastName: formDataObj.lastName || '',
          phone: formDataObj.phone || '',
          preferredContactMethod: 'Email',
          preferredContactTime: 'Any time'
        };
        
        await retryFailedSync(syncToAirtable, enrichedBooking);
        syncStats.bookings.success++;
        syncStats.total.success++;
        console.log(`✅ [${index + 1}/${bookingSubs.length}] Synced booking: ${email}`);
      } catch (error) {
        syncStats.bookings.failed++;
        syncStats.total.failed++;
        console.error(`❌ [${index + 1}/${bookingSubs.length}] Failed to sync booking ID ${booking.id}:`, error);
      }
    }

    // LEADS
    console.log('\n-------------------------------------------');
    console.log('SYNCING LEADS');
    console.log('-------------------------------------------');
    
    // Using raw SQL to select only fields we know exist
    const leadSubs = await db.execute(
      `SELECT 
        id, 
        first_name, 
        last_name,
        email, 
        phone,
        interest_type,
        source, 
        status, 
        notes,
        created_at,
        updated_at,
        assigned_to,
        form_data
      FROM leads`
    ).then(result => {
      return result.rows.map(row => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        interestType: row.interest_type,
        source: row.source,
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at ? new Date(row.created_at) : null,
        updatedAt: row.updated_at ? new Date(row.updated_at) : null,
        assignedTo: row.assigned_to,
        formData: row.form_data
      }));
    });
    
    syncStats.leads.total = leadSubs.length;
    syncStats.total.total += leadSubs.length;
    
    console.log(`Found ${leadSubs.length} leads to sync`);
    
    for (const [index, lead] of leadSubs.entries()) {
      try {
        // Parse formData if it's a string
        const formDataObj = typeof lead.formData === 'string' 
          ? JSON.parse(lead.formData) 
          : (lead.formData || {});
          
        // Enrich lead with additional fields
        const enrichedLead = {
          ...lead,
          formName: 'Lead Generation',
          source: lead.source || 'website',
          status: lead.status || 'new',
          tags: ['Lead', lead.interestType],
          formData: formDataObj,
          createdAt: lead.createdAt || new Date(),
          updatedAt: lead.updatedAt || new Date(),
          // Add default values for any missing fields Airtable expects
          preferredContactMethod: 'Email',
          preferredContactTime: 'Any time',
          lastName: lead.lastName || '',
          phone: lead.phone || ''
        };
        
        await retryFailedSync(syncToAirtable, enrichedLead);
        syncStats.leads.success++;
        syncStats.total.success++;
        console.log(`✅ [${index + 1}/${leadSubs.length}] Synced lead: ${lead.email}`);
      } catch (error) {
        syncStats.leads.failed++;
        syncStats.total.failed++;
        console.error(`❌ [${index + 1}/${leadSubs.length}] Failed to sync lead ${lead.email}:`, error);
      }
    }

    console.log('\n======================================================');
    console.log('SYNC COMPLETED SUCCESSFULLY');
    console.log('======================================================');
    
    // Print sync summary
    console.log('\nSYNC SUMMARY:');
    console.log('-------------------------------------------');
    console.log(`Guide Submissions: ${syncStats.guideSubmissions.success}/${syncStats.guideSubmissions.total} synced (${syncStats.guideSubmissions.failed} failed)`);
    console.log(`Bookings: ${syncStats.bookings.success}/${syncStats.bookings.total} synced (${syncStats.bookings.failed} failed)`);
    console.log(`Leads: ${syncStats.leads.success}/${syncStats.leads.total} synced (${syncStats.leads.failed} failed)`);
    console.log('-------------------------------------------');
    console.log(`TOTAL: ${syncStats.total.success}/${syncStats.total.total} synced (${syncStats.total.failed} failed)`);
    console.log('-------------------------------------------');
    
  } catch (error) {
    console.error('\n❌ SYNC FAILED WITH ERROR:');
    console.error('-------------------------------------------');
    console.error(error);
    console.error('-------------------------------------------');
    
    process.exit(1);
  }
}

// Run the sync
syncAllToAirtable()
  .then(() => {
    console.log(`\nSync process completed at ${new Date().toISOString()}`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\nSync process terminated with error at ${new Date().toISOString()}`);
    console.error(error);
    process.exit(1);
  });