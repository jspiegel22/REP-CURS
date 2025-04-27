import ActiveCampaign from 'activecampaign';
import { Lead } from '@shared/schema';
import { Booking } from '@shared/schema';

// Initialize ActiveCampaign client with environment variables
let ac: any;

try {
  if (process.env.ACTIVECAMPAIGN_API_URL && process.env.ACTIVECAMPAIGN_API_KEY) {
    ac = new ActiveCampaign({
      url: process.env.ACTIVECAMPAIGN_API_URL,
      token: process.env.ACTIVECAMPAIGN_API_KEY,
    });
    console.log('ActiveCampaign client initialized successfully');
  } else {
    console.log('ActiveCampaign API credentials not found in environment variables');
    ac = null;
  }
} catch (error) {
  console.error('Error initializing ActiveCampaign client:', error);
  ac = null;
}

// Tags to use for different event types
const TAGS = {
  LEAD: 'Website Lead',
  BOOKING: 'Website Booking',
  GUIDE_REQUEST: 'Guide Download',
  RESORT_INTEREST: 'Resort Interest',
  VILLA_INTEREST: 'Villa Interest',
  ADVENTURE_INTEREST: 'Adventure Interest'
};

// Lists
const DEFAULT_LIST_ID = 1; // Most AC accounts have a default list with ID 1

// Interface for custom fields in ActiveCampaign
interface CustomFields {
  [key: string]: string | number | boolean;
}

/**
 * Create or update a contact in ActiveCampaign
 * 
 * @param email Contact email
 * @param firstName First name
 * @param lastName Last name
 * @param phone Phone number
 * @param customFields Additional custom fields
 * @returns Created/updated contact or null if failed
 */
export async function createOrUpdateContact(
  email: string,
  firstName: string,
  lastName?: string | null,
  phone?: string | null,
  customFields: CustomFields = {}
): Promise<any | null> {
  try {
    console.log(`Creating or updating contact in ActiveCampaign: ${email}`);
    
    // Check if client is initialized
    if (!ac) {
      console.log('ActiveCampaign client not initialized, skipping contact creation');
      return null;
    }
    
    // First try to find if the contact already exists
    const existingContacts = await ac.contact.listAll({
      filters: { email },
    });
    
    let contact;
    const contactData = {
      email,
      firstName,
      lastName: lastName || '',
      phone: phone || '',
      ...customFields,
    };
    
    if (existingContacts?.contacts?.length) {
      // Update existing contact
      const existingContact = existingContacts.contacts[0];
      contact = await ac.contact.edit(existingContact.id, contactData);
      console.log(`Updated existing contact: ${email} (ID: ${existingContact.id})`);
    } else {
      // Create new contact
      contact = await ac.contact.create(contactData);
      
      // Add to default list
      if (contact?.contact?.id) {
        await ac.contactList.add({
          list: DEFAULT_LIST_ID,
          contact: contact.contact.id,
          status: 1 // Active status
        });
      }
      
      console.log(`Created new contact: ${email} (ID: ${contact?.contact?.id})`);
    }
    
    return contact?.contact || null;
  } catch (error) {
    console.error('Error creating/updating contact in ActiveCampaign:', error);
    return null;
  }
}

/**
 * Add a tag to a contact in ActiveCampaign
 * 
 * @param contactId Contact ID
 * @param tagName Name of the tag to add
 * @returns Success status
 */
export async function addTagToContact(contactId: string | number, tagName: string): Promise<boolean> {
  try {
    // Check if client is initialized
    if (!ac) {
      console.log('ActiveCampaign client not initialized, skipping tag addition');
      return false;
    }
    
    // First check if tag exists, if not create it
    const tags = await ac.tag.listAll();
    let tagId = null;
    
    for (const tag of tags.tags) {
      if (tag.tag === tagName) {
        tagId = tag.id;
        break;
      }
    }
    
    // Create tag if it doesn't exist
    if (!tagId) {
      const newTag = await ac.tag.create({ tag: tagName });
      tagId = newTag.tag.id;
      console.log(`Created new tag: ${tagName} (ID: ${tagId})`);
    }
    
    // Add tag to contact
    await ac.contactTag.add({
      contact: contactId,
      tag: tagId,
    });
    
    console.log(`Added tag ${tagName} to contact ${contactId}`);
    return true;
  } catch (error) {
    console.error(`Error adding tag ${tagName} to contact ${contactId}:`, error);
    return false;
  }
}

