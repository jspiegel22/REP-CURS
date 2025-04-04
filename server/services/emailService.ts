// Email service implementation using SendGrid
// For production, configure SENDGRID_API_KEY in environment variables

import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

// Simplified email interface for our application
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    // Only include one of these properties for each attachment
    path?: string;
    content?: string; 
    contentType?: string;
  }>;
}

// Constants
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const DEFAULT_FROM_EMAIL = 'noreply@cabo.is';
const DEFAULT_GUIDE_DOWNLOAD_URL = 'https://storage.googleapis.com/cabo-travel-guides/Ultimate-Cabo-Guide-2025.pdf';
const LOCAL_GUIDES_PATH = path.join(__dirname, '..', '..', 'public', 'guides');

// Initialize SendGrid if API key is available
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('SendGrid initialized successfully');
} else {
  console.log('SendGrid API key not found, email delivery will be simulated');
}

/**
 * Send an email using SendGrid or simulate sending in development
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Create a message object that matches SendGrid's expectations
    const msg: MailDataRequired = {
      to: options.to,
      from: options.from || DEFAULT_FROM_EMAIL,
      subject: options.subject,
      html: options.html,
    };
    
    if (!SENDGRID_API_KEY) {
      // Fallback to console logging in development
      console.log('Email would be sent:', {
        ...msg,
        attachments: options.attachments ? `${options.attachments.length} attachments` : 'none'
      });
      return true;
    }

    // Add attachments if present
    if (options.attachments && options.attachments.length > 0) {
      const sgAttachments = options.attachments.map(attachment => {
        const result: any = { filename: attachment.filename };
        if (attachment.path) result.path = attachment.path;
        if (attachment.content) result.content = attachment.content;
        if (attachment.contentType) result.type = attachment.contentType;
        return result;
      });
      
      // Type assertion to make TypeScript happy
      msg.attachments = sgAttachments as any;
    }
    
    // Send the email
    await sgMail.send(msg);
    console.log('Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Get a download URL for the guide
 * Uses the local path in development or Google Cloud Storage in production
 */
export async function getGuideDownloadUrl(guideType: string): Promise<string> {
  // Default fallback URL
  let downloadUrl = DEFAULT_GUIDE_DOWNLOAD_URL;
  
  try {
    const guideFileName = guideType
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') + '.pdf';
    
    // Check if we have a local file to use
    const localPath = path.join(LOCAL_GUIDES_PATH, guideFileName);
    if (fs.existsSync(localPath)) {
      // Use a local path for development
      downloadUrl = `/guides/${guideFileName}`;
      console.log(`Using local guide file: ${downloadUrl}`);
    } else {
      console.log(`Local guide file not found: ${localPath}, using default URL`);
    }
    
    return downloadUrl;
  } catch (error) {
    console.error('Error generating guide download URL:', error);
    return downloadUrl;
  }
}

/**
 * Creates an email with guide download information
 */
export async function createGuideDownloadEmail(firstName: string, email: string, guideType: string): Promise<EmailOptions> {
  // Get the appropriate download URL
  const downloadUrl = await getGuideDownloadUrl(guideType);
  
  return {
    to: email,
    subject: `Your ${guideType} is here!`,
    from: 'Cabo San Lucas Travel <guides@cabo.is>',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2F4F4F;">Your Cabo Guide is Ready!</h1>
        <p>Hello ${firstName},</p>
        <p>Thank you for requesting our ${guideType}. We're excited to help you plan your perfect Cabo San Lucas vacation!</p>
        <p>You can download your guide by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #2F4F4F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Download Your Guide
          </a>
        </div>
        <p>If you have any questions or need personalized recommendations, feel free to reply to this email.</p>
        <p>We've also included information about:</p>
        <ul>
          <li>Best beaches in Cabo San Lucas</li>
          <li>Top-rated restaurants and nightlife</li>
          <li>Family-friendly activities</li>
          <li>Exclusive villa rentals and resort recommendations</li>
        </ul>
        <p>Enjoy planning your Cabo adventure!</p>
        <p>Warm regards,<br>The @cabo Team</p>
      </div>
    `
  };
}

export function createBookingConfirmationEmail(booking: any): EmailOptions {
  return {
    to: booking.email,
    subject: 'Your Cabo Booking Confirmation',
    from: '@cabo <bookings@cabo.is>',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2F4F4F;">Your Booking is Confirmed!</h1>
        <p>Hello ${booking.firstName},</p>
        <p>Thank you for booking with @cabo. Your ${booking.bookingType} booking has been received.</p>
        <p>Here are your booking details:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Booking Type:</strong> ${booking.bookingType}</p>
          <p><strong>Check-in:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          ${booking.totalAmount ? `<p><strong>Total:</strong> $${booking.totalAmount}</p>` : ''}
        </div>
        <p>A confirmation number will be sent separately once your booking is fully processed.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>We look forward to welcoming you to Cabo San Lucas!</p>
        <p>Warm regards,<br>The @cabo Team</p>
      </div>
    `
  };
}