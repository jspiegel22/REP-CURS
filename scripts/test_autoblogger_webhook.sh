#!/bin/bash

# Test script for the AutoBlogger webhook
# This script sends test blog posts to the autoblogger webhook endpoint

# Configuration
API_URL="http://localhost:3000/api/webhooks/autoblogger"
WEBHOOK_SECRET="${WEBHOOK_SECRET:-41d203af-5210-4f49-a1b6-865d15fca215}" # Default value if not set in environment

# Test blog posts based on sample blog data
declare -a blog_posts=(
  '{
    "title": "Top 10 Hidden Beaches in Cabo San Lucas",
    "content": "Cabo San Lucas is home to some of the most breathtaking beaches in the world. While many travelers flock to the popular spots like Medano Beach, there are hidden gems waiting to be discovered. Here are our top picks for secluded beaches that offer pristine beauty and tranquility.\n\n## 1. Santa Maria Beach\nKnown for its horseshoe-shaped bay, Santa Maria Beach offers excellent snorkeling opportunities in crystal-clear waters. The beach is protected status ensures its pristine condition.\n\n## 2. Chileno Beach\nA favorite among locals, Chileno Beach provides a perfect balance of accessibility and seclusion. The calm waters make it ideal for swimming and snorkeling.",
    "excerpt": "Discover secluded paradises away from the tourist crowds, where pristine sands meet crystal-clear waters.",
    "slug": "top-10-hidden-beaches-cabo",
    "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "category": "Local Guides",
    "tags": ["beaches", "hidden gems", "snorkeling", "swimming"],
    "publish": true
  }'
  
  '{
    "title": "Ultimate Guide to Luxury Yacht Charters",
    "content": "Experience the ultimate luxury on the waters of Cabo San Lucas with a private yacht charter. From selecting the perfect vessel to planning your itinerary, this guide covers everything you need to know.\n\n## Choosing Your Yacht\nThe first step in planning your yacht charter is selecting the right vessel. Cabo offers various options, from sleek sailing yachts to luxurious motor yachts. Consider factors like group size, duration of charter, desired amenities, and budget considerations.\n\n## Popular Routes\nMost yacht charters in Cabo follow these popular routes: Lover's Beach and the Arch, Santa Maria Bay, Chileno Bay, and Palmilla Point.",
    "excerpt": "Everything you need to know about planning the perfect yacht experience in Cabo's stunning waters.",
    "slug": "luxury-yacht-charters-guide",
    "image_url": "https://images.unsplash.com/photo-1605281317010-fe5ffe798166",
    "category": "Luxury Travel",
    "tags": ["yacht", "luxury", "charter", "sailing"],
    "publish": true
  }'
  
  '{
    "title": "Planning Your Dream Wedding in Cabo",
    "content": "Cabo San Lucas has become one of the most sought-after destinations for weddings, combining stunning natural beauty with world-class amenities. Let's explore how to plan your perfect wedding in paradise.\n\n## Why Choose Cabo?\n- Year-round perfect weather\n- Stunning beach and desert landscapes\n- Luxury venues and accommodations\n- Easy access from major cities\n- Professional wedding services\n\n## Best Wedding Venues\n### Beach Resorts\n- Luxury beachfront properties\n- All-inclusive packages\n- Professional wedding coordinators\n- Accommodation for guests",
    "excerpt": "From venue selection to local vendors, your complete guide to creating magical moments.",
    "slug": "planning-dream-wedding-cabo",
    "image_url": "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f",
    "category": "Weddings",
    "tags": ["wedding", "planning", "venues", "beach wedding"],
    "publish": true
  }'
  
  '{
    "title": "Best Cabo Restaurants with Ocean Views",
    "content": "Dining with a view makes every meal memorable, and Cabo San Lucas offers some of the most spectacular ocean-view restaurants in the world. From cliff-side establishments to beachfront venues, here are our top picks for combining culinary excellence with breathtaking scenery.\n\n## El Farallon\nPerched on the cliffs of the Pedregal, El Farallon offers a dining experience unlike any other. The restaurant features a daily catch display where you can select your seafood, which is then prepared to perfection by expert chefs. With waves crashing below and the vast Pacific Ocean stretching to the horizon, the ambiance is simply magical, especially at sunset.",
    "excerpt": "Discover the most stunning oceanfront dining experiences that combine incredible cuisine with breathtaking views.",
    "slug": "best-cabo-restaurants-ocean-views",
    "image_url": "https://images.unsplash.com/photo-1515443961218-a51367888e4b",
    "category": "Dining",
    "tags": ["restaurants", "dining", "ocean view", "sunset", "seafood"],
    "publish": true
  }'
  
  '{
    "title": "Family-Friendly Activities in Cabo San Lucas",
    "content": "Cabo San Lucas isn't just for couples and spring breakers—it's also a fantastic destination for families with children of all ages. From gentle beaches to exciting excursions, here's our guide to creating unforgettable family memories in Cabo.\n\n## Safe Swimming Beaches\nWhile many of Cabo's beaches have strong currents, there are several spots that are perfect for families with children. Medano Beach offers calm waters and a gradual slope, making it ideal for little ones. Chileno Beach and Santa Maria Beach also provide protected swimming areas with excellent snorkeling opportunities where children can discover colorful fish in shallow waters.",
    "excerpt": "Discover the best kid-friendly adventures, beaches, and attractions that the whole family will love.",
    "slug": "family-friendly-activities-cabo-san-lucas",
    "image_url": "https://images.unsplash.com/photo-1580541631976-fcc992c6375e",
    "category": "Family Travel",
    "tags": ["family", "kids", "activities", "beaches", "adventures"],
    "publish": true
  }'
)

echo "===== Testing AutoBlogger Webhook ====="
echo "API URL: $API_URL"
echo "Using webhook secret for authentication"
echo

# Function to send a blog post to the webhook
send_blog_post() {
  local post="$1"
  local response
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Signature: $WEBHOOK_SECRET" \
    -d "$post")
  
  local status_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')
  
  echo "Status code: $status_code"
  echo "Response: $body"
  echo
  
  if [[ "$status_code" == 2* ]]; then
    echo "✅ Blog post sent successfully"
  else
    echo "❌ Failed to send blog post"
  fi
  echo "-------------------------------------------"
}

# Send each blog post to the webhook
for post in "${blog_posts[@]}"; do
  echo "Sending blog post..."
  send_blog_post "$post"
  echo
  # Add a small delay between requests
  sleep 1
done

echo "===== AutoBlogger Webhook Testing Complete ====="