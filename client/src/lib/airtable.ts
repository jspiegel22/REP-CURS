import Airtable from 'airtable';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { GuideDownload } from '@/types/booking';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY) {
  throw new Error('Missing Airtable API key');
}

if (!AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable base ID');
}

const airtable = new Airtable({
  apiKey: AIRTABLE_API_KEY
}).base(AIRTABLE_BASE_ID);

export async function submitGuideDownload(
  data: Omit<GuideDownload, 'submissionId' | 'submissionDate'>,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify reCAPTCHA if token is provided
    if (recaptchaToken !== "no-recaptcha") {
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recaptchaToken })
      });

      const recaptchaResult = await recaptchaResponse.json();
      if (!recaptchaResult.success) {
        return {
          success: false,
          message: 'reCAPTCHA verification failed'
        };
      }
    }

    // Prepare data for Airtable
    const enrichedData = {
      ...data,
      submissionId: nanoid(),
      submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    };

    // Submit to Airtable
    const record = await airtable('Guide Downloads').create([
      {
        fields: {
          Name: enrichedData.firstName,
          Email: enrichedData.email,
          'Guide Type': enrichedData.guideType,
          Source: enrichedData.source,
          Status: enrichedData.status,
          'Submission ID': enrichedData.submissionId,
          'Submission Date': enrichedData.submissionDate,
          'Form Name': enrichedData.formName,
          Tags: enrichedData.tags?.join(', ') || ''
        }
      }
    ]);

    if (!record || record.length === 0) {
      throw new Error('Failed to create Airtable record');
    }

    return {
      success: true,
      message: 'Guide download request submitted successfully'
    };
  } catch (error) {
    console.error('Airtable submission error:', error);
    return {
      success: false,
      message: 'An error occurred while submitting the form'
    };
  }
}

export async function createAirtableRecord(options: any): Promise<any> {
  try {
    const record = await airtable('Image Uploads').create([
      {
        fields: {
          Name: options.name,
          Email: options.email,
          'Image URL': options.imageUrl,
          Folder: options.folder,
          Status: options.status,
          ...options,
        },
      },
    ]);

    return record[0];
  } catch (error) {
    console.error('Error creating Airtable record:', error);
    throw error;
  }
}

export async function updateAirtableRecord(
  recordId: string,
  fields: Record<string, any>
): Promise<any> {
  try {
    const record = await airtable('Image Uploads').update(recordId, {
      fields,
    });

    return record;
  } catch (error) {
    console.error('Error updating Airtable record:', error);
    throw error;
  }
}

export async function getAirtableRecord(recordId: string): Promise<any> {
  try {
    const record = await airtable('Image Uploads').find(recordId);
    return record;
  } catch (error) {
    console.error('Error getting Airtable record:', error);
    throw error;
  }
}

export async function listAirtableRecords(
  filterByFormula?: string,
  maxRecords?: number
): Promise<any[]> {
  try {
    const records = await airtable('Image Uploads')
      .select({
        filterByFormula,
        maxRecords,
      })
      .all();

    return records;
  } catch (error) {
    console.error('Error listing Airtable records:', error);
    throw error;
  }
}

export async function deleteAirtableRecord(recordId: string): Promise<void> {
  try {
    await airtable('Image Uploads').destroy(recordId);
  } catch (error) {
    console.error('Error deleting Airtable record:', error);
    throw error;
  }
}


export async function submitToAirtable<T extends any>(
  config: any,
  data: T,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify reCAPTCHA if token is provided
    if (recaptchaToken !== "no-recaptcha") {
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recaptchaToken })
      });

      const recaptchaResult = await recaptchaResponse.json();
      if (!recaptchaResult.success) {
        return {
          success: false,
          message: 'reCAPTCHA verification failed'
        };
      }
    }

    const response = await fetch(`https://api.airtable.com/v0/${config.baseId}/${config.tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{ fields: data }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Airtable');
    }

    return {
      success: true,
      message: 'Submission successful'
    };
  } catch (error) {
    console.error('Airtable submission error:', error);
    return {
      success: false,
      message: 'An error occurred while submitting the form'
    };
  }
}

export async function submitBooking(
  data: any,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  const enrichedData: any = {
    ...data,
    submissionId: nanoid(),
    submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    bookingId: `BK-${nanoid(8)}`
  };

  return submitToAirtable(
    { baseId: AIRTABLE_BASE_ID, tableName: 'Bookings' },
    enrichedData,
    recaptchaToken
  );
}

export async function submitLead(
  data: any,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  const enrichedData: any = {
    ...data,
    submissionId: nanoid(),
    submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    leadId: `LD-${nanoid(8)}`
  };

  return submitToAirtable(
    { baseId: AIRTABLE_BASE_ID, tableName: 'Leads' },
    enrichedData,
    recaptchaToken
  );
}