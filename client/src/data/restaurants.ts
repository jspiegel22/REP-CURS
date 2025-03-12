import { Restaurant } from "../types/restaurant";

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Bagatelle Los Cabos",
    cuisine: "International",
    priceRange: "Very Expensive",
    rating: 4.5,
    reviews: 99,
    images: ["https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg"],
    location: "Cabo San Lucas",
    address: "Cabo San Lucas",
    description: "Its all about the atmosphere and service. They provide it all. The food was delicious, and presented beautifully. We even enjoyed hooka for the table and dancing on the chairs. Its not just dining, its an event to experience.",
    features: ["Live Entertainment", "Ocean View", "Fine Dining"],
    hours: {
      "Monday-Sunday": "5:00 PM - 11:00 PM"
    },
    phone: "+52 624 XXX XXXX",
    website: "https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas",
    menu: []
  },
  {
    id: 2,
    name: "Don Manuel's - Waldorf Astoria Los Cabos Pedregal",
    cuisine: "Fine Dining",
    priceRange: "Moderate",
    rating: 5,
    reviews: 773,
    images: ["https://resizer.otstatic.com/v2/photos/legacy/3/67415914.jpg"],
    location: "Cabo San Lucas",
    address: "Cabo San Lucas",
    description: "It was amazing, very fine dining and the most beautiful hotel with excellent service",
    features: ["Ocean View", "Hotel Restaurant", "Fine Dining"],
    hours: {
      "Monday-Sunday": "5:30 PM - 10:30 PM"
    },
    phone: "+52 624 XXX XXXX",
    website: "https://www.opentable.com/r/don-manuels-waldorf-astoria-los-cabos-pedregal-cabo-san-lucas",
    menu: []
  },
  {
    id: 3,
    name: "Hacienda Cocina y Cantina",
    cuisine: "Mexican",
    priceRange: "Very Expensive",
    rating: 5,
    reviews: 1981,
    images: [],
    location: "Cabo San Lucas",
    address: "Cabo San Lucas",
    description: "Our dinner at the Hacienda was awesome as we recalled from our last visit a few years ago. The service was wonderful and our dinners were prepared perfectly. The chicken mole and beef tenderloin were exceptional and the churros were amazing.",
    features: ["Ocean View", "Mexican Cuisine", "Fine Dining"],
    hours: {
      "Monday-Sunday": "5:00 PM - 10:00 PM"
    },
    phone: "+52 624 XXX XXXX",
    website: "https://www.opentable.com/r/hacienda-cocina-y-cantina-cabo-san-lucas",
    menu: []
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
        restaurant.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
};

// Price range options
export const priceRanges = ["Moderate", "Expensive", "Very Expensive"];

// Cuisine types
export const cuisineTypes = ["Mexican", "International", "Fine Dining", "Mediterranean", "Latin American", "Contemporary Mexican"];