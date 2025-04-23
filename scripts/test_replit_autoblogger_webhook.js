// Script to test the autoblogger webhook endpoint in the Replit environment
import axios from 'axios';

// Configuration
// The webhook URL should use the Replit domain instead of localhost
const replitDomain = 'https://603d1be0-7877-4e31-a83b-029d972cc9fd-00-cxbuxrzsxtnb.janeway.replit.dev';
const webhookUrl = `${replitDomain}/api/webhooks/autoblogger`;
const webhookSecret = process.env.WEBHOOK_SECRET || '41d203af-5210-4f49-a1b6-865d15fca215';

// Sample blog post for testing
const sampleBlogPost = {
  title: "Top 5 Family-Friendly Resorts in Cabo San Lucas",
  content: `
# Top 5 Family-Friendly Resorts in Cabo San Lucas

Planning a family vacation to Cabo San Lucas? Here are our top recommendations for family-friendly resorts that offer activities and amenities for all ages.

## 1. Grand Velas Los Cabos

This luxury all-inclusive resort offers an outstanding kids' club with supervised activities, a teens' club with video games and social spaces, and family-friendly pools. The resort's family suites provide ample space for everyone to relax.

## 2. Hilton Los Cabos Beach & Golf Resort

With its protected swimming cove and gentle waters, the Hilton Los Cabos is perfect for families with young children. The Enclave Beach Club offers both fun for kids and relaxation for parents.

## 3. Hyatt Ziva Los Cabos

This all-inclusive resort features a KidZ Club with water features, a game room, and arts and crafts. The resort also offers family-friendly entertainment and multiple pools, including a dedicated kids' pool with water slides.

## 4. Paradisus Los Cabos

The Family Concierge service at Paradisus Los Cabos ensures a stress-free vacation. The resort offers specialized activities for children and a family lounge with snacks, games, and a dedicated check-in area.

## 5. Hacienda del Mar Los Cabos Resort

With its beautiful gardens, multiple swimming pools, and beachfront location, Hacienda del Mar offers a warm, Mexican atmosphere that's welcoming to families. The resort's Tortuga Kids Club provides supervised activities for children.
  `,
  excerpt: "Discover the perfect places to stay in Cabo San Lucas with amenities and activities the whole family will love.",
  image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  category: "Family Travel",
  tags: ["family", "resorts", "kid-friendly", "vacation", "cabo san lucas"],
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

// Run the test
async function runTest() {
  try {
    console.log('🔍 Testing autoblogger webhook using Replit domain...\n');
    console.log(`Webhook URL: ${webhookUrl}`);
    
    await sendBlogPost(sampleBlogPost);
    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Failed to send blog post due to error');
    console.error('Test failed.');
  }
}

// Run the test
runTest();