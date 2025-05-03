/**
 * Centralized Image Management System for Cabo San Lucas Website
 * 
 * This file provides a single source of truth for all images used throughout the website.
 * Benefits:
 * - Images can be easily replaced site-wide
 * - Consistent fallbacks for missing images
 * - Proper categorization for different image types
 * - Simple API for components to reference images
 */

// Define the categories of images used throughout the site
export type ImageCategory = 'hero' | 'resort' | 'villa' | 'restaurant' | 'activity' | 
                           'beach' | 'wedding' | 'yacht' | 'luxury' | 'family' | 'blog' | 'testimonial';
                           
// Array of categories for components to use for dropdown lists, etc.
export const IMAGE_CATEGORIES = [
  'hero', 'resort', 'villa', 'restaurant', 'activity', 
  'beach', 'wedding', 'yacht', 'luxury', 'family', 'blog', 'testimonial'
] as const;

// Map of all images by category
export const images = {
  testimonial: {
    featured1: '/images/testimonials/testimonial-1.webp',
    featured2: '/images/testimonials/testimonial-2.webp',
    featured3: '/images/testimonials/testimonial-3.webp',
    // Specific testimonial people
    person1: '/images/testimonials/face-2.webp',
    person2: '/images/testimonials/face-3.webp',
    person3: '/images/testimonials/face-4.webp',
    person4: '/images/testimonials/face-5.webp',
    default: '/images/testimonials/face-2.webp',
  },
    
  hero: {
    main: '/images/hero/hero-1.webp',
    secondary: '/images/hero/hero-2.webp',
    mobile: '/images/hero/hero-1.webp', // Fallback to hero-1
    // Additional hero images - using fallbacks since actual files don't exist
    beach: '/images/hero/hero-1.webp',
    sunset: '/images/hero/hero-2.webp',
    aerial: '/images/hero/hero-1.webp',
  },
  
  resort: {
    // Use villa images as fallbacks since resort images don't exist yet
    featured1: '/images/villas/villa-estrella-main.webp',
    featured2: '/images/villas/villa-estrella-living.webp',
    featured3: '/images/villas/villa-estrella-pool.webp',
    // Additional resort images - using fallbacks
    pool: '/images/villas/villa-estrella-pool.webp',
    lobby: '/images/villas/villa-estrella-living.webp',
    spa: '/images/villas/villa-estrella-bedroom.webp',
    garden: '/images/villas/villa-estrella-main.webp',
    exterior: '/images/villas/villa-estrella-main.webp',
  },
  
  villa: {
    featured1: '/images/villas/villa-estrella-main.webp',
    featured2: '/images/villas/villa-estrella-living.webp',
    featured3: '/images/villas/villa-estrella-pool.webp',
    // Additional villa images
    living: '/images/villas/villa-estrella-living.webp',
    bedroom: '/images/villas/villa-estrella-bedroom.webp',
    kitchen: '/images/villas/villa-estrella-kitchen.webp',
    pool: '/images/villas/villa-estrella-pool.webp',
    exterior: '/images/villas/villa-estrella-main.webp',
    view: '/images/villas/villa-estrella-pool.webp',
  },
  
  restaurant: {
    featured1: '/images/restaurants/restaurant-featured-1.webp',
    featured2: '/images/restaurants/restaurant-featured-2.webp',
    featured3: '/images/restaurants/restaurant-featured-3.webp',
    // Additional restaurant images
    dining: '/images/restaurants/restaurant-dining.webp',
    bar: '/images/restaurants/restaurant-bar.webp',
    food: '/images/restaurants/restaurant-food.webp',
    chef: '/images/restaurants/restaurant-chef.webp',
    seafood: '/images/restaurants/restaurant-seafood.webp',
  },
  
  activity: {
    featured1: '/images/activities/activity-featured-1.webp',
    featured2: '/images/activities/activity-featured-2.webp',
    featured3: '/images/activities/activity-featured-3.webp',
    // Activity types
    fishing: '/images/activities/activity-fishing.webp',
    snorkeling: '/images/activities/activity-snorkeling.webp',
    sailing: '/images/activities/activity-sailing.webp',
    atvs: '/images/activities/activity-atvs.webp',
    hiking: '/images/activities/activity-hiking.webp',
    surfing: '/images/activities/activity-surfing.webp',
  },
  
  beach: {
    featured1: '/images/beaches/beach-featured-1.webp',
    featured2: '/images/beaches/beach-featured-2.webp',
    featured3: '/images/beaches/beach-featured-3.webp',
    // Named beaches
    lovers: '/images/beaches/beach-lovers.webp',
    medano: '/images/beaches/beach-medano.webp',
    chileno: '/images/beaches/beach-chileno.webp',
    santa: '/images/beaches/beach-santa-maria.webp',
    divorce: '/images/beaches/beach-divorce.webp',
  },
  
  wedding: {
    featured1: '/images/weddings/wedding-featured-1.webp',
    featured2: '/images/weddings/wedding-featured-2.webp',
    featured3: '/images/weddings/wedding-featured-3.webp',
    // Wedding themes
    beach: '/images/weddings/wedding-beach.webp',
    resort: '/images/weddings/wedding-resort.webp',
    villa: '/images/weddings/wedding-villa.webp',
    romantic: '/images/weddings/wedding-romantic.webp',
    celebration: '/images/weddings/wedding-celebration.webp',
  },
  
  yacht: {
    featured1: '/images/yachts/yacht-featured-1.webp',
    featured2: '/images/yachts/yacht-featured-2.webp',
    featured3: '/images/yachts/yacht-featured-3.webp',
    // Yacht types
    luxury: '/images/yachts/yacht-luxury.webp',
    sailing: '/images/yachts/yacht-sailing.webp',
    catamaran: '/images/yachts/yacht-catamaran.webp',
    party: '/images/yachts/yacht-party.webp',
    charter: '/images/yachts/yacht-charter.webp',
  },
  
  luxury: {
    featured1: '/images/luxury/luxury-featured-1.webp',
    featured2: '/images/luxury/luxury-featured-2.webp',
    featured3: '/images/luxury/luxury-featured-3.webp',
    // Luxury experiences
    concierge: '/images/luxury/luxury-concierge.webp',
    spa: '/images/luxury/luxury-spa.webp',
    dining: '/images/luxury/luxury-dining.webp',
    transport: '/images/luxury/luxury-transport.webp',
    shopping: '/images/luxury/luxury-shopping.webp',
  },
  
  family: {
    featured1: '/images/family/family-featured-1.webp',
    featured2: '/images/family/family-featured-2.webp',
    featured3: '/images/family/family-featured-3.webp',
    // Family activities
    kids: '/images/family/family-kids.webp',
    pool: '/images/family/family-pool.webp',
    beach: '/images/family/family-beach.webp',
    activities: '/images/family/family-activities.webp',
    adventure: '/images/family/family-adventure.webp',
  },
  
  blog: {
    featured1: '/images/blog/blog-featured-1.webp',
    featured2: '/images/blog/blog-featured-2.webp',
    featured3: '/images/blog/blog-featured-3.webp',
    // Blog categories
    travel: '/images/blog/blog-travel.webp',
    dining: '/images/blog/blog-dining.webp',
    adventure: '/images/blog/blog-adventure.webp',
    luxury: '/images/blog/blog-luxury.webp',
    tips: '/images/blog/blog-tips.webp',
    default: '/images/blog/blog-default.svg', // SVG file stays the same
  },
};

