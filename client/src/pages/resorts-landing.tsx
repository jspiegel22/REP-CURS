import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
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
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full bg-[url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Luxury Resorts in Cabo San Lucas</h1>
              <p className="text-xl mb-8">Experience world-class hospitality at our carefully curated selection of premium resorts. Each property offers stunning ocean views, exceptional service, and unforgettable experiences.</p>
              <Button size="lg" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
                View Available Resorts
              </Button>
            </div>
          </div>
        </div>
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