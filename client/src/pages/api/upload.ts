import { NextApiRequest, NextApiResponse } from 'next';
import { uploadImage } from '@/lib/imageUpload';
import { initializeSecurity } from '@/lib/formSecurity';
import formidable from 'formidable';
import { createAirtableRecord } from '@/lib/airtable';
import { sendActiveCampaignEmail } from '@/lib/email';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Initialize security
    await initializeSecurity();

    // Parse form data
    const form = formidable();
    const [fields, files] = await form.parse(req);
    
    // Validate form data
    const isValid = await validateFormData(fields);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid form data' });
    }

    // Handle image upload
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Google Drive
    const uploadedImage = await uploadImage(imageFile, fields.folder?.[0] || 'general');

    // Create Airtable record
    const airtableRecord = await createAirtableRecord({
      name: fields.name?.[0],
      email: fields.email?.[0],
      imageUrl: uploadedImage.webViewLink,
      folder: fields.folder?.[0],
      status: 'pending',
    });

    // Send notification email via Active Campaign
    await sendActiveCampaignEmail({
      to: fields.email?.[0],
      template: 'image-upload-confirmation',
      data: {
        name: fields.name?.[0],
        imageUrl: uploadedImage.webViewLink,
        folder: fields.folder?.[0],
      },
    });

    // Trigger make.com webhook for automation
    await fetch(process.env.MAKE_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: uploadedImage.webViewLink,
        airtableRecordId: airtableRecord.id,
        metadata: fields,
      }),
    });

    return res.status(200).json({
      message: 'Image uploaded successfully',
      image: uploadedImage,
      record: airtableRecord,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function validateFormData(fields: formidable.Fields): Promise<boolean> {
  // Add your validation logic here
  return true;
} 