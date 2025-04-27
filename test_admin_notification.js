import { sendAdminNotification } from './server/services/activeCampaign.js';

// Check for environment variables
console.log('ActiveCampaign API URL present:', !!process.env.ACTIVECAMPAIGN_API_URL);
console.log('ActiveCampaign API Key present:', !!process.env.ACTIVECAMPAIGN_API_KEY);

// Create a test notification with HTML content
async function testAdminNotification() {
  console.log('Testing admin email notification...');
  
  const subject = 'Test Admin Notification';
  const body = `
    <h2>Test Email Notification</h2>
    <p>This is a test email to verify that HTML templates are working correctly.</p>
    
    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
      <h3 style="color: #2F4F4F; margin-top: 0;">Sample Lead Information</h3>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Email:</strong> john@example.com</p>
      <p><strong>Phone:</strong> 555-123-4567</p>
      <p><strong>Interest:</strong> Villa Rental</p>
      <p><strong>Budget:</strong> $5,000-$10,000</p>
      <p><strong>Timeline:</strong> Summer 2025</p>
    </div>
    
    <p>This email was generated as part of a test of the Cabo Villas admin notification system.</p>
    <p>If you received this, the HTML email template system is working correctly!</p>
  `;
  
  try {
    const result = await sendAdminNotification(subject, body);
    if (result) {
      console.log('✅ Admin notification email sent successfully!');
    } else {
      console.log('❌ Failed to send admin notification email.');
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

// Run the test
testAdminNotification()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Unhandled error during test:', error));