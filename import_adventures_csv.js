// Import Adventures CSV file and upload adventure data to CMS
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

// Configuration
const CSV_FILE = 'attached_assets/full list.csv';
// Use the in-process server running on port 3000
const API_ENDPOINT = 'http://localhost:3000/api/adventures';
const LOGIN_ENDPOINT = 'http://localhost:3000/api/login';

// In Replit, save to a JSON file instead of direct API upload if the server is not running
const OUTPUT_JSON = 'adventures_output.json';

// Helper function to extract data from the adventure CSV format
function extractDataFromAdventureCSV(row) {
  // Extract adventure name and URL
  const url = row[0];
  const imageUrl = row[1];
  const title = row[2];
  
  // Extract prices
  const currentPrice = row[3];
  const originalPrice = row[4] || currentPrice;
  const discount = row[5] || null;
  
  // Extract duration and age requirements
  const duration = row[6];
  const minAge = row[8];
  
  // Generate a slug from the title
  const slug = generateSlug(title);
  
  // Determine category based on the title/description
  const category = determineCategory(title, url);
  
  // Create a description based on title, price, and duration
  const description = generateDescription(title, currentPrice, duration, minAge);
  
  // Generate a random rating between 4.2 and 5.0
  const rating = generateRating();
  
  // Create key features based on adventure type
  const keyFeatures = generateKeyFeatures(title, category);
  
  // Create things to bring based on adventure type
  const thingsToBring = generateThingsToBring(category);
  
  // Get adventure provider
  const provider = "Cabo Adventures";
  
  // Determine if this is a top recommended adventure
  const topRecommended = isTopRecommended(title, originalPrice);
  
  // Create the adventure object
  return {
    title,
    slug,
    description,
    currentPrice,
    originalPrice,
    discount,
    duration,
    imageUrl,
    imageUrls: [imageUrl],
    minAge,
    provider,
    category,
    keyFeatures,
    thingsToBring,
    topRecommended,
    rating,
    featured: topRecommended
  };
}

// Helper function to generate a slug from the title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
    .trim();
}

// Helper function to determine the category based on the title/URL
function determineCategory(title, url) {
  const titleLower = title.toLowerCase();
  
  // Check for yacht/boat related terms
  if (titleLower.includes('yacht') || titleLower.includes('sail') || 
      titleLower.includes('boat') || titleLower.includes('catamaran')) {
    return 'yacht';
  }
  
  // Check for water activities
  if (titleLower.includes('snorkel') || titleLower.includes('dive') || 
      titleLower.includes('dolphin') || titleLower.includes('whale') || 
      titleLower.includes('swim') || titleLower.includes('water') ||
      titleLower.includes('shark') || titleLower.includes('jet ski')) {
    return 'water';
  }
  
  // Check for luxury activities
  if (titleLower.includes('luxury') || titleLower.includes('private') || 
      titleLower.includes('premium') || titleLower.includes('art & wine')) {
    return 'luxury';
  }
  
  // Check for family activities
  if (titleLower.includes('family') || titleLower.includes('kids') ||
      url.includes('family')) {
    return 'family';
  }
  
  // Default to land activities
  return 'land';
}

// Helper function to generate a description based on title and details
function generateDescription(title, price, duration, minAge) {
  try {
    let description = `Experience ${title} in Cabo San Lucas. `;
    
    if (duration && typeof duration === 'string') {
      description += `This ${duration.toLowerCase()} adventure `;
    } else {
      description += `This amazing adventure `;
    }
    
    if (price && typeof price === 'string') {
      description += `costs ${price} `;
    }
    
    if (minAge && typeof minAge === 'string') {
      description += `and is suitable for visitors ${minAge.toLowerCase()}. `;
    } else {
      description += `for all ages. `;
    }
    
    description += `Enjoy this exciting activity and create unforgettable memories in Cabo San Lucas.`;
    return description;
  } catch (error) {
    console.error(`Error generating description for ${title}:`, error);
    return `Experience ${title} in Cabo San Lucas. Enjoy this exciting activity and create unforgettable memories in Cabo.`;
  }
}

// Helper function to generate a random rating between 4.2 and 5.0
function generateRating() {
  return (Math.random() * 0.8 + 4.2).toFixed(1);
}

// Helper function to generate key features based on adventure type
function generateKeyFeatures(title, category) {
  const titleLower = title.toLowerCase();
  const features = [];
  
  // Add category-specific features
  if (category === 'water') {
    features.push('Professional Safety Equipment Provided');
    features.push('Experienced Marine Guides');
  } else if (category === 'yacht') {
    features.push('Premium Vessel');
    features.push('Refreshments Included');
    features.push('Spectacular Ocean Views');
  } else if (category === 'luxury') {
    features.push('VIP Experience');
    features.push('Small Groups Only');
    features.push('Premium Service');
  } else if (category === 'family') {
    features.push('Kid-Friendly');
    features.push('All Ages Welcome');
    features.push('Family Discounts Available');
  } else {
    features.push('Expert Local Guides');
    features.push('Transportation Included');
  }
  
  // Add activity-specific features
  if (titleLower.includes('dolphin')) {
    features.push('Interaction with Dolphins');
  } else if (titleLower.includes('whale')) {
    features.push('Whale Sightings Guaranteed*');
  } else if (titleLower.includes('atv') || titleLower.includes('utv')) {
    features.push('Off-Road Adventure');
    features.push('Rugged Desert Terrain');
  } else if (titleLower.includes('snorkel')) {
    features.push('Pristine Snorkeling Locations');
    features.push('Marine Life Viewing');
  } else if (titleLower.includes('camel')) {
    features.push('Camel Ride Experience');
  } else if (titleLower.includes('bike')) {
    features.push('Premium Bike Equipment');
    features.push('Scenic Routes');
  }
  
  return features.slice(0, 4); // Return up to 4 features
}

