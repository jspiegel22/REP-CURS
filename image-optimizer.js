/**
 * Image Optimizer Script
 * 
 * This script performs two main operations on all JPG images in the project:
 * 1. Compresses the JPG images to reduce file size while maintaining quality
 * 2. Creates WebP versions of each image for faster loading
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root image directory
const imagesDir = path.join(__dirname, 'public', 'images');

// Quality settings
const JPG_QUALITY = 80; // Quality for JPG compression (0-100)
const WEBP_QUALITY = 80; // Quality for WebP conversion (0-100)

// Function to process an image
async function processImage(imagePath) {
  try {
    console.log(`Processing: ${imagePath}`);
    
    // Get image info
    const imageInfo = await sharp(imagePath).metadata();
    const originalSize = fs.statSync(imagePath).size;
    
    // Compress JPG
    await sharp(imagePath)
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
      .toBuffer()
      .then(data => {
        fs.writeFileSync(imagePath, data);
        const newSize = fs.statSync(imagePath).size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
        console.log(`  Compressed JPG: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% savings)`);
      });
      
    // Create WebP version
    const webpPath = imagePath.replace(/\.jpg$/i, '.webp');
    await sharp(imagePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath)
      .then(info => {
        const webpSize = fs.statSync(webpPath).size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
        console.log(`  Created WebP: ${formatBytes(webpSize)} (${savings}% savings from original)`);
      });
      
    return {
      path: imagePath,
      originalSize,
      compressedSize: fs.statSync(imagePath).size,
      webpSize: fs.statSync(webpPath).size,
      webpPath
    };
  } catch (error) {
    console.error(`  Error processing ${imagePath}:`, error);
    return null;
  }
}

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Find all JPG images recursively
function findJpgImages(dir) {
  let results = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findJpgImages(itemPath));
    } else if (itemPath.toLowerCase().endsWith('.jpg')) {
      results.push(itemPath);
    }
  }
  
  return results;
}

// Main function
async function optimizeImages() {
  console.log('Starting image optimization...');
  
  // Find all JPG images
  const jpgImages = findJpgImages(imagesDir);
  console.log(`Found ${jpgImages.length} JPG images to process.`);
  
  // Process each image
  const results = [];
  
  for (const imagePath of jpgImages) {
    const result = await processImage(imagePath);
    if (result) {
      results.push(result);
    }
  }
  
  // Calculate overall savings
  const totalOriginalSize = results.reduce((sum, item) => sum + item.originalSize, 0);
  const totalCompressedSize = results.reduce((sum, item) => sum + item.compressedSize, 0);
  const totalWebpSize = results.reduce((sum, item) => sum + item.webpSize, 0);
  
  const jpgSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2);
  const webpSavings = ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(2);
  
  console.log('\nOptimization complete!');
  console.log(`Total images processed: ${results.length}`);
  console.log(`JPG Compression savings: ${formatBytes(totalOriginalSize - totalCompressedSize)} (${jpgSavings}%)`);
  console.log(`WebP Conversion savings: ${formatBytes(totalOriginalSize - totalWebpSize)} (${webpSavings}%)`);
}

// Run the optimization
optimizeImages();