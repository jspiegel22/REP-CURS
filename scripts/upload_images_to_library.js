/**
 * Script to upload all website images in the attached_assets folder to the image library
 */
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing images
const imagesDir = path.resolve(__dirname, '../attached_assets');

// Supported image types
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG', '.WEBP', '.GIF'];

// Function to generate image name from filename
function generateName(filename) {
  // Remove extension and clean up name
  const baseName = path.basename(filename, path.extname(filename));
  
  // Replace underscores, hyphens with spaces, and capitalize words
  return baseName
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

// Function to generate alt text from filename
function generateAltText(filename) {
  const name = generateName(filename);
  return `${name} - Cabo San Lucas travel image`;
}

// Function to determine category from filename or path
function determineCategory(filePath, fileName) {
  const lowerFileName = fileName.toLowerCase();
  
  // Check for various categories
  if (lowerFileName.includes('villa') || lowerFileName.includes('house')) {
    return 'villa';
  } else if (lowerFileName.includes('hotel') || lowerFileName.includes('resort')) {
    return 'resort';
  } else if (lowerFileName.includes('beach') || lowerFileName.includes('ocean')) {
    return 'destinations';
  } else if (lowerFileName.includes('food') || lowerFileName.includes('restaurant')) {
    return 'restaurant';
  } else if (lowerFileName.includes('tour') || lowerFileName.includes('activity') || lowerFileName.includes('adventure')) {
    return 'adventure';
  } else {
    // Default category
    return 'general';
  }
}

// Function to upload a single image
async function uploadImage(filePath) {
  try {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName).toLowerCase();
    
    // Check if the file is an image
    if (!supportedExtensions.includes(fileExt)) {
      console.log(`Skipping ${fileName} - not a supported image format`);
      return { success: false, fileName, reason: 'Unsupported format' };
    }
    
    // Prepare form data
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('name', generateName(fileName));
    form.append('alt_text', generateAltText(fileName));
    form.append('category', determineCategory(filePath, fileName));
    form.append('tags', 'website,imported');
    
    // Send the request
    console.log(`Uploading ${fileName}...`);
    const response = await fetch('http://localhost:3000/api/images/upload', {
      method: 'POST',
      body: form,
    });
    
    // Handle response
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Successfully uploaded ${fileName}`);
      return { success: true, fileName, data };
    } else {
      const error = await response.text();
      console.error(`❌ Failed to upload ${fileName}: ${error}`);
      return { success: false, fileName, reason: error };
    }
  } catch (error) {
    console.error(`❌ Error uploading ${path.basename(filePath)}: ${error.message}`);
    return { success: false, fileName: path.basename(filePath), reason: error.message };
  }
}

// Main function to process all images
async function uploadAllImages() {
  console.log(`Scanning directory: ${imagesDir}`);
  
  try {
    // Read all files in the directory
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} image files to process`);
    
    // Results tracking
    const results = {
      total: imageFiles.length,
      successful: 0,
      failed: 0,
      details: []
    };
    
    // Process images sequentially to avoid overwhelming the server
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const result = await uploadImage(filePath);
      
      results.details.push(result);
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
      }
      
      // Short delay between uploads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Print summary
    console.log('\n===== Upload Summary =====');
    console.log(`Total images processed: ${results.total}`);
    console.log(`Successfully uploaded: ${results.successful}`);
    console.log(`Failed uploads: ${results.failed}`);
    
    // Write detailed results to a log file
    const logFile = path.join(__dirname, 'image_upload_results.json');
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`\nDetailed results written to: ${logFile}`);
    
  } catch (error) {
    console.error(`Error processing images: ${error.message}`);
  }
}

// Run the script
uploadAllImages().catch(console.error);