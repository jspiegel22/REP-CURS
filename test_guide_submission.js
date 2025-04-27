// Test script to submit a guide download request
import fetch from 'node-fetch';

async function submitGuideRequest() {
  try {
    const guideData = {
      firstName: "Test",
      lastName: "User",
      email: "jeff@instacabo.com", // Send to admin email
      phone: "555-123-4567",
      guideType: "Cabo San Lucas Travel Guide",
      interestAreas: ["Resorts", "Dining", "Activities"],
      source: "Test Script",
      status: "new",
      formName: "guide-download-test",
      tags: ["Test", "Guide Request"],
      formData: {
        additional_info: "This is a test submission to trigger email notifications",
        preferred_contact_method: "Email",
        time_to_call: "Anytime",
        test_mode: true
      }
    };

    console.log("Submitting test guide request...");
    
    const response = await fetch('http://localhost:3000/api/guide-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guideData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log("Guide submission successful!");
      console.log(result);
    } else {
      console.error("Guide submission failed:", result);
    }
  } catch (error) {
    console.error("Error submitting guide request:", error);
  }
}

// Execute the function
submitGuideRequest();