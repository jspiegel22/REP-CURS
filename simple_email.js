// Simple Email Sender using Nodemailer
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function sendEmailToJeff() {
  // Create a test account on Ethereal (for testing purposes only)
  const testAccount = await nodemailer.createTestAccount();
  
  console.log("Created test email account:", testAccount.user);
  
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
  
  // Email content
  const mailOptions = {
    from: '"Cabo San Lucas Website" <no-reply@cabo.is>',
    to: 'jeff@instacabo.com',
    subject: 'Test Email from Cabo San Lucas Website',
    text: 'This is a test email sent from the Cabo San Lucas website.',
    html: `
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
    `
  };
  
  try {
    console.log("Sending email...");
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    
    // Preview URL (only works with Ethereal emails)
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    
    console.log("\nIMPORTANT: Since we're using Ethereal for testing, the email wasn't actually delivered to jeff@instacabo.com.");
    console.log("Instead, you can view the email using the Preview URL above.");
    console.log("In a production environment, this would be sent directly to jeff@instacabo.com.");
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Execute the function
sendEmailToJeff();