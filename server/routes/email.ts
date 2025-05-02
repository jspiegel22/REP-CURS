/**
 * Email routes for handling email notifications
 */
import { Router } from 'express';
import * as emailService from '../services/emailService';
import { storage } from '../storage';
import { requireAuth, requireAdmin } from '../middleware';

export const router = Router();

/**
 * Send a booking confirmation email
 */
router.post('/send-booking-confirmation', async (req, res) => {
  try {
    const { email, name, bookingType, confirmationNumber, booking } = req.body;
    
    if (!email || !name || !bookingType || !confirmationNumber || !booking) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for booking confirmation email'
      });
    }
    
    // Get appropriate email template based on booking type
    const htmlContent = emailService.createBookingConfirmationEmail({
      name,
      email,
      bookingType,
      confirmationNumber,
      booking
    });
    
    // Send the email
    const success = await emailService.sendEmail({
      to: email,
      subject: `Your ${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking Confirmation (${confirmationNumber})`,
      html: htmlContent
    });
    
    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Booking confirmation email sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send booking confirmation email'
      });
    }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending booking confirmation email',
      error: error.message
    });
  }
});

/**
 * Send a lead notification email
 */
router.post('/send-lead-notification', async (req, res) => {
  try {
    const { leadId } = req.body;
    
    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: 'Missing lead ID'
      });
    }
    
    // Get lead from database
    const lead = await storage.getLeadById(leadId);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Create lead notification email
    const htmlContent = emailService.createLeadNotificationEmail({ lead });
    
    // Send to admin or specified notification recipients
    const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@cabo.is';
    
    const success = await emailService.sendEmail({
      to: recipientEmail,
      subject: `New ${lead.interestType} Lead: ${lead.firstName} ${lead.lastName || ''}`,
      html: htmlContent
    });
    
    if (success) {
      // Update lead to mark notification as sent
      await storage.updateLead(leadId, { notificationSent: true });
      
      return res.status(200).json({
        success: true,
        message: 'Lead notification email sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send lead notification email'
      });
    }
  } catch (error) {
    console.error('Error sending lead notification email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending lead notification email',
      error: error.message
    });
  }
});

/**
 * Send a test email (admin only)
 */
router.post('/send-test-email', requireAdmin, async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    
    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing recipient email address'
      });
    }
    
    // Create test email
    const htmlContent = emailService.createTestEmail({ recipient: recipientEmail });
    
    const success = await emailService.sendEmail({
      to: recipientEmail,
      subject: 'Cabo San Lucas Website - Email Test',
      html: htmlContent
    });
    
    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email'
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
});

export default router;