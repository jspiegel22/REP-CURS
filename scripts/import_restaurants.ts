import { Pool } from 'pg';
import dotenv from 'dotenv';
import { restaurants } from '../client/src/data/restaurants';

dotenv.config();

// Define the interface for our database restaurant schema
interface DbRestaurant {
  name: string;
  description: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  cuisine: string;
  price_level: string;
  rating: number;
  review_count: number;
  open_table_url?: string;
  website_url?: string;
  phone?: string;
  menu_url?: string;
  image_url: string;
  image_urls: string[];
  features: string[];
  tags: string[];
  reviews: Array<{name: string, rating: number, comment: string, date: string}>;
  category: string;
  featured: boolean;
}

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to map cuisine to category
function mapCuisineToCategory(cuisine: string): string {
  const categoryMap: Record<string, string> = {
    'Japanese': 'japanese',
    'Seafood': 'seafood',
    'Mexican': 'mexican',
    'Contemporary Mexican': 'mexican',
    'Italian': 'italian',
    'Steakhouse': 'steakhouse',
    'International': 'international',
    'Mediterranean': 'international',
    'Fine Dining': 'international',
  };
  
  return categoryMap[cuisine] || 'international';
}

// Convert price range to the format used in the CMS
function formatPriceLevel(priceRange: string): string {
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
function parseRating(rating: string): number {
  if (rating === 'Exceptional') return 5.0;
  if (rating === 'Awesome') return 4.5;
  if (rating === 'Not Rated') return 4.0;
  
  // Try to parse as number
  const numRating = parseFloat(rating);
  return isNaN(numRating) ? 4.0 : numRating;
}

// Import restaurants to database
async function importRestaurants() {
  console.log(`Starting import of ${restaurants.length} restaurants...`);
  
  try {
    // First check if we already have restaurants in the database
    const existingResult = await pool.query('SELECT COUNT(*) FROM restaurants');
    const existingCount = parseInt(existingResult.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing restaurants in database.`);
      
      // Ask for confirmation to continue with import
      const shouldContinue = process.argv.includes('--force');
      if (!shouldContinue) {
        console.log('Restaurants already exist in the database. Use --force to override this check.');
        process.exit(0);
      }
    }
    
    // Prepare import
    for (const restaurant of restaurants) {
      // Convert to DB format
      const dbRestaurant: DbRestaurant = {
        name: restaurant.name,
        description: restaurant.description || 'A culinary destination in Cabo San Lucas offering fine dining.',
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        price_level: formatPriceLevel(restaurant.priceRange),
        rating: parseRating(restaurant.rating),
        review_count: restaurant.reviewCount || 0,
        open_table_url: restaurant.openTableUrl,
        image_url: restaurant.imageUrl || '',
        image_urls: restaurant.imageUrl ? [restaurant.imageUrl] : [],
        features: ['Ocean View', 'Fine Dining'], // Default features
        tags: [restaurant.cuisine], // Use cuisine as a tag
        reviews: [], // No reviews initially
        category: mapCuisineToCategory(restaurant.cuisine),
        featured: restaurant.bookingsToday ? restaurant.bookingsToday > 20 : false, // Feature popular restaurants
      };
      
      // Check if this restaurant already exists
      const existingRestaurant = await pool.query(
        'SELECT id FROM restaurants WHERE name = $1',
        [dbRestaurant.name]
      );
      
      if (existingRestaurant.rows.length > 0) {
        const id = existingRestaurant.rows[0].id;
        console.log(`Updating existing restaurant: ${dbRestaurant.name} (ID: ${id})`);
        
        // Update existing restaurant
        await pool.query(
          `UPDATE restaurants SET 
            description = $1, 
            location = $2, 
            cuisine = $3, 
            price_level = $4, 
            rating = $5, 
            review_count = $6, 
            open_table_url = $7, 
            image_url = $8, 
            image_urls = $9, 
            features = $10, 
            tags = $11,
            category = $12,
            featured = $13
          WHERE id = $14`,
          [
            dbRestaurant.description,
            dbRestaurant.location,
            dbRestaurant.cuisine,
            dbRestaurant.price_level,
            dbRestaurant.rating,
            dbRestaurant.review_count,
            dbRestaurant.open_table_url,
            dbRestaurant.image_url,
            JSON.stringify(dbRestaurant.image_urls),
            JSON.stringify(dbRestaurant.features),
            JSON.stringify(dbRestaurant.tags),
            dbRestaurant.category,
            dbRestaurant.featured,
            id
          ]
        );
      } else {
        console.log(`Creating new restaurant: ${dbRestaurant.name}`);
        
        // Insert new restaurant
        await pool.query(
          `INSERT INTO restaurants (
            name, description, location, cuisine, price_level, rating, 
            review_count, open_table_url, image_url, image_urls, features, 
            tags, reviews, category, featured
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            dbRestaurant.name,
            dbRestaurant.description,
            dbRestaurant.location,
            dbRestaurant.cuisine,
            dbRestaurant.price_level,
            dbRestaurant.rating,
            dbRestaurant.review_count,
            dbRestaurant.open_table_url,
            dbRestaurant.image_url,
            JSON.stringify(dbRestaurant.image_urls),
            JSON.stringify(dbRestaurant.features),
            JSON.stringify(dbRestaurant.tags),
            JSON.stringify(dbRestaurant.reviews),
            dbRestaurant.category,
            dbRestaurant.featured
          ]
        );
      }
    }
    
    console.log(`Import completed successfully. Imported/updated ${restaurants.length} restaurants.`);
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
importRestaurants().catch(console.error);