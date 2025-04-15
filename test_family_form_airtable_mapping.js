// This script simulates how the family form data would be processed
// and mapped to Airtable columns through the webhookClient.ts logic
import { nanoid } from 'nanoid';

// Simulate a family trip form submission with all required fields
console.log("Testing family trip form Airtable field mapping\n");

// Create sample family trip form data
const familyTripFormData = {
  firstName: "Maria",
  lastName: "Garcia",
  email: "maria.garcia@example.com",
  phone: "555-987-6543",
  interestType: "group_trip", // Correct interestType for family forms
  source: "website",
  budget: "$10000-$15000",
  formName: "family-trip-form",
  formData: {
    numberOfAdults: "2",
    numberOfChildren: "3",
    notes: "Looking for a family-friendly villa with a pool and kids activities",
    checkIn: "2025-07-10",
    checkOut: "2025-07-17",
    preferredContactMethod: "Phone",
    specificType: "family_trip",
    accommodationType: "Villa",
    interests: ["Beach", "Pool", "Kids Activities"]
  }
};

// Process the data similar to webhookClient.ts sendLeadWebhook function
function processFormData(leadData) {
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
    if (leadData.formData.numberOfAdults && leadData.formData.numberOfChildren) {
      data.number_of_travelers = (parseInt(leadData.formData.numberOfAdults) || 0) + 
                                (parseInt(leadData.formData.numberOfChildren) || 0);
    } else if (leadData.formData.numberOfChildren) {
      data.number_of_travelers = (parseInt(leadData.formData.numberOfChildren) || 0) + 2; // Assuming 2 adults + children
    }
    if (leadData.formData.partySize) data.guests = parseInt(leadData.formData.partySize) || 0;
    if (leadData.formData.guestCount) data.guests = parseInt(leadData.formData.guestCount) || 0;
    
    // Special requests and notes
    if (leadData.formData.notes) {
      data.notes = (data.notes ? data.notes + "\n\n" : "") + leadData.formData.notes;
    }
    
    // Source tracking
    data.source_page = leadData.formName || '';
    
    // Interest areas 
    if (leadData.formData.interests && Array.isArray(leadData.formData.interests)) {
      data.interest_areas = leadData.formData.interests.join(', ');
    }
    
    // Accommodation preferences
    if (leadData.formData.accommodationType) {
      data.accommodation_preference = leadData.formData.accommodationType;
    }
  }
  
  return data;
}

// Process the sample form data
const processedData = processFormData(familyTripFormData);

// Print the processed data that would be sent to Airtable
console.log("PROCESSED FORM DATA FOR AIRTABLE:");
console.log(JSON.stringify(processedData, null, 2));

// Print a mapping table showing which form fields map to which Airtable columns
console.log("\nAIRTABLE COLUMN MAPPING:");
console.log("------------------------");
console.log("Form Field              | Airtable Column");
console.log("------------------------|-------------------");
console.log("firstName               | first_name");
console.log("lastName                | last_name");
console.log("email                   | email");
console.log("phone                   | phone");
console.log("interestType            | interest_type");
console.log("formData.checkIn        | start_date");
console.log("formData.checkOut       | end_date");
console.log("formData.numberOfAdults + numberOfChildren | number_of_travelers");
console.log("formData.notes          | notes");
console.log("formData.preferredContactMethod | preferred_contact_method");
console.log("formData.interests      | interest_areas");
console.log("formName                | source_page");
console.log("budget                  | budget");
console.log("formData.accommodationType | accommodation_preference");

// Verify the key fields needed for Airtable
console.log("\nVERIFICATION OF KEY AIRTABLE FIELDS:");
console.log("----------------------------------");
console.log("1. first_name:", processedData.first_name ? "✓ PRESENT" : "✗ MISSING");
console.log("2. last_name:", processedData.last_name ? "✓ PRESENT" : "✗ MISSING");
console.log("3. email:", processedData.email ? "✓ PRESENT" : "✗ MISSING");
console.log("4. phone:", processedData.phone ? "✓ PRESENT" : "✗ MISSING");
console.log("5. interest_type:", processedData.interestType ? "✓ PRESENT" : "✗ MISSING");
console.log("   - Value:", processedData.interestType);
console.log("   - Valid? ", ["villa", "resort", "adventure", "wedding", "group_trip", "influencer", "concierge"].includes(processedData.interestType) ? "✓ VALID" : "✗ INVALID");
console.log("6. start_date:", processedData.start_date ? "✓ PRESENT" : "✗ MISSING");
console.log("7. end_date:", processedData.end_date ? "✓ PRESENT" : "✗ MISSING");
console.log("8. number_of_travelers:", processedData.number_of_travelers ? "✓ PRESENT" : "✗ MISSING");
console.log("   - Value:", processedData.number_of_travelers);
console.log("9. preferred_contact_method:", processedData.preferred_contact_method ? "✓ PRESENT" : "✗ MISSING");