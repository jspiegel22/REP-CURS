import { useParams } from "wouter";
import { Villa, parseVillaData } from "@/types/villa";
import VillaBookingTemplate from "@/components/templates/VillaBookingTemplate";
import { generateSlug } from "@/lib/utils";

// Import complete CSV data from the assets
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg?width=486,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocean Views,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg?width=486,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10`;

// Extended sample reviews data
const reviews = [
  {
    author: "Sarah M.",
    date: "February 2025",
    rating: 5,
    content: "Absolutely stunning villa with incredible ocean views. The staff was amazing and attentive to every detail.",
    helpful: 12
  },
  {
    author: "James R.",
    date: "January 2025",
    rating: 5,
    content: "Perfect for our family vacation. The private pool and outdoor areas were spectacular.",
    helpful: 8
  },
  {
    author: "Michael P.",
    date: "December 2024",
    rating: 4,
    content: "Beautiful property with excellent amenities. The concierge service was top-notch.",
    helpful: 5
  }
];

// Comprehensive amenities list
const amenities = [
  "Private Beach Access",
  "Infinity Pool",
  "Full-Service Spa",
  "Fitness Center",
  "24-Hour Room Service",
  "Valet Parking",
  "High-Speed WiFi",
  "Air Conditioning",
  "Mini Bar",
  "Flat-screen TV",
  "In-room Safe",
  "Ocean View"
];

// Villa-specific features
const villaFeatures = {
  "Villa Tranquilidad": [
    "Private Chef Service",
    "Butler Service",
    "Direct Beach Access",
    "Panoramic Ocean Views",
    "Heated Pool",
    "Outdoor Kitchen",
    "Wine Cellar"
  ],
  "Villa Lorena": [
    "24/7 Concierge",
    "Daily Housekeeping",
    "Private Pool",
    "Gourmet Kitchen",
    "Home Theater",
    "Game Room"
  ],
  "Villa Esencia Del Mar": [
    "Personal Concierge",
    "Daily Maid Service",
    "Infinity Edge Pool",
    "Outdoor Living Space",
    "Professional Kitchen",
    "Media Room"
  ]
};

// Villa pricing (per night)
const villaPricing = {
  "Villa Tranquilidad": 2500,
  "Villa Lorena": 1500,
  "Villa Esencia Del Mar": 1800
};

export default function VillaDetail() {
  const { slug } = useParams();
  const villas = parseVillaData(villaData);
  const villa = villas.find(v => generateSlug(v.name) === slug);

  if (!villa) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Villa Not Found</h1>
        <p>Sorry, we couldn't find the villa you're looking for.</p>
      </div>
    );
  }

  // Get villa-specific features and pricing
  const features = villaFeatures[villa.name as keyof typeof villaFeatures] || [];
  const pricePerNight = villaPricing[villa.name as keyof typeof villaPricing] || 1500;

  return (
    <VillaBookingTemplate
      title={villa.name}
      subtitle={`${villa.rating} in ${villa.location}`}
      description={villa.description}
      imageUrls={[villa.imageUrl]} // In production, add more images
      pricePerNight={pricePerNight}
      rating={5}
      reviewCount={reviews.length}
      location={villa.location}
      maximumGuests={villa.maxOccupancy}
      features={features}
      amenities={amenities}
      villaId={parseInt(villa.id.replace('villa-', ''))}
      reviews={reviews}
      host={{
        name: "Villa Management Team",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a", // Professional management team image
        joinedDate: "January 2020"
      }}
    />
  );
}