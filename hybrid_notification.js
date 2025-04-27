// Hybrid Email Notification System
// This script attempts to use multiple methods to ensure email delivery
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the available environment variables (masking sensitive data)
console.log("Environment variables loaded:");
console.log("ACTIVECAMPAIGN_API_URL available:", process.env.ACTIVECAMPAIGN_API_URL ? "Yes" : "No");
console.log("ACTIVECAMPAIGN_API_KEY available:", process.env.ACTIVECAMPAIGN_API_KEY ? "Yes" : "No");

// Method 1: Try to send via the server API
async function sendViaServerAPI(data) {
  try {
    console.log("Attempting to send via server API...");
    
    const response = await fetch('http://localhost:3000/api/guide-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("Server API method successful!");
      console.log("Response:", JSON.stringify(result, null, 2));
      return true;
    } else {
      console.log(`Server API method failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("Server API method error:", error.message);
    return false;
  }
}

// Method 2: Try to send via ActiveCampaign API
async function sendViaActiveCampaign(subject, htmlContent) {
  try {
    if (!process.env.ACTIVECAMPAIGN_API_URL || !process.env.ACTIVECAMPAIGN_API_KEY) {
      console.log("ActiveCampaign credentials not available");
      return false;
    }
    
    console.log("Attempting to send via ActiveCampaign API...");
    
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
      message_to: 'jeff@instacabo.com',
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
      console.log("ActiveCampaign method successful!");
      return true;
    } else {
      console.log(`ActiveCampaign method failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("ActiveCampaign method error:", error.message);
    return false;
  }
}

// Method 3: Try to send via Ethereal for testing
async function sendViaEthereal(subject, htmlContent) {
  try {
    console.log("Attempting to send via Ethereal test account...");
    
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Mail options
    const mailOptions = {
      from: '"Cabo San Lucas Website" <no-reply@cabo.is>',
      to: 'jeff@instacabo.com',
      subject: subject,
      html: htmlContent
    };
    
    // Send mail
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Ethereal method successful!");
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    return {
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.log("Ethereal method error:", error.message);
    return { success: false };
  }
}

// Main function to try all methods
async function sendGuideNotification() {
  console.log("\n=== Sending Guide Download Notification ===\n");
  
  // Prepare guide request data
  const guideData = {
    firstName: "Test",
    lastName: "User",
    email: "jeff@instacabo.com",
    phone: "+1234567890",
    guideType: "resort",
    interestAreas: ["luxury", "family"],
    source: "API Test",
    formData: {
      preferredLanguage: "English",
      numberOfPeople: "2-4",
      preferredContactMethod: "Email"
    },
    created_at: new Date().toISOString()
  };
  
  // Prepare email content
  const subject = 'New Guide Download';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <div style="background-color: #2F4F4F; padding: 15px; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Cabo San Lucas Admin Notification</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
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
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
        <p>This is an automated notification from your Cabo San Lucas website.</p>
      </div>
    </div>
  `;
  
  // Try all methods in sequence until one succeeds
  
  // Method 1: Server API
  const serverResult = await sendViaServerAPI(guideData);
  if (serverResult) {
    console.log("\n✅ Notification sent successfully via Server API!");
    return;
  }
  
  // Method 2: ActiveCampaign
  const acResult = await sendViaActiveCampaign(subject, htmlContent);
  if (acResult) {
    console.log("\n✅ Notification sent successfully via ActiveCampaign API!");
    return;
  }
  
  // Method 3: Ethereal (for testing)
  const etherealResult = await sendViaEthereal(subject, htmlContent);
  if (etherealResult.success) {
    console.log("\n✅ Test notification sent successfully via Ethereal!");
    console.log("\nIMPORTANT: Since we're using Ethereal for testing, the email wasn't actually delivered to jeff@instacabo.com.");
    console.log("Instead, you can view the email using this Preview URL:", etherealResult.previewUrl);
    console.log("In a production environment with proper SMTP configuration, this would be sent directly to jeff@instacabo.com.");
    return;
  }
  
  console.log("\n❌ All notification methods failed. Please check the logs above for details.");
}

// Execute the main function
sendGuideNotification();