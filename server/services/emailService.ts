/**
 * Email Service for handling all types of email notifications
 * Uses SendGrid for email delivery
 */
import ActiveCampaign from 'activecampaign';

// Initialize ActiveCampaign client
let ac: any;
try {
  if (process.env.ACTIVECAMPAIGN_API_URL && process.env.ACTIVECAMPAIGN_API_KEY) {
    ac = new ActiveCampaign({
      url: process.env.ACTIVECAMPAIGN_API_URL,
      token: process.env.ACTIVECAMPAIGN_API_KEY,
    });
    console.log('ActiveCampaign client initialized successfully');
  } else {
    console.warn("ACTIVECAMPAIGN_API_URL or ACTIVECAMPAIGN_API_KEY environment variables are not set. Email notifications will not work.");
    ac = null;
  }
} catch (error) {
  console.error('Error initializing ActiveCampaign client:', error);
  ac = null;
}

// Default configuration
const DEFAULT_SENDER = {
  email: process.env.DEFAULT_SENDER_EMAIL || 'notifications@cabo.is',
  name: process.env.DEFAULT_SENDER_NAME || 'Cabo San Lucas Experiences'
};

const ADMIN_EMAIL = 'jeff@instacabo.com';

async function sendPlainTextNotification(type: string, data: any): Promise<boolean> {
  // Convert data object to formatted string
  const formattedData = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const text = `
New ${type} Notification
------------------------
${formattedData}
------------------------
Timestamp: ${new Date().toISOString()}
`;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New ${type} Notification`,
    html: `<pre>${text}</pre>`,
    text: text
  });
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail(params: {
  to: string;
  from?: { email: string; name: string };
  subject: string;
  text?: string;
  html: string;
  cc?: string[];
  bcc?: string[];
}): Promise<boolean> {
  try {
    if (!ac) {
      console.warn("Cannot send email: ActiveCampaign client not initialized");
      return false;
    }

    // Use ActiveCampaign's legacy API for reliable email sending
    const baseUrl = process.env.ACTIVECAMPAIGN_API_URL?.replace('https://', '').replace('.api-us1.com', '');
    const response = await ac.request({
      api: '/api/3/emails/send',
      method: 'POST',
      body: {
        email: {
          to: params.to,
          from: params.from?.email || DEFAULT_SENDER.email,
          fromName: params.from?.name || DEFAULT_SENDER.name,
          subject: params.subject,
          html: params.html,
          ...(params.cc && { cc: params.cc.join(',') }),
          ...(params.bcc && { bcc: [...(params.bcc || []), ADMIN_EMAIL].join(',') })
        }
      }
    });

    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Create a booking confirmation email for transportation bookings
 */
export function createTransportationConfirmationEmail(params: {
  name: string;
  confirmationNumber: string;
  booking: any;
}): string {
  const { name, confirmationNumber, booking } = params;
  
  // Format currency
  const formattedAmount = parseFloat(booking.amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transportation Booking Confirmation</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2F4F4F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .booking-details {
          margin: 20px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .booking-header {
          background-color: #f5f5f5;
          padding: 10px 15px;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .booking-body {
          padding: 15px;
        }
        .booking-row {
          display: flex;
          margin-bottom: 10px;
        }
        .booking-label {
          width: 40%;
          font-weight: bold;
          color: #666;
        }
        .booking-value {
          width: 60%;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .btn {
          display: inline-block;
          background-color: #2F4F4F;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
        .important-info {
          background-color: #f8f9fa;
          border-left: 4px solid #2F4F4F;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Transportation Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for booking your transportation with us. Your booking has been confirmed!</p>
          
          <div class="important-info">
            <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
          </div>
          
          <div class="booking-details">
            <div class="booking-header">Trip Details</div>
            <div class="booking-body">
              <div class="booking-row">
                <div class="booking-label">From:</div>
                <div class="booking-value">${booking.fromLocation}</div>
              </div>
              <div class="booking-row">
                <div class="booking-label">To:</div>
                <div class="booking-value">${booking.toLocation}</div>
              </div>
              <div class="booking-row">
                <div class="booking-label">Departure Date:</div>
                <div class="booking-value">${booking.departureDate}</div>
              </div>
              ${booking.returnDate && booking.returnDate !== "null" ? `
              <div class="booking-row">
                <div class="booking-label">Return Date:</div>
                <div class="booking-value">${booking.returnDate}</div>
              </div>
              ` : ''}
              <div class="booking-row">
                <div class="booking-label">Vehicle Type:</div>
                <div class="booking-value">${booking.vehicleType}</div>
              </div>
              <div class="booking-row">
                <div class="booking-label">Passengers:</div>
                <div class="booking-value">${booking.passengers}</div>
              </div>
              <div class="booking-row">
                <div class="booking-label">Total Amount:</div>
                <div class="booking-value">${formattedAmount}</div>
              </div>
            </div>
          </div>
          
          <div class="important-info">
            <h3>Important Information</h3>
            <ul>
              <li>Your driver will meet you at the designated location with a sign displaying your name.</li>
              <li>For airport pickups, please look for your driver in the arrivals area after you clear customs.</li>
              <li>Your driver will monitor your flight status and adjust for any delays.</li>
            </ul>
          </div>
          
          <p>If you need to modify or cancel your booking, please contact us at least 24 hours before your scheduled pickup time.</p>
          
          <p>We look forward to providing you with safe and comfortable transportation in Cabo San Lucas!</p>
          
          <p>Best regards,<br>Cabo Transportation Team</p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply to this message.</p>
          <p>For assistance, please contact support@cabotransportation.com</p>
          <p>&copy; ${new Date().getFullYear()} Cabo Transportation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Create a lead notification email for new transportation inquiry
 */
export function createLeadNotificationEmail(params: {
  lead: any;
}): string {
  const { lead } = params;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Transportation Lead</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2F4F4F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .lead-details {
          margin: 20px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .lead-header {
          background-color: #f5f5f5;
          padding: 10px 15px;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .lead-body {
          padding: 15px;
        }
        .lead-row {
          display: flex;
          margin-bottom: 10px;
        }
        .lead-label {
          width: 40%;
          font-weight: bold;
          color: #666;
        }
        .lead-value {
          width: 60%;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Transportation Lead</h1>
        </div>
        <div class="content">
          <p>A new transportation inquiry has been received:</p>
          
          <div class="lead-details">
            <div class="lead-header">Lead Details</div>
            <div class="lead-body">
              <div class="lead-row">
                <div class="lead-label">Name:</div>
                <div class="lead-value">${lead.firstName} ${lead.lastName || ''}</div>
              </div>
              <div class="lead-row">
                <div class="lead-label">Email:</div>
                <div class="lead-value">${lead.email}</div>
              </div>
              ${lead.phone ? `
              <div class="lead-row">
                <div class="lead-label">Phone:</div>
                <div class="lead-value">${lead.phone}</div>
              </div>
              ` : ''}
              <div class="lead-row">
                <div class="lead-label">Interest:</div>
                <div class="lead-value">Transportation</div>
              </div>
              <div class="lead-row">
                <div class="lead-label">From:</div>
                <div class="lead-value">${lead.details?.from || 'N/A'}</div>
              </div>
              <div class="lead-row">
                <div class="lead-label">To:</div>
                <div class="lead-value">${lead.details?.to || 'N/A'}</div>
              </div>
              <div class="lead-row">
                <div class="lead-label">Date:</div>
                <div class="lead-value">${lead.details?.date || 'N/A'}</div>
              </div>
              <div class="lead-row">
                <div class="lead-label">Passengers:</div>
                <div class="lead-value">${lead.details?.passengers || 'N/A'}</div>
              </div>
              <div class="lead-row">
                <div class="lead-label">Created At:</div>
                <div class="lead-value">${new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <p>Please follow up with this lead as soon as possible.</p>
        </div>
        <div class="footer">
          <p>This is an automated notification from the Cabo San Lucas website.</p>
          <p>&copy; ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Create a booking confirmation email (generic)
 */
export function createBookingConfirmationEmail(params: {
  name: string;
  email: string;
  bookingType: string;
  confirmationNumber: string;
  booking: any;
}): string {
  // For transportation bookings, use the dedicated template
  if (params.bookingType === 'transportation') {
    return createTransportationConfirmationEmail({
      name: params.name,
      confirmationNumber: params.confirmationNumber,
      booking: params.booking
    });
  }
  
  // For other booking types, use a generic template
  // TODO: Implement specific templates for other booking types
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2F4F4F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${params.name},</p>
          <p>Thank you for your booking. Your confirmation number is <strong>${params.confirmationNumber}</strong>.</p>
          
          <p>We have received your booking and will be in touch shortly with more details.</p>
          
          <p>Best regards,<br>Cabo Experiences Team</p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply to this message.</p>
          <p>For assistance, please contact support@cabo.is</p>
          <p>&copy; ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Create a test email for verifying the email service is working
 */
/**
 * Create a guide request email with download link
 */
export function createGuideRequestEmail(params: {
  name: string;
  email: string;
  downloadLink: string;
}): string {
  const { name, email, downloadLink } = params;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Guide Download Confirmation</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2F4F4F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .download-button {
          display: inline-block;
          background-color: #2F4F4F;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Cabo San Lucas Guide</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for your interest in Cabo San Lucas! Your exclusive travel guide is ready to download.</p>
          
          <p>Click the button below to access your guide:</p>
          
          <p style="text-align: center;">
            <a href="${downloadLink}" class="download-button">Download Your Guide</a>
          </p>
          
          <p>This guide includes:</p>
          <ul>
            <li>Insider tips for the best experiences in Cabo</li>
            <li>Top restaurant recommendations</li>
            <li>Hidden beaches and attractions</li>
            <li>Transportation and accommodation suggestions</li>
          </ul>
          
          <p>If you have any questions about planning your trip to Cabo San Lucas, please don't hesitate to reply to this email.</p>
          
          <p>We look forward to helping you create an unforgettable Cabo experience!</p>
          
          <p>Best regards,<br>The Cabo San Lucas Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}. If you didn't request this guide, please disregard this email.</p>
          <p>&copy; ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Create a guide notification email for admin
 */
export function createGuideNotificationEmail(params: {
  guide: any;
}): string {
  const { guide } = params;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Guide Download</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2F4F4F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .guide-details {
          margin: 20px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .guide-header {
          background-color: #f5f5f5;
          padding: 10px 15px;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .guide-body {
          padding: 15px;
        }
        .guide-row {
          display: flex;
          margin-bottom: 10px;
        }
        .guide-label {
          width: 40%;
          font-weight: bold;
          color: #666;
        }
        .guide-value {
          width: 60%;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Guide Download</h1>
        </div>
        <div class="content">
          <p>A new guide download request has been received:</p>
          
          <div class="guide-details">
            <div class="guide-header">Guide Request Details</div>
            <div class="guide-body">
              <div class="guide-row">
                <div class="guide-label">Name:</div>
                <div class="guide-value">${guide.firstName} ${guide.lastName || ''}</div>
              </div>
              <div class="guide-row">
                <div class="guide-label">Email:</div>
                <div class="guide-value">${guide.email}</div>
              </div>
              ${guide.phone ? `
              <div class="guide-row">
                <div class="guide-label">Phone:</div>
                <div class="guide-value">${guide.phone}</div>
              </div>
              ` : ''}
              <div class="guide-row">
                <div class="guide-label">Guide Type:</div>
                <div class="guide-value">${guide.guideType || 'General'}</div>
              </div>
              ${guide.interestAreas ? `
              <div class="guide-row">
                <div class="guide-label">Interest Areas:</div>
                <div class="guide-value">${
                  Array.isArray(guide.interestAreas) 
                    ? guide.interestAreas.join(', ') 
                    : guide.interestAreas
                }</div>
              </div>
              ` : ''}
              <div class="guide-row">
                <div class="guide-label">Source:</div>
                <div class="guide-value">${guide.source || 'Website'}</div>
              </div>
              <div class="guide-row">
                <div class="guide-label">Created At:</div>
                <div class="guide-value">${new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <p>Please follow up with this guide request as soon as possible.</p>
        </div>
        <div class="footer">
          <p>This is an automated notification from the Cabo San Lucas website.</p>
          <p>&copy; ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createTestEmail(params: {
  recipient: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Service Test</title>
      <style>
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2F4F4F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email System Test</h1>
        </div>
        <div class="content">
          <p>This is a test email from the Cabo San Lucas website.</p>
          <p>If you're receiving this email, it means the email notification system is working correctly.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Recipient: ${params.recipient}</li>
            <li>Timestamp: ${new Date().toLocaleString()}</li>
            <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
          </ul>
          <p>This email service is configured to send:</p>
          <ul>
            <li>Booking confirmations</li>
            <li>Lead notifications</li>
            <li>Guide download notifications</li>
          </ul>
        </div>
        <div class="footer">
          <p>This is an automated test email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}