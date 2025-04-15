// This script tests submitting family trip form data to our test server
import fetch from 'node-fetch';
import { nanoid } from 'nanoid';

// Simulate a family trip form submission with all required fields
const familyTripFormData = {
  firstName: "Maria",
  lastName: "Garcia",
  email: "maria.garcia@example.com",
  phone: "555-987-6543",
  interestType: "group_trip",
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

// Submit the form data to our test server
async function submitFormData() {
  try {
    console.log("Submitting family trip form data to test server...");
    
    const response = await fetch("http://localhost:3000/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(familyTripFormData)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log("Form submitted successfully!");
    console.log("Response data:");
    console.log(JSON.stringify(responseData, null, 2));
    
    // Verify the specific fields we need for Airtable mapping
    console.log("\nVerifying fields needed for Airtable:");
    console.log("first_name:", responseData.first_name);
    console.log("last_name:", responseData.last_name);
    console.log("email:", responseData.email);
    console.log("phone:", responseData.phone);
    console.log("interestType:", responseData.interestType);
    console.log("start_date:", responseData.start_date);
    console.log("end_date:", responseData.end_date);
    console.log("number_of_travelers:", responseData.number_of_travelers);
    console.log("notes:", responseData.notes);
  } catch (error) {
    console.error("Error submitting form:", error.message);
  }
}

// Run the test
submitFormData();