import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../public/images/testimonials/actual');
const OUTPUT_DIR = path.join(__dirname, '../public/images/testimonials/webp');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function processImage(filename) {
  const inputPath = path.join(SOURCE_DIR, filename);
  const outputName = path.basename(filename, path.extname(filename)) + '.webp';
  const outputPath = path.join(OUTPUT_DIR, outputName);
  
  try {
    // Get image dimensions
    const metadata = await sharp(inputPath).metadata();
    const size = Math.min(metadata.width, metadata.height);
    
    // Center crop to square and extract circular mask
    await sharp(inputPath)
      // First, extract a square from the center
      .resize({
        width: size,
        height: size,
        fit: 'cover',
        position: 'center'
      })
      // Convert to WebP with good quality
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    console.log(`Successfully processed ${filename} to ${outputName}`);
    return outputName;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return null;
  }
}

async function main() {
  try {
    // Read all files from the source directory
    const files = fs.readdirSync(SOURCE_DIR);
    
    // Process each file
    const processedFiles = [];
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const result = await processImage(file);
        if (result) {
          processedFiles.push(result);
        }
      }
    }
    
    console.log(`Successfully processed ${processedFiles.length} images.`);
    console.log('Processed files:', processedFiles);
  } catch (error) {
    console.error('Error processing testimonial images:', error);
  }
}

main();