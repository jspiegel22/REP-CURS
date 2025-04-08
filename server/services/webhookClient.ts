import axios from 'axios';
import { Lead, Booking, GuideSubmission } from '@shared/schema';
import { log } from '../vite';

const WEBHOOK_API_BASE_URL = process.env.WEBHOOK_API_URL || 'http://localhost:8000';

interface WebhookResult {
  status: string;
  tracking_id?: string;
  results?: Array<{
    webhook_name: string;
    success: boolean;
    status: number;
  }>;
  message?: string;
}

/**
 * Send a lead submission to the webhook API
 */
export async function sendLeadWebhook(lead: Lead): Promise<WebhookResult> {
  try {
    // Format lead data for webhook API
    const webhookData = {
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      interest_type: lead.interestType,
      source: lead.source || 'website',
      budget: lead.budget,
      timeline: lead.timeline,
      form_data: lead.formData,
      tags: lead.tags,
      created_at: lead.createdAt
    };

    const response = await axios.post(
      `${WEBHOOK_API_BASE_URL}/api/webhooks/lead`,
      webhookData
    );

    log(`Lead webhook sent. Tracking ID: ${response.data.tracking_id}`, 'webhook');
    return response.data;
  } catch (error) {
    log(`Error sending lead webhook: ${error}`, 'webhook');
    // Return a structured error response
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error sending lead webhook'
    };
  }
}

/**
 * Send a booking submission to the webhook API
 */
export async function sendBookingWebhook(booking: Booking): Promise<WebhookResult> {
  try {
    // Format booking data for webhook API
    const webhookData = {
      first_name: booking.firstName,
      last_name: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      booking_type: booking.bookingType,
      start_date: booking.startDate,
      end_date: booking.endDate,
      guests: booking.guests,
      total_amount: booking.totalAmount,
      special_requests: booking.specialRequests,
      form_data: booking.formData,
      tags: booking.tags,
      created_at: booking.createdAt
    };

    const response = await axios.post(
      `${WEBHOOK_API_BASE_URL}/api/webhooks/booking`,
      webhookData
    );

    log(`Booking webhook sent. Tracking ID: ${response.data.tracking_id}`, 'webhook');
    return response.data;
  } catch (error) {
    log(`Error sending booking webhook: ${error}`, 'webhook');
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error sending booking webhook'
    };
  }
}

/**
 * Send a guide request submission to the webhook API
 */
export async function sendGuideRequestWebhook(guide: GuideSubmission): Promise<WebhookResult> {
  try {
    // Format guide request data for webhook API
    const webhookData = {
      first_name: guide.firstName,
      last_name: guide.lastName,
      email: guide.email,
      phone: guide.phone,
      guide_type: guide.guideType,
      interest_areas: guide.interestAreas,
      form_data: guide.formData,
      tags: guide.tags,
      created_at: guide.createdAt
    };

    const response = await axios.post(
      `${WEBHOOK_API_BASE_URL}/api/webhooks/guide-request`,
      webhookData
    );

    log(`Guide request webhook sent. Tracking ID: ${response.data.tracking_id}`, 'webhook');
    return response.data;
  } catch (error) {
    log(`Error sending guide request webhook: ${error}`, 'webhook');
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error sending guide request webhook'
    };
  }
}

/**
 * Setup a new webhook integration target
 */
export async function setupWebhook(webhookConfig: {
  name: string;
  url: string;
  service_type: string;
  auth_header?: string;
  events: string[];
}) {
  try {
    const response = await axios.post(
      `${WEBHOOK_API_BASE_URL}/api/webhooks/setup`,
      webhookConfig
    );
    
    log(`Webhook ${webhookConfig.name} configured successfully`, 'webhook');
    return response.data;
  } catch (error) {
    log(`Error setting up webhook: ${error}`, 'webhook');
    throw error;
  }
}

/**
 * List all configured webhooks
 */
export async function listWebhooks() {
  try {
    const response = await axios.get(`${WEBHOOK_API_BASE_URL}/api/webhooks`);
    return response.data.webhooks;
  } catch (error) {
    log(`Error listing webhooks: ${error}`, 'webhook');
    throw error;
  }
}

/**
 * List webhook delivery history
 */
export async function listWebhookDeliveries(params: {
  limit?: number;
  event_type?: string;
  webhook_id?: number;
  success?: boolean;
} = {}) {
  try {
    const response = await axios.get(
      `${WEBHOOK_API_BASE_URL}/api/webhooks/deliveries`,
      { params }
    );
    return response.data.deliveries;
  } catch (error) {
    log(`Error listing webhook deliveries: ${error}`, 'webhook');
    throw error;
  }
}

/**
 * Retry a failed webhook delivery
 */
export async function retryWebhook(deliveryId: number) {
  try {
    const response = await axios.post(
      `${WEBHOOK_API_BASE_URL}/api/webhooks/retry/${deliveryId}`
    );
    log(`Webhook delivery ${deliveryId} retry initiated`, 'webhook');
    return response.data;
  } catch (error) {
    log(`Error retrying webhook delivery: ${error}`, 'webhook');
    throw error;
  }
}