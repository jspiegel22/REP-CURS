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
    name: "Alex P.",
    title: "Adventure Seeker",
    content: "The whale watching tour was incredible! We saw so many whales and the crew was fantastic.",
    rating: 5
  },
  {
    name: "Maria S.",
    title: "First-time Visitor",
    content: "Our ATV desert tour was the highlight of our trip. Amazing views and professional guides.",
    rating: 5
  },
  {
    name: "John D.",
    title: "Sports Enthusiast",
    content: "The deep-sea fishing experience was world-class. Caught a marlin on our first try!",
    rating: 5
  }
];

const faqs = [
  {
    question: "What's included in adventure packages?",
    answer: "Our adventure packages typically include all necessary equipment, professional guides, safety briefings, and often transportation from major hotels. Some tours also include meals and refreshments."
  },
  {
    question: "Do I need prior experience?",
    answer: "Most of our adventures are suitable for beginners and include thorough instruction. Some advanced activities may require previous experience - this will be clearly noted in the tour description."
  },
  {
    question: "What should I bring?",
    answer: "Generally, you should bring sunscreen, comfortable clothing, and a sense of adventure! Specific requirements will be provided for each activity upon booking."
  }
];

export default function AdventuresLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Cabo Adventures & Experiences</h1>
              <p className="text-xl mb-8">From whale watching to desert expeditions, discover thrilling adventures in Cabo San Lucas. Create unforgettable memories with our expert-guided tours.</p>
              <Button size="lg" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
                Explore Adventures
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
        <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Experience the Best of Cabo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🐋</div>
            <h3 className="text-xl font-semibold mb-2">Marine Life</h3>
            <p>Encounter magnificent whales, sea lions, and tropical fish in their natural habitat.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🏍️</div>
            <h3 className="text-xl font-semibold mb-2">Desert Tours</h3>
            <p>Explore Baja's stunning desert landscape on ATV or camel adventures.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🎣</div>
            <h3 className="text-xl font-semibold mb-2">Sport Fishing</h3>
            <p>World-class fishing experiences with professional crew and equipment.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">Adventure Stories</h2>
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
          <h2 className="text-3xl font-bold mb-4">Ready for Adventure?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Book your next thrilling experience in Cabo San Lucas today.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
            <Link href="/listings/adventure">Browse Adventures</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
