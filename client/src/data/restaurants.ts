import { Restaurant } from "../types/restaurant";

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Bonachón Asado de Baja Sur",
    cuisine: "Mexican",
    priceRange: "Expensive",
    rating: 5,
    reviews: 1,
    images: ["https://resizer.otstatic.com/v2/photos/legacy/2/73781541.jpg"],
    location: "Cabo San Lucas",
    address: "Cabo San Lucas",
    description: "The food and service are top notch here. You are greeted by a friendly and professional staff as you walk into the restaurant.",
    features: ["Live Fire Grill", "Kids Play Area", "Happy Hour"],
    hours: {
      "Monday-Friday": "11:00 AM - 10:00 PM",
      "Saturday-Sunday": "11:00 AM - 11:00 PM"
    },
    phone: "+52 624 XXX XXXX",
    website: "https://www.opentable.com/r/bonachon-asado-de-baja-sur-cabo-san-lucas",
    menu: [
      {
        category: "Tacos",
        items: [
          {
            name: "Tacos Al Pastor",
            price: 16,
            description: "Specialty tacos available on Sundays"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Habanero's Gastro Grill",
    cuisine: "Mexican",
    priceRange: "Expensive",
    rating: 5,
    reviews: 496,
    images: ["https://resizer.otstatic.com/v2/photos/legacy/2/70187965.jpg"],
    location: "San José del Cabo",
    address: "San José del Cabo",
    description: "Exceptional dining experience with professional service and authentic Mexican cuisine.",
    features: ["Outdoor Seating", "Full Bar"],
    hours: {
      "Monday-Sunday": "12:00 PM - 10:00 PM"
    },
    phone: "+52 624 XXX XXXX",
    website: "https://www.opentable.com/r/habaneros-gastro-grill-san-jose-del-cabo",
    menu: []
  },
  {
    id: 3,
    name: "Acre Restaurant & Cocktail Bar",
    cuisine: "Global, International",
    priceRange: "Very Expensive",
    rating: 5,
    reviews: 3243,
    images: ["https://images.unsplash.com/photo-1578474846511-04ba529f0b88"],
    location: "San José del Cabo",
    address: "San José del Cabo",
    description: "Amazing dining experience with outstanding cocktails and food.",
    features: ["Cocktail Bar", "Farm-to-Table"],
    hours: {
      "Monday-Sunday": "5:00 PM - 11:00 PM"
    },
    phone: "+52 624 XXX XXXX",
    website: "https://www.opentable.com/r/acre-restaurant-and-cocktail-bar-san-jose-del-cabo",
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
