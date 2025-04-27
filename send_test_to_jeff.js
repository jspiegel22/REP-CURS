// Direct Test Email to jeff@instacabo.com
import nodemailer from 'nodemailer';

async function sendTestEmailToJeff() {
  console.log("Creating test email account...");
  
  // Create a test account on Ethereal
  const testAccount = await nodemailer.createTestAccount();
  
  console.log("Test account created:", testAccount.user);
  
  // Create a transporter using the test account
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  const currentTime = new Date().toLocaleString();
  
  // Email content
  const mailOptions = {
    from: '"Cabo San Lucas Website" <admin@cabo.is>',
    to: 'jeff@instacabo.com',
    subject: `Test Email: ${currentTime}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <div style="background-color: #2F4F4F; padding: 15px; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Cabo San Lucas Admin Notification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h2>Test Email Notification</h2>
          <p>This is a direct test email sent at your request to verify the notification system.</p>
          <p><strong>Timestamp:</strong> ${currentTime}</p>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>Test Information:</h3>
            <p><strong>Email Type:</strong> Direct Test</p>
            <p><strong>Recipient:</strong> jeff@instacabo.com</p>
            <p><strong>Requested By:</strong> User via AI Assistant</p>
            <p><strong>Status:</strong> Test Successful</p>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
          <p>This is a test email requested through the Replit AI Assistant.</p>
        </div>
      </div>
    `
  };
  
  try {
    console.log("Sending test email to jeff@instacabo.com...");
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    
    // Preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Preview URL:", previewUrl);
    
    console.log("\nIMPORTANT: Since this is using Ethereal for testing, the email preview is available at the URL above.");
    console.log("In a production environment with a proper SMTP setup, this would be delivered directly to jeff@instacabo.com.");
    
    return { success: true, previewUrl };
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    return { success: false, error: error.message };
  }
}

// Execute the function
sendTestEmailToJeff();