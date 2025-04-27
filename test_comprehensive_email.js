// Test script to trigger a comprehensive database email
import fetch from 'node-fetch';

async function sendComprehensiveEmail() {
  try {
    console.log("Sending comprehensive database email notification...");
    
    // Get the current hostname from the environment
    const hostname = process.env.REPL_SLUG ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'localhost';
    console.log(`Using hostname: ${hostname}`);
    
    const response = await fetch(`https://${hostname}/api/test-comprehensive-notification`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log("Comprehensive email sent successfully!");
      console.log("Data counts:", result.dataCounts);
      console.log("Full response:", result);
    } else {
      console.error("Failed to send comprehensive email:", result);
    }
  } catch (error) {
    console.error("Error sending comprehensive email:", error);
  }
}

// Execute the function
sendComprehensiveEmail();