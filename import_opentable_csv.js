// Import OpenTable CSV files and upload restaurant data to CMS
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

// Configuration
const CSV_FILES = [
  'attached_assets/opentable-2025-03-12.csv',
  'attached_assets/opentable-2025-03-12 (1).csv',
  'attached_assets/opentable-2025-03-12 (2).csv',
  'attached_assets/opentable-2025-03-12 (3).csv'
];
// For Replit environment, we'll use the internal API endpoints
const API_ENDPOINT = process.env.REPL_URL ? `${process.env.REPL_URL}/api/restaurants` : 'http://localhost:3000/api/restaurants';
const LOGIN_ENDPOINT = process.env.REPL_URL ? `${process.env.REPL_URL}/api/login` : 'http://localhost:3000/api/login';
const IMPORT_ENDPOINT = process.env.REPL_URL ? `${process.env.REPL_URL}/api/restaurants/import` : 'http://localhost:3000/api/restaurants/import';

// In Replit, save to a JSON file instead of direct API upload if the server is not running
const OUTPUT_JSON = 'restaurants_output.json';

// Helper function to extract data from OpenTable format
function extractDataFromOpenTable(row) {
  // Extract restaurant name (format: "1. Restaurant Name")
  const nameMatch = row[2]?.match(/^\d+\.\s(.+)$/);
  const name = nameMatch ? nameMatch[1].trim() : row[2];
  
  // Extract rating (e.g., "Exceptional", "Awesome", etc.)
  const rating = row[3];
  
  // Extract number of reviews from format like "(123)"
  const reviewCountMatch = row[6]?.match(/\((\d+)\)/);
  const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;
  
  // Extract price range from format like "Price: Very Expensive"
  const priceRangeMatch = row[7]?.match(/Price:\s(.+)/);
  let priceLevel = "$$$";
  if (priceRangeMatch) {
    const priceText = priceRangeMatch[1].toLowerCase();
    if (priceText.includes("very expensive")) {
      priceLevel = "$$$$";
    } else if (priceText.includes("expensive")) {
      priceLevel = "$$$";
    } else if (priceText.includes("moderate")) {
      priceLevel = "$$";
    } else if (priceText.includes("casual")) {
      priceLevel = "$";
    }
  }
  
  // Extract cuisine and location from format like "• Seafood • Cabo San Lucas"
  const cuisineLocationMatch = row[8]?.match(/•\s(.+?)\s•\s(.+)$/);
  const cuisine = cuisineLocationMatch ? cuisineLocationMatch[1].trim() : 'International';
  const location = cuisineLocationMatch ? cuisineLocationMatch[2].trim() : 'Cabo San Lucas';
  
  // Get OpenTable URL and image URL
  const openTableUrl = row[0];
  const imageUrl = row[1];
  
  // Map cuisine to a category
  const category = mapCuisineToCategory(cuisine);
  
  // Create a brief description
  const description = `${name} offers ${cuisine.toLowerCase()} cuisine in a ${rating.toLowerCase()} setting in ${location}.`;
  
  // Get the daily booking count if available, format like "Booked 32 times today"
  const bookingsMatch = row[9]?.match(/Booked\s(\d+)/);
  const bookingsToday = bookingsMatch ? parseInt(bookingsMatch[1]) : Math.floor(Math.random() * 30);
  
  // Map rating text to numeric value
  const ratingValue = mapRatingToValue(rating);
  
  // Common features based on price level
  let features = [];
  if (priceLevel === "$$$$") {
    features = ['Fine Dining', 'Ocean View', 'Upscale', 'Reservations Recommended'];
  } else if (priceLevel === "$$$") {
    features = ['Casual Elegant', 'Full Bar', 'Patio Dining'];
  } else {
    features = ['Casual Dining', 'Family Friendly'];
  }
  
  // Create the restaurant object
  return {
    name,
    description,
    location,
    cuisine,
    priceLevel,
    rating: ratingValue,
    reviewCount,
    openTable: openTableUrl,
    imageUrl: ensureValidImageUrl(imageUrl),
    imageUrls: [ensureValidImageUrl(imageUrl)],
    features: features.slice(0, Math.min(features.length, 3)),
    tags: [cuisine],
    category,
    featured: reviewCount > 500 || ratingValue > 4.7
  };
}

// Helper to map cuisine to category
function mapCuisineToCategory(cuisine) {
  const cuisineMap = {
    'Mexican': 'mexican',
    'Seafood': 'seafood',
    'Japanese': 'japanese',
    'Italian': 'italian',
    'Steakhouse': 'steakhouse',
    'French': 'international',
    'Mediterranean': 'international',
    'Asian': 'international',
    'Fusion': 'fusion',
    'American': 'american',
    'Spanish': 'international',
    'Vegetarian': 'vegan',
    'Vegan': 'vegan'
  };
  
  return cuisineMap[cuisine] || 'international';
}

