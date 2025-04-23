// Script to insert test blog posts directly into the database
import { db } from "../server/db";
import { blogPosts } from "@shared/schema";
import { eq } from "drizzle-orm";

// Sample blog posts for testing
const testBlogPosts = [
  {
    title: "Top 10 Hidden Beaches in Cabo San Lucas",
    slug: "top-10-hidden-beaches-cabo",
    content: "Cabo San Lucas is home to some of the most breathtaking beaches in the world. While many travelers flock to the popular spots like Medano Beach, there are hidden gems waiting to be discovered. Here are our top picks for secluded beaches that offer pristine beauty and tranquility.\n\n## 1. Santa Maria Beach\nKnown for its horseshoe-shaped bay, Santa Maria Beach offers excellent snorkeling opportunities in crystal-clear waters. The beach's protected status ensures its pristine condition.\n\n## 2. Chileno Beach\nA favorite among locals, Chileno Beach provides a perfect balance of accessibility and seclusion. The calm waters make it ideal for swimming and snorkeling.",
    excerpt: "Discover secluded paradises away from the tourist crowds, where pristine sands meet crystal-clear waters.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    author: "Cabo Team",
    categories: JSON.stringify(["Local Guides"]),
    tags: JSON.stringify(["beaches", "hidden gems", "snorkeling", "swimming"]),
    status: "published",
    pubDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Ultimate Guide to Luxury Yacht Charters",
    slug: "luxury-yacht-charters-guide",
    content: "Experience the ultimate luxury on the waters of Cabo San Lucas with a private yacht charter. From selecting the perfect vessel to planning your itinerary, this guide covers everything you need to know.\n\n## Choosing Your Yacht\nThe first step in planning your yacht charter is selecting the right vessel. Cabo offers various options, from sleek sailing yachts to luxurious motor yachts. Consider factors like group size, duration of charter, desired amenities, and budget considerations.\n\n## Popular Routes\nMost yacht charters in Cabo follow these popular routes: Lover's Beach and the Arch, Santa Maria Bay, Chileno Bay, and Palmilla Point.",
    excerpt: "Everything you need to know about planning the perfect yacht experience in Cabo's stunning waters.",
    imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166",
    author: "Cabo Team",
    categories: JSON.stringify(["Luxury Travel"]),
    tags: JSON.stringify(["yacht", "luxury", "charter", "sailing"]),
    status: "published",
    pubDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Planning Your Dream Wedding in Cabo",
    slug: "planning-dream-wedding-cabo",
    content: "Cabo San Lucas has become one of the most sought-after destinations for weddings, combining stunning natural beauty with world-class amenities. Let's explore how to plan your perfect wedding in paradise.\n\n## Why Choose Cabo?\n- Year-round perfect weather\n- Stunning beach and desert landscapes\n- Luxury venues and accommodations\n- Easy access from major cities\n- Professional wedding services\n\n## Best Wedding Venues\n### Beach Resorts\n- Luxury beachfront properties\n- All-inclusive packages\n- Professional wedding coordinators\n- Accommodation for guests",
    excerpt: "From venue selection to local vendors, your complete guide to creating magical moments.",
    imageUrl: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f",
    author: "Cabo Team",
    categories: JSON.stringify(["Weddings"]),
    tags: JSON.stringify(["wedding", "planning", "venues", "beach wedding"]),
    status: "published",
    pubDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to insert the test blog posts
async function insertTestBlogPosts() {
  try {
    console.log('Inserting test blog posts...');
    
    // Insert each blog post
    for (const post of testBlogPosts) {
      // Check if post with this slug already exists to avoid duplicates
      const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.slug, post.slug)).limit(1);
      
      if (existingPost.length > 0) {
        console.log(`Blog post with slug '${post.slug}' already exists. Skipping.`);
        continue;
      }
      
      // Insert the blog post
      const result = await db.insert(blogPosts).values(post).returning();
      console.log(`✅ Created blog post: ${post.title} (ID: ${result[0].id})`);
    }
    
    console.log('Successfully inserted test blog posts!');
  } catch (error) {
    console.error('Error inserting test blog posts:', error);
  }
}

// Run the function
insertTestBlogPosts()
  .catch(console.error)
  .finally(() => {
    console.log('Script execution complete.');
    // Do not explicitly disconnect from the database to ensure statements complete
    // in a production environment, you would need to properly disconnect
    setTimeout(() => process.exit(0), 1000);
  });