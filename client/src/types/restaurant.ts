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
  id: string;
  name: string;
  rating: 'Exceptional' | 'Awesome' | string;
  reviewCount: number;
  priceRange: 'Expensive' | 'Very Expensive' | string;
  cuisine: string;
  location: string;
  imageUrl?: string;
  bookingsToday?: number;
  description?: string;
  openTableUrl?: string;
  availableTimeslots?: string[];
}

export interface RestaurantFilters {
  cuisine?: string;
  priceRange?: string;
  rating?: string;
  location?: string;
}

export interface RestaurantSortOptions {
  field: 'name' | 'rating' | 'reviewCount' | 'bookingsToday';
  direction: 'asc' | 'desc';
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