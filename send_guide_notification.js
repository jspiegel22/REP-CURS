// Test script to trigger a guide notification using the internal server API
import fetch from 'node-fetch';

async function sendGuideNotification() {
  try {
    console.log("Sending guide notification via server API...");
    
    // Create a test guide request payload
    const guideData = {
      firstName: "Test",
      lastName: "User",
      email: "jeff@instacabo.com",
      phone: "+1234567890",
      guideType: "resort",
      interestAreas: ["luxury", "family"],
      source: "API Test",
      formData: {
        preferredLanguage: "English",
        numberOfPeople: "2-4",
        preferredContactMethod: "Email"
      },
      created_at: new Date().toISOString()
    };
    
    console.log("Guide request payload:", JSON.stringify(guideData, null, 2));
    
    // Try to connect to the server
    console.log("Sending request to http://localhost:3000/api/guide-submissions");
    
    const response = await fetch('http://localhost:3000/api/guide-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(guideData)
    });
    
    // Parse and log the response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = await response.text();
    }
    
    if (response.ok) {
      console.log("Guide notification sent successfully!");
      console.log("Response:", typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2));
    } else {
      console.error("Failed to send guide notification. Status:", response.status);
      console.error("Response:", typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2));
    }
    
  } catch (error) {
    console.error("Error sending guide notification:", error);
  }
}

// Execute the function
sendGuideNotification();