// Fallback images for each category
const fallbackImages: Record<ImageCategory, string> = {
  hero: '/images/hero/hero-1.webp',
  resort: '/images/villas/villa-estrella-main.webp', // Use villa as fallback for resort
  villa: '/images/villas/villa-estrella-main.webp',
  restaurant: '/images/villas/villa-estrella-kitchen.webp', // Use villa kitchen as fallback
  activity: '/images/villas/villa-estrella-pool.webp', // Use villa pool as fallback
  beach: '/images/villas/villa-estrella-pool.webp', // Use villa pool as fallback
  wedding: '/images/villas/villa-estrella-living.webp', // Use villa living as fallback
  yacht: '/images/villas/villa-estrella-main.webp', // Use villa as fallback
  luxury: '/images/villas/villa-estrella-main.webp', // Use villa as fallback
  family: '/images/villas/villa-estrella-living.webp', // Use villa living as fallback
  blog: '/images/blog/blog-default.svg',
  testimonial: '/images/testimonials/face-2.webp',
};

/**
 * Get the fallback image for a specific category
 */
export function getFallbackImage(category: ImageCategory): string {
  return fallbackImages[category] || '/images/blog/blog-default.svg';
}

/**
 * Get the full URL for an image path
 */
export function getImageUrl(imagePath: string): string {
  // Handle external URLs
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Handle relative URLs
  return imagePath;
}

/**
 * Check if WebP is supported in the browser and use fallback if needed
 * This function is a utility for components to check WebP support
 */
export function getOptimalImageFormat(webpPath: string): string {
  // If the browser supports WebP, return the WebP path
  // Otherwise, convert to JPG path
  
  // For now, just return the WebP path since modern browsers support it
  // And we've already created both formats
  return webpPath;
  
  // Client-side WebP detection could be implemented like this:
  // if (webpSupported) {
  //   return webpPath;
  // } else {
  //   return webpPath.replace('.webp', '.jpg');
  // }
}

/**
 * Get a random featured image from a category
 */
export function getRandomImage(category: ImageCategory): string {
  const featuredKeys = ['featured1', 'featured2', 'featured3'];
  const randomIndex = Math.floor(Math.random() * featuredKeys.length);
  const key = featuredKeys[randomIndex] as keyof typeof images[typeof category];
  
  return images[category][key] as string || getFallbackImage(category);
}