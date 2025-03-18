import { Button } from "@/components/ui/button";
import { LeadGenTemplate } from "@/components/templates/LeadGenTemplate";
import { Star, Briefcase, TrendingUp, Users } from "lucide-react";

export default function WorkWithUsPage() {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Marketing Excellence",
      description: "Strategic campaigns that drive measurable results"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Industry Expertise",
      description: "Deep understanding of luxury travel market"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Custom Solutions",
      description: "Tailored strategies for your unique needs"
    }
  ];

  const caseStudies = [
    {
      title: "Resort Marketing Campaign",
      description: "Increased bookings by 150% through targeted digital marketing",
      metrics: "150% Growth in 6 months",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    },
    {
      title: "Luxury Villa Launch",
      description: "Successfully launched high-end villa rentals with 90% occupancy",
      metrics: "90% Occupancy Rate",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
    }
  ];

  return (
    <LeadGenTemplate
      title="Partner With Us"
      subtitle="Transform Your Cabo Business"
      description="Join forces with the leading luxury travel platform in Cabo San Lucas. We specialize in creating compelling digital experiences that convert high-value travelers into loyal customers."
      imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978"
      features={features}
      benefits={[
        "Access to affluent, travel-ready audience",
        "Professional photography and content creation",
        "Targeted marketing campaigns",
        "Performance tracking and analytics",
        "Premium listing placement",
        "Dedicated account manager"
      ]}
      testimonials={[
        {
          name: "Maria Rodriguez",
          text: "Working with the team has transformed our villa business. Their marketing expertise and understanding of the luxury market is unmatched.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
        },
        {
          name: "James Chen",
          text: "The results speak for themselves. Our resort has seen a significant increase in high-value bookings since partnering with them.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
        }
      ]}
      faqs={[
        {
          question: "What services do you offer?",
          answer: "We offer comprehensive digital marketing, content creation, social media management, and booking platform integration for luxury travel businesses in Cabo."
        },
        {
          question: "How long until we see results?",
          answer: "Most partners see significant improvements in visibility and bookings within the first 3 months of working with us."
        },
        {
          question: "What makes your platform different?",
          answer: "We focus exclusively on the luxury Cabo market and have built a trusted brand that attracts high-value travelers looking for premium experiences."
        }
      ]}
      stats={[
        { value: "500K+", label: "Monthly Visitors" },
        { value: "150+", label: "Partner Properties" },
        { value: "95%", label: "Partner Satisfaction" },
        { value: "$2M+", label: "Generated Revenue" }
      ]}
    >
      {/* Instagram Feed Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Follow Our Journey</h2>
          <div className="aspect-square max-w-3xl mx-auto">
            <iframe
              src="https://www.instagram.com/cabo/embed"
              className="w-full h-full rounded-xl shadow-lg"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
            />
          </div>
        </div>
      </div>
    </LeadGenTemplate>
  );
}
