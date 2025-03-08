import { useParams } from "wouter";
import { Villa, parseVillaData } from "@/types/villa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Import CSV data
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16`;
const villas = parseVillaData(villaData);

const faqs = [
  {
    question: "What's included in the villa rental?",
    answer: "Our villa rentals include daily housekeeping, concierge service, welcome drinks, and airport transfers. Many villas also offer additional services like private chefs and spa treatments."
  },
  {
    question: "How do I book activities and excursions?",
    answer: "Your dedicated concierge can arrange all activities and excursions. From fishing trips to sunset cruises, we'll handle all the details for you."
  },
  {
    question: "What's the check-in/check-out process?",
    answer: "Check-in is at 3 PM and check-out is at 11 AM. Early check-in and late check-out can be arranged based on availability."
  }
];

const reviews = [
  {
    name: "Sarah M.",
    date: "February 2025",
    rating: 5,
    comment: "Absolutely stunning villa with incredible ocean views. The staff was amazing and attentive to every detail."
  },
  {
    name: "James R.",
    date: "January 2025",
    rating: 5,
    comment: "Perfect for our family vacation. The private pool and outdoor areas were spectacular."
  }
];

export default function VillaDetail() {
  const { id } = useParams();
  const villa = villas.find(v => v.id === id);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dates: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  if (!villa) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Villa Not Found</h1>
        <p>Sorry, we couldn't find the villa you're looking for.</p>
        <Button asChild className="mt-4">
          <a href="/villas">Back to Villas</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div 
        className="relative h-[70vh] min-h-[500px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${villa.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto px-4 h-full flex items-end pb-12">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">{villa.name}</h1>
              <p className="text-xl">{villa.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">About this Villa</h2>
            <p className="text-muted-foreground mb-8">{villa.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.maxOccupancy}</p>
                  <p className="text-sm text-muted-foreground">Max Guests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.rating}</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Reviews Section */}
            <h2 className="text-2xl font-semibold mb-6">Guest Reviews</h2>
            <div className="space-y-6 mb-12">
              {reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mb-12">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Book this Villa</h3>
                <p className="text-muted-foreground mb-6">
                  Contact us to check availability and book your stay at {villa.name}.
                </p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full" size="lg">
                      Inquire Now
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Book {villa.name}</SheetTitle>
                      <SheetDescription>
                        Fill out the form below and we'll get back to you shortly with availability and pricing.
                      </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dates">Preferred Dates</Label>
                        <Input 
                          id="dates"
                          value={formData.dates}
                          onChange={e => setFormData({...formData, dates: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message"
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder="Tell us about your group and any special requests..."
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Inquiry
                      </Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}