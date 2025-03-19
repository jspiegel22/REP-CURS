import { Blog } from "@/types/blog";

export const sampleBlogs: Blog[] = [
  {
    id: 1,
    title: "Top 10 Hidden Beaches in Cabo San Lucas",
    slug: "top-10-hidden-beaches-cabo",
    excerpt: "Discover secluded paradises away from the tourist crowds, where pristine sands meet crystal-clear waters.",
    content: `
      Cabo San Lucas is home to some of the most breathtaking beaches in the world. While many travelers flock to the popular spots like Medano Beach, there are hidden gems waiting to be discovered. Here are our top picks for secluded beaches that offer pristine beauty and tranquility.

      ## 1. Santa Maria Beach
      Known for its horseshoe-shaped bay, Santa Maria Beach offers excellent snorkeling opportunities in crystal-clear waters. The beach's protected status ensures its pristine condition.

      ## 2. Chileno Beach
      A favorite among locals, Chileno Beach provides a perfect balance of accessibility and seclusion. The calm waters make it ideal for swimming and snorkeling.

      ## Best Time to Visit
      The best time to visit these hidden beaches is during the early morning hours when the temperatures are mild and the crowds are thin. This is also when you'll catch the most spectacular sunrises over the Sea of Cortez.

      ## Essential Tips
      - Bring plenty of water and sunscreen
      - Pack snorkeling gear
      - Check tide schedules before visiting
      - Consider hiring a local guide
    `,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    author: "Isabella",
    date: "2025-03-15",
    category: "Local Guides",
    readTime: "5 min read",
    ctaType: "beachGuide"
  },
  {
    id: 2,
    title: "Ultimate Guide to Luxury Yacht Charters",
    slug: "luxury-yacht-charters-guide",
    excerpt: "Everything you need to know about planning the perfect yacht experience in Cabo's stunning waters.",
    content: `
      Experience the ultimate luxury on the waters of Cabo San Lucas with a private yacht charter. From selecting the perfect vessel to planning your itinerary, this guide covers everything you need to know.

      ## Choosing Your Yacht
      The first step in planning your yacht charter is selecting the right vessel. Cabo offers various options, from sleek sailing yachts to luxurious motor yachts. Consider factors like:
      - Group size
      - Duration of charter
      - Desired amenities
      - Budget considerations

      ## Popular Routes
      Most yacht charters in Cabo follow these popular routes:
      - Lover's Beach and the Arch
      - Santa Maria Bay
      - Chileno Bay
      - Palmilla Point

      ## What to Expect
      A typical day on a luxury yacht charter includes:
      - Gourmet catering
      - Professional crew service
      - Water sports equipment
      - Stunning photo opportunities

      ## Booking Tips
      - Book at least 3 months in advance for peak seasons
      - Consider shoulder seasons for better rates
      - Ask about included amenities
      - Review the crew's experience
    `,
    imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166",
    author: "Isabella",
    date: "2025-03-12",
    category: "Luxury Travel",
    readTime: "7 min read",
    ctaType: "luxuryGuide"
  },
  {
    id: 3,
    title: "Planning Your Dream Wedding in Cabo",
    slug: "planning-dream-wedding-cabo",
    excerpt: "From venue selection to local vendors, your complete guide to creating magical moments.",
    content: `
      Cabo San Lucas has become one of the most sought-after destinations for weddings, combining stunning natural beauty with world-class amenities. Let's explore how to plan your perfect wedding in paradise.

      ## Why Choose Cabo?
      - Year-round perfect weather
      - Stunning beach and desert landscapes
      - Luxury venues and accommodations
      - Easy access from major cities
      - Professional wedding services

      ## Best Wedding Venues
      ### Beach Resorts
      - Luxury beachfront properties
      - All-inclusive packages
      - Professional wedding coordinators
      - Accommodation for guests

      ### Private Villas
      - Intimate settings
      - Customizable spaces
      - Privacy for your celebration
      - Unique photo opportunities

      ## Planning Timeline
      12 Months Before:
      - Choose your date
      - Book your venue
      - Select key vendors

      6 Months Before:
      - Send invitations
      - Plan activities
      - Finalize menu
    `,
    imageUrl: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f",
    author: "Isabella",
    date: "2025-03-10",
    category: "Weddings",
    readTime: "8 min read",
    ctaType: "weddingGuide"
  }
];

// Category-specific CTAs
export const categoryCtAs = {
  "Local Guides": {
    title: "Download Our Complete Beach Guide",
    description: "Get our insider's guide to all of Cabo's hidden beaches, including maps and best times to visit.",
    buttonText: "Get Free Beach Guide",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  "Luxury Travel": {
    title: "Luxury Experience Guide",
    description: "Download our exclusive guide to Cabo's most luxurious experiences and VIP services.",
    buttonText: "Get VIP Guide",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
  },
  "Weddings": {
    title: "Wedding Planning Checklist",
    description: "Get our comprehensive Cabo wedding planning checklist and vendor guide.",
    buttonText: "Get Wedding Guide",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f"
  }
};