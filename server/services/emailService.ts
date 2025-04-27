/**
 * Comprehensive Email Service
 * 
 * This service provides a unified interface for sending emails
 * with multiple fallback methods for reliability.
 */

import nodemailer from 'nodemailer';
import * as activeCampaign from './activeCampaign';

// Email Configuration Types
export interface EmailOptions {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  method?: string;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

/**
 * Main function to send an email using the most reliable available method
 * 
 * This attempts multiple methods in sequence:
 * 1. SMTP (if configured)
 * 2. ActiveCampaign API
 * 3. Ethereal (test/development only)
 * 
 * @param options Email options including recipient, subject, and content
 * @returns Promise resolving to the email send result
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Default sender if not provided
  const emailOptions = {
    ...options,
    from: options.from || 'Cabo San Lucas <no-reply@cabo.is>'
  };

  // Try sending via SMTP
  const smtpResult = await sendViaSmtp(emailOptions);
  if (smtpResult.success) {
    return { ...smtpResult, method: 'smtp' };
  }

  // Try sending via ActiveCampaign API
  const acResult = await sendViaActiveCampaign(emailOptions);
  if (acResult.success) {
    return { ...acResult, method: 'activecampaign' };
  }

  // Finally, try Ethereal for testing/development
  const etherealResult = await sendViaEthereal(emailOptions);
  if (etherealResult.success) {
    return { ...etherealResult, method: 'ethereal' };
  }

  // All methods failed
  return {
    success: false,
    error: 'All email delivery methods failed'
  };
}

/**
 * Attempts to send email via configured SMTP server
 */
async function sendViaSmtp(options: EmailOptions): Promise<EmailResult> {
  // Check if SMTP configuration is available
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { success: false, error: 'SMTP configuration not available' };
  }

  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send mail
    const info = await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('SMTP email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown SMTP error'
    };
  }
}

/**
 * Attempts to send email via ActiveCampaign API
 */
async function sendViaActiveCampaign(options: EmailOptions): Promise<EmailResult> {
  try {
    const success = await activeCampaign.sendAdminNotification(
      options.subject,
      options.html
    );

    return {
      success: !!success,
      error: success ? undefined : 'ActiveCampaign email failed'
    };
  } catch (error) {
    console.error('ActiveCampaign email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown ActiveCampaign error'
    };
  }
}

/**
 * Attempts to send email via Ethereal (for testing/development)
 */
async function sendViaEthereal(options: EmailOptions): Promise<EmailResult> {
  try {
    // Only use in development
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: 'Ethereal not available in production' };
    }

    // Create test account
    const testAccount = await nodemailer.createTestAccount();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Send mail
    const info = await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html
    });

    console.log('Test email sent. Preview URL:', nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Ethereal email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Ethereal error'
    };
  }
}

// Email Content Templates

/**
 * Creates a formatted email for booking confirmations
 */
export function createBookingConfirmationEmail(booking: any): EmailOptions {
  const formattedStartDate = new Date(booking.startDate).toLocaleDateString();
  const formattedEndDate = new Date(booking.endDate).toLocaleDateString();
  
  return {
    to: booking.email,
    subject: 'Your Cabo San Lucas Booking Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2F4F4F; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Booking Confirmation</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear ${booking.firstName} ${booking.lastName || ''},</p>
          
          <p>Thank you for your booking with Cabo San Lucas! We're excited to help make your trip amazing.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #2F4F4F;">Booking Details:</h3>
            <p><strong>Booking Type:</strong> ${booking.bookingType}</p>
            <p><strong>Check-in:</strong> ${formattedStartDate}</p>
            <p><strong>Check-out:</strong> ${formattedEndDate}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            ${booking.totalAmount ? `<p><strong>Total Amount:</strong> $${booking.totalAmount}</p>` : ''}
            ${booking.specialRequests ? `<p><strong>Your Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          </div>
          
          <p>Our team will be in touch with you shortly to confirm all the details and answer any questions you may have.</p>
          
          <p>We look forward to welcoming you to Cabo San Lucas!</p>
          
          <p>Warm regards,<br>The Cabo San Lucas Team</p>
        </div>
        
        <div style="padding: 15px; background-color: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
          <p>This is a confirmation of your booking. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    `
  };
}

/**
 * Creates a formatted email for lead confirmations
 */
export function createLeadConfirmationEmail(lead: any): EmailOptions {
  return {
    to: lead.email,
    subject: 'Thank You for Your Interest in Cabo San Lucas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2F4F4F; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Thank You</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear ${lead.firstName} ${lead.lastName || ''},</p>
          
          <p>Thank you for your interest in Cabo San Lucas! We've received your inquiry and are excited to help you plan your perfect getaway.</p>
          
          <p>Our team will review your request and be in touch with you shortly to discuss how we can best assist you.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #2F4F4F;">Your Information:</h3>
            <p><strong>Interest:</strong> ${lead.interestType || 'Cabo San Lucas Experience'}</p>
            ${lead.budget ? `<p><strong>Budget Range:</strong> ${lead.budget}</p>` : ''}
            ${lead.timeline ? `<p><strong>Travel Timeline:</strong> ${lead.timeline}</p>` : ''}
          </div>
          
          <p>In the meantime, feel free to explore our website for more inspiration for your Cabo adventure.</p>
          
          <p>Warm regards,<br>The Cabo San Lucas Team</p>
        </div>
        
        <div style="padding: 15px; background-color: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
          <p>This email confirms we've received your inquiry. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    `
  };
}

/**
 * Creates a formatted email for guide download confirmations
 */
export function createGuideConfirmationEmail(guide: any): EmailOptions {
  return {
    to: guide.email,
    subject: 'Your Cabo San Lucas Guide is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2F4F4F; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Your Cabo Guide</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear ${guide.firstName} ${guide.lastName || ''},</p>
          
          <p>Thank you for requesting our ${guide.guideType || 'Cabo San Lucas'} guide! We're excited to help you plan your perfect Cabo experience.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
            <h3 style="margin-top: 0; color: #2F4F4F;">Your Guide is Ready!</h3>
            <p>Click the button below to access your guide:</p>
            <a href="https://cabo.is/guides/${guide.guideType || 'general'}" 
               style="display: inline-block; background-color: #2F4F4F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; margin: 15px 0;">
              Download Your Guide
            </a>
          </div>
          
          <p>Our team is also available to answer any specific questions you might have about planning your trip.</p>
          
          <p>Warm regards,<br>The Cabo San Lucas Team</p>
        </div>
        
        <div style="padding: 15px; background-color: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
          <p>This email confirms your guide download. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    `
  };
}

/**
 * Creates a formatted email for admin notifications
 */
export function createAdminNotificationEmail(subject: string, content: string): EmailOptions {
  return {
    to: process.env.ADMIN_EMAIL || 'jeff@instacabo.com',
    subject: `[Cabo Admin] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="background-color: #2F4F4F; padding: 15px; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Cabo San Lucas Admin Notification</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          ${content}
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
          <p>This is an automated notification from your Cabo San Lucas website.</p>
          <p>© ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
        </div>
      </div>
    `
  };
}