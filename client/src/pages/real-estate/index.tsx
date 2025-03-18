import { Button } from "@/components/ui/button";
import { LeadGenTemplate } from "@/components/templates/LeadGenTemplate";
import { Star, Home, TrendingUp, MapPin, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

// Sample listings data
const sampleListings = [
  {
    id: 1,
    title: "Oceanfront Villa in Pedregal",
    price: "$4,500,000",
    beds: 5,
    baths: 5.5,
    sqft: "6,500",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    features: ["Ocean View", "Infinity Pool", "Private Beach Access"]
  },
  {
    id: 2,
    title: "Luxury Penthouse at Puerto Los Cabos",
    price: "$2,800,000",
    beds: 3,
    baths: 3.5,
    sqft: "3,200",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    features: ["Marina View", "Private Terrace", "Concierge Service"]
  },
  {
    id: 3,
    title: "Golf Course Estate at Diamante",
    price: "$5,200,000",
    beds: 6,
    baths: 6.5,
    sqft: "7,800",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    features: ["Golf Course View", "Guest House", "Wine Cellar"]
  }
];

export default function RealEstatePage() {
  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Premium Properties",
      description: "Exclusive listings in prime locations"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Expertise",
      description: "Deep knowledge of Cabo real estate market"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Investment Guidance",
      description: "Expert advice on property investments"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LeadGenTemplate
        title="Cabo Real Estate"
        subtitle="Find Your Dream Property"
        description="Whether you're looking for a vacation home, investment property, or permanent residence, our team of expert real estate professionals will help you find the perfect property in Cabo San Lucas."
        imageUrl="https://images.unsplash.com/photo-1613490493576-7fde63acd811"
        features={features}
        benefits={[
          "Access to off-market properties",
          "Local market expertise",
          "Property management services",
          "Investment analysis",
          "Legal guidance",
          "Financing assistance"
        ]}
        testimonials={[
          {
            name: "Michael Chen",
            text: "The team's knowledge of the Cabo market was invaluable. They helped us find the perfect vacation home with amazing ocean views.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
          },
          {
            name: "Sarah Williams",
            text: "Their investment guidance was spot-on. Our rental property has exceeded our ROI expectations.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
          }
        ]}
        faqs={[
          {
            question: "What types of properties are available?",
            answer: "We offer a wide range of properties including oceanfront villas, luxury condos, vacation homes, and investment properties."
          },
          {
            question: "Can non-Mexican citizens buy property in Cabo?",
            answer: "Yes, through a bank trust called a fideicomiso, foreigners can own property in the coastal areas of Mexico."
          },
          {
            question: "What are the typical property management fees?",
            answer: "Property management fees typically range from 20-30% of rental income, covering all aspects of property maintenance and guest services."
          }
        ]}
        stats={[
          { value: "$1.2M", label: "Average Sale Price" },
          { value: "12%", label: "Annual Market Growth" },
          { value: "98%", label: "Client Satisfaction" },
          { value: "30", label: "Days Average Sale Time" }
        ]}
      />

      {/* Featured Listings Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <p className="text-2xl font-bold text-[#2F4F4F] mb-4">{listing.price}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>{listing.beds} beds</span>
                    <span>{listing.baths} baths</span>
                    <span>{listing.sqft} sq ft</span>
                  </div>
                  <div className="space-y-2">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Guide Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#2F4F4F] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <h2 className="text-3xl font-bold mb-4">Download Our Free Real Estate Guide</h2>
              <p className="text-gray-200 mb-6">
                Get our comprehensive guide to buying property in Cabo San Lucas. Learn about the local market,
                legal requirements, financing options, and insider tips for finding the perfect property.
              </p>
              <Button className="bg-white text-[#2F4F4F] hover:bg-gray-100 gap-2">
                <Download className="h-4 w-4" />
                Download Guide
              </Button>
            </div>
            <div className="md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1554469384-e58fac16e23a"
                alt="Real Estate Guide"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}