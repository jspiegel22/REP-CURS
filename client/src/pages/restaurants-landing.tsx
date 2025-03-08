import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { SiTripadvisor } from "react-icons/si";

const testimonials = [
  {
    name: "Robert M.",
    title: "Food Enthusiast",
    content: "The farm-to-table experience at Flora Farms was exceptional. A must-visit for food lovers!",
    rating: 5
  },
  {
    name: "Isabella C.",
    title: "Luxury Traveler",
    content: "Incredible sunset dining with fresh seafood. The service was impeccable.",
    rating: 5
  },
  {
    name: "Thomas W.",
    title: "Wine Connoisseur",
    content: "Amazing wine selection and the chef's tasting menu was outstanding.",
    rating: 5
  }
];

const faqs = [
  {
    question: "Do I need reservations?",
    answer: "For fine dining restaurants and popular establishments, we highly recommend making reservations, especially during peak season (December-April)."
  },
  {
    question: "What's the dress code?",
    answer: "Dress codes vary by restaurant. Most fine dining establishments require smart casual attire. Specific dress codes will be noted in the restaurant details."
  },
  {
    question: "Are dietary restrictions accommodated?",
    answer: "Yes, most restaurants can accommodate various dietary restrictions including vegetarian, vegan, and gluten-free options. Please mention any restrictions when making your reservation."
  }
];

export default function RestaurantsLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Culinary Excellence in Cabo</h1>
              <p className="text-xl mb-8">From exclusive beachfront dining to authentic local cuisine, discover the finest restaurants and culinary experiences in Cabo San Lucas.</p>
              <Button size="lg" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
                Explore Restaurants
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-[#F5F5DC] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <SiTripadvisor className="w-12 h-12 text-[#2F4F4F]" />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Dining Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🌊</div>
            <h3 className="text-xl font-semibold mb-2">Oceanfront Dining</h3>
            <p>Enjoy fresh seafood and stunning views at our beachfront restaurants.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">👨‍🍳</div>
            <h3 className="text-xl font-semibold mb-2">Celebrity Chefs</h3>
            <p>Experience innovative cuisine from world-renowned chefs and restaurants.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🌮</div>
            <h3 className="text-xl font-semibold mb-2">Local Flavors</h3>
            <p>Discover authentic Mexican cuisine and regional specialties.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Dining Experiences</h2>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Dine?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover the best restaurants and make your reservation today.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
            <Link href="/listings/restaurant">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
