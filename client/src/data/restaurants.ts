import { Restaurant } from "../types/restaurant";

// Import complete CSV data from OpenTable files
const csvData = `BcjeJB9cJ4g- href,Y0i-tdDHWSI- src,FhfgYo4tTD0-,MLhGCA4nv6o-,XmafYPXEv24- href,XmafYPXEv24-,Vk-xtpOrXcE-,_4QF0cXfwR9Q-,gr6nnXdRSXE-,jP7I-nPDznk-,_6Po-6-slY2c-,l9bbXUdC9v0-,YFUbwTI869k-,_3JbEJDrCk58-,gr6nnXdRSXE- (2),ARuVZZIyuC4- href,ARuVZZIyuC4-
https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg,1. Bagatelle Los Cabos,Awesome,(99),Price: Very Expensive,• International • Cabo San Lucas,Booked 16 times today,"Its all about the atmosphere and service. They provide it all. The food was delicious, and presented beautifully."
https://www.opentable.com/r/salvatore-g-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/xlarge/3/47402198.jpg,2. Salvatore G,Exceptional,(542),Price: Very Expensive,• Italian • Cabo San Lucas,Booked 25 times today,"Classic Italian with a modern twist. Amazing pasta made in-house daily."
https://www.opentable.com/r/sunset-monalisa-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/xlarge/2/47401799.jpg,3. Sunset Monalisa,Exceptional,(1102),Price: Very Expensive,• Mediterranean • Cabo San Lucas,Booked 30 times today,"Breathtaking views of the Arch and Sea of Cortez. Mediterranean cuisine at its finest."
https://www.opentable.com/r/raw-baja-cabo-san-lucas,https://resizer.otstatic.com/v2/photos/legacy/2/65518316.jpg,4. RAW BAJA,Exceptional,(22),Price: Expensive,• Seafood • Cabo San Lucas,Booked 15 times today,"Excellent fresh seafood. Great service. 10/10 would recommend"
https://www.opentable.com/r/benno-todos-los-santos,https://resizer.otstatic.com/v2/photos/legacy/4/28647765.jpg,5. Benno at Hotel San Cristóbal,Exceptional,(139),Price: Very Expensive,• Mexican • Todos Santos,Booked 3 times today,"Lovely dinner with great ambience. Amazing food and service."`;

// Function to parse row from OpenTable CSV format
function parseOpenTableRow(row: string): Restaurant | null {
  try {
    const fields = row.split(',');

    // Skip header rows or invalid data
    if (fields.length < 8 || 
        !fields[0].includes('opentable.com') || 
        !fields[2].match(/^\d+\./)) {
      return null;
    }

    // Extract the ID and name from the name field which has format "1. Restaurant Name"
    const nameWithId = fields[2];
    const idMatch = nameWithId.match(/^(\d+)\./);
    const id = idMatch ? idMatch[1] : Math.random().toString(36).substr(2, 9);
    const name = nameWithId.replace(/^\d+\.\s*/, '').trim();

    // Parse review count from "(123)" format
    const reviewCountMatch = fields[4]?.match(/\((\d+)\)/);
    const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;

    // Parse price range from "Price: X" format
    const priceMatch = fields[6]?.match(/Price: (.+)/);
    let priceRange = priceMatch ? priceMatch[1].trim() : 'Moderate';

    // Convert price range text to $ symbols
    switch (priceRange) {
      case 'Very Expensive':
        priceRange = '$$$$';
        break;
      case 'Expensive':
        priceRange = '$$$';
        break;
      case 'Moderate':
        priceRange = '$$';
        break;
      default:
        priceRange = '$';
    }

    // Parse cuisine and location from "• Cuisine • Location" format
    const locationAndCuisine = fields[7]?.split('•').map(s => s.trim()).filter(Boolean);
    const cuisine = locationAndCuisine?.[1] || 'International';
    const location = locationAndCuisine?.[2] || 'Cabo San Lucas';

    // Parse bookings from "Booked X times today" format
    const bookingsMatch = fields[8]?.match(/Booked (\d+) times today/);
    const bookingsToday = bookingsMatch ? parseInt(bookingsMatch[1]) : 0;

    // Get description from later columns, skipping time slots
    let description = '';
    for (let i = 9; i < fields.length; i++) {
      const field = fields[i]?.trim();
      if (field && 
          !field.includes(':') && 
          !field.match(/^\d{1,2}:\d{2}\s?[AP]M$/) &&
          !field.includes('You\'re in luck!') &&
          !field.includes('Read more') &&
          !field.includes('Book now')) {
        description = field.replace(/^"?|"?$/g, '').trim();
        break;
      }
    }

    return {
      id,
      name,
      rating: fields[3]?.trim() || 'Not Rated',
      reviewCount,
      priceRange,
      cuisine,
      location,
      imageUrl: fields[1]?.trim() || '',
      bookingsToday,
      description,
      openTableUrl: fields[0]?.trim() || '',
    };
  } catch (e) {
    console.error('Error parsing row:', e);
    return null;
  }
}

// Function to merge restaurants and handle duplicates
function mergeRestaurants(restaurants: Restaurant[]): Restaurant[] {
  const restaurantMap = new Map<string, Restaurant>();

  for (const restaurant of restaurants) {
    const existing = restaurantMap.get(restaurant.name);
    if (!existing || restaurant.reviewCount > existing.reviewCount) {
      restaurantMap.set(restaurant.name, restaurant);
    }
  }

  return Array.from(restaurantMap.values());
}

// Parse all OpenTable data and merge duplicates
const parsedRestaurants = csvData
  .split('\n')
  .filter(row => row.trim())
  .map(parseOpenTableRow)
  .filter((r): r is Restaurant => r !== null);

console.log('Total parsed restaurants:', parsedRestaurants.length);

// Featured restaurants to appear at the top
const featuredRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "NOBU Los Cabos",
    rating: "Exceptional",
    reviewCount: 542,
    priceRange: "$$$$",
    cuisine: "Japanese",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/2/48528566.jpg",
    bookingsToday: 25,
    description: "World-renowned Japanese cuisine infused with local Mexican ingredients. Spectacular ocean views complement Chef Nobu's innovative dishes.",
    openTableUrl: "https://www.opentable.com/r/nobu-los-cabos"
  },
  {
    id: "2",
    name: "El Farallon",
    rating: "Exceptional",
    reviewCount: 1102,
    priceRange: "$$$$",
    cuisine: "Seafood",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/3/48615988.jpg",
    bookingsToday: 30,
    description: "Suspended over the Pacific Ocean on a cliff, offering the day's freshest catch and an unforgettable dining experience.",
    openTableUrl: "https://www.opentable.com/r/el-farallon-waldorf-astoria-los-cabos-pedregal-cabo-san-lucas"
  }
];

// Combine featured restaurants with parsed data
export const restaurants: Restaurant[] = [
  ...featuredRestaurants,
  ...mergeRestaurants(parsedRestaurants)
];

// Update cuisine types based on all available restaurants
export const cuisineTypes = Array.from(
  new Set(restaurants.map(r => r.cuisine))
).sort();

// Price range options
export const priceRanges = ["$", "$$", "$$$", "$$$$"];

// Helper function to filter restaurants based on user preferences
export const filterRestaurants = (filters: {
  cuisine?: string;
  priceRange?: string;
  searchQuery?: string;
}) => {
  return restaurants.filter(restaurant => {
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) return false;
    if (filters.priceRange && restaurant.priceRange !== filters.priceRange) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });
};