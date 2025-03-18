import { useParams } from "wouter";
import Footer from "@/components/footer";
import { villas } from "@/data/villas";
import VillaBookingTemplate from "@/components/templates/VillaBookingTemplate";
import { generateSlug } from "@/lib/utils";

// Reviews data
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

// Villa amenities
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
  const villa = villas.find(v => generateSlug(v.name) === slug);

  if (!villa) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Villa Not Found</h1>
            <p>Sorry, we couldn't find the villa you're looking for.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get villa-specific features and pricing
  const features = villaFeatures[villa.name as keyof typeof villaFeatures] || [];
  const pricePerNight = villaPricing[villa.name as keyof typeof villaPricing] || 1500;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <VillaBookingTemplate
          title={villa.name}
          subtitle={`${villa.rating} in ${villa.location}`}
          description={villa.description}
          imageUrls={[villa.imageUrl]}
          pricePerNight={pricePerNight}
          rating={5}
          reviewCount={reviews.length}
          location={villa.location}
          maximumGuests={villa.maxGuests}
          features={features}
          amenities={amenities}
          villaId={parseInt(villa.id.replace('villa-', ''))}
          reviews={reviews}
        />
      </main>
      <Footer />
    </div>
  );
}