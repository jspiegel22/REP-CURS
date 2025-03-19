import Airtable from 'airtable';

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