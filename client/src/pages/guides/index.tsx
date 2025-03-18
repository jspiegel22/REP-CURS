import { Button } from "@/components/ui/button";
import { LeadGenTemplate } from "@/components/templates/LeadGenTemplate";
import { Star, Compass, Map, Book } from "lucide-react";

export default function GuidesPage() {
  const features = [
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Local Insights",
      description: "Expert tips from Cabo insiders"
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Custom Itineraries",
      description: "Personalized travel planning"
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: "Exclusive Content",
      description: "Hidden gems and secret spots"
    }
  ];

  return (
    <LeadGenTemplate
      title="Cabo Travel Guides"
      subtitle="Expert Local Knowledge"
      description="Get insider access to the best of Cabo with our comprehensive travel guides. From hidden beaches to exclusive restaurants, we'll help you experience Cabo like a local."
      imageUrl="https://images.unsplash.com/photo-1516546453174-5e1098a4b4af"
      features={features}
      benefits={[
        "Insider restaurant recommendations",
        "Hidden beach locations",
        "Local cultural insights",
        "Seasonal activity guides",
        "Transportation tips",
        "Safety information"
      ]}
      testimonials={[
        {
          name: "Jessica Martinez",
          text: "The restaurant recommendations were spot-on! We discovered amazing places we would have never found on our own.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce"
        },
        {
          name: "David Thompson",
          text: "The seasonal guide helped us plan the perfect time to visit for whale watching. Incredible experience!",
          rating: 5,
          image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"
        }
      ]}
      faqs={[
        {
          question: "How often are the guides updated?",
          answer: "Our guides are updated monthly to ensure all information is current and accurate."
        },
        {
          question: "What's included in the guides?",
          answer: "Each guide includes detailed recommendations for restaurants, activities, beaches, transportation, and seasonal events."
        },
        {
          question: "Are the guides available offline?",
          answer: "Yes, all our guides can be downloaded for offline access during your trip."
        }
      ]}
      stats={[
        { value: "150+", label: "Local Spots" },
        { value: "50+", label: "Beach Guides" },
        { value: "200+", label: "Restaurant Reviews" },
        { value: "12", label: "Themed Guides" }
      ]}
    />
  );
}
