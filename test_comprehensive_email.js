/**
 * Comprehensive Email Test
 * 
 * This script tests our multi-method email service with all available delivery methods:
 * 1. SMTP (if configured)
 * 2. ActiveCampaign API
 * 3. Ethereal (for development/testing)
 */

import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log environment variables for debugging
console.log('\n=== Environment Check ===');
console.log('ACTIVECAMPAIGN_API_URL:', process.env.ACTIVECAMPAIGN_API_URL ? 'Available' : 'Not Available');
console.log('ACTIVECAMPAIGN_API_KEY:', process.env.ACTIVECAMPAIGN_API_KEY ? 'Available' : 'Not Available');
console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'Available' : 'Not Available');
console.log('SMTP_USER:', process.env.SMTP_USER ? 'Available' : 'Not Available');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Available' : 'Not Available');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'jeff@instacabo.com');

async function sendComprehensiveEmail() {
  console.log('\n=== Starting Comprehensive Email Test ===\n');
  
  // Define email content
  const recipient = process.env.ADMIN_EMAIL || 'jeff@instacabo.com';
  const subject = 'Comprehensive Email Test';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2F4F4F; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0;">Email System Test</h1>
      </div>
      
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2>Multi-Method Email Delivery Test</h2>
        
        <p>This email was sent as part of a comprehensive test of the Cabo San Lucas website's email delivery system.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #2F4F4F;">System Configuration:</h3>
          <p><strong>SMTP:</strong> ${process.env.SMTP_HOST ? 'Configured' : 'Not Configured'}</p>
          <p><strong>ActiveCampaign:</strong> ${process.env.ACTIVECAMPAIGN_API_URL ? 'Configured' : 'Not Configured'}</p>
          <p><strong>Fallback:</strong> Ethereal Test Email</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>The system has been configured to attempt multiple delivery methods in sequence:</p>
        <ol>
          <li>Direct SMTP delivery (if configured)</li>
          <li>ActiveCampaign API delivery (if configured)</li>
          <li>Ethereal test account (for development/testing)</li>
        </ol>
        
        <p>If you're seeing this email, at least one of these methods is working correctly.</p>
      </div>
      
      <div style="padding: 15px; background-color: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
        <p>This is a test email sent from the Cabo San Lucas Website.</p>
        <p>© ${new Date().getFullYear()} Cabo San Lucas. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Method 1: Try SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('Attempting to send via configured SMTP...');
    
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      
      const info = await transporter.sendMail({
        from: 'Cabo San Lucas Website <no-reply@cabo.is>',
        to: recipient,
        subject: subject,
        html: htmlContent
      });
      
      console.log('✅ SMTP Email sent successfully!');
      console.log('Message ID:', info.messageId);
      return { success: true, method: 'smtp', result: info };
    } catch (error) {
      console.error('❌ SMTP Error:', error.message);
    }
  } else {
    console.log('SMTP not configured, skipping...');
  }
  
  // Method 2: Try ActiveCampaign if configured
  if (process.env.ACTIVECAMPAIGN_API_URL && process.env.ACTIVECAMPAIGN_API_KEY) {
    console.log('Attempting to send via ActiveCampaign API...');
    
    try {
      // This uses ActiveCampaign's legacy API which is more reliable for sending quick emails
      const baseUrl = process.env.ACTIVECAMPAIGN_API_URL.replace('https://', '').replace('.api-us1.com', '');
      const apiUrl = `https://${baseUrl}.api-us1.com/admin/api.php`;
      
      // Prepare the URL parameters
      const params = new URLSearchParams({
        api_key: process.env.ACTIVECAMPAIGN_API_KEY,
        api_action: 'message_send',
        api_output: 'json'
      });
      
      // Prepare message data
      const messageData = {
        type: 'html',
        message_to: recipient,
        message_from: 'Cabo San Lucas Website <no-reply@cabo.is>',
        message_subject: subject,
        message_html: htmlContent
      };
      
      // Combine URL and data
      Object.entries(messageData).forEach(([key, value]) => {
        params.append(key, value);
      });
      
      // Make the request
      const response = await fetch(`${apiUrl}?${params.toString()}`, { method: 'POST' });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ ActiveCampaign Email sent successfully!');
        return { success: true, method: 'activecampaign', result };
      } else {
        console.error('❌ ActiveCampaign Error:', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ ActiveCampaign Error:', error.message);
    }
  } else {
    console.log('ActiveCampaign not configured, skipping...');
  }
  
  // Method 3: Fallback to Ethereal for testing
  console.log('Attempting to send via Ethereal test account...');
  
  try {
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
      from: 'Cabo San Lucas Website <no-reply@cabo.is>',
      to: recipient,
      subject: subject,
      html: htmlContent
    });
    
    console.log('✅ Ethereal Test Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL:', previewUrl);
    
    console.log('\nIMPORTANT: Since this is using Ethereal for testing, the email preview is available at the URL above.');
    console.log('In a production environment with properly configured SMTP, this would be delivered directly to', recipient);
    
    return { success: true, method: 'ethereal', result: info, previewUrl };
  } catch (error) {
    console.error('❌ Ethereal Error:', error.message);
    
    console.log('\n❌ All email methods failed. Check configuration and try again.');
    return { success: false, error: 'All methods failed' };
  }
}

// Execute the comprehensive email test
sendComprehensiveEmail();