import { Button } from "@/components/ui/button";
import { LeadGenTemplate } from "@/components/templates/LeadGenTemplate";
import { Star, Compass, Map, Book, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

// Sample guides data
const guides = [
  {
    id: 1,
    title: "Cabo Restaurant Guide",
    description: "Discover the best restaurants, bars, and hidden culinary gems in Cabo.",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88",
    type: "Food & Dining"
  },
  {
    id: 2,
    title: "Beach & Activities Guide",
    description: "Complete guide to beaches, water sports, and outdoor activities.",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13",
    type: "Activities"
  },
  {
    id: 3,
    title: "Real Estate Investment Guide",
    description: "Everything you need to know about investing in Cabo real estate.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    type: "Real Estate"
  },
  {
    id: 4,
    title: "Wedding Planning Guide",
    description: "Plan your perfect destination wedding in Cabo San Lucas.",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f",
    type: "Events"
  },
  {
    id: 5,
    title: "Transportation Guide",
    description: "Getting around Cabo - from airport transfers to local transit.",
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7",
    type: "Travel"
  },
  {
    id: 6,
    title: "Seasonal Events Guide",
    description: "Year-round calendar of events, festivals, and local celebrations.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    type: "Events"
  }
];

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
    <div className="min-h-screen bg-background">
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

      {/* Downloadable Guides Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Download Our Free Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-[#2F4F4F] text-sm font-medium px-3 py-1 rounded-full">
                      {guide.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Guide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}