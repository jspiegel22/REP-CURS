import { useParams } from "wouter";
import VillaBookingTemplate from "@/components/templates/VillaBookingTemplate";
import { ImageGallery } from "@/components/ImageGallery";
import SEO, { generateVillaSchema } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import type { Villa } from "@shared/schema";
import { sampleVillas } from "@/data/sample-villas";
import { generateVillaSlug } from "@/lib/utils";
import { Star } from "lucide-react";

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
  const { slug } = useParams();
  console.log("Current slug:", slug);

  // Find villa by slug
  const villa = sampleVillas.find(v => {
    const villaSlug = generateVillaSlug(v.name);
    console.log(`Comparing: ${villaSlug} with ${slug}`);
    return villaSlug === slug;
  });

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
        {/* Footer removed to prevent duplication with App.tsx global Footer */}
      </div>
    );
  }

  // Default amenities list
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

  // Combine villa's amenities with default ones if needed
  const combinedAmenities = Array.from(new Set([...defaultAmenities, ...(villa.amenities as string[])]));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`${villa.name} - Luxury Villa in ${villa.location} | Cabo Adventures`}
        description={`Experience ${villa.name}, a stunning ${villa.bedrooms}-bedroom villa in ${villa.location}. ${villa.description} Book your stay today!`}
        canonicalUrl={`https://cabo-adventures.com/villas/${generateVillaSlug(villa.name)}`}
        schema={generateVillaSchema(villa)}
        openGraph={{
          title: `${villa.name} - Luxury Villa in ${villa.location}`,
          description: villa.description,
          image: villa.imageUrl,
          url: `https://cabo-adventures.com/villas/${generateVillaSlug(villa.name)}`
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
        <div className="container mx-auto px-4 py-8">
          {/* Title and Rating */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{villa.name}</h1>
            <div className="flex items-center gap-2 text-lg">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                <span className="ml-1">5.0</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{reviews.length} reviews</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{villa.location}</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <ImageGallery 
              images={villa.imageUrls as string[]} 
              title={villa.name}
              showThumbnails={true}
            />
          </div>

          {/* Booking Form */}
          <div className="mb-12">
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
              villaId={villa.id.toString()}
              reviews={reviews}
            />
          </div>

          {/* Villa Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About this Villa</h2>
              <p className="text-muted-foreground">{villa.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {combinedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.author}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer removed to prevent duplication with App.tsx global Footer */}
    </div>
  );
}