/**
 * Process a lead in ActiveCampaign
 * 
 * @param lead Lead data
 * @returns Success status
 */
export async function processLead(lead: Lead): Promise<boolean> {
  try {
    // Create custom fields based on lead data
    const customFields: CustomFields = {
      'Source': lead.source || 'Website',
      'Lead Status': lead.status || 'New',
      'Interest Type': lead.interestType || 'General',
      'Budget': lead.budget || 'Not specified',
      'Timeline': lead.timeline || 'Not specified',
    };
    
    // Add any form data as custom fields
    if (lead.formData && typeof lead.formData === 'object') {
      Object.entries(lead.formData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          customFields[key] = value;
        }
      });
    }
    
    // Create or update contact
    const contact = await createOrUpdateContact(
      lead.email,
      lead.firstName,
      lead.lastName,
      lead.phone,
      customFields
    );
    
    if (!contact) {
      return false;
    }
    
    // Add appropriate tags
    await addTagToContact(contact.id, TAGS.LEAD);
    
    // Add interest-specific tags
    if (lead.interestType === 'resort') {
      await addTagToContact(contact.id, TAGS.RESORT_INTEREST);
    } else if (lead.interestType === 'villa') {
      await addTagToContact(contact.id, TAGS.VILLA_INTEREST);
    } else if (lead.interestType === 'adventure') {
      await addTagToContact(contact.id, TAGS.ADVENTURE_INTEREST);
    }
    
    // Send notification to admin
    await sendAdminNotification(
      'New Lead Received',
      `
      <h2>New Lead from ${lead.source}</h2>
      <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName || ''}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
      <p><strong>Interest:</strong> ${lead.interestType || 'Not specified'}</p>
      <p><strong>Budget:</strong> ${lead.budget || 'Not specified'}</p>
      <p><strong>Timeline:</strong> ${lead.timeline || 'Not specified'}</p>
      <p><strong>Created:</strong> ${new Date(lead.createdAt || new Date()).toLocaleString()}</p>
      `
    );
    
    return true;
  } catch (error) {
    console.error('Error processing lead in ActiveCampaign:', error);
    return false;
  }
}

/**
 * Process a booking in ActiveCampaign
 * 
 * @param booking Booking data
 * @returns Success status
 */
export async function processBooking(booking: Booking): Promise<boolean> {
  try {
    // Create custom fields based on booking data
    const customFields: CustomFields = {
      'Source': booking.source || 'Website',
      'Booking Status': booking.status || 'Pending',
      'Booking Type': booking.bookingType || 'General',
      'Guests': booking.guests || 1,
      'Check-in Date': new Date(booking.startDate).toISOString().split('T')[0],
      'Check-out Date': new Date(booking.endDate).toISOString().split('T')[0],
    };
    
    if (booking.totalAmount) {
      customFields['Total Amount'] = booking.totalAmount;
    }
    
    // Add any form data as custom fields
    if (booking.formData && typeof booking.formData === 'object') {
      Object.entries(booking.formData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          customFields[key] = value;
        }
      });
    }
    
    // Create or update contact
    const contact = await createOrUpdateContact(
      booking.email,
      booking.firstName,
      booking.lastName,
      booking.phone,
      customFields
    );
    
    if (!contact) {
      return false;
    }
    
    // Add booking tag
    await addTagToContact(contact.id, TAGS.BOOKING);
    
    // Send notification to admin
    await sendAdminNotification(
      'New Booking Received',
      `
      <h2>New ${booking.bookingType} Booking</h2>
      <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName || ''}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
      <p><strong>Booking Type:</strong> ${booking.bookingType}</p>
      <p><strong>Check-in:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> ${booking.guests}</p>
      ${booking.totalAmount ? `<p><strong>Total Amount:</strong> $${booking.totalAmount}</p>` : ''}
      <p><strong>Special Requests:</strong> ${booking.specialRequests || 'None'}</p>
      <p><strong>Created:</strong> ${new Date(booking.createdAt || new Date()).toLocaleString()}</p>
      `
    );
    
    return true;
  } catch (error) {
    console.error('Error processing booking in ActiveCampaign:', error);
    return false;
  }
}

