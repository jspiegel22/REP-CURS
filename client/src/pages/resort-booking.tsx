import BookingTemplate from "@/components/templates/BookingTemplate";

export default function ResortBooking() {
  return (
    <BookingTemplate
      title="Waldorf Astoria Los Cabos"
      subtitle="Luxury Beachfront Resort"
      description="Experience unparalleled luxury at the Waldorf Astoria Los Cabos. Nestled on the pristine beaches of Cabo San Lucas, our resort offers world-class amenities, stunning ocean views, and exceptional service."
      imageUrl="/resort-hero.jpg"
      pricingOptions={[
        {
          id: "deluxe",
          name: "Deluxe Ocean View Room",
          price: 799,
          description: "Spacious room with private balcony and ocean views"
        },
        {
          id: "suite",
          name: "Luxury Suite",
          price: 1299,
          description: "One-bedroom suite with separate living area and panoramic views"
        },
        {
          id: "villa",
          name: "Beachfront Villa",
          price: 2499,
          description: "Two-bedroom villa steps from the beach with private pool"
        }
      ]}
      features={[
        "Direct Beach Access",
        "Multiple Swimming Pools",
        "World-class Spa",
        "Fine Dining Restaurants",
        "24-hour Room Service",
        "Fitness Center"
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
        "Ocean View",
        "Private Balcony",
        "King Bed",
        "Luxury Bath",
        "Mini Bar",
        "Wi-Fi",
        "Room Service",
        "Concierge"
      ]}
      faqs={[
        {
          question: "What time is check-in/check-out?",
          answer: "Check-in is at 3:00 PM and check-out is at 12:00 PM. Early check-in and late check-out can be arranged based on availability."
        },
        {
          question: "Is breakfast included?",
          answer: "Breakfast is not included in the standard room rate but can be added as an extra during booking."
        },
        {
          question: "Do you offer airport transfers?",
          answer: "Yes, we offer luxury airport transfers that can be added during booking or arranged through our concierge."
        }
      ]}
    />
  );
}
