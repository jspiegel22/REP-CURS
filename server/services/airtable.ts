import Airtable from 'airtable';
import type { Booking, Lead, GuideSubmission } from '@shared/schema';

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const ALL_SUBMISSIONS_TABLE = 'tbl3882i9kYQN5wMO'; // Your unified submissions table

// Validate Airtable configuration
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('⚠️ Airtable API key or Base ID is missing. Airtable integration will not work.');
  console.error('AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? 'Present' : 'Missing');
  console.error('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'Present' : 'Missing');
}

// Initialize Airtable client
const airtable = new Airtable({ 
  apiKey: AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com'
});
const base = airtable.base(AIRTABLE_BASE_ID || '');

/**
 * Core function to sync any type of submission to Airtable
 * All submission types go to the same table but are clearly marked with their type
 */
export async function syncToAirtable(submission: Lead | Booking | GuideSubmission): Promise<string> {
  if (!submission) return "";

  try {
    const submissionType = getSubmissionType(submission);
    
    console.log(`Syncing ${submissionType} to Airtable:`, {
      email: submission.email,
      baseId: AIRTABLE_BASE_ID?.slice(0, 6) + '...',
      tableId: ALL_SUBMISSIONS_TABLE
    });

    // Common fields shared across all submission types
    const fields = {
      // Basic Information
      'First Name': submission.firstName,
      'Last Name': (submission as any).lastName || '',
      'Email': submission.email,
      'Phone': (submission as any).phone || '',
      'Preferred Contact Method': (submission as any).preferredContactMethod || '',
      'Preferred Contact Time': (submission as any).preferredContactTime || '',
      
      // Submission Type & Details
      'Submission Type': submissionType,
      'Status': (submission as any).status || 'New',
      'Priority': (submission as any).priority || 'Normal',
      
      // Source & Tracking
      'Source Page': (submission as any).source || '',
      'UTM Source': (submission as any).utmSource || '',
      'UTM Medium': (submission as any).utmMedium || '',
      'UTM Campaign': (submission as any).utmCampaign || '',
      
      // Form & Submission Data
      'Form Name': (submission as any).formName || '',
      'Form Data': JSON.stringify((submission as any).formData || {}),
      'Submission ID': generateSubmissionId(submission),
      'Created At': (submission as any).createdAt?.toISOString() || new Date().toISOString(),
      'Last Modified': new Date().toISOString(),
      
      // Additional Metadata
      'IP Address': (submission as any).ipAddress || '',
      'User Agent': (submission as any).userAgent || '',
      'Referrer': (submission as any).referrer || '',
      'Tags': generateTags(submission),
      'Notes': (submission as any).notes || ''
    };

    // Add type-specific fields based on submission type
    if (isBooking(submission)) {
      // Booking-specific fields
      Object.assign(fields, {
        'Booking Type': submission.bookingType,
        'Start Date': submission.startDate.toISOString(),
        'End Date': submission.endDate.toISOString(),
        'Guests': submission.guests,
        'Total Amount': submission.totalAmount?.toString() || '',
        'Currency': (submission as any).currency || 'USD',
        'Payment Status': (submission as any).paymentStatus || 'Pending',
        'Payment Method': (submission as any).paymentMethod || '',
        'Special Requests': (submission as any).specialRequests || '',
        'Budget': (submission as any).budget || '',
        'Listing ID': (submission as any).listingId || ''
      });
    } else if (isGuideSubmission(submission)) {
      // Guide submission-specific fields
      Object.assign(fields, {
        'Guide Type': submission.guideType,
        'Interest Areas': Array.isArray((submission as any).interestAreas) 
          ? (submission as any).interestAreas.join(', ') 
          : (submission as any).interestAreas || '',
        'Travel Dates': (submission as any).travelDates || '',
        'Number of Travelers': (submission as any).numberOfTravelers || '',
        'Download Link': (submission as any).downloadLink || '',
        'Processed At': (submission as any).processedAt ? new Date((submission as any).processedAt).toISOString() : ''
      });
    } else {
      // Lead-specific fields (using the Lead type)
      const lead = submission as Lead;
      Object.assign(fields, {
        'Interest Type': lead.interestType || '',
        'Budget': lead.budget || '',
        'Timeline': lead.timeline || '',
        'Assigned To': lead.assignedTo || ''
      });
    }

    // Create the record in Airtable
    const record = await base(ALL_SUBMISSIONS_TABLE).create([{ fields }]);

    console.log(`✅ ${submissionType} successfully synced to Airtable:`, {
      recordId: record[0].getId(),
      email: submission.email
    });

    return record[0].getId();
  } catch (error: any) {
    console.error(`❌ Error syncing ${getSubmissionType(submission)} to Airtable:`, {
      error: error.message || String(error),
      email: submission.email
    });
    throw new Error(`Failed to sync ${getSubmissionType(submission)} to Airtable: ${error.message || String(error)}`);
  }
}

/**
 * Helper function to determine the submission type
 */
function getSubmissionType(submission: Lead | Booking | GuideSubmission): string {
  if (isBooking(submission)) return 'Booking';
  if (isGuideSubmission(submission)) return 'Guide Request';
  return 'Lead';
}

/**
 * Type guard for Booking submissions
 */
function isBooking(submission: Lead | Booking | GuideSubmission): submission is Booking {
  return 'startDate' in submission && 'endDate' in submission && 'bookingType' in submission;
}

/**
 * Type guard for GuideSubmission submissions
 */
function isGuideSubmission(submission: Lead | Booking | GuideSubmission): submission is GuideSubmission {
  return 'guideType' in submission;
}

/**
 * Generate a unique submission ID for tracking
 */
function generateSubmissionId(submission: Lead | Booking | GuideSubmission): string {
  // If there's already a submission ID, use it
  if ((submission as any).submissionId) {
    return (submission as any).submissionId;
  }
  
  // Otherwise, generate a new one with type prefix and timestamp
  const type = getSubmissionType(submission);
  const prefix = type.substring(0, 1).toUpperCase(); // B for Booking, G for Guide, L for Lead
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate comma-separated tags for categorization
 * IMPORTANT: Only use standardized tags that are pre-configured in Airtable
 * Do NOT pass user-provided tags directly to Airtable as it will reject new options
 */
function generateTags(submission: Lead | Booking | GuideSubmission): string {
  // First tag is ALWAYS the submission type - this is what Make.com uses for routing
  const tags = [getSubmissionType(submission)];
  
  // Second tag is the specific category based on submission type
  if (isBooking(submission)) {
    // Add booking-specific category
    tags.push(capitalizeFirstLetter(submission.bookingType)); // Villa, Resort, Adventure, etc.
  } else if (isGuideSubmission(submission)) {
    // Add standard guide category tag - do NOT use user-submitted guide type directly
    tags.push("Travel Guide");
  } else if ('interestType' in submission) {
    // Add lead-specific category - convert to display format
    const interestType = (submission as Lead).interestType;
    if (interestType === "villa") tags.push("Villa Rental");
    else if (interestType === "resort") tags.push("Resort Stay");
    else if (interestType === "adventure") tags.push("Adventure");
    else if (interestType === "wedding") tags.push("Wedding");
    else if (interestType === "group_trip") tags.push("Group Trip");
    else if (interestType === "influencer") tags.push("Influencer");
    else if (interestType === "concierge") tags.push("Concierge");
    else tags.push(capitalizeFirstLetter(interestType));
  }
  
  // Add "Website" tag for all submissions that come from the website
  if ((submission as any).source === "website") {
    tags.push("Website");
  }
  
  // Note: We intentionally don't add custom user tags here since Airtable
  // will reject them unless they're already configured as select options
  
  return tags.join(', ');
}

// Helper function to capitalize first letter of each word
function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Export type-specific sync functions for backward compatibility
export const syncLeadToAirtable = syncToAirtable;
export const syncBookingToAirtable = syncToAirtable;
export const syncGuideSubmissionToAirtable = syncToAirtable;

/**
 * Utility function to retry failed syncs with exponential backoff
 */
export async function retryFailedSync<T>(
  syncFunction: (data: T) => Promise<string>,
  data: T,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt} of ${maxRetries} to sync data to Airtable`);
      return await syncFunction(data);
    } catch (error: any) {
      lastError = error as Error;
      console.error(`❌ Sync attempt ${attempt} failed:`, error.message || String(error));
      
      if (attempt < maxRetries) {
        // Use exponential backoff - each retry waits longer
        const backoffDelay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${backoffDelay}ms before retry ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError || new Error('Failed to sync after multiple attempts');
}