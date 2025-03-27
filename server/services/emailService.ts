// This file simulates an email service
// In a production environment, you would use a real email service like SendGrid, Mailgun, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // In a real implementation, this would connect to an email API
  console.log('Sending email to:', options.to);
  console.log('Subject:', options.subject);
  console.log('From:', options.from || 'noreply@cabosanlucastravel.com');
  
  // Log email sending (simulated)
  console.log('Email sent successfully');
  
  // Return true for successful email sending (simulated)
  return true;
}

export function createGuideDownloadEmail(firstName: string, email: string, guideType: string): EmailOptions {
  return {
    to: email,
    subject: `Your ${guideType} is here!`,
    from: 'Cabo San Lucas Travel <guides@cabosanlucastravel.com>',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2F4F4F;">Your Cabo Guide is Ready!</h1>
        <p>Hello ${firstName},</p>
        <p>Thank you for requesting our ${guideType}. We're excited to help you plan your perfect Cabo San Lucas vacation!</p>
        <p>You can download your guide by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing" 
             style="background-color: #2F4F4F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Download Your Guide
          </a>
        </div>
        <p>If you have any questions or need personalized recommendations, feel free to reply to this email.</p>
        <p>Enjoy planning your Cabo adventure!</p>
        <p>Warm regards,<br>The Cabo San Lucas Travel Team</p>
      </div>
    `
  };
}

export function createBookingConfirmationEmail(booking: any): EmailOptions {
  return {
    to: booking.email,
    subject: 'Your Cabo Booking Confirmation',
    from: 'Cabo San Lucas Travel <bookings@cabosanlucastravel.com>',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2F4F4F;">Your Booking is Confirmed!</h1>
        <p>Hello ${booking.firstName},</p>
        <p>Thank you for booking with Cabo San Lucas Travel. Your ${booking.bookingType} booking has been received.</p>
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
        <p>Warm regards,<br>The Cabo San Lucas Travel Team</p>
      </div>
    `
  };
}