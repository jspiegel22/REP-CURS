/**
 * Image Optimization Script
 * 
 * This script processes images in the public directory, converting them to WebP format
 * and applying compression for optimal web performance.
 * 
 * Usage: node scripts/optimize-images.js
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get current directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const QUALITY = 80; // WebP quality (0-100)
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG', '.GIF'];

// Stats tracking
let stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSavings: 0
};

async function processImage(filePath) {
  try {
    const ext = path.extname(filePath);
    const extLower = ext.toLowerCase();
    
    // Skip if not an image we want to process
    if (!IMAGE_EXTENSIONS.map(e => e.toLowerCase()).includes(extLower)) {
      return;
    }
    
    // Skip if already a webp file
    if (extLower === '.webp') {
      console.log(`Skipping already optimized: ${filePath}`);
      stats.skipped++;
      return;
    }

    // Ensure we're creating a new file, not overwriting the original
    const outputPath = filePath.slice(0, -ext.length) + '.webp';
    
    // Skip if webp version already exists and is newer
    try {
      const [srcStat, destStat] = await Promise.all([
        fs.stat(filePath),
        fs.stat(outputPath).catch(() => null)
      ]);
      
      if (destStat && destStat.mtime > srcStat.mtime) {
        console.log(`Skipping (already optimized): ${path.relative(PUBLIC_DIR, filePath)}`);
        stats.skipped++;
        return;
      }
    } catch (err) {
      // If destination doesn't exist, we continue with conversion
    }

    // Get original file size
    const originalSize = (await fs.stat(filePath)).size;
    
    // Process the image
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    
    // Get optimized file size
    const optimizedSize = (await fs.stat(outputPath)).size;
    const savings = originalSize - optimizedSize;
    const savingsPercent = Math.round((savings / originalSize) * 100);
    
    stats.processed++;
    stats.totalSavings += savings;
    
    console.log(`Optimized: ${path.relative(PUBLIC_DIR, filePath)} → ${path.relative(PUBLIC_DIR, outputPath)} (${savingsPercent}% smaller)`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    stats.errors++;
  }
}

async function walkDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await walkDirectory(fullPath);
    } else if (entry.isFile()) {
      await processImage(fullPath);
    }
  }
}

async function main() {
  console.log('🖼️ Starting image optimization...');
  console.log(`📁 Processing images in: ${PUBLIC_DIR}`);
  console.log(`⚙️ Quality setting: ${QUALITY}%`);
  
  const startTime = Date.now();
  
  try {
    await walkDirectory(PUBLIC_DIR);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n📊 Optimization complete!');
    console.log(`✅ Processed: ${stats.processed} images`);
    console.log(`⏭️ Skipped: ${stats.skipped} images`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log(`💾 Total size reduction: ${(stats.totalSavings / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`⏱️ Time taken: ${duration} seconds`);
    
  } catch (error) {
    console.error('Failed to optimize images:', error);
    process.exit(1);
  }
}

main().catch(console.error);