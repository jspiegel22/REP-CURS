import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const guideSubmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  preferredContactMethod: z.enum(['email', 'phone', 'both']).default('email'),
  guideType: z.string().default("Ultimate Cabo Guide 2025"),
  interestAreas: z.array(z.string()).default([]),
  source: z.string().default("website"),
  status: z.string().default("pending"),
  formName: z.string().default("guide-download"),
  submissionId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Generate submission ID if not provided
    const submissionId = req.body.submissionId || 
      `guide-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    // Parse and validate submission data
    const submissionData = guideSubmissionSchema.safeParse({
      ...req.body,
      submissionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!submissionData.success) {
      return res.status(400).json({
        message: "Invalid submission data",
        errors: submissionData.error.errors
      });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('guide_submissions')
      .insert([submissionData.data])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Send to ActiveCampaign (if integrated)
    try {
      // TODO: Add ActiveCampaign integration
    } catch (acError) {
      console.error("ActiveCampaign error:", acError);
      // Don't fail the submission if AC fails
    }

    // Return success response
    res.status(201).json({
      ...data,
      message: "Your guide is ready for download",
      downloadUrl: "/guides/ultimate-cabo-guide-2025.pdf"
    });
  } catch (error) {
    console.error("Error processing guide submission:", error);
    res.status(500).json({ 
      message: "Failed to process guide submission",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}