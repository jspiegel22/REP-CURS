// Webhook client module for sending events to external systems

import axios from 'axios';
import { nanoid } from 'nanoid';

// Hardcode the webhook URL to ensure it's available
// This should match the value in .env
process.env.MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2';
process.env.VITE_MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2';

const WEBHOOK_API_URL = process.env.WEBHOOK_API_URL || 'http://localhost:8000/api';

interface WebhookResponse {
  status: 'success' | 'error' | 'warning';
  message?: string;
  tracking_id: string;
}

/**
 * Send a lead webhook notification to external systems
 */
export async function sendLeadWebhook(leadData: any): Promise<WebhookResponse> {
  try {
    console.log(`Attempting to send lead webhook for ${leadData.email}`);
    
    // Add tracking ID if not present
    const data = {
      ...leadData,
      tracking_id: leadData.tracking_id || nanoid(),
      webhook_type: 'lead' // Add webhook type to help in Make.com routing
    };
    
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
          message: 'Sent directly to Make.com'
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
      message: response.data?.message
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
      message: error.message
    };
  }
}

/**
 * Send a booking webhook notification to external systems
 */
export async function sendBookingWebhook(bookingData: any): Promise<WebhookResponse> {
  try {
    console.log(`Attempting to send booking webhook for ${bookingData.email}`);
    
    // Add tracking ID if not present
    const data = {
      ...bookingData,
      tracking_id: bookingData.tracking_id || nanoid(),
      webhook_type: 'booking' // Add webhook type to help in Make.com routing
    };
    
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
          message: 'Sent directly to Make.com'
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
      message: response.data?.message
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
      message: error.message
    };
  }
}

/**
 * Send a guide request webhook notification to external systems
 */
export async function sendGuideRequestWebhook(guideData: any): Promise<WebhookResponse> {
  try {
    console.log(`Attempting to send guide request webhook for ${guideData.email}`, guideData);
    
    // Format data for webhook API
    const data = {
      first_name: guideData.firstName,
      last_name: guideData.lastName || '',
      email: guideData.email,
      phone: guideData.phone || undefined,
      guide_type: guideData.guideType,
      interest_areas: Array.isArray(guideData.interestAreas) ? guideData.interestAreas : [],
      form_data: {
        source: guideData.source || 'website',
        formName: guideData.formName || 'guide-download',
        preferredContactMethod: guideData.preferredContactMethod || 'Email',
        submissionId: guideData.submissionId,
      },
      tags: Array.isArray(guideData.tags) ? guideData.tags : [],
      tracking_id: guideData.tracking_id || nanoid(),
      webhook_type: 'guide' // Add webhook type to help in Make.com routing
    };
    
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
          message: 'Sent directly to Make.com'
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
      message: response.data?.message
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
      message: `Webhook sending failed: ${error.message}`
    };
  }
}