/**
 * Process a guide request in ActiveCampaign
 * 
 * @param guide Guide request data
 * @returns Success status
 */
export async function processGuideRequest(guide: any): Promise<boolean> {
  try {
    // Create custom fields based on guide data
    const customFields: CustomFields = {
      'Source': guide.source || 'Website',
      'Guide Type': guide.guideType || 'General',
    };
    
    // Add interest areas if available
    if (guide.interestAreas) {
      customFields['Interest Areas'] = Array.isArray(guide.interestAreas) 
        ? guide.interestAreas.join(', ') 
        : guide.interestAreas;
    }
    
    // Add any form data as custom fields
    if (guide.formData && typeof guide.formData === 'object') {
      Object.entries(guide.formData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          customFields[key] = value;
        }
      });
    }
    
    // Create or update contact
    const contact = await createOrUpdateContact(
      guide.email,
      guide.firstName,
      guide.lastName,
      guide.phone,
      customFields
    );
    
    if (!contact) {
      return false;
    }
    
    // Add guide request tag
    await addTagToContact(contact.id, TAGS.GUIDE_REQUEST);
    
    // Send notification to admin
    await sendAdminNotification(
      'New Guide Download',
      `
      <h2>New Guide Download Request</h2>
      <p><strong>Name:</strong> ${guide.firstName} ${guide.lastName || ''}</p>
      <p><strong>Email:</strong> ${guide.email}</p>
      <p><strong>Phone:</strong> ${guide.phone || 'Not provided'}</p>
      <p><strong>Guide Type:</strong> ${guide.guideType}</p>
      <p><strong>Interest Areas:</strong> ${
        Array.isArray(guide.interestAreas) 
          ? guide.interestAreas.join(', ') 
          : (guide.interestAreas || 'Not specified')
      }</p>
      <p><strong>Created:</strong> ${new Date(guide.createdAt || new Date()).toLocaleString()}</p>
      `
    );
    
    return true;
  } catch (error) {
    console.error('Error processing guide request in ActiveCampaign:', error);
    return false;
  }
}

/**
 * Send a notification email to the admin
 * 
 * @param subject Email subject
 * @param body HTML email body
 * @returns Success status
 */
export async function sendAdminNotification(subject: string, body: string): Promise<boolean> {
  try {
    // Check if client is initialized
    if (!ac) {
      console.log('ActiveCampaign client not initialized, skipping admin notification');
      return false;
    }
    
    // Use ActiveCampaign transactional emails to send notification
    const response = await ac.request({
      api: '/api/3/transactionalEmails/send',
      method: 'POST',
      body: {
        transactionalEmail: {
          to: 'jeff@instacabo.com',
          subject: `[CaboVillas] ${subject}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <div style="background-color: #2F4F4F; padding: 15px; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Cabo Villas Admin Notification</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
              ${body}
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; font-size: 12px; text-align: center; color: #666;">
              <p>This is an automated notification from your Cabo Villas website.</p>
            </div>
          </div>
          `,
          replyTo: 'no-reply@cabo.is',
        }
      }
    });
    
    console.log(`Admin notification email sent: ${subject}`);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
}