/**
 * Script to optimize testimonial face images and convert them to WebP format
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TESTIMONIAL_DIR = path.join(process.cwd(), 'public', 'images', 'testimonials');
const OUTPUT_DIR = TESTIMONIAL_DIR;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(filePath, outputPath) {
  try {
    // Resize to appropriate dimensions for avatars (100x100px is plenty for avatars)
    // Convert to WebP format for better compression
    await sharp(filePath)
      .resize(100, 100, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`Optimized: ${path.basename(filePath)} → ${path.basename(outputPath)}`);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(filePath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`  Size reduction: ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB (${savings}% savings)`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error);
  }
}

async function processFiles() {
  try {
    const files = fs.readdirSync(TESTIMONIAL_DIR);
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    for (const file of imageFiles) {
      const filePath = path.join(TESTIMONIAL_DIR, file);
      const fileName = path.basename(file, path.extname(file));
      const outputPath = path.join(OUTPUT_DIR, `${fileName}.webp`);
      
      await optimizeImage(filePath, outputPath);
    }
    
    console.log('All testimonial face images optimized successfully');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();