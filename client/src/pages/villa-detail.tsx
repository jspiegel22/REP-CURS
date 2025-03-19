import { useParams } from "wouter";
import Footer from "@/components/footer";
import VillaBookingTemplate from "@/components/templates/VillaBookingTemplate";
import SEO, { generateVillaSchema } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import type { Villa } from "@shared/schema";

// Villa amenities mapping
const defaultAmenities = [
  "Private Pool",
  "Ocean View",
  "WiFi",
  "Air Conditioning",
  "Full Kitchen",
  "Daily Housekeeping",
  "Concierge Service",
  "Parking",
  "Security System",
  "Outdoor Space"
];

// Reviews data (can be moved to API later)
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

export default function VillaDetail() {
  const { trackHsId } = useParams();
  const { data: villa, isLoading } = useQuery<Villa>({
    queryKey: ["/api/villas", trackHsId],
    enabled: !!trackHsId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-96 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!villa) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO 
          title="Villa Not Found - Cabo Adventures"
          description="Sorry, we couldn't find the villa you're looking for. Explore our other luxury villas in Cabo San Lucas."
        />
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

  // Combine villa's amenities with default ones if needed
  const combinedAmenities = Array.from(new Set([...defaultAmenities, ...(villa.amenities as string[])]));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`${villa.name} - Luxury Villa in ${villa.location} | Cabo Adventures`}
        description={`Experience ${villa.name}, a stunning ${villa.bedrooms}-bedroom villa in ${villa.location}. ${villa.description} Book your stay today!`}
        canonicalUrl={`https://cabo-adventures.com/villa/${villa.trackHsId}`}
        schema={generateVillaSchema(villa)}
        openGraph={{
          title: `${villa.name} - Luxury Villa in ${villa.location}`,
          description: villa.description,
          image: villa.imageUrl,
          url: `https://cabo-adventures.com/villa/${villa.trackHsId}`
        }}
        keywords={[
          'Cabo San Lucas villas',
          'luxury villa rental',
          villa.location,
          'beachfront villa',
          'vacation rental',
          villa.name
        ]}
      />
      <main className="flex-1">
        <VillaBookingTemplate
          title={villa.name}
          subtitle={`Luxury ${villa.bedrooms} Bedroom Villa in ${villa.location}`}
          description={villa.description}
          imageUrls={villa.imageUrls as string[]}
          pricePerNight={parseFloat(villa.pricePerNight)}
          rating={5}
          reviewCount={reviews.length}
          location={villa.location}
          maximumGuests={villa.maxGuests}
          features={[
            `${villa.bedrooms} Bedrooms`,
            `${villa.bathrooms} Bathrooms`,
            `Max ${villa.maxGuests} Guests`,
            'Daily Housekeeping',
            'Concierge Service',
            'Ocean Views'
          ]}
          amenities={combinedAmenities}
          villaId={villa.trackHsId}
          reviews={reviews}
        />
      </main>
      <Footer />
    </div>
  );
}