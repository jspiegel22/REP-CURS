/**
 * Image Processor Utility
 * 
 * This script helps process and organize images for the Cabo San Lucas website.
 * It automatically converts images to WebP format by default for better compression
 * and web performance.
 * 
 * Features:
 * - Resize images to appropriate dimensions
 * - Convert to WebP (or other formats) with optimized settings
 * - Rename files according to the website's naming convention
 * - Copy files to the correct directories
 * - Option to keep original files if needed
 * 
 * Usage:
 * node scripts/image-processor.js --source=/path/to/your/images --category=resort [options]
 * 
 * Options:
 * --source=PATH         Path to the directory containing images to process (required)
 * --category=NAME       Image category (required). One of: hero, resort, villa, restaurant, 
 *                       activity, beach, wedding, yacht, luxury, family, blog
 * --quality=NUMBER      Image quality (1-100, default: 85)
 * --format=FORMAT       Output format (webp, jpeg, png, avif, default: webp)
 * --keep-original       Keep original image files in addition to the processed versions
 * 
 * Example:
 * node scripts/image-processor.js --source=./my-photos --category=beach --quality=90 --format=webp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // You may need to install this: npm install sharp

// Get command line arguments
const args = process.argv.slice(2);
let sourceDir = '';
let category = '';
let quality = 85;  // Default quality
let format = 'webp'; // Default format
let keepOriginal = false; // Whether to keep original files

args.forEach(arg => {
  if (arg.startsWith('--source=')) {
    sourceDir = arg.split('=')[1];
  } else if (arg.startsWith('--category=')) {
    category = arg.split('=')[1];
  } else if (arg.startsWith('--quality=')) {
    const qualityValue = parseInt(arg.split('=')[1], 10);
    if (!isNaN(qualityValue) && qualityValue >= 1 && qualityValue <= 100) {
      quality = qualityValue;
    }
  } else if (arg.startsWith('--format=')) {
    const formatValue = arg.split('=')[1].toLowerCase();
    if (['webp', 'jpeg', 'png', 'avif'].includes(formatValue)) {
      format = formatValue;
    }
  } else if (arg === '--keep-original') {
    keepOriginal = true;
  }
});

// Validate inputs
if (!sourceDir || !category) {
  console.error('Error: Source directory and category are required');
  console.log('Usage: node scripts/image-processor.js --source=/path/to/your/images --category=resort [--quality=85] [--format=webp] [--keep-original]');
  process.exit(1);
}

// Define category directories mapping
const categoryDirs = {
  hero: 'hero',
  resort: 'resorts',
  villa: 'villas',
  restaurant: 'restaurants',
  activity: 'activities',
  beach: 'beaches',
  wedding: 'weddings',
  yacht: 'yachts',
  luxury: 'luxury',
  family: 'family',
  blog: 'blog'
};

// Check if category is valid
if (!Object.keys(categoryDirs).includes(category)) {
  console.error(`Error: Invalid category '${category}'`);
  console.log('Valid categories are:', Object.keys(categoryDirs).join(', '));
  process.exit(1);
}

// Define image dimensions based on category
const imageDimensions = {
  hero: { width: 1920, height: 1080 },
  resort: { width: 800, height: 600 },
  villa: { width: 800, height: 600 },
  restaurant: { width: 800, height: 600 },
  activity: { width: 800, height: 600 },
  beach: { width: 800, height: 600 },
  wedding: { width: 800, height: 600 },
  yacht: { width: 800, height: 600 },
  luxury: { width: 800, height: 600 },
  family: { width: 800, height: 600 },
  blog: { width: 1200, height: 675 }
};

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const targetDir = path.join(__dirname, '..', 'public', 'images', categoryDirs[category]);

// Make sure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Process images
async function processImages() {
  try {
    // Read source directory
    const files = fs.readdirSync(sourceDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.error('Error: No image files found in source directory');
      process.exit(1);
    }
    
    console.log(`Found ${imageFiles.length} images. Processing...`);
    
    // Process each image
    let index = 1;
    for (const file of imageFiles) {
      const sourcePath = path.join(sourceDir, file);
      
      // Use the selected format extension
      const formatExt = `.${format}`;
      
      // Generate target filename
      let targetFilename;
      if (index <= 3) {
        // For the first three images, use featured1, featured2, featured3
        targetFilename = `${category}-featured-${index}${formatExt}`;
      } else {
        // For other images, just use incremental numbers
        targetFilename = `${category}-${index}${formatExt}`;
      }
      
      const targetPath = path.join(targetDir, targetFilename);
      
      // Keep original if requested
      if (keepOriginal) {
        const originalFilename = `${category}-original-${index}${path.extname(file)}`;
        const originalTargetPath = path.join(targetDir, originalFilename);
        fs.copyFileSync(sourcePath, originalTargetPath);
        console.log(`Kept original: ${sourcePath} → ${originalTargetPath}`);
      }
      
      // Resize and optimize image
      const dimensions = imageDimensions[category];
      
      // Process image with sharp
      const sharpInstance = sharp(sourcePath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'center'
        });
      
      // Apply the correct format with options
      switch(format) {
        case 'webp':
          sharpInstance.webp({ 
            quality,
            lossless: false,
            effort: 5  // 0-6 range, higher means more compression effort
          });
          break;
        case 'jpeg':
          sharpInstance.jpeg({
            quality,
            progressive: true,
            optimizeCoding: true
          });
          break;
        case 'png':
          sharpInstance.png({
            quality,
            progressive: true,
            compressionLevel: 9, // 0-9, 9 is max compression
            palette: true // Use a palette of colors for lower sizes
          });
          break;
        case 'avif':
          sharpInstance.avif({
            quality,
            effort: 7, // 0-9, 9 is slowest but best compression
            chromaSubsampling: '4:2:0'
          });
          break;
      }
      
      // Save the processed image
      await sharpInstance.toFile(targetPath);
        
      console.log(`Processed and converted to ${format.toUpperCase()}: ${sourcePath} → ${targetPath}`);
      index++;
    }
    
    console.log('\nAll images processed successfully!');
    console.log(`Images saved to: ${targetDir}`);
    console.log('\nNext steps:');
    console.log('1. Check the processed images in the target directory');
    console.log('2. Update the image names in client/src/lib/imageMap.ts if needed');
    
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

// Run the script
processImages();