// Simple test of the family form data structure
import { nanoid } from 'nanoid';

console.log("SIMPLE FAMILY FORM TEST");
console.log("-----------------------");

// This is the exact form data from the family form (lines 80-101 in client/src/pages/group-trips/family/index.tsx)
const familyFormData = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "555-123-4567",
  interestType: 'group_trip',  // This is now the correct value
  source: 'website',
  status: 'new',
  budget: '$5000-$10000',
  timeline: "2025-08-15 to 2025-08-22",
  tags: "Family Trip, Group Travel",
  formName: 'family-trip-form',
  formData: {
    numberOfChildren: "2",
    notes: "Looking for a family-friendly villa with a pool",
    checkIn: "2025-08-15",
    checkOut: "2025-08-22",
    preferredContactMethod: 'Email',
    specificType: 'family_trip'
  }
};

// This is what the webhookClient.ts does to the data (lines 22-106 in server/services/webhookClient.ts)
// Extract first and last name for consistency
const firstName = familyFormData.firstName || familyFormData.first_name || '';
const lastName = familyFormData.lastName || familyFormData.last_name || '';

// Process the data for Make.com and Airtable
const processedData = {
  ...familyFormData,
  // Ensure first_name and last_name are at the top level and overwrite any existing values
  first_name: firstName,
  last_name: lastName,
  firstName: firstName,
  lastName: lastName,
  tracking_id: familyFormData.tracking_id || nanoid(),
  webhook_type: 'lead',
  submission_type: 'Lead'
};

// Map form fields to proper Airtable columns
if (familyFormData.formData) {
  // Start and end dates
  if (familyFormData.formData.checkIn) processedData.start_date = familyFormData.formData.checkIn;
  if (familyFormData.formData.checkOut) processedData.end_date = familyFormData.formData.checkOut;
  
  // Number of travelers
  if (familyFormData.formData.numberOfChildren) {
    processedData.number_of_travelers = (parseInt(familyFormData.formData.numberOfChildren) || 0) + 2; // Assuming 2 adults + children
  }
  
  // Notes
  if (familyFormData.formData.notes) {
    processedData.notes = familyFormData.formData.notes;
  }
  
  // Source tracking
  processedData.source_page = familyFormData.formName || '';
}

console.log("DATA THAT WOULD BE SENT TO MAKE.COM/AIRTABLE:");
console.log(JSON.stringify(processedData, null, 2));

// Verify key fields are present and correct
console.log("\nVERIFICATION OF KEY FIELDS:");
console.log("1. first_name:", processedData.first_name ? "✓ Present" : "✗ Missing");
console.log("2. last_name:", processedData.last_name ? "✓ Present" : "✗ Missing");
console.log("3. email:", processedData.email ? "✓ Present" : "✗ Missing");
console.log("4. phone:", processedData.phone ? "✓ Present" : "✗ Missing");
console.log("5. interestType:", processedData.interestType);
console.log("   Is value valid?", ["villa", "resort", "adventure", "wedding", "group_trip", "influencer", "concierge"].includes(processedData.interestType) ? "✓ Yes" : "✗ No");
console.log("6. start_date:", processedData.start_date ? "✓ Present" : "✗ Missing");
console.log("7. end_date:", processedData.end_date ? "✓ Present" : "✗ Missing");
console.log("8. number_of_travelers:", processedData.number_of_travelers);
console.log("9. source_page:", processedData.source_page);