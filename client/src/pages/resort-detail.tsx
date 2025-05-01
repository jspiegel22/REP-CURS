import { useParams } from "wouter";
import { resorts } from "@/data/resorts";
import ResortBookingTemplate from "@/components/templates/ResortBookingTemplate";
import { generateSlug } from "@/lib/utils";
import SEO, { generateResortSchema } from "@/components/SEO";

// Reviews data
const reviews = [
  {
    author: "Sarah M.",
    date: "February 2025",
    rating: 5,
    content: "Absolutely stunning resort with incredible ocean views. The staff was amazing and attentive to every detail.",
    helpful: 12
  },
  {
    author: "James R.",
    date: "January 2025",
    rating: 5,
    content: "Perfect for our family vacation. The pools and amenities were spectacular.",
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

// Resort amenities
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

// Resort-specific features
const resortFeatures = {
  "Waldorf Astoria Los Cabos Pedregal": [
    "Private Chef Service",
    "Butler Service",
    "Direct Beach Access",
    "Panoramic Ocean Views",
    "Heated Pool",
    "Outdoor Kitchen",
    "Wine Cellar"
  ],
  "Casa Dorada Resort & Spa": [
    "24/7 Concierge",
    "Daily Housekeeping",
    "Private Pool",
    "Gourmet Kitchen",
    "Home Theater",
    "Game Room"
  ]
};

export default function ResortDetail() {
  const { slug } = useParams();
  const resort = resorts.find(r => generateSlug(r.name) === slug);

  if (!resort) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO 
          title="Resort Not Found - Cabo Adventures"
          description="Sorry, we couldn't find the resort you're looking for. Explore our other luxury resorts in Cabo San Lucas."
        />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Resort Not Found</h1>
            <p>Sorry, we couldn't find the resort you're looking for.</p>
          </div>
        </main>
        {/* Footer removed to prevent duplication with App.tsx global Footer */}
      </div>
    );
  }

  const features = resortFeatures[resort.name as keyof typeof resortFeatures] || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`${resort.name} - Luxury Resort in ${resort.location} | Cabo Adventures`}
        description={`Experience ${resort.name}, a stunning resort in ${resort.location}. ${resort.description} Book your stay today!`}
        canonicalUrl={`https://cabo-adventures.com/resorts/${generateSlug(resort.name)}`}
        schema={generateResortSchema(resort)}
        openGraph={{
          title: `${resort.name} - Luxury Resort in ${resort.location}`,
          description: resort.description,
          image: resort.imageUrl,
          url: `https://cabo-adventures.com/resorts/${generateSlug(resort.name)}`
        }}
        keywords={[
          'Cabo San Lucas resorts',
          'luxury resort',
          resort.location,
          'beachfront resort',
          'vacation resort',
          resort.name
        ]}
      />
      <main className="flex-1">
        <ResortBookingTemplate
          title={resort.name}
          subtitle={`${resort.rating} in ${resort.location}`}
          description={resort.description}
          imageUrls={[resort.imageUrl]}
          priceLevel={resort.priceLevel}
          rating={Number(resort.rating)}
          reviewCount={resort.reviewCount}
          location={resort.location}
          maximumGuests={4}
          features={features}
          amenities={amenities}
          resortId={resort.id}
          reviews={reviews}
        />
      </main>
      {/* Footer removed to prevent duplication with App.tsx global Footer */}
    </div>
  );
}