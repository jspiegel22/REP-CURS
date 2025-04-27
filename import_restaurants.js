// Simple script to import restaurant data directly
// This bypasses the need to use the web interface which is having timeout issues

import { restaurants } from './client/src/data/restaurants.js';
import pg from 'pg';
const { Pool } = pg;

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function importRestaurants() {
  console.log(`Found ${restaurants.length} restaurants to import`);
  
  let created = 0;
  let errors = 0;
  
  // Helper function to map cuisine to category
  function mapCuisineToCategory(cuisine) {
    const categoryMap = {
      'Japanese': 'japanese',
      'Seafood': 'seafood',
      'Mexican': 'mexican',
      'Contemporary Mexican': 'mexican',
      'Italian': 'italian',
      'Steakhouse': 'steakhouse',
      'American': 'american',
      'International': 'international',
      'Mediterranean': 'international',
      'Fine Dining': 'international',
    };
    
    return categoryMap[cuisine] || 'international';
  }
  
  // Convert price range to the format used in the CMS
  function formatPriceLevel(priceRange) {
    if (priceRange.startsWith('$')) {
      return priceRange; // Already in the right format ($, $$, $$$, etc.)
    }
    
    switch (priceRange) {
      case 'Very Expensive':
        return '$$$$';
      case 'Expensive':
        return '$$$';
      case 'Moderate':
        return '$$';
      default:
        return '$';
    }
  }
  
  // Convert rating to numeric value
  function parseRating(rating) {
    if (rating === 'Exceptional') return 5.0;
    if (rating === 'Awesome') return 4.5;
    if (rating === 'Not Rated') return 4.0;
    
    // Try to parse as number
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? 4.0 : numRating;
  }
  
  // Process each restaurant
  for (const restaurant of restaurants) {
    try {
      // Check if this restaurant already exists by name
      const checkResult = await pool.query(
        'SELECT * FROM restaurants WHERE name = $1',
        [restaurant.name]
      );
      
      const exists = checkResult.rows.length > 0;
      
      // Convert to database format
      const restaurantData = {
        name: restaurant.name,
        description: restaurant.description || 'A culinary destination in Cabo San Lucas offering fine dining.',
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        price_level: formatPriceLevel(restaurant.priceRange),
        rating: parseRating(restaurant.rating),
        review_count: restaurant.reviewCount || 0,
        open_table: restaurant.openTableUrl,
        image_url: restaurant.imageUrl || '',
        image_urls: restaurant.imageUrl ? JSON.stringify([restaurant.imageUrl]) : JSON.stringify([]),
        features: JSON.stringify(['Ocean View', 'Fine Dining']), // Default features
        tags: JSON.stringify([restaurant.cuisine]), // Use cuisine as a tag
        reviews: JSON.stringify([]), // No reviews initially
        category: mapCuisineToCategory(restaurant.cuisine),
        featured: restaurant.bookingsToday ? restaurant.bookingsToday > 20 : false,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Insert or update
      if (exists) {
        console.log(`Restaurant ${restaurant.name} already exists, skipping...`);
      } else {
        // Insert new restaurant
        const columns = Object.keys(restaurantData).join(', ');
        const placeholders = Object.keys(restaurantData).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(restaurantData);
        
        await pool.query(
          `INSERT INTO restaurants (${columns}) VALUES (${placeholders})`,
          values
        );
        
        created++;
        console.log(`Created restaurant: ${restaurant.name}`);
      }
    } catch (error) {
      console.error(`Error processing restaurant ${restaurant.name}:`, error);
      errors++;
    }
  }
  
  console.log(`Import completed: Created ${created} restaurants, ${errors} errors`);
}

// Run the import
importRestaurants()
  .then(() => {
    console.log('Import process completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Import process failed:', err);
    process.exit(1);
  });