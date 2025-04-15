// This script demonstrates how the family trip form data will be processed
// and how first_name and last_name will be sent to Make.com

import { nanoid } from 'nanoid';

// Simulate the lead data from a family trip form submission
const leadData = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "555-123-4567",
  interestType: "group_trip",
  source: "website",
  status: "new",
  budget: "$5000-$10000",
  timeline: "2025-06-15 to 2025-06-22",
  tags: "Family Trip, Group Travel",
  formName: "family-trip-form",
  formData: {
    numberOfChildren: "2",
    notes: "Looking for a family-friendly resort with kid activities",
    checkIn: "2025-06-15",
    checkOut: "2025-06-22",
    preferredContactMethod: "Email",
    specificType: "family_trip"
  }
};

// Extract first and last name for consistency - this is our fix
const firstName = leadData.firstName || leadData.first_name || '';
const lastName = leadData.lastName || leadData.last_name || '';

// Add tracking ID if not present
const data = {
  ...leadData,
  // Ensure first_name and last_name are at the top level and overwrite any existing values
  first_name: firstName,
  last_name: lastName,
  firstName: firstName,
  lastName: lastName,
  tracking_id: leadData.tracking_id || nanoid(),
  webhook_type: 'lead',
  submission_type: 'Lead',
  tags: typeof leadData.tags === 'string' ? leadData.tags : (
    Array.isArray(leadData.tags) ? leadData.tags.join(', ') : ''
  ),
  preferred_contact_method: leadData.preferredContactMethod || 
                           (leadData.formData?.preferredContactMethod) || 'Email'
};

// Map form fields to proper Airtable columns
if (leadData.formData) {
  // Start and end dates
  if (leadData.formData.checkIn) data.start_date = leadData.formData.checkIn;
  if (leadData.formData.checkOut) data.end_date = leadData.formData.checkOut;
  
  // Number of travelers
  if (leadData.formData.numberOfTravelers) data.number_of_travelers = parseInt(leadData.formData.numberOfTravelers) || 0;
  if (leadData.formData.numberOfChildren) data.number_of_travelers = (parseInt(leadData.formData.numberOfChildren) || 0) + 2; // Assuming 2 adults + children
  if (leadData.formData.partySize) data.guests = parseInt(leadData.formData.partySize) || 0;
  if (leadData.formData.guestCount) data.guests = parseInt(leadData.formData.guestCount) || 0;
  
  // Source tracking
  data.source_page = leadData.formName || '';
}

// Simulate what would be sent to Make.com webhook
console.log("Data that would be sent to Make.com webhook:");
console.log(JSON.stringify(data, null, 2));

// Specifically check first_name and last_name fields
console.log("\nVerifying first_name and last_name fields:");
console.log("first_name:", data.first_name);
console.log("last_name:", data.last_name);
console.log("Are fields present at top level?", data.hasOwnProperty('first_name') && data.hasOwnProperty('last_name'));