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
    name: "Michael R.",
    title: "Family Vacation",
    content: "The villa exceeded all expectations. Perfect for our multi-generational family gathering.",
    rating: 5
  },
  {
    name: "Jennifer L.",
    title: "Luxury Retreat",
    content: "Private chef service and infinity pool made this the most luxurious vacation ever.",
    rating: 5
  },
  {
    name: "David K.",
    title: "Group Getaway",
    content: "Spacious, private, and absolutely stunning. The concierge service was exceptional.",
    rating: 5
  }
];

const faqs = [
  {
    question: "What amenities are included in luxury villa rentals?",
    answer: "Our luxury villas come with private pools, fully equipped kitchens, daily housekeeping, concierge service, and optional private chef services. Many also feature ocean views, home theaters, and private beach access."
  },
  {
    question: "How far in advance should I book?",
    answer: "For peak seasons (December-April), we recommend booking 6-8 months in advance. For off-peak seasons, 3-4 months ahead is usually sufficient to secure your preferred villa."
  },
  {
    question: "Is airport transfer included?",
    answer: "Yes, all villa bookings include complimentary airport transfers. We'll have a luxury vehicle waiting for you upon arrival."
  }
];

export default function VillasLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] w-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Luxury Villas in Cabo San Lucas</h1>
              <p className="text-xl mb-8">Experience unparalleled privacy and luxury in our handpicked collection of oceanfront villas. Complete with private pools, dedicated staff, and breathtaking views.</p>
              <Button size="lg" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
                View Available Villas
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
        <h2 className="text-3xl font-bold mb-12 text-center text-[#2F4F4F]">The Ultimate Villa Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🏊‍♂️</div>
            <h3 className="text-xl font-semibold mb-2">Private Pools</h3>
            <p>Infinity pools with stunning ocean views, perfect for swimming or lounging.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">👨‍🍳</div>
            <h3 className="text-xl font-semibold mb-2">Personal Chef</h3>
            <p>Optional in-villa chef service for gourmet dining experiences.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl text-[#2F4F4F]">🛎️</div>
            <h3 className="text-xl font-semibold mb-2">Concierge Service</h3>
            <p>24/7 dedicated concierge to handle all your needs and requests.</p>
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
            Book your private villa in Cabo San Lucas and start planning your perfect getaway.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
            <Link href="/listings/villa">Browse Available Villas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
