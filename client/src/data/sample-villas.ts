import { Villa } from "@shared/schema";

export const sampleVillas: Villa[] = [
  {
    id: 1,
    trackHsId: "villa-001",
    name: "Villa Tranquilidad",
    description: "Spectacular Beachfront Villa Located in Puerto Los Cabos. This 6+ Star Platinum Villa offers breathtaking ocean views and luxurious amenities.",
    bedrooms: 8,
    bathrooms: 8,
    maxGuests: 16,
    amenities: ["Private Pool", "Beach Access", "Ocean View", "Chef's Kitchen", "Home Theater"],
    imageUrl: "https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg",
    imageUrls: [
      "https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg",
      "https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-2.jpg"
    ],
    pricePerNight: "2500",
    location: "San José del Cabo",
    address: "Puerto Los Cabos",
    latitude: "23.0",
    longitude: "-109.7",
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    trackHsId: "villa-002",
    name: "Villa Lorena",
    description: "Comfortable Villa with Wonderful Pacific Ocean Views. This 4.5-Star Deluxe Villa combines luxury with comfort.",
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 10,
    amenities: ["Infinity Pool", "Ocean View", "Gourmet Kitchen", "Outdoor Dining"],
    imageUrl: "https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg",
    imageUrls: [
      "https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg",
      "https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-2.jpg"
    ],
    pricePerNight: "1500",
    location: "Cabo San Lucas",
    address: "Pedregal",
    latitude: "22.9",
    longitude: "-109.9",
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    trackHsId: "villa-003",
    name: "Villa Esencia Del Mar",
    description: "Breathtaking Ocean Views & Modern Luxury. Experience the essence of Cabo living in this stunning villa.",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 10,
    amenities: ["Private Pool", "Ocean View", "Chef's Kitchen", "Outdoor Living Space"],
    imageUrl: "https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg",
    imageUrls: [
      "https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg",
      "https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-2.jpg"
    ],
    pricePerNight: "1800",
    location: "Cabo San Lucas",
    address: "Cabo San Lucas",
    latitude: "22.89",
    longitude: "-109.91",
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    trackHsId: "villa-004",
    name: "Villa Luna",
    description: "Modern Luxury Villa with Panoramic Views. Perfect for families and groups seeking privacy and comfort.",
    bedrooms: 6,
    bathrooms: 6,
    maxGuests: 12,
    amenities: ["Infinity Pool", "Ocean View", "Home Theater", "Game Room", "Gym"],
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format",
    imageUrls: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format",
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format"
    ],
    pricePerNight: "2200",
    location: "San José del Cabo",
    address: "Costa Azul",
    latitude: "23.05",
    longitude: "-109.68",
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    trackHsId: "villa-005",
    name: "Casa del Mar",
    description: "Beachfront Paradise with World-Class Amenities. This villa offers the ultimate luxury beach experience.",
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    amenities: ["Private Beach", "Infinity Pool", "Chef Service", "Spa Room", "Wine Cellar"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format",
    imageUrls: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format"
    ],
    pricePerNight: "3000",
    location: "Cabo San Lucas",
    address: "Medano Beach",
    latitude: "22.88",
    longitude: "-109.90",
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];