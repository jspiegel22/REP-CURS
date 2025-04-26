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
    featured1: '/images/testimonials/testimonial-featured-1.jpg',
    featured2: '/images/testimonials/testimonial-featured-2.jpg',
    featured3: '/images/testimonials/testimonial-featured-3.jpg',
    // Specific testimonial people
    person1: '/images/testimonials/testimonial-person-1.jpg',
    person2: '/images/testimonials/testimonial-person-2.jpg',
    person3: '/images/testimonials/testimonial-person-3.jpg',
    person4: '/images/testimonials/testimonial-person-4.jpg',
    default: '/images/testimonials/testimonial-default.jpg',
  },
    
  hero: {
    main: '/images/hero/hero-featured-1.jpg',
    secondary: '/images/hero/hero-featured-2.jpg',
    mobile: '/images/hero/hero-featured-3.jpg',
    // Additional hero images
    beach: '/images/hero/hero-beach.jpg',
    sunset: '/images/hero/hero-sunset.jpg',
    aerial: '/images/hero/hero-aerial.jpg',
  },
  
  resort: {
    featured1: '/images/resorts/resort-featured-1.jpg',
    featured2: '/images/resorts/resort-featured-2.jpg',
    featured3: '/images/resorts/resort-featured-3.jpg',
    // Additional resort images
    pool: '/images/resorts/resort-pool.jpg',
    lobby: '/images/resorts/resort-lobby.jpg',
    spa: '/images/resorts/resort-spa.jpg',
    garden: '/images/resorts/resort-garden.jpg',
    exterior: '/images/resorts/resort-exterior.jpg',
  },
  
  villa: {
    featured1: '/images/villas/villa-featured-1.jpg',
    featured2: '/images/villas/villa-featured-2.jpg',
    featured3: '/images/villas/villa-featured-3.jpg',
    // Additional villa images
    living: '/images/villas/villa-living.jpg',
    bedroom: '/images/villas/villa-bedroom.jpg',
    kitchen: '/images/villas/villa-kitchen.jpg',
    pool: '/images/villas/villa-pool.jpg',
    exterior: '/images/villas/villa-exterior.jpg',
    view: '/images/villas/villa-view.jpg',
  },
  
  restaurant: {
    featured1: '/images/restaurants/restaurant-featured-1.jpg',
    featured2: '/images/restaurants/restaurant-featured-2.jpg',
    featured3: '/images/restaurants/restaurant-featured-3.jpg',
    // Additional restaurant images
    dining: '/images/restaurants/restaurant-dining.jpg',
    bar: '/images/restaurants/restaurant-bar.jpg',
    food: '/images/restaurants/restaurant-food.jpg',
    chef: '/images/restaurants/restaurant-chef.jpg',
    seafood: '/images/restaurants/restaurant-seafood.jpg',
  },
  
  activity: {
    featured1: '/images/activities/activity-featured-1.jpg',
    featured2: '/images/activities/activity-featured-2.jpg',
    featured3: '/images/activities/activity-featured-3.jpg',
    // Activity types
    fishing: '/images/activities/activity-fishing.jpg',
    snorkeling: '/images/activities/activity-snorkeling.jpg',
    sailing: '/images/activities/activity-sailing.jpg',
    atvs: '/images/activities/activity-atvs.jpg',
    hiking: '/images/activities/activity-hiking.jpg',
    surfing: '/images/activities/activity-surfing.jpg',
  },
  
  beach: {
    featured1: '/images/beaches/beach-featured-1.jpg',
    featured2: '/images/beaches/beach-featured-2.jpg',
    featured3: '/images/beaches/beach-featured-3.jpg',
    // Named beaches
    lovers: '/images/beaches/beach-lovers.jpg',
    medano: '/images/beaches/beach-medano.jpg',
    chileno: '/images/beaches/beach-chileno.jpg',
    santa: '/images/beaches/beach-santa-maria.jpg',
    divorce: '/images/beaches/beach-divorce.jpg',
  },
  
  wedding: {
    featured1: '/images/weddings/wedding-featured-1.jpg',
    featured2: '/images/weddings/wedding-featured-2.jpg',
    featured3: '/images/weddings/wedding-featured-3.jpg',
    // Wedding themes
    beach: '/images/weddings/wedding-beach.jpg',
    resort: '/images/weddings/wedding-resort.jpg',
    villa: '/images/weddings/wedding-villa.jpg',
    romantic: '/images/weddings/wedding-romantic.jpg',
    celebration: '/images/weddings/wedding-celebration.jpg',
  },
  
  yacht: {
    featured1: '/images/yachts/yacht-featured-1.jpg',
    featured2: '/images/yachts/yacht-featured-2.jpg',
    featured3: '/images/yachts/yacht-featured-3.jpg',
    // Yacht types
    luxury: '/images/yachts/yacht-luxury.jpg',
    sailing: '/images/yachts/yacht-sailing.jpg',
    catamaran: '/images/yachts/yacht-catamaran.jpg',
    party: '/images/yachts/yacht-party.jpg',
    charter: '/images/yachts/yacht-charter.jpg',
  },
  
  luxury: {
    featured1: '/images/luxury/luxury-featured-1.jpg',
    featured2: '/images/luxury/luxury-featured-2.jpg',
    featured3: '/images/luxury/luxury-featured-3.jpg',
    // Luxury experiences
    concierge: '/images/luxury/luxury-concierge.jpg',
    spa: '/images/luxury/luxury-spa.jpg',
    dining: '/images/luxury/luxury-dining.jpg',
    transport: '/images/luxury/luxury-transport.jpg',
    shopping: '/images/luxury/luxury-shopping.jpg',
  },
  
  family: {
    featured1: '/images/family/family-featured-1.jpg',
    featured2: '/images/family/family-featured-2.jpg',
    featured3: '/images/family/family-featured-3.jpg',
    // Family activities
    kids: '/images/family/family-kids.jpg',
    pool: '/images/family/family-pool.jpg',
    beach: '/images/family/family-beach.jpg',
    activities: '/images/family/family-activities.jpg',
    adventure: '/images/family/family-adventure.jpg',
  },
  
  blog: {
    featured1: '/images/blog/blog-featured-1.jpg',
    featured2: '/images/blog/blog-featured-2.jpg',
    featured3: '/images/blog/blog-featured-3.jpg',
    // Blog categories
    travel: '/images/blog/blog-travel.jpg',
    dining: '/images/blog/blog-dining.jpg',
    adventure: '/images/blog/blog-adventure.jpg',
    luxury: '/images/blog/blog-luxury.jpg',
    tips: '/images/blog/blog-tips.jpg',
    default: '/images/blog/blog-default.svg',
  },
};

// Fallback images for each category
const fallbackImages: Record<ImageCategory, string> = {
  hero: '/images/hero/hero-featured-1.jpg',
  resort: '/images/resorts/resort-featured-1.jpg',
  villa: '/images/villas/villa-featured-1.jpg',
  restaurant: '/images/restaurants/restaurant-featured-1.jpg',
  activity: '/images/activities/activity-featured-1.jpg',
  beach: '/images/beaches/beach-featured-1.jpg',
  wedding: '/images/weddings/wedding-featured-1.jpg',
  yacht: '/images/yachts/yacht-featured-1.jpg',
  luxury: '/images/luxury/luxury-featured-1.jpg',
  family: '/images/family/family-featured-1.jpg',
  blog: '/images/blog/blog-default.svg',
  testimonial: '/images/testimonials/testimonial-default.jpg',
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
 * Get a random featured image from a category
 */
export function getRandomImage(category: ImageCategory): string {
  const featuredKeys = ['featured1', 'featured2', 'featured3'];
  const randomIndex = Math.floor(Math.random() * featuredKeys.length);
  const key = featuredKeys[randomIndex] as keyof typeof images[typeof category];
  
  return images[category][key] as string || getFallbackImage(category);
}