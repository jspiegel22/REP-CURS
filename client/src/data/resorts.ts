import { apiRequest } from "@/lib/queryClient";

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
}

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
