// Test script to directly run actual form data through the family form payload construction
import { nanoid } from 'nanoid';

// This simulates the exact data structure used in the family form component
console.log("TESTING ACTUAL FAMILY FORM PAYLOAD CONSTRUCTION");
console.log("------------------------------------------------");

// These are the exact form field values a user would enter
const formData = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "555-123-4567",
  checkIn: "2025-08-15",
  checkOut: "2025-08-22",
  budget: "$10000-$15000",
  children: "2",
  notes: "We're looking for kid-friendly activities and would like a villa with a pool."
};

console.log("Form input data:", formData);

// This is the exact payload construction from the family form component (line 80-101)
const payload = {
  firstName: formData.firstName,
  lastName: formData.lastName,
  email: formData.email, 
  phone: formData.phone,
  interestType: 'group_trip', // Fixed value - previously was 'lead'
  source: 'website',
  status: 'new',
  budget: formData.budget || '$5000-$10000',
  timeline: `${formData.checkIn} to ${formData.checkOut}`,
  tags: "Family Trip, Group Travel",
  formName: 'family-trip-form',
  formData: {
    numberOfChildren: formData.children,
    notes: formData.notes,
    checkIn: formData.checkIn,
    checkOut: formData.checkOut,
    preferredContactMethod: 'Email',
    specificType: 'family_trip'
  }
};

console.log("\nConstructed payload to send to API:", JSON.stringify(payload, null, 2));

// This simulates the transformation that would happen in webhookClient.ts (line 22-106)
function processWebhookPayload(leadData) {
  // Extract first and last name for consistency
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
    
    // Special requests and notes
    if (leadData.formData.notes) {
      data.notes = (data.notes ? data.notes + "\n\n" : "") + leadData.formData.notes;
    }
    
    // Source tracking
    data.source_page = leadData.formName || '';
  }
  
  return data;
}

// Process the payload as webhookClient.ts would
const processedData = processWebhookPayload(payload);

// This is what would be sent to Make.com
console.log("\nFINAL DATA THAT WOULD BE SENT TO MAKE.COM:");
console.log(JSON.stringify(processedData, null, 2));

// Verify key Airtable fields
console.log("\nAIRTABLE MAPPING VERIFICATION:");
console.log("-----------------------------");
console.log("1. first_name:", processedData.first_name);
console.log("2. last_name:", processedData.last_name);
console.log("3. email:", processedData.email);
console.log("4. phone:", processedData.phone);
console.log("5. interest_type:", processedData.interestType);
console.log("   - Valid? ", ["villa", "resort", "adventure", "wedding", "group_trip", "influencer", "concierge"].includes(processedData.interestType) ? "✓ Yes" : "✗ No");
console.log("6. start_date:", processedData.start_date);
console.log("7. end_date:", processedData.end_date);
console.log("8. number_of_travelers:", processedData.number_of_travelers, "(2 adults + 2 children)");
console.log("9. notes:", processedData.notes);
console.log("10. budget:", processedData.budget);
console.log("11. source_page:", processedData.source_page);