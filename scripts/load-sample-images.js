import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { db } from '../server/db.js';
import { siteImages } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

// Define sample images to load from attached_assets
const sampleImages = [
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'Villa_Chavez-2.jpg'),
    name: 'Villa Chavez',
    category: 'villa',
    alt_text: 'Luxurious Villa Chavez in Cabo San Lucas',
    description: 'A stunning villa with panoramic views of the ocean',
    tags: ['luxury', 'villa', 'ocean view'],
    featured: true
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'dream vacation cabo.JPG'),
    name: 'Dream Vacation Cabo',
    category: 'hero',
    alt_text: 'Dream vacation destination in Cabo San Lucas',
    description: 'Experience the ultimate dream vacation in Cabo',
    tags: ['dream', 'vacation', 'luxury'],
    featured: true
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'four seasons CDS.jpg'),
    name: 'Four Seasons Cabo Del Sol',
    category: 'resort',
    alt_text: 'Four Seasons Resort at Cabo Del Sol',
    description: 'Luxury resort with stunning beach access and amenities',
    tags: ['four seasons', 'resort', 'luxury'],
    featured: true
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'grand-velas-los-cabos.jpg'),
    name: 'Grand Velas Los Cabos',
    category: 'resort',
    alt_text: 'Grand Velas Resort in Los Cabos',
    description: 'All-inclusive luxury resort with spectacular ocean views',
    tags: ['grand velas', 'resort', 'all-inclusive'],
    featured: true
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'Katie.jpg'),
    name: 'Katie - Testimonial',
    category: 'testimonial',
    alt_text: 'Katie from New York, satisfied customer',
    description: 'Katie shares her amazing experience in Cabo',
    tags: ['testimonial', 'customer'],
    featured: false
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'Kylie.png'),
    name: 'Kylie - Testimonial',
    category: 'testimonial',
    alt_text: 'Kylie from California, happy traveler',
    description: 'Kylie talks about her family trip to Cabo',
    tags: ['testimonial', 'customer', 'family'],
    featured: false
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'Phil K.jpeg'),
    name: 'Phil K - Testimonial',
    category: 'testimonial',
    alt_text: 'Phil K, business traveler',
    description: 'Phil discusses his corporate retreat in Cabo',
    tags: ['testimonial', 'customer', 'business'],
    featured: false
  },
  {
    filepath: path.join(process.cwd(), 'attached_assets', 'joel.jpeg'),
    name: 'Joel - Testimonial',
    category: 'testimonial',
    alt_text: 'Joel, adventure seeker',
    description: 'Joel shares his adventure experiences in Cabo',
    tags: ['testimonial', 'customer', 'adventure'],
    featured: false
  }
];

// Load sample images
async function loadSampleImages() {
  console.log('Starting to load sample images...');

  // Make sure the uploads directory exists
  const uploadDir = path.join('public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const results = [];
  const errors = [];

  // Process each image
  for (const imageData of sampleImages) {
    try {
      // Check if file exists
      if (!fs.existsSync(imageData.filepath)) {
        console.error(`File not found: ${imageData.filepath}`);
        errors.push({ 
          name: imageData.name, 
          error: `File not found: ${imageData.filepath}` 
        });
        continue;
      }

      // Check if image with this name already exists
      const existingImages = await db
        .select()
        .from(siteImages)
        .where(sql`${siteImages.name} = ${imageData.name}`);

      if (existingImages.length > 0) {
        console.log(`Image "${imageData.name}" already exists, skipping`);
        continue;
      }

      // Generate safe filename
      const originalName = path.basename(imageData.filepath, path.extname(imageData.filepath));
      const safeFileName = originalName
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .replace(/-+/g, '-');

      const filename = `${safeFileName}-${Date.now()}`;
      const webpPath = path.join(uploadDir, `${filename}.webp`);

      console.log(`Processing image: ${imageData.name}`);

      // Process with sharp for conversion to WebP
      const imageInfo = await sharp(imageData.filepath)
        .webp({ quality: 85 })
        .toFile(webpPath);

      // Create relative URL
      const image_url = `/uploads/${filename}.webp`;

      // Insert into database
      const [image] = await db.insert(siteImages).values({
        name: imageData.name,
        image_file: `${filename}.webp`,
        image_url,
        alt_text: imageData.alt_text,
        description: imageData.description,
        category: imageData.category,
        width: imageInfo.width,
        height: imageInfo.height,
        tags: imageData.tags,
        featured: imageData.featured,
        created_at: new Date(),
        updated_at: new Date()
      }).returning();

      console.log(`Successfully added image: ${imageData.name}`);
      results.push(image);
    } catch (error) {
      console.error(`Error processing image ${imageData.name}:`, error);
      errors.push({ 
        name: imageData.name, 
        error: error?.message || 'Unknown error' 
      });
    }
  }

  console.log('Image loading complete!');
  console.log(`Successfully uploaded ${results.length} images`);
  if (errors.length > 0) {
    console.log(`Failed to upload ${errors.length} images`);
    console.log('Errors:', JSON.stringify(errors, null, 2));
  }
}

// Run the function
loadSampleImages()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });