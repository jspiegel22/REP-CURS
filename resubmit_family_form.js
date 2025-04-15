// Script to resubmit a family form to test webhook functionality
import fetch from 'node-fetch';

async function submitFamilyForm() {
  try {
    console.log("Submitting family trip form to API...");
    
    // Create family form data exactly as it would be from the form
    const payload = {
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.rodriguez@example.com",
      phone: "555-789-1234",
      interestType: 'group_trip',
      source: 'website',
      status: 'new',
      budget: '$8000-$12000',
      timeline: "2025-09-10 to 2025-09-17",
      tags: "Family Trip, Group Travel",
      formName: 'family-trip-form',
      formData: {
        numberOfChildren: "3",
        notes: "Looking for a beachfront villa with family-friendly amenities and kids club access.",
        checkIn: "2025-09-10",
        checkOut: "2025-09-17",
        preferredContactMethod: 'Email',
        specificType: 'family_trip'
      }
    };
    
    console.log("Payload to send:", JSON.stringify(payload, null, 2));
    
    // Submit to API
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorData}`);
    }
    
    const responseData = await response.json();
    console.log("Form submitted successfully!");
    console.log("Response:", JSON.stringify(responseData, null, 2));
    
  } catch (error) {
    console.error("Error submitting form:", error.message);
  }
}

// Execute the form submission
submitFamilyForm();