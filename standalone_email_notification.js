// Standalone Email Notification Script
// This script can send emails directly without requiring the server to be running
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Set up proper path for dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: './.env' });

// Log the available environment variables (masking sensitive data)
console.log("Environment variables loaded:");
console.log("ACTIVECAMPAIGN_API_URL available:", process.env.ACTIVECAMPAIGN_API_URL ? "Yes" : "No");
console.log("ACTIVECAMPAIGN_API_KEY available:", process.env.ACTIVECAMPAIGN_API_KEY ? "Yes" : "No");

async function sendEmailToJeff(subject, message) {
  // Check API credentials
  if (!process.env.ACTIVECAMPAIGN_API_URL || !process.env.ACTIVECAMPAIGN_API_KEY) {
    console.error("Missing ActiveCampaign API credentials. Please check your environment variables.");
    return false;
  }
  
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
    
    // Prepare the HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <div style="background-color: #2F4F4F; padding: 15px; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Cabo San Lucas Admin Notification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h2>${subject}</h2>
          ${message}
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
          <p>This is an automated test email from your Cabo San Lucas website.</p>
        </div>
      </div>
    `;
    
    // Prepare message data
    const messageData = {
      type: 'html',
      message_to: 'jeff@instacabo.com',
      message_from: 'Cabo San Lucas Website <no-reply@cabo.is>',
      message_subject: subject,
      message_html: html
    };
    
    // Combine URL and data
    Object.entries(messageData).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    console.log(`Sending email to jeff@instacabo.com with subject: ${subject}`);
    console.log(`Using API URL: ${apiUrl}`);
    
    // Make the request
    const response = await fetch(`${apiUrl}?${params.toString()}`, { method: 'POST' });
    
    // Parse and log the response
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }
    
    if (response.ok) {
      console.log("Email sent successfully!");
      console.log("Response:", typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData);
      return true;
    } else {
      console.error("Failed to send email. Status:", response.status);
      console.error("Response:", typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData);
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

async function sendTestEmail() {
  const subject = 'Test Email from Cabo San Lucas Website';
  const message = `
    <p>This is a test email sent directly from the script to verify that the notification system is working correctly.</p>
    
    <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
      <h3>Email Details:</h3>
      <p><strong>Recipient:</strong> jeff@instacabo.com</p>
      <p><strong>Sender:</strong> Cabo San Lucas Website</p>
      <p><strong>Purpose:</strong> Test notification system</p>
    </div>
  `;
  
  return await sendEmailToJeff(subject, message);
}

async function sendGuideRequestEmail() {
  const guideData = {
    firstName: "Test",
    lastName: "User",
    email: "jeff@instacabo.com",
    phone: "+1234567890",
    guideType: "resort",
    interestAreas: ["luxury", "family"],
  };
  
  const subject = 'New Guide Download';
  const message = `
    <h2>New Guide Download Request</h2>
    <p><strong>Name:</strong> ${guideData.firstName} ${guideData.lastName || ''}</p>
    <p><strong>Email:</strong> ${guideData.email}</p>
    <p><strong>Phone:</strong> ${guideData.phone || 'Not provided'}</p>
    <p><strong>Guide Type:</strong> ${guideData.guideType}</p>
    <p><strong>Interest Areas:</strong> ${
      Array.isArray(guideData.interestAreas) 
        ? guideData.interestAreas.join(', ') 
        : (guideData.interestAreas || 'Not specified')
    }</p>
  `;
  
  return await sendEmailToJeff(subject, message);
}

// Main function
async function main() {
  console.log("=== Standalone Email Notification System ===");
  console.log("1. Sending test email...");
  const testResult = await sendTestEmail();
  
  if (testResult) {
    console.log("\n2. Sending guide request notification...");
    await sendGuideRequestEmail();
  }
  
  console.log("\n=== Email operations completed ===");
}

// Execute the main function
main();