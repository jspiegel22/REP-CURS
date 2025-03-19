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
  }
];
