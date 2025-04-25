/**
 * Script to register testimonial face images in the site_images database
 */
import { db } from '../server/db.ts';
import { siteImages } from '../shared/schema.ts';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TESTIMONIAL_DIR = path.join(process.cwd(), 'public', 'images', 'testimonials');

// Testimonial face image data
const testimonialImageData = [
  {
    name: 'Testimonial Face 1',
    slug: 'testimonial-face-1',
    image_file: 'face-2.webp',
    alt_text: 'Satisfied Cabo traveler',
    description: 'Customer testimonial photo for @cabo website',
    category: 'testimonial',
    width: 100,
    height: 100,
    tags: ['testimonial', 'avatar', 'customer'],
  },
  {
    name: 'Testimonial Face 2',
    slug: 'testimonial-face-2',
    image_file: 'face-3.webp',
    alt_text: 'Happy Cabo visitor',
    description: 'Customer testimonial photo for @cabo website',
    category: 'testimonial',
    width: 100,
    height: 100,
    tags: ['testimonial', 'avatar', 'customer'],
  },
  {
    name: 'Testimonial Face 3',
    slug: 'testimonial-face-3',
    image_file: 'face-4.webp',
    alt_text: 'Cabo vacation guest',
    description: 'Customer testimonial photo for @cabo website',
    category: 'testimonial',
    width: 100,
    height: 100,
    tags: ['testimonial', 'avatar', 'customer'],
  },
  {
    name: 'Testimonial Face 4',
    slug: 'testimonial-face-4',
    image_file: 'face-5.webp',
    alt_text: 'Cabo luxury traveler',
    description: 'Customer testimonial photo for @cabo website',
    category: 'testimonial',
    width: 100,
    height: 100,
    tags: ['testimonial', 'avatar', 'customer'],
  },
  {
    name: 'Testimonial Face 5',
    slug: 'testimonial-face-5',
    image_file: 'testimonial-2.webp',
    alt_text: 'Cabo experience review',
    description: 'Customer testimonial photo for @cabo website',
    category: 'testimonial',
    width: 100,
    height: 100,
    tags: ['testimonial', 'avatar', 'customer'],
  },
  {
    name: 'Testimonial Face 6',
    slug: 'testimonial-face-6',
    image_file: 'testimonial-3.webp',
    alt_text: 'Cabo travel enthusiast',
    description: 'Customer testimonial photo for @cabo website',
    category: 'testimonial',
    width: 100,
    height: 100,
    tags: ['testimonial', 'avatar', 'customer'],
  },
];

async function registerTestimonialImages() {
  try {
    console.log('Registering testimonial face images in the database...');

    for (const imageData of testimonialImageData) {
      // Check if image with same slug already exists
      const existingImages = await db.select().from(siteImages).where(eq(siteImages.slug, imageData.slug));
      
      if (existingImages.length > 0) {
        console.log(`Image ${imageData.name} already exists, skipping.`);
        continue;
      }

      // Construct image URL from file path
      const imageUrl = `/images/testimonials/${imageData.image_file}`;

      // Insert image data into database
      const result = await db.insert(siteImages).values({
        name: imageData.name,
        slug: imageData.slug,
        image_file: imageData.image_file,
        image_url: imageUrl,
        alt_text: imageData.alt_text,
        description: imageData.description,
        category: imageData.category,
        width: imageData.width,
        height: imageData.height,
        tags: imageData.tags,
        created_at: new Date(),
        updated_at: new Date(),
      });

      console.log(`Registered image: ${imageData.name}`);
    }

    console.log('All testimonial face images registered successfully!');
  } catch (error) {
    console.error('Error registering testimonial images:', error);
  } finally {
    process.exit(0);
  }
}

// Run the function
registerTestimonialImages();