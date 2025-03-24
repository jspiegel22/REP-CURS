import Airtable from 'airtable';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { BaseSubmission, GuideDownload, Booking, LeadGen } from '@/types/booking';

const config = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
};

const airtable = new Airtable({ apiKey: config.apiKey }).base(config.baseId!);

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

interface CreateRecordOptions {
  name: string;
  email: string;
  imageUrl: string;
  folder: string;
  status: string;
  [key: string]: any;
}

export async function createAirtableRecord(options: CreateRecordOptions): Promise<AirtableRecord> {
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
): Promise<AirtableRecord> {
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

export async function getAirtableRecord(recordId: string): Promise<AirtableRecord> {
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
): Promise<AirtableRecord[]> {
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

interface AirtableConfig {
  baseId: string;
  tableName: string;
}

const AIRTABLE_CONFIGS = {
  guideDownloads: {
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
    tableName: 'Guide Downloads'
  },
  bookings: {
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
    tableName: 'Bookings'
  },
  leads: {
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
    tableName: 'Leads'
  }
};

export async function submitToAirtable<T extends BaseSubmission>(
  config: AirtableConfig,
  data: T,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify reCAPTCHA first
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

    // Submit to Airtable
    const response = await fetch(`https://api.airtable.com/v0/${config.baseId}/${config.tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
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

export async function submitGuideDownload(
  data: Omit<GuideDownload, 'submissionId' | 'submissionDate'>,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  const enrichedData: GuideDownload = {
    ...data,
    submissionId: nanoid(),
    submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };

  return submitToAirtable(AIRTABLE_CONFIGS.guideDownloads, enrichedData, recaptchaToken);
}

export async function submitBooking(
  data: Omit<Booking, 'submissionId' | 'submissionDate' | 'bookingId'>,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  const enrichedData: Booking = {
    ...data,
    submissionId: nanoid(),
    submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    bookingId: `BK-${nanoid(8)}`
  };

  return submitToAirtable(AIRTABLE_CONFIGS.bookings, enrichedData, recaptchaToken);
}

export async function submitLead(
  data: Omit<LeadGen, 'submissionId' | 'submissionDate' | 'leadId'>,
  recaptchaToken: string
): Promise<{ success: boolean; message: string }> {
  const enrichedData: LeadGen = {
    ...data,
    submissionId: nanoid(),
    submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    leadId: `LD-${nanoid(8)}`
  };

  return submitToAirtable(AIRTABLE_CONFIGS.leads, enrichedData, recaptchaToken);
} 