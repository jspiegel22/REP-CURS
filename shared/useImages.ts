import { useMemo } from 'react';

// Categories for images
export type ImageCategory = 
  | 'hero'
  | 'resort'
  | 'villa'
  | 'restaurant'
  | 'activity'
  | 'beach'
  | 'wedding'
  | 'yacht'
  | 'luxury'
  | 'family'
  | 'blog'
  | 'testimonial';

// Image data structure
export interface SiteImage {
  id: number;
  name: string;
  image_url: string;
  alt_text: string;
  description?: string;
  category: ImageCategory;
  tags?: string[];
  width?: number;
  height?: number;
  featured?: boolean;
}

// Initial set of images for the site
export const staticImages: SiteImage[] = [
  {
    id: 1,
    name: 'Four Seasons Cabo San Lucas',
    image_url: '/uploads/four-seasons-cds.webp',
    alt_text: 'Four Seasons luxury resort in Cabo San Lucas overlooking the beach with infinity pools',
    description: 'Stunning beachfront Four Seasons resort in Cabo San Lucas with private pools and ocean views',
    category: 'resort',
    tags: ['luxury', 'beachfront', 'pools', 'ocean view'],
    featured: true
  },
  {
    id: 2,
    name: 'Villa Chavez',
    image_url: '/uploads/villa-chavez.webp',
    alt_text: 'Modern luxury Villa Chavez with infinity pool in Cabo San Lucas at sunset',
    description: 'Exclusive luxury Villa Chavez featuring a stunning infinity pool, modern architecture, and mountain views in Cabo San Lucas',
    category: 'villa',
    tags: ['villa', 'luxury', 'pool', 'mountain view', 'private'],
    featured: true
  },
  {
    id: 3,
    name: 'Cabo Beach Sunset',
    image_url: '/uploads/cabo-beach-sunset.webp',
    alt_text: 'Beautiful sunset over a beach in Cabo San Lucas with dramatic sky colors',
    description: 'Dramatic sunset view over a pristine beach in Cabo San Lucas',
    category: 'beach',
    tags: ['sunset', 'beach', 'ocean'],
    featured: true
  },
  {
    id: 4,
    name: 'Luxury Villa with Ocean View',
    image_url: '/uploads/luxury-villa.webp',
    alt_text: 'Luxury villa with infinity pool overlooking the ocean in Cabo San Lucas',
    description: 'Private luxury villa with stunning infinity pool and panoramic ocean views',
    category: 'villa',
    tags: ['luxury', 'pool', 'ocean view', 'private'],
    featured: false
  },
  {
    id: 5,
    name: 'Cabo San Lucas Arch',
    image_url: '/uploads/cabo-arch.webp',
    alt_text: 'The famous Arch of Cabo San Lucas (El Arco) rock formation',
    description: 'The iconic El Arco (The Arch) natural rock formation at Land\'s End in Cabo San Lucas',
    category: 'activity',
    tags: ['landmark', 'natural wonder', 'tourist attraction'],
    featured: true
  }
];

// Helper function to get a single image
export function getImageByUrl(url: string): SiteImage | undefined {
  return staticImages.find(img => img.image_url === url);
}

// Helper function to get images by category
export function getImagesByCategory(category: ImageCategory): SiteImage[] {
  return staticImages.filter(img => img.category === category);
}

// Hook for accessing images by category
export function useImagesByCategory(category: ImageCategory) {
  return useMemo(() => {
    return getImagesByCategory(category);
  }, [category]);
}

// Helper function to get featured images
export function getFeaturedImages(): SiteImage[] {
  return staticImages.filter(img => img.featured);
}

// Helper function to get all images
export function getAllImages(): SiteImage[] {
  return staticImages;
}

// Hook for accessing all images
export function useAllImages() {
  return useMemo(() => {
    return getAllImages();
  }, []);
}