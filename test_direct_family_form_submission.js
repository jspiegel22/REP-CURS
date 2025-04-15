// Direct test of family form submission to API
const axios = require('axios');

async function submitFamilyForm() {
  console.log("DIRECT FAMILY FORM SUBMISSION TEST");
  console.log("---------------------------------");
  
  // This is the exact form data from the family form 
  const familyFormData = {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    interestType: 'group_trip',  // This is the correct value
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

  try {
    // This would typically be the API endpoint for leads
    const response = await axios.post('http://localhost:3000/api/leads', familyFormData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", JSON.stringify(response.data, null, 2));
    
    return {success: true, data: response.data};
  } catch (error) {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Error Response:", error.response.status, error.response.data);
    }
    
    // Even though we got an error (likely because local API isn't running),
    // let's simulate and verify what the server would have received
    console.log("\nSIMULATED WEBHOOK CALL VERIFICATION:");
    console.log("---------------------------------");
    
    // Simulate transformation by webhookClient.ts
    const firstName = familyFormData.firstName || familyFormData.first_name || '';
    const lastName = familyFormData.lastName || familyFormData.last_name || '';
    
    const processedData = {
      ...familyFormData,
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      webhook_type: 'lead',
      submission_type: 'Lead'
    };
    
    // Map form fields to proper Airtable columns
    if (familyFormData.formData) {
      if (familyFormData.formData.checkIn) processedData.start_date = familyFormData.formData.checkIn;
      if (familyFormData.formData.checkOut) processedData.end_date = familyFormData.formData.checkOut;
      
      if (familyFormData.formData.numberOfChildren) {
        processedData.number_of_travelers = (parseInt(familyFormData.formData.numberOfChildren) || 0) + 2;
      }
      
      if (familyFormData.formData.notes) {
        processedData.notes = familyFormData.formData.notes;
      }
      
      processedData.source_page = familyFormData.formName || '';
    }
    
    console.log("DATA THAT WOULD BE SENT TO MAKE.COM/AIRTABLE:");
    console.log(JSON.stringify(processedData, null, 2));
    
    // Verify key fields
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
    
    return {success: false, error: error.message, simulatedData: processedData};
  }
}

// Execute the test
submitFamilyForm();