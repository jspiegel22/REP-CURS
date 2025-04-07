import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const guideSubmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  preferredContactMethod: z.enum(['email', 'phone', 'both']).default('email'),
  guideType: z.string().default("Ultimate Cabo Guide 2025"),
  interestAreas: z.array(z.string()).default([]),
  source: z.string().default("website"),
  status: z.string().default("completed"),
  formName: z.string().default("guide-download"),
  submissionId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate submission data
    const submissionData = guideSubmissionSchema.safeParse({
      ...req.body,
      submissionId: req.body.submissionId || `guide-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    });

    if (!submissionData.success) {
      return res.status(400).json({
        message: "Invalid submission data",
        errors: submissionData.error.errors
      });
    }

    // Mock submission success
    console.log('✅ Guide submission received:', submissionData.data);

    // Return a successful response with a download URL
    res.status(201).json({
      ...submissionData.data,
      message: "Your guide is ready for download",
      downloadUrl: "/guides/ultimate-cabo-guide-2025.pdf"
    });
  } catch (error) {
    console.error("Error processing guide submission:", error);
    res.status(500).json({ message: "Failed to process guide submission" });
  }
}