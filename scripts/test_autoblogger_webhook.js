// Script to test the autoblogger webhook endpoint
import axios from 'axios';

// Configuration
const webhookUrl = 'http://localhost:5173/api/webhooks/autoblogger';
const webhookSecret = process.env.WEBHOOK_SECRET || '41d203af-5210-4f49-a1b6-865d15fca215';

// Sample blog post for testing
const sampleBlogPost = {
  title: "Top 5 Luxury Resorts in Cabo San Lucas",
  content: `
# Top 5 Luxury Resorts in Cabo San Lucas

Cabo San Lucas is known for its stunning beaches, vibrant nightlife, and world-class resorts. If you're planning a luxury getaway, here are the top 5 resorts that offer unparalleled luxury and amenities.

## 1. Waldorf Astoria Los Cabos Pedregal

Nestled at the tip of the Baja Peninsula, the Waldorf Astoria Los Cabos Pedregal offers breathtaking views of the Pacific Ocean. Each room features a private plunge pool and terrace. The resort's signature restaurant, El Farallon, serves the freshest seafood with ocean views.

## 2. One&Only Palmilla

This iconic resort combines Mexican charm with modern luxury. With two beautiful beaches, a Jack Nicklaus-designed golf course, and a world-class spa, One&Only Palmilla is the epitome of luxury.

## 3. Las Ventanas al Paraiso

Spanish for "Windows to Paradise," Las Ventanas lives up to its name with stunning architecture and unparalleled service. The resort features infinity pools, a holistic spa, and private beach cabanas.

## 4. Montage Los Cabos

Located on the golden sand beaches of Santa Maria Bay, Montage Los Cabos offers guests direct access to one of the best swimming beaches in the region. The resort's contemporary design blends seamlessly with the desert landscape.

## 5. Grand Velas Los Cabos

This all-inclusive resort redefines luxury with spacious suites, gourmet dining options, and a stunning three-tiered infinity pool overlooking the Sea of Cortez.
  `,
  excerpt: "Discover the most exclusive and luxurious accommodations in Cabo San Lucas for an unforgettable vacation experience.",
  image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  category: "Luxury Travel",
  tags: ["resorts", "luxury", "accommodation", "cabo san lucas"],
  publish: true
};

// Helper function to send the blog post
async function sendBlogPost(post) {
  try {
    console.log(`Sending blog post: ${post.title}`);
    
    const response = await axios.post(webhookUrl, post, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': webhookSecret
      }
    });
    
    console.log('✅ Successfully sent blog post!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending blog post:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run tests with different scenarios
async function runTests() {
  try {
    console.log('🔍 Testing autoblogger webhook...\n');
    
    // Test 1: Valid blog post with all fields
    console.log('🧪 Test 1: Sending complete blog post with valid signature');
    await sendBlogPost(sampleBlogPost);
    
    // Test 2: Missing required fields
    console.log('\n🧪 Test 2: Sending blog post with missing content (should fail)');
    try {
      const incompletePost = { ...sampleBlogPost };
      delete incompletePost.content;
      
      await sendBlogPost(incompletePost);
      console.log('❌ Test failed: Expected an error for missing content');
    } catch (error) {
      console.log('✅ Test passed: Correctly rejected post with missing content');
    }
    
    // Test 3: Invalid webhook signature
    console.log('\n🧪 Test 3: Sending blog post with invalid signature (should fail)');
    try {
      const response = await axios.post(webhookUrl, sampleBlogPost, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': 'invalid-signature'
        }
      });
      
      console.log('❌ Test failed: Accepted post with invalid signature');
    } catch (error) {
      console.log('✅ Test passed: Correctly rejected post with invalid signature');
    }
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n❌ Failed to send blog post due to error');
    console.error('Test failed.');
  }
}

// Run the tests
runTests();