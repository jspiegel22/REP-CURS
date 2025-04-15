import axios from 'axios';

async function submitFamilyForm() {
  console.log("SUBMITTING FAMILY FORM DATA TO MAKE.COM");
  console.log("---------------------------------------");
  
  // Create family form data
  const familyFormData = {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    interestType: 'group_trip',
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
    // Send directly to Make.com webhook URL
    const makeWebhookUrl = 'https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2';
    
    // Process data like webhookClient.ts does
    const firstName = familyFormData.firstName || familyFormData.first_name || '';
    const lastName = familyFormData.lastName || familyFormData.last_name || '';
    
    const processedData = {
      ...familyFormData,
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      tracking_id: Date.now().toString(),
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
    
    console.log("SENDING DATA TO MAKE.COM:");
    console.log(JSON.stringify(processedData, null, 2));
    
    const response = await axios.post(makeWebhookUrl, processedData);
    
    console.log("MAKE.COM RESPONSE:", response.status, response.statusText);
    console.log("SUBMISSION SUCCESSFUL!");
    
    return {success: true};
  } catch (error) {
    console.error("ERROR SENDING TO MAKE.COM:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    return {success: false, error: error.message};
  }
}

// Execute the submission
submitFamilyForm();