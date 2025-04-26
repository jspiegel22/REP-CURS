import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage() {
  try {
    const inputPath = path.join(__dirname, '../attached_assets/dream vacation cabo.JPG');
    const outputPath = path.join(__dirname, '../public/uploads/dream-vacation-cabo.webp');
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Process the image
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    console.log('Dream vacation image processed successfully!');
    console.log('Saved to:', outputPath);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();