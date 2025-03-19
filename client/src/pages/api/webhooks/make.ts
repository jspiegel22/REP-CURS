import { NextApiRequest, NextApiResponse } from 'next';
import { createAirtableRecord } from '@/lib/airtable';
import { sendActiveCampaignEmail } from '@/lib/email';
import { trackEvent } from '@/lib/analytics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl, airtableRecordId, metadata } = req.body;

    // Validate webhook payload
    if (!imageUrl || !airtableRecordId || !metadata) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Process the image upload
    await processImageUpload(imageUrl, airtableRecordId, metadata);

    // Track the automation event
    trackEvent({
      category: 'Automation',
      action: 'Image Processing',
      label: airtableRecordId,
    });

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function processImageUpload(
  imageUrl: string,
  airtableRecordId: string,
  metadata: Record<string, any>
) {
  // Update Airtable record with processing status
  await createAirtableRecord({
    id: airtableRecordId,
    status: 'processing',
    processedAt: new Date().toISOString(),
  });

  // Send processing notification email
  await sendActiveCampaignEmail({
    to: metadata.email,
    template: 'image-processing',
    data: {
      name: metadata.name,
      imageUrl,
      folder: metadata.folder,
    },
  });

  // Here you would typically:
  // 1. Download the image
  // 2. Process it (resize, optimize, etc.)
  // 3. Upload to your CDN
  // 4. Update the record with the processed image URL

  // For now, we'll just simulate processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Update Airtable record with completion status
  await createAirtableRecord({
    id: airtableRecordId,
    status: 'completed',
    completedAt: new Date().toISOString(),
  });

  // Send completion notification email
  await sendActiveCampaignEmail({
    to: metadata.email,
    template: 'image-processing-complete',
    data: {
      name: metadata.name,
      imageUrl,
      folder: metadata.folder,
    },
  });
} 