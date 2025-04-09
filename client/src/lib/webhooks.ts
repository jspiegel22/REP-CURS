/**
 * Webhook integration client for the Cabo website
 * This client allows for sending data to external services like Airtable, Zapier, etc.
 */

// Define webhook API URL
const WEBHOOK_API_URL = import.meta.env.VITE_WEBHOOK_API_URL || 'http://localhost:8000/api';

// Lead data interface
export interface LeadData {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  interest_type: string;
  source?: string;
  budget?: string;
  timeline?: string;
  form_data?: Record<string, any>;
  tags?: string[];
}

// Booking data interface
export interface BookingData {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  booking_type: string;
  start_date: string | Date;
  end_date: string | Date;
  guests: number;
  total_amount?: number;
  special_requests?: string;
  form_data?: Record<string, any>;
  tags?: string[];
}

// Guide request data interface
export interface GuideRequestData {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  guide_type: string;
  interest_areas?: string[];
  form_data?: Record<string, any>;
  tags?: string[];
}

/**
 * Send lead data to webhook service
 */
export async function sendLeadWebhook(leadData: LeadData): Promise<{ status: string; tracking_id: string }> {
  try {
    const response = await fetch(`${WEBHOOK_API_URL}/leads/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lead webhook error:', errorText);
      throw new Error(`Lead webhook failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending lead webhook:', error);
    // Save for offline processing
    saveToOfflineQueue('lead', leadData);
    throw error;
  }
}

/**
 * Send booking data to webhook service
 */
export async function sendBookingWebhook(bookingData: BookingData): Promise<{ status: string; tracking_id: string }> {
  try {
    const response = await fetch(`${WEBHOOK_API_URL}/bookings/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Booking webhook error:', errorText);
      throw new Error(`Booking webhook failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending booking webhook:', error);
    // Save for offline processing
    saveToOfflineQueue('booking', bookingData);
    throw error;
  }
}

/**
 * Send guide request data to webhook service
 */
export async function sendGuideRequestWebhook(guideData: GuideRequestData): Promise<{ status: string; tracking_id: string }> {
  try {
    const response = await fetch(`${WEBHOOK_API_URL}/guides/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guideData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Guide request webhook error:', errorText);
      throw new Error(`Guide request webhook failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending guide request webhook:', error);
    // Save for offline processing
    saveToOfflineQueue('guide', guideData);
    throw error;
  }
}

// Interface for queued webhook data
interface QueuedWebhook {
  type: 'lead' | 'booking' | 'guide';
  data: LeadData | BookingData | GuideRequestData;
  timestamp: number;
}

/**
 * Save webhook data to local storage for offline processing
 */
function saveToOfflineQueue(type: 'lead' | 'booking' | 'guide', data: any): void {
  try {
    // Get existing queue from localStorage
    const queueStr = localStorage.getItem('webhook_queue');
    const queue: QueuedWebhook[] = queueStr ? JSON.parse(queueStr) : [];
    
    // Add new item
    queue.push({
      type,
      data,
      timestamp: Date.now(),
    });
    
    // Save back to localStorage
    localStorage.setItem('webhook_queue', JSON.stringify(queue));
    console.log(`Saved ${type} to offline queue for later processing`);
  } catch (error) {
    console.error('Error saving to offline queue:', error);
  }
}

/**
 * Process all queued webhook data when back online
 */
export async function processOfflineQueue(): Promise<void> {
  try {
    const queueStr = localStorage.getItem('webhook_queue');
    if (!queueStr) return;
    
    const queue: QueuedWebhook[] = JSON.parse(queueStr);
    if (!queue.length) return;
    
    console.log(`Processing ${queue.length} queued webhook events`);
    
    const remainingQueue: QueuedWebhook[] = [];
    
    for (const item of queue) {
      try {
        switch (item.type) {
          case 'lead':
            await sendLeadWebhook(item.data as LeadData);
            break;
          case 'booking':
            await sendBookingWebhook(item.data as BookingData);
            break;
          case 'guide':
            await sendGuideRequestWebhook(item.data as GuideRequestData);
            break;
        }
        console.log(`Successfully processed queued ${item.type} webhook`);
      } catch (error) {
        console.error(`Failed to process queued ${item.type} webhook:`, error);
        // Keep failed items in the queue for retry later
        remainingQueue.push(item);
      }
    }
    
    // Update queue with remaining items
    if (remainingQueue.length) {
      localStorage.setItem('webhook_queue', JSON.stringify(remainingQueue));
      console.log(`${remainingQueue.length} items remaining in queue`);
    } else {
      localStorage.removeItem('webhook_queue');
      console.log('Queue processed successfully, queue cleared');
    }
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
}

// Add event listener for online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('App is online, processing webhook queue');
    processOfflineQueue();
  });
}

// Setup dashboard util functions
export async function setupWebhook(webhookData: {
  name: string;
  url: string; 
  service_type: string;
  auth_header?: string;
  events: string[];
  is_active?: boolean;
}): Promise<any> {
  try {
    const response = await fetch(`${WEBHOOK_API_URL}/webhooks/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to setup webhook: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting up webhook:', error);
    throw error;
  }
}

export async function listWebhooks(): Promise<any[]> {
  try {
    const response = await fetch(`${WEBHOOK_API_URL}/webhooks`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list webhooks: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error listing webhooks:', error);
    throw error;
  }
}

export async function retryWebhook(deliveryId: number): Promise<any> {
  try {
    const response = await fetch(`${WEBHOOK_API_URL}/admin/webhook-retry/${deliveryId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to retry webhook: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error retrying webhook:', error);
    throw error;
  }
}