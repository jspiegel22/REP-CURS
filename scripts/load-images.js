/**
 * Image Loader Script
 * 
 * This script helps load the initial images from the attached_assets folder
 * into the database for testing and development.
 * It uses the Express API endpoint /api/images/upload directly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define image mappings
const imageMap = [
  {
    filepath: 'attached_assets/Villa_Chavez-2.jpg',
    name: 'Villa Chavez',
    category: 'villa',
    alt_text: 'Luxurious Villa Chavez in Cabo San Lucas',
    description: 'A stunning villa with panoramic views of the ocean',
    tags: ['luxury', 'villa', 'ocean view'],
    featured: true
  },
  {
    filepath: 'attached_assets/dream vacation cabo.JPG',
    name: 'Dream Vacation Cabo',
    category: 'hero',
    alt_text: 'Dream vacation destination in Cabo San Lucas',
    description: 'Experience the ultimate dream vacation in Cabo',
    tags: ['dream', 'vacation', 'luxury'],
    featured: true
  },
  {
    filepath: 'attached_assets/four seasons CDS.jpg',
    name: 'Four Seasons Cabo Del Sol',
    category: 'resort',
    alt_text: 'Four Seasons Resort at Cabo Del Sol',
    description: 'Luxury resort with stunning beach access and amenities',
    tags: ['four seasons', 'resort', 'luxury'],
    featured: true
  },
  {
    filepath: 'attached_assets/grand-velas-los-cabos.jpg',
    name: 'Grand Velas Los Cabos',
    category: 'resort',
    alt_text: 'Grand Velas Resort in Los Cabos',
    description: 'All-inclusive luxury resort with spectacular ocean views',
    tags: ['grand velas', 'resort', 'all-inclusive'],
    featured: true
  },
  {
    filepath: 'attached_assets/Katie.jpg',
    name: 'Katie - Testimonial',
    category: 'testimonial',
    alt_text: 'Katie from New York, satisfied customer',
    description: 'Katie shares her amazing experience in Cabo',
    tags: ['testimonial', 'customer'],
    featured: false
  },
  {
    filepath: 'attached_assets/Kylie.png',
    name: 'Kylie - Testimonial',
    category: 'testimonial',
    alt_text: 'Kylie from California, happy traveler',
    description: 'Kylie talks about her family trip to Cabo',
    tags: ['testimonial', 'customer', 'family'],
    featured: false
  },
  {
    filepath: 'attached_assets/Phil K.jpeg',
    name: 'Phil K - Testimonial',
    category: 'testimonial',
    alt_text: 'Phil K, business traveler',
    description: 'Phil discusses his corporate retreat in Cabo',
    tags: ['testimonial', 'customer', 'business'],
    featured: false
  },
  {
    filepath: 'attached_assets/joel.jpeg',
    name: 'Joel - Testimonial',
    category: 'testimonial',
    alt_text: 'Joel, adventure seeker',
    description: 'Joel shares his adventure experiences in Cabo',
    tags: ['testimonial', 'customer', 'adventure'],
    featured: false
  }
];

// Process and load each image
async function loadImages() {
  console.log('Starting to load images...');
  
  // Use localhost for API calls since we're running in Replit
  const API_URL = 'http://localhost:3000';
  
  console.log(`Using API URL: ${API_URL}`);
  
  // First check if images endpoint is available
  try {
    const response = await fetch(`${API_URL}/api/images`);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    console.log('Image API is available, proceeding with uploads');
  } catch (error) {
    console.error('Error connecting to the image API:', error.message);
    console.error('Make sure the server is running before executing this script');
    return;
  }
  
  for (const imageData of imageMap) {
    try {
      // Check if file exists
      if (!fs.existsSync(imageData.filepath)) {
        console.error(`File not found: ${imageData.filepath}`);
        continue;
      }
      
      // Check if image with this name already exists
      const checkResponse = await fetch(`${API_URL}/api/images?search=${encodeURIComponent(imageData.name)}`);
      const existingImages = await checkResponse.json();
      
      if (existingImages && existingImages.length > 0 && existingImages.some(img => img.name === imageData.name)) {
        console.log(`Image "${imageData.name}" already exists, skipping`);
        continue;
      }
      
      // Create form data for upload
      const form = new FormData();
      form.append('file', fs.createReadStream(imageData.filepath));
      form.append('name', imageData.name);
      form.append('alt_text', imageData.alt_text);
      form.append('description', imageData.description);
      form.append('category', imageData.category);
      form.append('tags', imageData.tags.join(','));
      form.append('featured', imageData.featured ? 'true' : 'false');
      
      // Upload the image
      const uploadResponse = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        body: form
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      }
      
      const result = await uploadResponse.json();
      console.log(`Successfully uploaded image: ${result.name}`);
    } catch (error) {
      console.error(`Error processing image ${imageData.filepath}:`, error.message);
    }
  }
  
  console.log('Image loading complete!');
}

// Execute the loading function
loadImages()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });