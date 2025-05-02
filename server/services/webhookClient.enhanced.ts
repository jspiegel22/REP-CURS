// Enhanced Webhook client module with email notifications
import axios from 'axios';
import { nanoid } from 'nanoid';
import * as emailService from './emailService';

// Hardcode the webhook URL to ensure it's available
// This should match the value in .env
process.env.MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || 'https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2';
process.env.VITE_MAKE_WEBHOOK_URL = process.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2';

const WEBHOOK_API_URL = process.env.WEBHOOK_API_URL || 'http://localhost:8000/api';

interface WebhookResponse {
  status: 'success' | 'error' | 'warning';
  message?: string;
  tracking_id: string;
  email_sent?: boolean;
}

/**
 * Send a lead webhook notification to external systems
 * Enhanced with email notifications
 */
export async function sendLeadWebhook(leadData: any): Promise<WebhookResponse> {
  try {
    console.log(`Attempting to send lead webhook for ${leadData.email}`);
    
    // Extract first and last name for consistency
    const firstName = leadData.firstName || leadData.first_name || '';
    const lastName = leadData.lastName || leadData.last_name || '';
    
    // Add tracking ID if not present
    const data = {
      ...leadData,
      // Ensure first_name and last_name are at the top level and overwrite any existing values
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      tracking_id: leadData.tracking_id || nanoid(),
      webhook_type: 'lead', // Add webhook type to help in Make.com routing
      submission_type: 'Lead', // Airtable column mapping
      // Make sure tags are a string not an array for Airtable compatibility
      tags: typeof leadData.tags === 'string' ? leadData.tags : (
        Array.isArray(leadData.tags) ? leadData.tags.join(', ') : ''
      ),
      // Extract preferredContactMethod from either direct property or from formData
      preferred_contact_method: leadData.preferredContactMethod || 
                              (leadData.formData?.preferredContactMethod) || 'Email'
    };
    
    // Map form fields to proper Airtable columns
    if (leadData.formData) {
      // Start and end dates
      if (leadData.formData.checkIn) data.start_date = leadData.formData.checkIn;
      if (leadData.formData.checkOut) data.end_date = leadData.formData.checkOut;
      
      // Number of travelers
      if (leadData.formData.numberOfTravelers) data.number_of_travelers = parseInt(leadData.formData.numberOfTravelers) || 0;
      if (leadData.formData.numberOfChildren) data.number_of_travelers = (parseInt(leadData.formData.numberOfChildren) || 0) + 2; // Assuming 2 adults + children
      if (leadData.formData.partySize) data.guests = parseInt(leadData.formData.partySize) || 0;
      if (leadData.formData.guestCount) data.guests = parseInt(leadData.formData.guestCount) || 0;
      
      // Special requests and notes
      if (leadData.formData.notes) {
        data.notes = (data.notes ? data.notes + "\n\n" : "") + leadData.formData.notes;
      }
      if (leadData.formData.specialRequests) {
        data.special_requests = leadData.formData.specialRequests;
      }
      
      // Source tracking
      data.source_page = leadData.formName || '';
      
      // Wedding specific fields
      if (leadData.formData.weddingDate) data.travel_dates = leadData.formData.weddingDate;
      if (leadData.formData.weddingStyle) data.interest_areas = leadData.formData.weddingStyle;
      if (leadData.formData.partnersName) {
        data.notes = (data.notes ? data.notes + "\n\n" : "") + `Partner's Name: ${leadData.formData.partnersName}`;
      }
      
      // Influencer specific fields
      if (leadData.formData.instagramHandle) {
        let influencerNotes = [];
        influencerNotes.push(`Instagram: ${leadData.formData.instagramHandle}`);
        if (leadData.formData.followerCount) influencerNotes.push(`Followers: ${leadData.formData.followerCount}`);
        if (leadData.formData.previousBrands) influencerNotes.push(`Previous Brands: ${leadData.formData.previousBrands}`);
        if (leadData.formData.contentTypes) influencerNotes.push(`Content Types: ${leadData.formData.contentTypes}`);
        if (influencerNotes.length > 0) {
          data.notes = (data.notes ? data.notes + "\n\n" : "") + influencerNotes.join("\n");
        }
      }
      
      // URL fields
      if (leadData.formData.websiteUrl) data.download_link = leadData.formData.websiteUrl;
    }
    
    // Automatically set priority based on budget if not set
    if (leadData.budget && !data.priority) {
      if (leadData.budget.includes('$50000') || leadData.budget.includes('$50,000')) {
        data.priority = 'High';
      } else if (leadData.budget.includes('$20000') || leadData.budget.includes('$20,000')) {
        data.priority = 'Normal';
      } else {
        data.priority = 'Normal';
      }
    } else if (!data.priority) {
      data.priority = 'Normal';
    }
    
    // Send email notification using our emailService
    let emailSent = false;
    try {
      // Create lead notification email
      const htmlContent = emailService.createLeadNotificationEmail({ lead: data });
      
      // Send to admin or specified notification recipients
      const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@cabo.is';
      
      emailSent = await emailService.sendEmail({
        to: recipientEmail,
        subject: `New ${data.interestType || 'Transportation'} Lead: ${data.firstName} ${data.lastName || ''}`,
        html: htmlContent
      });
      console.log(`Email notification ${emailSent ? 'sent successfully' : 'failed'} for lead: ${data.email}`);
    } catch (emailError) {
      console.error('Error sending lead email notification:', emailError);
      // We won't throw here - the webhook should still try to process
    }
    
    // Try direct Make.com webhook first if configured
    try {
      if (process.env.MAKE_WEBHOOK_URL) {
        console.log("Using direct Make.com webhook:", process.env.MAKE_WEBHOOK_URL);
        console.log("Lead webhook payload:", JSON.stringify(data, null, 2));
        const response = await axios.post(process.env.MAKE_WEBHOOK_URL, data);
        console.log("Make.com webhook response:", response.status, response.statusText);
        return {
          status: 'success',
          tracking_id: data.tracking_id,
          message: 'Sent directly to Make.com',
          email_sent: emailSent
        };
      } else {
        console.warn("MAKE_WEBHOOK_URL environment variable is not set!");
      }
    } catch (directError: any) {
      console.error("Direct Make.com webhook failed:", directError.message);
      if (directError.response) {
        console.error(`Status: ${directError.response.status}, Response:`, directError.response.data);
      }
      console.warn("Falling back to API");
    }
    
    // Fall back to webhook API
    const response = await axios.post(`${WEBHOOK_API_URL}/leads/webhook`, data);
    
    return {
      status: 'success',
      tracking_id: data.tracking_id,
      message: response.data?.message,
      email_sent: emailSent
    };
  } catch (error: any) {
    console.error('Error sending lead webhook:', error.message);
    
    // Log detailed error info for debugging
    if (error.response) {
      console.error(`Status: ${error.response.status}, Response:`, error.response.data);
    }
    
    // Return error response but don't throw - we don't want to break the main flow
    return {
      status: 'error',
      tracking_id: leadData.tracking_id || nanoid(),
      message: error.message,
      email_sent: false
    };
  }
}

/**
 * Send a booking webhook notification to external systems
 * Enhanced with email notifications
 */
export async function sendBookingWebhook(bookingData: any): Promise<WebhookResponse> {
  try {
    console.log(`Attempting to send booking webhook for ${bookingData.email}`);
    
    // Extract first and last name for consistency
    const firstName = bookingData.firstName || bookingData.first_name || '';
    const lastName = bookingData.lastName || bookingData.last_name || '';
    
    // Add tracking ID if not present
    const data = {
      ...bookingData,
      // Ensure first_name and last_name are at the top level and overwrite any existing values
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      tracking_id: bookingData.tracking_id || nanoid(),
      webhook_type: 'booking', // Add webhook type to help in Make.com routing
      submission_type: 'Booking', // Airtable column mapping
      // Make sure tags are a string not an array for Airtable compatibility
      tags: typeof bookingData.tags === 'string' ? bookingData.tags : (
        Array.isArray(bookingData.tags) ? bookingData.tags.join(', ') : ''
      ),
      // Extract preferredContactMethod from either direct property or from formData
      preferred_contact_method: bookingData.preferredContactMethod || 
                              (bookingData.formData?.preferredContactMethod) || 'Email'
    };
    
    // Map booking fields to proper Airtable columns
    // Dates
    if (bookingData.startDate) data.start_date = bookingData.startDate;
    if (bookingData.endDate) data.end_date = bookingData.endDate;
    
    // Booking details
    if (bookingData.guests) data.guests = parseInt(bookingData.guests) || 0;
    if (bookingData.totalAmount) data.total_amount = parseFloat(bookingData.totalAmount) || 0;
    if (bookingData.bookingType) data.booking_type = bookingData.bookingType;
    
    // Handle payment fields
    if (bookingData.currency) data.currency = bookingData.currency;
    if (bookingData.paymentStatus) data.payment_status = bookingData.paymentStatus;
    if (bookingData.paymentMethod) data.payment_method = bookingData.paymentMethod;
    
    // Special requests
    if (bookingData.specialRequests) {
      data.special_requests = bookingData.specialRequests;
    }
    
    // Map form data
    if (bookingData.formData) {
      // Extract date information if not already set
      if (!data.start_date && bookingData.formData.checkIn) data.start_date = bookingData.formData.checkIn;
      if (!data.end_date && bookingData.formData.checkOut) data.end_date = bookingData.formData.checkOut;
      
      // Extract guest information if not already set
      if (!data.guests) {
        if (bookingData.formData.numberOfGuests) data.guests = parseInt(bookingData.formData.numberOfGuests) || 0;
        if (bookingData.formData.guestCount) data.guests = parseInt(bookingData.formData.guestCount) || 0;
        if (bookingData.formData.partySize) data.guests = parseInt(bookingData.formData.partySize) || 0;
      }
      
      // Extract special requests if not already set
      if (!data.special_requests && bookingData.formData.specialRequests) {
        data.special_requests = bookingData.formData.specialRequests;
      }
    }
    
    // Source tracking
    data.source_page = bookingData.formName || '';
    
    // Automatically set status
    if (!data.status) {
      data.status = 'New';
    }
    
    // Send email notification using our emailService
    let emailSent = false;
    try {
      // Create a confirmation number if not present
      const confirmationNumber = data.confirmationNumber || `CB${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Create booking confirmation email
      const htmlContent = emailService.createBookingConfirmationEmail({
        name: `${data.firstName} ${data.lastName || ''}`,
        email: data.email,
        bookingType: data.bookingType || 'transportation',
        confirmationNumber: confirmationNumber,
        booking: data
      });
      
      // Send to the customer
      emailSent = await emailService.sendEmail({
        to: data.email,
        subject: `Your Booking Confirmation (${confirmationNumber})`,
        html: htmlContent
      });
      console.log(`Email notification ${emailSent ? 'sent successfully' : 'failed'} for booking: ${data.email}`);
    } catch (emailError) {
      console.error('Error sending booking email notification:', emailError);
      // We won't throw here - the webhook should still try to process
    }
    
    // Try direct Make.com webhook first if configured
    try {
      if (process.env.MAKE_WEBHOOK_URL) {
        console.log("Using direct Make.com webhook:", process.env.MAKE_WEBHOOK_URL);
        console.log("Booking webhook payload:", JSON.stringify(data, null, 2));
        const response = await axios.post(process.env.MAKE_WEBHOOK_URL, data);
        console.log("Make.com webhook response:", response.status, response.statusText);
        return {
          status: 'success',
          tracking_id: data.tracking_id,
          message: 'Sent directly to Make.com',
          email_sent: emailSent
        };
      } else {
        console.warn("MAKE_WEBHOOK_URL environment variable is not set!");
      }
    } catch (directError: any) {
      console.error("Direct Make.com booking webhook failed:", directError.message);
      if (directError.response) {
        console.error(`Status: ${directError.response.status}, Response:`, directError.response.data);
      }
      console.warn("Falling back to API");
    }
    
    // Fall back to webhook API
    const response = await axios.post(`${WEBHOOK_API_URL}/bookings/webhook`, data);
    
    return {
      status: 'success',
      tracking_id: data.tracking_id,
      message: response.data?.message,
      email_sent: emailSent
    };
  } catch (error: any) {
    console.error('Error sending booking webhook:', error.message);
    
    // Log detailed error info for debugging
    if (error.response) {
      console.error(`Status: ${error.response.status}, Response:`, error.response.data);
    }
    
    // Return error response but don't throw - we don't want to break the main flow
    return {
      status: 'error',
      tracking_id: bookingData.tracking_id || nanoid(),
      message: error.message,
      email_sent: false
    };
  }
}

/**
 * Send a guide request webhook notification to external systems
 * Enhanced with email notifications
 */
export async function sendGuideRequestWebhook(guideData: any): Promise<WebhookResponse> {
  try {
    console.log(`Attempting to send guide request webhook for ${guideData.email}`, guideData);
    
    // Extract first and last name for consistency
    const firstName = guideData.firstName || guideData.first_name || '';
    const lastName = guideData.lastName || guideData.last_name || '';
    
    // Format data for webhook API
    const data: any = {
      // Ensure first_name and last_name are at the top level
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      email: guideData.email,
      phone: guideData.phone || undefined,
      guide_type: guideData.guideType,
      interest_areas: typeof guideData.interestAreas === 'string' ? guideData.interestAreas : 'Travel Guide',
      // Extract preferredContactMethod from either direct property or from formData
      preferred_contact_method: guideData.preferredContactMethod || 
                               (guideData.formData?.preferredContactMethod) || 'Email',
      form_data: {
        source: guideData.source || 'website',
        formName: guideData.formName || 'guide-download',
        submissionId: guideData.submissionId,
      },
      tags: typeof guideData.tags === 'string' ? guideData.tags : 'Guide Request, Website',
      tracking_id: guideData.tracking_id || nanoid(),
      webhook_type: 'guide', // Add webhook type to help in Make.com routing
      submission_type: 'Guide Request', // For Airtable column mapping
      status: 'New',
      source_page: guideData.formName || 'guide-download', 
      download_link: guideData.formData?.download_link || 'https://cabovillas.replit.app/cabo-travel.pdf',
      // Initialize fields that will be potentially populated
      budget_range: '',
      notes: '',
      travel_dates: ''
    };
    
    // Add additional fields if they exist in the form data
    if (guideData.formData) {
      if (guideData.formData.investmentLevel) {
        data.budget_range = guideData.formData.investmentLevel;
      }
      
      if (guideData.formData.agentInterest) {
        data.notes = (data.notes ? data.notes + "\n\n" : "") + 
                   `Agent Interest: ${guideData.formData.agentInterest ? 'Yes' : 'No'}`;
      }
      
      // Extract travel dates if available
      if (guideData.formData.travelDates) {
        data.travel_dates = guideData.formData.travelDates;
      }
    }
    
    // Send email notification using our emailService
    let emailSent = false;
    try {
      // Create guide email using centralized template
      const userHtmlContent = emailService.createGuideRequestEmail({
        name: data.firstName,
        email: data.email,
        downloadLink: data.download_link || '#' // Fallback to a placeholder URL if download link is missing
      });
      
      // Create admin notification email
      const adminHtmlContent = emailService.createGuideNotificationEmail({
        guide: data
      });
      
      // Send to the customer
      emailSent = await emailService.sendEmail({
        to: data.email,
        subject: "Your Cabo San Lucas Travel Guide",
        html: userHtmlContent
      });
      
      // Also send notification to admin
      const adminEmailSent = await emailService.sendEmail({
        to: process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@cabo.is',
        subject: `New Guide Request: ${data.firstName} ${data.lastName || ''}`,
        html: adminHtmlContent
      });
      console.log(`Email notification ${emailSent ? 'sent successfully' : 'failed'} for guide request: ${data.email}`);
    } catch (emailError) {
      console.error('Error sending guide request email notification:', emailError);
      // We won't throw here - the webhook should still try to process
    }
    
    // Try direct Make.com webhook first if configured
    try {
      if (process.env.MAKE_WEBHOOK_URL) {
        console.log("Using direct Make.com webhook:", process.env.MAKE_WEBHOOK_URL);
        console.log("Guide webhook payload:", JSON.stringify(data, null, 2));
        const response = await axios.post(process.env.MAKE_WEBHOOK_URL, data);
        console.log("Make.com webhook response:", response.status, response.statusText);
        return {
          status: 'success',
          tracking_id: data.tracking_id,
          message: 'Sent directly to Make.com',
          email_sent: emailSent
        };
      } else {
        console.warn("MAKE_WEBHOOK_URL environment variable is not set!");
      }
    } catch (directError: any) {
      console.error("Direct Make.com guide webhook failed:", directError.message);
      if (directError.response) {
        console.error(`Status: ${directError.response.status}, Response:`, directError.response.data);
      }
      console.warn("Falling back to API");
    }
    
    // Fall back to webhook API
    const response = await axios.post(`${WEBHOOK_API_URL}/guides/webhook`, data);
    
    return {
      status: 'success',
      tracking_id: data.tracking_id,
      message: response.data?.message,
      email_sent: emailSent
    };
  } catch (error: any) {
    console.error('Error sending guide request webhook:', error.message);
    
    // Log detailed error info for debugging
    if (error.response) {
      console.error(`Status: ${error.response.status}, Response:`, error.response.data);
    }
    
    // Return error response but don't throw - we don't want to break the main flow
    return {
      status: 'warning',
      tracking_id: guideData.tracking_id || nanoid(),
      message: error.message,
      email_sent: false
    };
  }
}