// Test script for the blog webhook endpoint
// This sends a sample blog post to the webhook to test database integration

import fetch from 'node-fetch';

// Configuration
const API_URL = "http://localhost:3000/api/webhooks/autoblogger";  // Use port 3000 instead of 8000
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "41d203af-5210-4f49-a1b6-865d15fca215"; // Default value if not set in environment

// Sample blog post
const blogPost = {
  title: "Top 10 Hidden Beaches in Cabo San Lucas",
  content: "Cabo San Lucas is home to some of the most breathtaking beaches in the world. While many travelers flock to the popular spots like Medano Beach, there are hidden gems waiting to be discovered. Here are our top picks for secluded beaches that offer pristine beauty and tranquility.\n\n## 1. Santa Maria Beach\nKnown for its horseshoe-shaped bay, Santa Maria Beach offers excellent snorkeling opportunities in crystal-clear waters. The beach's protected status ensures its pristine condition.\n\n## 2. Chileno Beach\nA favorite among locals, Chileno Beach provides a perfect balance of accessibility and seclusion. The calm waters make it ideal for swimming and snorkeling.",
  excerpt: "Discover secluded paradises away from the tourist crowds, where pristine sands meet crystal-clear waters.",
  slug: "top-10-hidden-beaches-cabo",
  image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  category: "Local Guides",
  tags: ["beaches", "hidden gems", "snorkeling", "swimming"],
  publish: true
};

// Function to send the blog post to the webhook
async function sendBlogPost() {
  try {
    console.log(`Sending blog post: ${blogPost.title}`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': WEBHOOK_SECRET
      },
      body: JSON.stringify(blogPost)
    });
    
    const statusCode = response.status;
    const responseData = await response.json().catch(() => ({ error: "Invalid JSON response" }));
    
    console.log(`Status code: ${statusCode}`);
    console.log("Response:", JSON.stringify(responseData, null, 2));
    
    if (statusCode >= 200 && statusCode < 300) {
      console.log("✅ Blog post sent successfully");
    } else {
      console.log("❌ Failed to send blog post");
    }
    
    return { success: statusCode >= 200 && statusCode < 300, data: responseData };
  } catch (error) {
    console.error("Error sending blog post:", error.message);
    console.log("❌ Failed to send blog post due to error");
    
    return { success: false, error: error.message };
  }
}

// Run the test
sendBlogPost()
  .then(result => {
    if (result.success) {
      console.log("Test completed successfully!");
    } else {
      console.log("Test failed.");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });