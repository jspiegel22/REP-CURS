/**
 * Notification Routes
 * 
 * API endpoints for testing and managing notifications (email, webhooks, etc.)
 */
import { Router } from 'express';
import * as emailService from '../services/emailService';
import { 
  sendLeadWebhook, 
  sendBookingWebhook, 
  sendGuideRequestWebhook 
} from '../services/webhookClient.enhanced';
import { requireAdmin } from '../middleware';

const router = Router();

/**
 * Test email route - sends a test email to verify the system works
 * Protected with admin authentication
 */
router.post('/test-email', requireAdmin, async (req, res) => {
  try {
    const email = req.body.email || req.user?.email;
    // Create test email content
    const htmlContent = emailService.createTestEmail({
      recipient: email || 'Not specified'
    });
    
    // Send the email
    const result = await emailService.sendEmail({
      to: email,
      subject: "Test Email from Cabo Website",
      html: htmlContent
    });
    
    if (result) {
      res.json({ 
        success: true, 
        message: `Test email sent successfully to ${email || 'admin email'}`
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email'
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: String(error)
    });
  }
});

/**
 * Test lead notification - sends a test lead notification
 * Protected with admin authentication
 */
router.post('/test-lead', requireAdmin, async (req, res) => {
  try {
    // Use provided lead data or default to test data
    const leadData = req.body.leadData || {
      firstName: "Test",
      lastName: "Lead",
      email: req.body.email || req.user?.email || "test@example.com",
      phone: "+1-555-123-4567",
      source: "Website - Test",
      interestType: "villa",
      budget: "$10,000-$20,000",
      timeline: "Within 6 months",
      message: "This is a test lead notification to verify the system works.",
      formData: {
        preferredContactMethod: "Email",
        preferredTimeToContact: "Morning",
        numberOfTravelers: 4,
        specialRequests: "Test special request"
      }
    };
    
    // Try to send both webhook and email
    const webhookResult = await sendLeadWebhook(leadData);
    
    res.json({ 
      success: true,
      webhook: webhookResult,
      message: `Lead notification process complete. Email sent: ${webhookResult.email_sent}`
    });
  } catch (error) {
    console.error('Error processing lead notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing lead notification',
      error: String(error)
    });
  }
});

/**
 * Test booking notification - sends a test booking notification
 * Protected with admin authentication
 */
router.post('/test-booking', requireAdmin, async (req, res) => {
  try {
    // Use provided booking data or default to test data
    const bookingData = req.body.bookingData || {
      firstName: "Test",
      lastName: "Booking",
      email: req.body.email || req.user?.email || "test@example.com",
      phone: "+1-555-123-4567",
      source: "Website - Test",
      bookingType: "villa",
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 37 days from now
      guests: 4,
      totalAmount: 4500,
      currency: "USD",
      paymentStatus: "pending",
      paymentMethod: "credit_card",
      specialRequests: "This is a test booking notification to verify the system works.",
      formData: {
        preferredContactMethod: "Email",
        preferredTimeToContact: "Morning",
        specialAccommodations: "None - Test"
      }
    };
    
    // Try to send both webhook and email
    const webhookResult = await sendBookingWebhook(bookingData);
    
    res.json({ 
      success: true,
      webhook: webhookResult,
      message: `Booking notification process complete. Email sent: ${webhookResult.email_sent}`
    });
  } catch (error) {
    console.error('Error processing booking notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing booking notification',
      error: String(error)
    });
  }
});

/**
 * Test guide request notification - sends a test guide request notification
 * Protected with admin authentication
 */
router.post('/test-guide', requireAdmin, async (req, res) => {
  try {
    // Use provided guide data or default to test data
    const guideData = req.body.guideData || {
      firstName: "Test",
      lastName: "Guide",
      email: req.body.email || req.user?.email || "test@example.com",
      phone: "+1-555-123-4567",
      source: "Website - Test",
      guideType: "villa",
      interestAreas: ["Luxury", "Family-Friendly", "Beach"],
      formData: {
        preferredContactMethod: "Email",
        travelDates: "Summer 2025",
        investmentLevel: "$5,000-$10,000",
        agentInterest: true
      }
    };
    
    // Try to send both webhook and email
    const webhookResult = await sendGuideRequestWebhook(guideData);
    
    res.json({ 
      success: true,
      webhook: webhookResult,
      message: `Guide request notification process complete. Email sent: ${webhookResult.email_sent}`
    });
  } catch (error) {
    console.error('Error processing guide request notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing guide request notification',
      error: String(error)
    });
  }
});

/**
 * Test all notifications at once - sends test lead, booking, and guide notifications
 * Protected with admin authentication
 */
router.post('/test-all', requireAdmin, async (req, res) => {
  try {
    const email = req.body.email || req.user?.email || "jeff@instacabo.com";
    const results = {
      email: await emailService.sendEmail({
        to: email,
        subject: "Test Email from Cabo Website",
        html: emailService.createTestEmail({ recipient: email })
      }),
      lead: await sendLeadWebhook({
        firstName: "Test",
        lastName: "Lead",
        email: email,
        source: "Test All Endpoint",
        interestType: "villa"
      }),
      booking: await sendBookingWebhook({
        firstName: "Test",
        lastName: "Booking",
        email: email,
        source: "Test All Endpoint",
        bookingType: "villa",
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 2
      }),
      guide: await sendGuideRequestWebhook({
        firstName: "Test",
        lastName: "Guide",
        email: email,
        source: "Test All Endpoint",
        guideType: "villa"
      })
    };
    
    res.json({
      success: true,
      results,
      message: 'All test notifications sent'
    });
  } catch (error) {
    console.error('Error processing test notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing test notifications',
      error: String(error)
    });
  }
});

export default router;