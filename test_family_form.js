// Test script for family trip form
const testFamilyForm = async () => {
  try {
    console.log("Testing family trip form submission...");
    
    // Sample form data
    const sampleData = {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "555-123-4567",
      interestType: "group_trip", // Updated to use correct value
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
    
    // Send the data to our API
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Form submission failed:", errorData);
      console.error("Status:", response.status);
      console.error("Status text:", response.statusText);
      return;
    }
    
    const result = await response.json();
    console.log("Form submission successful:", result);
    console.log("The form data was accepted by the API!");
    
  } catch (error) {
    console.error("Error during form test:", error);
  }
};

// Run the test
testFamilyForm();