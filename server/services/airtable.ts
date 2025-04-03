import Airtable from 'airtable';
import type { Booking, Lead, GuideSubmission } from '@shared/schema';

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const ALL_LEADS_TABLE = 'tbl3882i9kYQN5wMO'; // Your existing leads table

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Airtable API key or Base ID is missing. Airtable integration will not work.');
  console.error('AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? 'Present' : 'Missing');
  console.error('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'Present' : 'Missing');
}

const airtable = new Airtable({ 
  apiKey: AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com'
});
const base = airtable.base(AIRTABLE_BASE_ID || '');

// Common function to sync any type of submission to Airtable
export async function syncToAirtable(submission: Lead | Booking | GuideSubmission): Promise<string> {
  if (!submission) return null;

  try {
    console.log('Attempting to sync submission to Airtable:', {
      baseId: AIRTABLE_BASE_ID,
      tableId: ALL_LEADS_TABLE,
      email: submission.email
    });

    // Determine submission type and prepare fields
    const fields = {
      // Basic Information
      'First Name': submission.firstName,
      'Last Name': (submission as any).lastName || '',
      'Email': submission.email,
      'Phone': (submission as any).phone || '',
      'Preferred Contact Method': (submission as any).preferredContactMethod || '',
      'Preferred Contact Time': (submission as any).preferredContactTime || '',
      
      // Submission Type & Details
      'Submission Type': getSubmissionType(submission),
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
      'Tags': generateTags(submission)
    };

    // Add type-specific fields
    if (isBooking(submission)) {
      Object.assign(fields, {
        'Start Date': submission.startDate.toISOString(),
        'End Date': submission.endDate.toISOString(),
        'Guests': submission.guests,
        'Total Amount': submission.totalAmount?.toString() || '',
        'Currency': (submission as any).currency || 'USD',
        'Payment Status': (submission as any).paymentStatus || 'Pending',
        'Payment Method': (submission as any).paymentMethod || ''
      });
    } else if (isGuideSubmission(submission)) {
      Object.assign(fields, {
        'Guide Type': submission.guideType,
        'Interest Areas': (submission as any).interestAreas?.join(', ') || '',
        'Travel Dates': (submission as any).travelDates || '',
        'Number of Travelers': (submission as any).numberOfTravelers || '',
        'Download Link': (submission as any).downloadLink || ''
      });
    }

    const record = await base(ALL_LEADS_TABLE).create([{ fields }]);

    console.log('Submission successfully synced to Airtable:', {
      recordId: record[0].getId(),
      email: submission.email,
      type: getSubmissionType(submission)
    });

    return record[0].getId();
  } catch (error) {
    console.error('Error syncing submission to Airtable:', {
      error,
      baseId: AIRTABLE_BASE_ID,
      tableId: ALL_LEADS_TABLE,
      email: submission.email
    });
    throw new Error('Failed to sync submission to Airtable');
  }
}

// Helper functions
function getSubmissionType(submission: Lead | Booking | GuideSubmission): string {
  if (isBooking(submission)) return 'Booking';
  if (isGuideSubmission(submission)) return 'Guide Request';
  return 'Lead';
}

function isBooking(submission: Lead | Booking | GuideSubmission): submission is Booking {
  return 'startDate' in submission && 'endDate' in submission;
}

function isGuideSubmission(submission: Lead | Booking | GuideSubmission): submission is GuideSubmission {
  return 'guideType' in submission;
}

function generateSubmissionId(submission: Lead | Booking | GuideSubmission): string {
  const prefix = getSubmissionType(submission).charAt(0);
  return `${prefix}-${Date.now()}`;
}

function generateTags(submission: Lead | Booking | GuideSubmission): string {
  const tags = [getSubmissionType(submission)];
  
  if (isBooking(submission)) {
    tags.push('Booking', submission.bookingType);
  } else if (isGuideSubmission(submission)) {
    tags.push('Guide', submission.guideType);
  }
  
  if ((submission as any).tags) {
    tags.push(...(submission as any).tags);
  }
  
  return tags.join(', ');
}

// Export the sync function for different types (for backward compatibility)
export const syncLeadToAirtable = syncToAirtable;
export const syncBookingToAirtable = syncToAirtable;
export const syncGuideSubmissionToAirtable = syncToAirtable;

// Utility function to retry failed syncs
export async function retryFailedSync<T>(
  syncFunction: (data: T) => Promise<string>,
  data: T,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${maxRetries} to sync data`);
      return await syncFunction(data);
    } catch (error) {
      lastError = error as Error;
      console.error(`Sync attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError || new Error('Failed to sync after multiple attempts');
}