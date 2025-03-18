import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import BookingTemplate from "@/components/templates/BookingTemplate";
import { Loader2 } from "lucide-react";
import { Resort } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Sample reviews data
const sampleReviews = [
  {
    author: "Michael R.",
    rating: 5,
    content: "Absolutely stunning resort with impeccable service. The views of the ocean from our room were breathtaking, and the staff went above and beyond to make our stay special.",
    date: "March 2025",
    helpful: 12
  },
  {
    author: "Sarah L.",
    rating: 5,
    content: "Perfect location and amazing amenities. The infinity pool overlooking the ocean is spectacular. Restaurant service was top-notch.",
    date: "February 2025",
    helpful: 8
  },
  {
    author: "James K.",
    rating: 4,
    content: "Beautiful property with excellent service. Only minor issue was slow service at the beach bar, but overall a fantastic experience.",
    date: "January 2025",
    helpful: 5
  }
];

export default function ResortBooking() {
  const { slug } = useParams<{ slug: string }>();

  const { data: resort, isLoading, error } = useQuery<Resort>({
    queryKey: ['/api/resorts', slug],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/resorts/${slug}`);
      return response.json();
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center">Error loading resort: {error.message}</div>;
  }

  if (!resort) {
    return <div className="p-4 text-center">Resort not found</div>;
  }

  return (
    <BookingTemplate
      title={resort.name}
      subtitle="Luxury Beachfront Resort"
      description={resort.description}
      imageUrls={[
        resort.imageUrl,
        "/images/waldorf-pool.jpg",
        "/images/waldorf-room.jpg",
        "/images/waldorf-spa.jpg",
        "/images/waldorf-dining.jpg"
      ]}
      pricePerNight={799} // Default price if not in database
      rating={Number(resort.rating)}
      reviewCount={resort.reviewCount}
      location={resort.location}
      maximumGuests={4}
      features={[
        "Oceanfront Location",
        "Private Terrace",
        "Infinity Pool Access",
        "24/7 Concierge",
        "Spa Access",
        "Fine Dining"
      ]}
      extras={[
        {
          id: "breakfast",
          name: "Daily Breakfast",
          price: 45,
          description: "Full breakfast buffet at our main restaurant"
        },
        {
          id: "spa",
          name: "Spa Package",
          price: 199,
          description: "60-minute massage and access to spa facilities"
        },
        {
          id: "transfer",
          name: "Airport Transfer",
          price: 120,
          description: "Round-trip luxury transportation from SJD airport"
        }
      ]}
      amenities={[
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
      ]}
      isResort={true}
      reviews={sampleReviews}
      faqs={[
        {
          question: "What time is check-in/check-out?",
          answer: "Check-in is at 3:00 PM and check-out is at 12:00 PM. Early check-in and late check-out can be arranged based on availability."
        },
        {
          question: "Is breakfast included?",
          answer: "Breakfast is not included in the standard room rate but can be added as an extra during booking or arranged through our concierge."
        },
        {
          question: "Do you offer airport transfers?",
          answer: "Yes, we offer luxury airport transfers that can be added during booking or arranged through our concierge."
        },
        {
          question: "What is your cancellation policy?",
          answer: "Free cancellation up to 48 hours before check-in. After that, the first night is non-refundable."
        }
      ]}
    />
  );
}