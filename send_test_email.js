// Test script to send an email notification to jeff@instacabo.com
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';

// Set up proper path for dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: './.env' });

// Log the available environment variables (masking sensitive data)
console.log("Environment variables loaded:");
console.log("ACTIVECAMPAIGN_API_URL available:", process.env.ACTIVECAMPAIGN_API_URL ? "Yes" : "No");
console.log("ACTIVECAMPAIGN_API_KEY available:", process.env.ACTIVECAMPAIGN_API_KEY ? "Yes" : "No");

async function sendTestEmail() {
  try {
    console.log("Preparing to send email via ActiveCampaign API...");
    
    // Check if API credentials are available
    if (!process.env.ACTIVECAMPAIGN_API_URL || !process.env.ACTIVECAMPAIGN_API_KEY) {
      console.error("Missing ActiveCampaign API credentials. Please check your environment variables.");
      return;
    }
    
    // Prepare the API URL and headers
    const apiUrl = `${process.env.ACTIVECAMPAIGN_API_URL}/api/3/emails`;
    const headers = {
      'Content-Type': 'application/json',
      'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY
    };
    
    // Prepare the email content
    const subject = 'Test Email from Cabo San Lucas Website';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <div style="background-color: #2F4F4F; padding: 15px; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Cabo San Lucas Admin Notification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h2>Test Email</h2>
          <p>This is a test email sent directly from the script to verify that the notification system is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Email Details:</h3>
            <p><strong>Recipient:</strong> jeff@instacabo.com</p>
            <p><strong>Sender:</strong> Cabo San Lucas Website</p>
            <p><strong>Purpose:</strong> Test notification system</p>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
          <p>This is an automated test email from your Cabo San Lucas website.</p>
        </div>
      </div>
    `;
    
    console.log(`Sending test email to jeff@instacabo.com using API URL: ${apiUrl}...`);
    
    // Prepare the request body
    const body = {
      email: {
        type: "text/html",
        to: 'jeff@instacabo.com',
        subject: subject,
        html: html,
        fromEmail: "no-reply@cabo.is",
        fromName: "Cabo San Lucas Website"
      }
    };
    
    // Make the request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    
    // Parse and log the response
    const responseData = await response.json();
    
    if (response.ok) {
      console.log("Email sent successfully!");
      console.log("Response:", JSON.stringify(responseData, null, 2));
    } else {
      console.error("Failed to send email. Status:", response.status);
      console.error("Response:", JSON.stringify(responseData, null, 2));
    }
    
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

// Execute the function
sendTestEmail();