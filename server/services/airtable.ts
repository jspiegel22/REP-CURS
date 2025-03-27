import Airtable from 'airtable';
import type { Booking, Lead, GuideSubmission } from '@shared/schema';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  console.error('Airtable API key or Base ID is missing. Airtable integration will not work.');
}

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID || '');

export const syncLeadToAirtable = async (lead) => {
  if (!lead) return null;

  const LEADS_TABLE = 'Leads';

  try {
    const record = await base(LEADS_TABLE).create([{
      fields: {
        'First Name': lead.firstName,
        'Last Name': lead.lastName || '',
        'Email': lead.email,
        'Phone': lead.phone || '',
        'Interest Type': lead.interestType,
        'Source Page': lead.source,
        'Status': lead.status,
        'Form Data': JSON.stringify(lead.formData || {}),
        'Notes': lead.notes || '',
        'Assigned To': lead.assignedTo || '',
        'Created At': lead.createdAt?.toISOString() || new Date().toISOString(),
        'Lead ID': `LEAD-${Date.now()}`,
        'Last Modified': new Date().toISOString(),
      }
    }]);

    return record[0].getId();
  } catch (error) {
    console.error('Error syncing lead to Airtable:', error);
    throw new Error('Failed to sync lead to Airtable');
  }
};

export async function syncBookingToAirtable(booking: Booking) {
  const BOOKINGS_TABLE = 'Bookings'; // Added table name here
  try {
    const record = await base(BOOKINGS_TABLE).create([{
      fields: {
        'First Name': booking.firstName,
        'Last Name': booking.lastName,
        'Email': booking.email,
        'Phone': booking.phone,
        'Booking Type': booking.bookingType,
        'Start Date': booking.startDate.toISOString(),
        'End Date': booking.endDate.toISOString(),
        'Guests': booking.guests,
        'Status': booking.status,
        'Total Amount': booking.totalAmount?.toString() || '',
        'Special Requests': booking.specialRequests || '',
        'Form Data': JSON.stringify(booking.formData || {}),
        'Created At': booking.createdAt?.toISOString() || new Date().toISOString(),
        'Booking ID': `BOOK-${Date.now()}`, // Unique identifier
        'Last Modified': new Date().toISOString(),
      }
    }]);

    return record[0].getId();
  } catch (error) {
    console.error('Error syncing booking to Airtable:', error);
    throw new Error('Failed to sync booking to Airtable');
  }
}

export async function syncGuideSubmissionToAirtable(submission: GuideSubmission): Promise<string> {
  const GUIDES_TABLE = 'Guide Submissions';
  
  try {
    console.log('Syncing guide submission to Airtable:', submission);
    const record = await base(GUIDES_TABLE).create([{
      fields: {
        'First Name': submission.firstName,
        'Email': submission.email,
        'Guide Type': submission.guideType,
        'Source': submission.source,
        'Form Name': submission.formName,
        'Status': submission.status,
        'Submission ID': submission.submissionId,
        'Submission Date': submission.createdAt?.toISOString() || new Date().toISOString(),
      }
    }]);

    return record[0].getId();
  } catch (error) {
    console.error('Error syncing guide submission to Airtable:', error);
    throw new Error('Failed to sync guide submission to Airtable');
  }
}

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
      return await syncFunction(data);
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError || new Error('Failed to sync after multiple attempts');
}