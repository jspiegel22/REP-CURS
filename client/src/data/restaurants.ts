import { Restaurant } from "../types/restaurant";

// Function to parse row from OpenTable CSV format
function parseOpenTableRow(row: string): Restaurant | null {
  try {
    const fields = row.split(',');
    if (fields.length < 10) return null;

    // Extract the ID from the name field which has format "1. Restaurant Name"
    const nameWithId = fields[2];
    const idMatch = nameWithId.match(/^(\d+)\./);
    const id = idMatch ? idMatch[1] : Math.random().toString();
    const name = nameWithId.replace(/^\d+\.\s*/, '');

    // Extract location and cuisine from combined field that looks like "• Cuisine • Location"
    const locationCuisine = fields[7].split('•').filter(s => s.trim());
    const cuisine = locationCuisine[1]?.trim() || 'Unspecified';
    const location = locationCuisine[2]?.trim() || 'Cabo San Lucas';

    // Parse price range from "Price: Very Expensive" format
    const priceRange = fields[6].replace('Price: ', '').trim();

    // Parse bookings from "Booked X times today" format
    const bookingsMatch = fields[8].match(/Booked (\d+) times today/);
    const bookingsToday = bookingsMatch ? parseInt(bookingsMatch[1]) : 0;

    // Parse review count from "(123)" format
    const reviewCountMatch = fields[5].match(/\((\d+)\)/);
    const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;

    return {
      id,
      name,
      rating: fields[3].trim(),
      reviewCount,
      priceRange,
      cuisine,
      location,
      imageUrl: fields[1].trim(),
      bookingsToday,
      description: fields[10]?.trim() || '',
      openTableUrl: fields[0].trim(),
    };
  } catch (e) {
    console.error('Error parsing row:', e);
    return null;
  }
}

// Import and parse all OpenTable CSV data
// Note: In a production environment, this would be done server-side
const csvData = `
[CSV data from files would go here]
`;

const parsedRestaurants = csvData
  .split('\n')
  .filter(row => row.trim())
  .map(parseOpenTableRow)
  .filter((r): r is Restaurant => r !== null);

// Combine existing featured restaurants with parsed data
export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bagatelle Los Cabos",
    rating: "Awesome",
    reviewCount: 99,
    priceRange: "Very Expensive",
    cuisine: "International",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg",
    bookingsToday: 16,
    description: "Its all about the atmosphere and service. They provide it all. The food was delicious, and presented beautifully.",
    openTableUrl: "https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas"
  },
  {
    id: "2",
    name: "Don Manuel's - Waldorf Astoria Los Cabos Pedregal",
    rating: "Exceptional",
    reviewCount: 773,
    priceRange: "Moderate",
    cuisine: "Fine Dining",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/legacy/3/67415914.jpg",
    bookingsToday: 13,
    description: "It was amazing, very fine dining and the most beautiful hotel with excellent service",
    openTableUrl: "https://www.opentable.com/r/don-manuels-waldorf-astoria-los-cabos-pedregal-cabo-san-lucas"
  },
  {
    id: "3",
    name: "NOBU Los Cabos",
    rating: "Exceptional",
    reviewCount: 542,
    priceRange: "Very Expensive",
    cuisine: "Japanese",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/2/48528566.jpg",
    bookingsToday: 25,
    description: "World-renowned Japanese cuisine infused with local Mexican ingredients. Spectacular ocean views complement Chef Nobu's innovative dishes.",
    openTableUrl: "https://www.opentable.com/r/nobu-los-cabos"
  },
  {
    id: "4",
    name: "Comal at Chileno Bay",
    rating: "Exceptional",
    reviewCount: 891,
    priceRange: "Very Expensive",
    cuisine: "Contemporary Mexican",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/1/25885179.jpg",
    bookingsToday: 18,
    description: "Modern Mexican cuisine with stunning views of the Sea of Cortez. Farm-to-table ingredients and creative cocktails.",
    openTableUrl: "https://www.opentable.com/r/comal-at-chileno-bay-cabo-san-lucas"
  },
  {
    id: "5",
    name: "El Farallon - Waldorf Astoria Los Cabos",
    rating: "Exceptional",
    reviewCount: 1102,
    priceRange: "Very Expensive",
    cuisine: "Seafood",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/3/48615988.jpg",
    bookingsToday: 30,
    description: "Suspended over the Pacific Ocean on a cliff, offering the day's freshest catch and an unforgettable dining experience.",
    openTableUrl: "https://www.opentable.com/r/el-farallon-waldorf-astoria-los-cabos-pedregal-cabo-san-lucas"
  },
  ...parsedRestaurants
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