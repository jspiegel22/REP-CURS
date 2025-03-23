import { z } from "zod";

// Base schema for all form submissions
export const baseSubmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  submissionDate: z.string(),
  submissionId: z.string(),
  source: z.string(),
  formName: z.string(),
});

// Guide download specific schema
export const guideDownloadSchema = baseSubmissionSchema.extend({
  guideName: z.string(),
  guideType: z.string(),
  downloadDate: z.string(),
});

// Booking specific schema
export const bookingSchema = baseSubmissionSchema.extend({
  bookingType: z.enum(["villa", "adventure", "concierge", "wedding", "event"]),
  startDate: z.string(),
  endDate: z.string(),
  numberOfGuests: z.number().min(1),
  budget: z.string(),
  specialRequests: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  bookingId: z.string(),
});

// Lead generation specific schema
export const leadGenSchema = baseSubmissionSchema.extend({
  interestType: z.enum(["villa", "adventure", "concierge", "wedding", "event", "real-estate", "other"]),
  budget: z.string(),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  preferredContactTime: z.string().optional(),
  additionalInfo: z.string().optional(),
  leadId: z.string(),
});

export type BaseSubmission = z.infer<typeof baseSubmissionSchema>;
export type GuideDownload = z.infer<typeof guideDownloadSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type LeadGen = z.infer<typeof leadGenSchema>; 