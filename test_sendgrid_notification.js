/**
 * Test script for SendGrid email notifications
 * 
 * This script allows you to test SendGrid email notifications
 * without going through the web interface.
 */
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY environment variable is not set. Email notifications will not work.");
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jeff@instacabo.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'notifications@cabo.is';
const SENDER_NAME = process.env.SENDER_NAME || 'Cabo San Lucas Website';

async function sendTestEmail() {
  try {
    const msg = {
      to: ADMIN_EMAIL,
      from: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      subject: "SendGrid Test Email - Transportation Notification System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <div style="background-color: #2F4F4F; padding: 15px; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Cabo San Lucas Transportation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <h2>Email System Test</h2>
            <p>This is a test email to verify that the SendGrid notification system is working correctly.</p>
            <p>If you received this email, it means the email notification system is configured properly and is ready to send real notifications for:</p>
            <ul>
              <li>Lead notifications</li>
              <li>Booking confirmations</li>
              <li>Guide download notifications</li>
            </ul>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
            <p>This is an automated test email from your Cabo San Lucas website.</p>
          </div>
        </div>
      `
    };
    
    console.log("Sending test email to:", ADMIN_EMAIL);
    await sgMail.send(msg);
    console.log("Test email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending test email:", error);
    if (error.response) {
      console.error("SendGrid API response error:", error.response.body);
    }
    return false;
  }
}

// Execute the test
sendTestEmail()
  .then(result => {
    if (result) {
      console.log("SendGrid notification system is working correctly!");
    } else {
      console.error("SendGrid notification test failed!");
    }
    process.exit(result ? 0 : 1);
  });