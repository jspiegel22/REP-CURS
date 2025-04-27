/**
 * This script imports the full list of adventures from the CSV file
 * and adds them to the database, ensuring all adventures are properly synchronized.
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db.js';
import { adventures } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Helper function to generate a slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
    .replace(/\-\-+/g, '-')    // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
}

// Helper function to determine the category based on title
function determineCategory(title) {
  title = title.toLowerCase();
  
  if (title.includes('sail') || title.includes('whale') || title.includes('boat') || 
      title.includes('dolphin') || title.includes('snorkel') || title.includes('dive') || 
      title.includes('scuba') || title.includes('shark') || title.includes('jet ski') ||
      title.includes('fishing') || title.includes('catamaran')) {
    return 'water';
  } else if (title.includes('atv') || title.includes('bike') || title.includes('utv') || 
           title.includes('camel') || title.includes('adventure') || title.includes('zipline') ||
           title.includes('outdoor') || title.includes('offroad')) {
    return 'land';
  } else if (title.includes('luxury') || title.includes('private')) {
    return 'luxury';
  } else if (title.includes('family') || title.includes('kids')) {
    return 'family';
  } else if (title.includes('yacht') || title.includes('charter')) {
    return 'yacht';
  }
  
  // Default to water if can't determine
  return 'water';
}

// Helper function to generate a description
function generateDescription(title, price, duration, minAge) {
  let description = `Experience the incredible ${title} in Cabo San Lucas. `;
  description += `This amazing ${duration.toLowerCase()} adventure costs ${price} `;
  
  if (minAge) {
    description += `and is suitable for guests ${minAge.toLowerCase()}. `;
  }
  
  description += 'Join us for an unforgettable experience in one of Mexico\'s most beautiful destinations.';
  
  return description;
}

// Helper function to generate random rating between 4.2 and 5.0
function generateRating() {
  // Generate a random number between 4.2 and 5.0 with one decimal place
  return Number((Math.random() * 0.8 + 4.2).toFixed(1));
}

// Helper function to generate key features based on category
function generateKeyFeatures(title, category) {
  const baseFeatures = [
    'Professional guide',
    'All equipment included',
    'Bottled water provided',
    'Hotel pickup and drop-off'
  ];
  
  const categoryFeatures = {
    water: [
      'Scenic ocean views',
      'Marine wildlife sightings',
      'Snacks and beverages included',
      'Safety equipment provided'
    ],
    land: [
      'Scenic desert trails',
      'Photo opportunities',
      'Lunch included',
      'Safety briefing'
    ],
    luxury: [
      'Premium experience',
      'Small group sizes',
      'Gourmet food and drinks',
      'Personalized service'
    ],
    family: [
      'Kid-friendly activities',
      'Educational content',
      'Safe for all ages',
      'Family photo opportunities'
    ],
    yacht: [
      'Luxury vessel',
      'Gourmet catering',
      'Open bar',
      'Premium amenities'
    ]
  };
  
  // Combine base features with category-specific features
  let features = [...baseFeatures];
  
  if (categoryFeatures[category]) {
    features = features.concat(categoryFeatures[category]);
  }
  
  // Add some specific features based on the title
  if (title.toLowerCase().includes('whale')) {
    features.push('Whale watching');
    features.push('Marine biologist guide');
  }
  
  if (title.toLowerCase().includes('dolphin')) {
    features.push('Dolphin interaction');
    features.push('Professional photos available');
  }
  
  if (title.toLowerCase().includes('scuba') || title.toLowerCase().includes('dive')) {
    features.push('PADI certified instructors');
    features.push('All diving equipment included');
  }
  
  if (title.toLowerCase().includes('atv') || title.toLowerCase().includes('utv')) {
    features.push('Off-road vehicle provided');
    features.push('Scenic desert trails');
  }
  
  // Return a subset of the features (6-8 random ones)
  const numFeatures = Math.floor(Math.random() * 3) + 6; // 6-8 features
  
  // Shuffle and take the first numFeatures
  return features
    .sort(() => 0.5 - Math.random())
    .slice(0, numFeatures);
}

// Helper function to generate things to bring based on category
function generateThingsToBring(category) {
  const commonItems = [
    'Sunscreen',
    'Sunglasses',
    'Camera',
    'Light jacket'
  ];
  
  const categoryItems = {
    water: [
      'Swimsuit',
      'Towel',
      'Change of clothes',
      'Waterproof bag for belongings'
    ],
    land: [
      'Closed-toe shoes',
      'Long pants',
      'Hat',
      'Bandana (for dust)'
    ],
    luxury: [
      'Comfortable shoes',
      'Light layers',
      'Hat',
      'Camera'
    ],
    family: [
      'Extra snacks',
      'Water bottle',
      'Hat for kids',
      'Change of clothes'
    ],
    yacht: [
      'Swimsuit',
      'Towel',
      'Non-marking shoes',
      'Light layers'
    ]
  };
  
  // Combine common items with category-specific items
  let items = [...commonItems];
  
  if (categoryItems[category]) {
    items = items.concat(categoryItems[category]);
  }
  
  // Return a subset of the items (4-6 random ones)
  const numItems = Math.floor(Math.random() * 3) + 4; // 4-6 items
  
  // Shuffle and take the first numItems
  return items
    .sort(() => 0.5 - Math.random())
    .slice(0, numItems);
}

// Determine if an adventure should be top recommended
function isTopRecommended(title, price) {
  // Mark about 20% of adventures as top recommended
  // Prioritize more expensive or popular activities
  
  // Extract numeric price value
  let numericPrice = 0;
  if (price) {
    const priceMatch = price.match(/\$(\d+)/);
    if (priceMatch && priceMatch[1]) {
      numericPrice = parseInt(priceMatch[1], 10);
    }
  }
  
  // Popular keywords that might indicate premium experiences
  const popularKeywords = ['luxury', 'whale', 'dolphin', 'private', 'yacht'];
  const isPremium = popularKeywords.some(keyword => title.toLowerCase().includes(keyword));
  
  // Higher price or premium keywords increases chance of being top recommended
  const baseChance = 0.2; // 20% base chance
  let finalChance = baseChance;
  
  if (numericPrice > 150) {
    finalChance += 0.2; // +20% chance if price > $150
  }
  
  if (isPremium) {
    finalChance += 0.3; // +30% chance if it has premium keywords
  }
  
  // Random selection based on calculated chance
  return Math.random() < finalChance;
}

// Main function to extract data from CSV
async function extractDataFromCSV(filePath) {
  try {
    console.log(`Reading CSV file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV content
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true
    });
    
    console.log(`Parsed ${records.length} records from CSV`);
    
    // Skip header row
    const dataRows = records.slice(1);
    
    // Map rows to adventure objects
    const adventures = dataRows.map(row => {
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
      
      // Determine category based on the title
      const category = determineCategory(title);
      
      // Create a description based on title, price, and duration
      const description = generateDescription(title, currentPrice, duration, minAge);
      
      // Generate a rating between 4.2 and 5.0
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
    });
    
    console.log(`Extracted ${adventures.length} adventures from CSV`);
    return adventures;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
}

// Main function to import adventures
async function importAdventures() {
  try {
    console.log('Starting adventure import process...');
    
    // Get adventures from CSV
    const extractedAdventures = await extractDataFromCSV('./public/full_list.csv');
    
    console.log(`Processing ${extractedAdventures.length} adventures...`);
    
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    // Process each adventure
    for (const adventure of extractedAdventures) {
      try {
        // Check if adventure already exists by slug
        const existingAdventures = await db.select().from(adventures).where(eq(adventures.slug, adventure.slug));
        
        if (existingAdventures && existingAdventures.length > 0) {
          // Adventure exists, update it
          const existingAdventure = existingAdventures[0];
          
          const [updatedAdventure] = await db
            .update(adventures)
            .set({
              title: adventure.title,
              description: adventure.description,
              currentPrice: adventure.currentPrice,
              originalPrice: adventure.originalPrice,
              discount: adventure.discount,
              duration: adventure.duration,
              imageUrl: adventure.imageUrl,
              imageUrls: adventure.imageUrls,
              minAge: adventure.minAge,
              provider: adventure.provider,
              category: adventure.category,
              keyFeatures: adventure.keyFeatures,
              thingsToBring: adventure.thingsToBring,
              topRecommended: adventure.topRecommended,
              rating: adventure.rating,
              featured: adventure.featured,
              updatedAt: new Date()
            })
            .where(eq(adventures.id, existingAdventure.id))
            .returning();
          
          console.log(`Updated adventure: ${updatedAdventure.title} (ID: ${updatedAdventure.id})`);
          updated++;
        } else {
          // Create new adventure
          const [newAdventure] = await db
            .insert(adventures)
            .values({
              ...adventure,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
          
          console.log(`Created adventure: ${newAdventure.title} (ID: ${newAdventure.id})`);
          created++;
        }
      } catch (error) {
        console.error(`Error processing adventure ${adventure.title}:`, error);
        errors++;
      }
      
      // Add a small delay to avoid database contention
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('Adventure import completed:');
    console.log(`- Created: ${created}`);
    console.log(`- Updated: ${updated}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Total processed: ${extractedAdventures.length}`);
    
    return { created, updated, errors, total: extractedAdventures.length };
    
  } catch (error) {
    console.error('Error during adventure import:', error);
    throw error;
  }
}

// Execute the import as an IIFE
(async function () {
  try {
    const result = await importAdventures();
    console.log('Import completed successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
})();