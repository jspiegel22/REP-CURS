export interface MenuItem {
  name: string;
  price: number;
  description: string;
}

export interface MenuSection {
  category: string;
  items: MenuItem[];
}

export interface RestaurantHours {
  [key: string]: string; // e.g., "Monday": "9:00 AM - 5:00 PM"
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  reviews: number;
  images: string[];
  location: string;
  address: string;
  description: string;
  features: string[];
  hours: RestaurantHours;
  phone: string;
  website: string;
  menu: MenuSection[];
}

export interface RestaurantFilters {
  cuisine?: string;
  priceRange?: string;
  features?: string[];
  searchQuery?: string;
}

export interface ReservationDetails {
  restaurantId: number;
  date: string;
  time: string;
  partySize: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  specialRequests?: string;
}

export type TimeSlot = string; // e.g., "5:00 PM"
export type PartySize = string; // e.g., "1" to "8" 