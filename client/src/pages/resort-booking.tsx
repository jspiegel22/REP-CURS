import BookingTemplate from "@/components/templates/BookingTemplate";

export default function ResortBooking() {
  return (
    <BookingTemplate
      title="Waldorf Astoria Los Cabos Pedregal"
      subtitle="Luxury Beachfront Resort"
      description={`Experience unparalleled luxury at the Waldorf Astoria Los Cabos Pedregal. Nestled on the pristine beaches of Cabo San Lucas, our resort offers world-class amenities, stunning ocean views, and exceptional service.

Set against a backdrop of majestic mountains and overlooking the Pacific Ocean, this five-star resort redefines luxury with its sophisticated accommodations, award-winning spa, and exquisite dining options.

Each room features a private terrace with breathtaking ocean views, while the resort's infinity pools seem to merge with the horizon, creating an unforgettable visual experience.`}
      imageUrls={[
        "/images/waldorf-main.jpg",
        "/images/waldorf-pool.jpg",
        "/images/waldorf-room.jpg",
        "/images/waldorf-spa.jpg",
        "/images/waldorf-dining.jpg"
      ]}
      pricePerNight={799}
      rating={4.8}
      reviewCount={1820}
      location="Camino Del Mar 1, Pedregal, Cabo San Lucas"
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
      host={{
        name: "Waldorf Astoria Team",
        image: "/images/waldorf-host.jpg",
        joinedDate: "2018"
      }}
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