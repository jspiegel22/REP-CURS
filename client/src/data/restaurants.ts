import { Restaurant } from "../types/restaurant";

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
  },
  {
    id: "4",
    name: "El Farallon",
    rating: "Exceptional",
    reviewCount: 245,
    priceRange: "Very Expensive",
    cuisine: "Seafood",
    location: "Cabo San Lucas",
    imageUrl: "https://resizer.otstatic.com/v2/photos/xlarge/1/47401803.jpg",
    bookingsToday: 24,
    description: "Carved into the cliffs of The Resort at Pedregal, El Farallon offers an unparalleled dining experience with the best views in Cabo.",
    openTableUrl: "https://www.opentable.com/r/el-farallon-cabo-san-lucas",
    availableTimeslots: ["5:30 PM", "6:00 PM", "8:00 PM", "8:30 PM"]
  }
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