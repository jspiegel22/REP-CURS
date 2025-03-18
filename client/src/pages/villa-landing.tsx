import { LeadGenTemplate } from "@/components/templates/LeadGenTemplate";

export default function VillaLanding() {
  return (
    <LeadGenTemplate
      title="Luxury Cabo Villa Rentals"
      subtitle="Experience Paradise in Your Private Villa"
      description="Discover our exclusive collection of luxury villas in Cabo San Lucas. Each villa offers stunning ocean views, private pools, and personalized concierge service to ensure an unforgettable stay."
      imageUrl="/villa-hero.jpg"
      features={[
        "Stunning Ocean Views",
        "Private Infinity Pools",
        "Full Staff Including Chef",
        "24/7 Concierge Service",
        "Luxury Transportation",
        "Custom Experiences Available"
      ]}
      amenities={[
        "Private Pool",
        "Beach Access",
        "Chef Service",
        "Daily Housekeeping",
        "Wi-Fi",
        "Air Conditioning",
        "Security System",
        "Outdoor Kitchen"
      ]}
      faqs={[
        {
          question: "What's included in the villa rental?",
          answer: "Our villa rentals include daily housekeeping, concierge service, and basic utilities. Additional services like chef service and transportation can be arranged."
        },
        {
          question: "How far in advance should I book?",
          answer: "We recommend booking at least 3-6 months in advance, especially for peak seasons (December-April)."
        },
        {
          question: "What's the minimum stay requirement?",
          answer: "Most villas require a minimum stay of 3-5 nights, with longer minimums during peak seasons and holidays."
        }
      ]}
    />
  );
}