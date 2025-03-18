import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import { Resort } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiTripadvisor, SiExpedia } from "react-icons/si";

const testimonials = [
  {
    name: "Sarah M.",
    title: "Honeymooner",
    content: "The most incredible resort experience we've ever had. The staff went above and beyond.",
    rating: 5
  },
  {
    name: "James R.",
    title: "Family Vacation",
    content: "Perfect blend of luxury and comfort. Our kids loved the activities while we enjoyed the spa.",
    rating: 5
  },
  {
    name: "Michelle K.",
    title: "Business Retreat",
    content: "Impeccable service and fantastic meeting facilities. Will definitely return.",
    rating: 5
  }
];

const faqs = [
  {
    question: "What's included in the resort packages?",
    answer: "Our resort packages typically include accommodation, daily breakfast, access to all resort amenities, and select activities. Some packages also offer all-inclusive options with meals and premium experiences."
  },
  {
    question: "How far are the resorts from the airport?",
    answer: "Most of our partner resorts are within 30-45 minutes from Los Cabos International Airport (SJD). We can arrange luxury transportation for your convenience."
  },
  {
    question: "Can you accommodate special dietary requirements?",
    answer: "Yes, all our partner resorts offer extensive dining options including vegetarian, vegan, gluten-free, and other dietary preferences. Please let us know your requirements in advance."
  }
];

export default function ResortsLanding() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resorts, isLoading } = useQuery<Resort[]>({
    queryKey: ['/api/resorts'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/resorts");
      return response.json();
    }
  });

  const filteredResorts = resorts?.filter(resort =>
    resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1582719508461-905c673771fd')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Luxury Resorts in Cabo San Lucas</h1>
              <p className="text-xl">Discover world-class hospitality at our carefully curated selection of premium resorts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search resorts by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResorts?.map((resort) => (
              <Link
                key={resort.id}
                href={`/resort/${generateSlug(resort.name)}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full">
                  <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                    <img
                      src={resort.imageUrl}
                      alt={resort.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{resort.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span>{resort.rating} ({resort.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{resort.location}</span>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-muted-foreground">
                      {resort.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="bg-[#F5F5DC] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-12">
            <SiTripadvisor className="w-12 h-12 text-[#2F4F4F]" />
            <SiExpedia className="w-12 h-12 text-[#2F4F4F]" />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Why Choose Our Resorts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🌊</div>
            <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
            <p>Stunning beachfront properties with breathtaking ocean views and easy access to local attractions.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">✨</div>
            <h3 className="text-xl font-semibold mb-2">Luxury Amenities</h3>
            <p>World-class spas, infinity pools, private beaches, and exclusive dining experiences.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold mb-2">Family Friendly</h3>
            <p>Dedicated kids' clubs, family activities, and spacious accommodations for all group sizes.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Guest Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {"★".repeat(testimonial.rating)}
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2F4F4F] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Book your stay at one of our premium resorts and create unforgettable memories in Cabo San Lucas.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
            <Link href="/listings/resort">Browse Available Resorts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}