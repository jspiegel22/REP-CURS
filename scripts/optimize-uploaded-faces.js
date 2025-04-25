/**
 * Script to optimize the actual uploaded face images and convert them to WebP format
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(process.cwd(), 'public', 'images', 'testimonials', 'originals');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'testimonials');

// Map of input files to output files with custom naming
const imageMap = [
  { input: 'IMG_0144.jpg', output: 'testimonial-1.webp' },
  { input: 'IMG_0145.jpg', output: 'testimonial-2.webp' },
  { input: 'Phil K.jpeg', output: 'testimonial-3.webp' },
  { input: 'joel.jpeg', output: 'testimonial-4.webp' }
];

async function optimizeImage(inputPath, outputPath) {
  try {
    // Resize to appropriate dimensions for avatars and convert to WebP
    await sharp(inputPath)
      .resize(100, 100, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log(`Optimized: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`  Size reduction: ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB (${savings}% savings)`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
}

async function processFiles() {
  try {
    console.log('Processing uploaded profile images...');
    
    for (const mapping of imageMap) {
      const inputPath = path.join(INPUT_DIR, mapping.input);
      const outputPath = path.join(OUTPUT_DIR, mapping.output);
      
      if (fs.existsSync(inputPath)) {
        await optimizeImage(inputPath, outputPath);
      } else {
        console.error(`Input file not found: ${inputPath}`);
      }
    }
    
    console.log('All images optimized successfully');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();