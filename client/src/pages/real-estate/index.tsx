import { Button } from "@/components/ui/button";
import { LeadGenTemplate } from "@/components/templates/LeadGenTemplate";
import { Star, Home, TrendingUp, MapPin } from "lucide-react";

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

  const caseStudies = [
    {
      title: "Luxury Villa Sale",
      description: "Successful sale of oceanfront property within 30 days",
      metrics: "$4.2M Sale Price",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
    },
    {
      title: "Investment Property",
      description: "Vacation rental generating 15% annual return",
      metrics: "15% ROI",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    }
  ];

  return (
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
  );
}
