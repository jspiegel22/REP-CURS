import { Villa } from "@shared/schema";

// Convert villaData into our Villa type format
const villaLines = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocean Views,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=2,https://www.cabovillas.com/Properties/Villas/Villa_California/FULL/Villa_California-1.jpg,CABO SAN LUCAS,Villa California,Relaxing Escape with Views of Cabo San Lucas,4-Star Deluxe Villa,,5,6,10
https://www.cabovillas.com/properties.asp?PID=202,https://www.cabovillas.com/Properties/Villas/Villa_Penasco/FULL/Villa_Penasco-1.jpg,"CABO SAN LUCAS, OCEANFRONT",Villa Peñasco,Lavishly Appointed Villa Overlooking the Pacific,6+ -Star Platinum Villa,+,6,6+,14
https://www.cabovillas.com/properties.asp?PID=296,https://www.cabovillas.com/Properties/Villas/Villa_Ladrillo/FULL/Villa_Ladrillo-1.jpg,CABO SAN LUCAS,Villa Ladrillo,Great Cabo San Lucas Location & Pacific Ocean Views,4-Star Deluxe Villa,,4,4,8
https://www.cabovillas.com/properties.asp?PID=512,https://www.cabovillas.com/Properties/Villas/Casa_Bella_Vista_by_Waldorf_Astoria_Los_Cabos_Pedregal/FULL/Casa_Bella_Vista_by_Waldorf_Astoria_Los_Cabos_Pedregal-1.jpg,CABO SAN LUCAS,Casa Bella Vista by Waldorf Astoria Los Cabos Pedregal,Gorgeous Marina & Bay Views with Luxury Resort Amenities,6+ -Star Platinum Villa,+,3,3.5,7
https://www.cabovillas.com/properties.asp?PID=627,https://www.cabovillas.com/Properties/Villas/Tortuga_Bay_Penthouse_2401/FULL/Tortuga_Bay_Penthouse_2401-1.jpg,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Tortuga Bay Penthouse 2401,Beachfront Luxury with Sweeping Ocean Views,5-Star Luxury Villa,,3,3,6
https://www.cabovillas.com/properties.asp?PID=140,https://www.cabovillas.com/Properties/Villas/Villa_Marcella/FULL/Villa_Marcella-1.jpg,"CABO SAN LUCAS, OCEANFRONT, BEACHFRONT",Villa Marcella,Luxury Beach Front Estate,6-Star Premier Villa,,5,6.5,14`.split('\n');

function parseVillaLine(line: string, index: number): Villa {
  const [url, imageUrl, location, name, description, rating] = line.split(',');
  const amenities = [
    "Private Pool",
    "Ocean View",
    "Chef's Kitchen",
    "Daily Housekeeping",
    "Wi-Fi",
    "Air Conditioning",
    "Security System",
    location.toLowerCase().includes('beachfront') ? "Beach Access" : "Mountain View"
  ];

  return {
    id: index,
    trackHsId: `villa-${index}`,
    name: name.trim(),
    description: description.trim(),
    bedrooms: 4 + Math.floor(Math.random() * 4), // Random between 4-8 bedrooms
    bathrooms: 4 + Math.floor(Math.random() * 4),
    maxGuests: 8 + Math.floor(Math.random() * 8), // Random between 8-16 guests
    amenities,
    imageUrl: imageUrl.trim(),
    imageUrls: [
      imageUrl.trim(),
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format",
    ],
    pricePerNight: String(1500 + Math.floor(Math.random() * 2500)), // Random between $1500-$4000
    location: location.includes('SAN JOSÉ') ? 'San José del Cabo' : 'Cabo San Lucas',
    address: location.trim(),
    latitude: String(22.89 + (Math.random() * 0.2)), // Random coordinates around Cabo
    longitude: String(-109.91 + (Math.random() * 0.2)),
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Parse villa data and create array
export const sampleVillas: Villa[] = villaLines
  .slice(1) // Skip header row
  .filter(line => line.trim() !== '')
  .map((line, index) => parseVillaLine(line, index + 1));