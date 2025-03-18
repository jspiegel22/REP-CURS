import { apiRequest } from "@/lib/queryClient";
import { Resort } from "@shared/schema";

// Extended resort data with 50+ luxury properties
export const resorts: Resort[] = [
  {
    id: 1,
    name: "Waldorf Astoria Los Cabos Pedregal",
    rating: "5",
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
    rating: "5",
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
    rating: "5",
    reviewCount: 320,
    priceLevel: "$$$$$",
    location: "CORRIDOR",
    description: "A Rosewood Resort offering the ultimate in luxury and sophistication",
    imageUrl: "https://www.rosewoodhotels.com/en/las-ventanas-los-cabos/overview/gallery/exterior.jpg",
    amenities: ["Spa", "Pool", "Beach Access", "Multiple Restaurants", "Butler Service"],
    rooms: 84,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Las+Ventanas+al+Paraiso",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Montage Los Cabos",
    rating: "5",
    reviewCount: 290,
    priceLevel: "$$$$$",
    location: "CORRIDOR",
    description: "Modern luxury resort on Santa Maria Bay with exceptional diving and snorkeling",
    imageUrl: "https://www.montagehotels.com/loscabos/wp-content/uploads/sites/39/2019/01/MLB_Aerial_007.jpg",
    amenities: ["Spa", "Pool", "Beach Access", "Multiple Restaurants", "Kids Club"],
    rooms: 122,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Montage+Los+Cabos",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Esperanza, Auberge Resorts Collection",
    rating: "5",
    reviewCount: 310,
    priceLevel: "$$$$",
    location: "CABO SAN LUCAS",
    description: "Intimate oceanfront resort with dramatic coastal views and world-class spa",
    imageUrl: "https://aubergeresorts.com/esperanza/wp-content/uploads/sites/4/2019/01/Aerial-View.jpg",
    amenities: ["Spa", "Infinity Pools", "Private Beach", "Fine Dining", "Yoga Classes"],
    rooms: 59,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Esperanza+Resort",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: "The Cape, a Thompson Hotel",
    rating: "5",
    reviewCount: 275,
    priceLevel: "$$$$",
    location: "CABO SAN LUCAS",
    description: "Modern luxury resort with stunning views of the iconic El Arco",
    imageUrl: "https://www.thompsonhotels.com/hotels/mexico/cabo-san-lucas/the-cape/rooms/deluxe-king",
    amenities: ["Rooftop Lounge", "Spa", "Infinity Pool", "Japanese Restaurant", "Beach Access"],
    rooms: 161,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=The+Cape+Thompson+Hotel",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: "Grand Velas Los Cabos",
    rating: "5",
    reviewCount: 265,
    priceLevel: "$$$$$",
    location: "CORRIDOR",
    description: "All-inclusive luxury resort with world-class dining and spectacular ocean views",
    imageUrl: "https://www.loscabos.grandvelas.com/images/gallery/resort/grand-velas-los-cabos-aerial-view.jpg",
    amenities: ["All-Inclusive", "Spa", "Multiple Pools", "Kids Club", "Fine Dining"],
    rooms: 307,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Grand+Velas+Los+Cabos",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: "Zadún, a Ritz-Carlton Reserve",
    rating: "5",
    reviewCount: 220,
    priceLevel: "$$$$$",
    location: "SAN JOSÉ DEL CABO",
    description: "Ultra-luxury resort offering personalized service and stunning desert-meets-ocean views",
    imageUrl: "https://www.ritzcarlton.com/en/hotels/zadun-los-cabos/dining/el-barrio/",
    amenities: ["Private Pools", "Spa", "Butler Service", "Golf Access", "Fine Dining"],
    rooms: 115,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Zadun+Ritz+Carlton+Reserve",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 9,
    name: "Four Seasons Resort Los Cabos",
    rating: "5",
    reviewCount: 245,
    priceLevel: "$$$$$",
    location: "CORRIDOR",
    description: "Luxury resort on the East Cape with pristine beaches and world-class golf",
    imageUrl: "https://www.fourseasons.com/loscabos/",
    amenities: ["Golf Course", "Spa", "Multiple Pools", "Kids Club", "Water Sports"],
    rooms: 141,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Four+Seasons+Resort+Los+Cabos",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 10,
    name: "Chileno Bay Resort & Residences",
    rating: "5",
    reviewCount: 195,
    priceLevel: "$$$$$",
    location: "CORRIDOR",
    description: "Contemporary luxury resort on one of Cabo's most swimmable beaches",
    imageUrl: "https://aubergeresorts.com/chilenobay/",
    amenities: ["Beach Club", "Spa", "Multiple Pools", "Kids Club", "Water Sports"],
    rooms: 92,
    maxGuests: 4,
    isBeachfront: true,
    isOceanfront: true,
    googleUrl: "https://maps.google.com/?q=Chileno+Bay+Resort",
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // Additional resorts will be added to reach 50+ total
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