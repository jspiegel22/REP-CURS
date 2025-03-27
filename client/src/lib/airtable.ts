import Airtable from 'airtable';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { GuideDownload } from '@/types/booking';
import type { GuideDownloadSubmission, BookingSubmission, LeadSubmission } from "@/types/booking";

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

export class AirtableService {
  private static instance: AirtableService;
  private base: Airtable.Base;
  private config: {
    guideDownloadsTable: string;
    bookingsTable: string;
    leadsTable: string;
  };

  private constructor() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      throw new Error("Airtable configuration is missing");
    }

    this.base = new Airtable({ apiKey }).base(baseId);
    this.config = {
      guideDownloadsTable: "Guide Downloads",
      bookingsTable: "Bookings",
      leadsTable: "Leads",
    };
  }

  public static getInstance(): AirtableService {
    if (!AirtableService.instance) {
      AirtableService.instance = new AirtableService();
    }
    return AirtableService.instance;
  }

  public async getGuideDownloads(): Promise<GuideDownloadSubmission[]> {
    try {
      const records = await this.base(this.config.guideDownloadsTable)
        .select({
          sort: [{ field: "submissionDate", direction: "desc" }],
        })
        .all();

      return records.map((record) => ({
        submissionId: record.get("submissionId") as string,
        firstName: record.get("firstName") as string,
        lastName: record.get("lastName") as string,
        email: record.get("email") as string,
        phone: record.get("phone") as string,
        guideType: record.get("guideType") as string,
        guideName: record.get("guideName") as string,
        downloadDate: record.get("downloadDate") as string,
        source: record.get("source") as string,
        formName: record.get("formName") as string,
      }));
    } catch (error) {
      console.error("Error fetching guide downloads:", error);
      throw error;
    }
  }

  public async getBookings(): Promise<BookingSubmission[]> {
    try {
      const records = await this.base(this.config.bookingsTable)
        .select({
          sort: [{ field: "submissionDate", direction: "desc" }],
        })
        .all();

      return records.map((record) => ({
        submissionId: record.get("submissionId") as string,
        firstName: record.get("firstName") as string,
        lastName: record.get("lastName") as string,
        email: record.get("email") as string,
        phone: record.get("phone") as string,
        bookingType: record.get("bookingType") as string,
        startDate: record.get("startDate") as string,
        endDate: record.get("endDate") as string,
        numberOfGuests: record.get("numberOfGuests") as number,
        budget: record.get("budget") as string,
        specialRequests: record.get("specialRequests") as string,
        status: record.get("status") as string,
        bookingId: record.get("bookingId") as string,
        submissionDate: record.get("submissionDate") as string,
        source: record.get("source") as string,
        formName: record.get("formName") as string,
      }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }

  public async getLeads(): Promise<LeadSubmission[]> {
    try {
      const records = await this.base(this.config.leadsTable)
        .select({
          sort: [{ field: "submissionDate", direction: "desc" }],
        })
        .all();

      return records.map((record) => ({
        submissionId: record.get("submissionId") as string,
        firstName: record.get("firstName") as string,
        lastName: record.get("lastName") as string,
        email: record.get("email") as string,
        phone: record.get("phone") as string,
        interestType: record.get("interestType") as string,
        budget: record.get("budget") as string,
        preferredContactMethod: record.get("preferredContactMethod") as string,
        preferredContactTime: record.get("preferredContactTime") as string,
        additionalInfo: record.get("additionalInfo") as string,
        leadId: record.get("leadId") as string,
        submissionDate: record.get("submissionDate") as string,
        source: record.get("source") as string,
        formName: record.get("formName") as string,
      }));
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  }

  public async submitGuideDownload(submission: Omit<GuideDownloadSubmission, "submissionId" | "submissionDate">): Promise<void> {
    try {
      await this.base(this.config.guideDownloadsTable).create([
        {
          fields: {
            ...submission,
            submissionId: `GD-${Date.now()}`,
            submissionDate: new Date().toISOString(),
          },
        },
      ]);
    } catch (error) {
      console.error("Error submitting guide download:", error);
      throw error;
    }
  }

  public async submitBooking(submission: Omit<BookingSubmission, "submissionId" | "submissionDate" | "bookingId">): Promise<void> {
    try {
      await this.base(this.config.bookingsTable).create([
        {
          fields: {
            ...submission,
            submissionId: `B-${Date.now()}`,
            bookingId: `BK-${Date.now()}`,
            submissionDate: new Date().toISOString(),
          },
        },
      ]);
    } catch (error) {
      console.error("Error submitting booking:", error);
      throw error;
    }
  }

  public async submitLead(submission: Omit<LeadSubmission, "submissionId" | "submissionDate" | "leadId">): Promise<void> {
    try {
      await this.base(this.config.leadsTable).create([
        {
          fields: {
            ...submission,
            submissionId: `L-${Date.now()}`,
            leadId: `LD-${Date.now()}`,
            submissionDate: new Date().toISOString(),
          },
        },
      ]);
    } catch (error) {
      console.error("Error submitting lead:", error);
      throw error;
    }
  }
}

export const Airtable = AirtableService.getInstance();