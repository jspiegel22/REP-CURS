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
      availableTimeslots: fields.slice(15, 19)
        .filter(slot => slot.match(/\d+:\d+ [AP]M/))
    };
  } catch (e) {
    console.error('Error parsing row:', e);
    return null;
  }
}

// Restaurant data from all OpenTable CSV files
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
    openTableUrl: "https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas",
    availableTimeslots: ["6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"]
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
    openTableUrl: "https://www.opentable.com/r/don-manuels-waldorf-astoria-los-cabos-pedregal-cabo-san-lucas",
    availableTimeslots: ["6:30 PM", "6:45 PM", "7:15 PM", "7:30 PM"]
  },
  {
    id: "3",
    name: "Hacienda Cocina y Cantina",
    rating: "Exceptional", 
    reviewCount: 1981,
    priceRange: "Very Expensive",
    cuisine: "Mexican",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/legacy/1/47402198.jpg",
    bookingsToday: 11,
    description: "Our dinner at the Hacienda was awesome. The service was wonderful and our dinners were prepared perfectly.",
    openTableUrl: "https://www.opentable.com/r/hacienda-cocina-y-cantina-cabo-san-lucas",
    availableTimeslots: ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"]
  }
  // More restaurants will be added using parseOpenTableRow function
];

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

// Price range options
export const priceRanges = ["Moderate", "Expensive", "Very Expensive"];

// Cuisine types
export const cuisineTypes = [
  "Mexican",
  "International",
  "Fine Dining",
  "Mediterranean",
  "Latin American",
  "Contemporary Mexican",
  "Global, International",
  "Italian",
  "Seafood",
  "Steakhouse",
  "Asian Fusion",
  "Japanese",
  "Farm-to-Table"
];