// Helper function to generate things to bring based on category
function generateThingsToBring(category) {
  const items = [
    'Comfortable Clothing',
    'Sunscreen',
    'Hat or Cap',
    'Sunglasses',
    'Camera',
    'Valid ID'
  ];
  
  // Add category-specific items
  if (category === 'water') {
    items.push('Swimwear');
    items.push('Towel');
    items.push('Change of Clothes');
  } else if (category === 'yacht') {
    items.push('Light Jacket');
    items.push('Non-marking Shoes');
  } else if (category === 'land') {
    items.push('Closed-toe Shoes');
    items.push('Light Jacket');
  }
  
  return items.slice(0, 5); // Return up to 5 items
}

// Helper function to determine if an adventure should be top recommended
function isTopRecommended(title, price) {
  const titleLower = title.toLowerCase();
  
  // Check for popular/iconic adventures
  if (titleLower.includes('luxury') || 
      titleLower.includes('whale shark') ||
      titleLower.includes('private') ||
      titleLower.includes('cabo pulmo') ||
      titleLower.includes('dolphin trainer')) {
    return true;
  }
  
  return false;
}

// Process the CSV file
async function processCSVFile(filePath, authCookie) {
  console.log(`Processing ${filePath}...`);
  
  try {
    // Read and parse the CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = parse(fileContent, {
      skip_empty_lines: true
    });
    
    // Skip header row
    const dataRows = records.slice(1);
    const adventures = [];
    let skippedCount = 0;
    let errorCount = 0;
    
    console.log(`Total rows in CSV: ${dataRows.length}`);
    
    // Process each row
    for (const row of dataRows) {
      if (row.length < 5) {
        console.warn(`Skipping incomplete row: ${row.join(' | ')}`);
        skippedCount++;
        continue; // Skip incomplete rows
      }
      
      try {
        // Validate that we have the essential data
        if (!row[0] || !row[2] || !row[3] || !row[6]) {
          console.warn(`Skipping row with missing essential data: ${row[2] || 'unknown title'}`);
          skippedCount++;
          continue;
        }
        
        const adventure = extractDataFromAdventureCSV(row);
        adventures.push(adventure);
        console.log(`Successfully processed: ${adventure.title}`);
      } catch (err) {
        errorCount++;
        console.error(`Error processing row: ${row[2] || 'unknown row'}`, err.message);
      }
    }
    
    console.log(`Extracted ${adventures.length} adventures from ${filePath}`);
    console.log(`Skipped ${skippedCount} rows, Errors: ${errorCount}`);
    
    return adventures;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    return [];
  }
}

// Login to get auth cookie
async function login() {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'jefe',
        password: 'instacabo'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    
    return response.headers.get('set-cookie');
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Import adventures to the server
async function importAdventures(adventures, authCookie) {
  console.log(`Importing ${adventures.length} adventures to server...`);
  
  let createdCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const adventure of adventures) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authCookie
        },
        body: JSON.stringify(adventure)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`Created adventure: ${result.title} (ID: ${result.id})`);
        createdCount++;
      } else if (response.status === 400 && response.statusText.includes('already exists')) {
        console.log(`Adventure already exists: ${adventure.title}, updating...`);
        // Try to update instead
        const updateResponse = await fetch(`${API_ENDPOINT}/${adventure.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': authCookie
          },
          body: JSON.stringify(adventure)
        });
        
        if (updateResponse.ok) {
          updatedCount++;
          console.log(`Updated adventure: ${adventure.title}`);
        } else {
          errorCount++;
          console.error(`Error updating adventure ${adventure.title}: ${updateResponse.status} ${updateResponse.statusText}`);
        }
      } else {
        errorCount++;
        console.error(`Error creating adventure ${adventure.title}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing adventure ${adventure.title}:`, error);
    }
  }
  
  console.log(`Import summary: Created ${createdCount}, Updated ${updatedCount}, Errors ${errorCount}`);
  return { createdCount, updatedCount, errorCount };
}

// Save adventures to a JSON file
function saveAdventuresToFile(adventures) {
  try {
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(adventures, null, 2));
    console.log(`Saved ${adventures.length} adventures to ${OUTPUT_JSON}`);
    return true;
  } catch (error) {
    console.error(`Error saving to ${OUTPUT_JSON}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting adventure import process...');
    
    // Process the CSV file
    const adventures = await processCSVFile(CSV_FILE);
    
    if (adventures.length === 0) {
      console.error('No adventures extracted from CSV file.');
      process.exit(1);
    }
    
    console.log(`Successfully extracted ${adventures.length} adventures from CSV file.`);
    
    // Try to upload to server
    console.log('Attempting to upload to server...');
    const authCookie = await login();
    
    if (authCookie) {
      await importAdventures(adventures, authCookie);
    } else {
      console.warn('Could not authenticate with the server. Saving to JSON file instead.');
      saveAdventuresToFile(adventures);
    }
    
    console.log('Adventure import process completed.');
  } catch (error) {
    console.error('Fatal error in import process:', error);
    process.exit(1);
  }
}

// Run the main function
main();