// Helper to map rating text to value
function mapRatingToValue(rating) {
  const ratingMap = {
    'Exceptional': 5,
    'Awesome': 4.5,
    'Excellent': 4,
    'Very Good': 3.5,
    'Good': 3
  };
  
  return ratingMap[rating] || 4;
}

// Helper to ensure valid image URL
function ensureValidImageUrl(url) {
  if (!url || url.trim() === '') {
    return 'https://placehold.co/600x400/orange/white?text=Cabo+Restaurant';
  }
  
  // Check if URL needs sizing parameters
  if (url.includes('otstatic.com') && !url.includes('?w=')) {
    return `${url}?w=600&h=400&fit=crop`;
  }
  
  return url;
}

// Process a single CSV file
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
    const restaurants = [];
    
    // Process each row
    for (const row of dataRows) {
      if (row.length < 5) continue; // Skip incomplete rows
      
      try {
        const restaurant = extractDataFromOpenTable(row);
        restaurants.push(restaurant);
      } catch (err) {
        console.error(`Error processing row: ${row[2]}`, err.message);
      }
    }
    
    console.log(`Extracted ${restaurants.length} restaurants from ${filePath}`);
    return restaurants;
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
    
    const cookies = response.headers.get('set-cookie');
    console.log('Login successful');
    return cookies;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

// Import restaurants to the backend
async function importRestaurants(restaurants, authCookie) {
  try {
    console.log(`Importing ${restaurants.length} restaurants to CMS...`);
    
    // Use the bulk import endpoint
    const response = await fetch(IMPORT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({ restaurants })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Import failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`Import completed successfully: Created ${result.created || 0}, Updated ${result.updated || 0}`);
    return result;
  } catch (err) {
    console.error('Import error:', err);
    throw err;
  }
}

// Save restaurants to a JSON file
function saveRestaurantsToFile(restaurants) {
  try {
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(restaurants, null, 2));
    console.log(`Successfully saved ${restaurants.length} restaurants to ${OUTPUT_JSON}`);
    return true;
  } catch (err) {
    console.error(`Error saving to ${OUTPUT_JSON}:`, err);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting OpenTable data import...');
    
    // Process all CSV files - no auth needed for parsing
    let allRestaurants = [];
    for (const csvFile of CSV_FILES) {
      const restaurants = await processCSVFile(csvFile);
      allRestaurants = [...allRestaurants, ...restaurants];
    }
    
    console.log(`Total restaurants extracted: ${allRestaurants.length}`);
    
    // Remove duplicates based on name
    const uniqueRestaurants = [];
    const restaurantNames = new Set();
    
    for (const restaurant of allRestaurants) {
      if (!restaurantNames.has(restaurant.name)) {
        restaurantNames.add(restaurant.name);
        uniqueRestaurants.push(restaurant);
      }
    }
    
    console.log(`Total unique restaurants: ${uniqueRestaurants.length}`);
    
    // Save restaurants to JSON file first
    saveRestaurantsToFile(uniqueRestaurants);
    
    // Try to login and import, but don't fail the script if this part doesn't work
    try {
      // Login first
      const authCookie = await login();
      
      // Import restaurants in batches to avoid timeouts
      const BATCH_SIZE = 10;
      for (let i = 0; i < uniqueRestaurants.length; i += BATCH_SIZE) {
        const batch = uniqueRestaurants.slice(i, i + BATCH_SIZE);
        console.log(`Importing batch ${i/BATCH_SIZE + 1} (${batch.length} restaurants)...`);
        await importRestaurants(batch, authCookie);
      }
      
      console.log('Import to API completed successfully!');
    } catch (importErr) {
      console.error('Error during API import:', importErr);
      console.log('Data has been saved to JSON file and can be imported later.');
    }
    
    // Print a summary of the parsed data
    console.log('\nRestaurant Category Summary:');
    const categories = {};
    uniqueRestaurants.forEach(r => {
      categories[r.category] = (categories[r.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} restaurants`);
    });
    
    console.log('\nFeatured Restaurants:');
    const featuredCount = uniqueRestaurants.filter(r => r.featured).length;
    console.log(`- ${featuredCount} restaurants marked as featured (${Math.round(featuredCount/uniqueRestaurants.length*100)}%)`);
    
    console.log('\nTotal parsed restaurants:', uniqueRestaurants.length);
  } catch (err) {
    console.error('Error in main process:', err);
  }
}

// Run the script
main();