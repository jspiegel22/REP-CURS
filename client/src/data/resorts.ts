import { apiRequest } from "@/lib/queryClient";
import { Resort } from "@shared/schema";

export interface Resort {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  location: string;
  description: string;
  imageUrl: string;
  amenities: string[];
  bookingsToday: number;
  googleUrl: string;
  rooms: number;
  maxGuests: number;
  isBeachfront: boolean;
  isOceanfront: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sample resort data - in production this would come from the database
export const resorts: Resort[] = [
  {
    id: 1,
    name: "Waldorf Astoria Los Cabos",
    rating: 5,
    reviewCount: 450,
    priceLevel: "$$$$$",
    location: "CABO SAN LUCAS",
    description: "Luxury beachfront resort with world-class amenities and spectacular ocean views",
    imageUrl: "https://www.hilton.com/im/en/SJDLCWA/3254503/waldorf-astoria-los-cabos-aerial.jpg",
    amenities: ["Spa", "Pool", "Beach Access", "Fine Dining", "Fitness Center"],
    rooms: 115,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Waldorf+Astoria+Los+Cabos",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "One&Only Palmilla",
    rating: 5,
    reviewCount: 380,
    priceLevel: "$$$$$",
    location: "SAN JOSÉ DEL CABO",
    description: "Historic luxury resort offering unparalleled service and pristine beaches",
    imageUrl: "https://www.oneandonlyresorts.com/palmilla/media/images/home/header.jpg",
    amenities: ["Spa", "Golf Course", "Private Beach", "Multiple Restaurants", "Butler Service"],
    rooms: 174,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=One+and+Only+Palmilla",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Las Ventanas al Paraíso",
    rating: 5,
    reviewCount: 320,
    priceLevel: "$$$$$",
    location: "CORRIDOR",
    description: "A Rosewood Resort offering the ultimate in luxury and sophistication",
    imageUrl: "https://www.rosewoodhotels.com/en/las-ventanas-los-cabos/overview/image-gallery",
    amenities: ["Spa", "Pool", "Beach Access", "Multiple Restaurants", "Butler Service"],
    rooms: 84,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Las+Ventanas+al+Paraiso",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Export functions to filter and search resorts
export const filterResorts = (
  resorts: Resort[],
  {
    searchQuery = "",
    location = "all",
    priceLevel = "all",
  }: {
    searchQuery?: string;
    location?: string;
    priceLevel?: string;
  }
) => {
  return resorts.filter(resort => {
    const matchesSearch =
      resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resort.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = location === "all" || resort.location === location;
    const matchesPriceLevel = priceLevel === "all" || resort.priceLevel === priceLevel;

    return matchesSearch && matchesLocation && matchesPriceLevel;
  });
};

// Fetch all resorts from the database
export const fetchResorts = async (): Promise<Resort[]> => {
  const response = await apiRequest("GET", "/api/resorts");
  return response.json();
};

// Fetch a single resort by ID
export const fetchResortById = async (id: string): Promise<Resort> => {
  const response = await apiRequest("GET", `/api/resorts/${id}`);
  return response.json();
};