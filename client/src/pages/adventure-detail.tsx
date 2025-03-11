import { useParams } from "wouter";
import { Adventure, parseAdventureData } from "@/types/adventure";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Clock, Users, Calendar } from "lucide-react";

// Import complete CSV data
const adventureData = `group href,h-full src,ais-Highlight-nonHighlighted,text-base,text-xs-4,absolute,font-sans,flex src (2),font-sans (2),gl-font-meta,group href (2)
https://www.cabo-adventures.com/en/tour/luxury-day-sailing/,https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp?w=640&q=65&fit=clip&auto=format,4-HOUR LUXURY CABO SAILING BOAT TOUR,$104 USD,$149 USD,-30%,4 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,`;

const adventures = parseAdventureData(adventureData);

const faqs = [
  {
    question: "What's included in the tour?",
    answer: "Our tours include professional guides, all necessary equipment, and safety briefings. Some tours also include meals and refreshments - see the specific tour details for more information."
  },
  {
    question: "What should I bring?",
    answer: "We recommend bringing sunscreen, comfortable clothing, and a camera. Specific requirements will be provided upon booking."
  },
  {
    question: "Is transportation included?",
    answer: "Yes, round-trip transportation from most hotels in Cabo San Lucas and San José del Cabo is included."
  }
];

const reviews = [
  {
    name: "Michael S.",
    date: "March 2025",
    rating: 5,
    comment: "Amazing experience! The guides were professional and made sure everyone was safe and having fun."
  },
  {
    name: "Jessica R.",
    date: "February 2025",
    rating: 5,
    comment: "Highlight of our trip to Cabo. Would definitely recommend this adventure!"
  }
];

export default function AdventureDetail() {
  const { id } = useParams();
  const adventure = adventures.find(a => a.id === id);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    participants: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking form submitted:", formData);
  };

  if (!adventure) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Adventure not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img
          src={adventure.imageUrl}
          alt={adventure.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-end py-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-4">{adventure.title}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{adventure.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{adventure.minAge}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Content */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About This Adventure</h2>
              <p className="text-muted-foreground mb-8">
                Experience an unforgettable adventure with Cabo Adventures. Our professional guides ensure your safety while providing an exciting and memorable experience.
              </p>

              {/* What's Included Section */}
              <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Equipment</h3>
                    <p className="text-sm text-muted-foreground">All necessary equipment and safety gear provided</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Transportation</h3>
                    <p className="text-sm text-muted-foreground">Round-trip transportation from select hotels</p>
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
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-bold">{adventure.currentPrice}</span>
                    {adventure.discount && (
                      <span className="ml-2 text-sm line-through text-muted-foreground">
                        {adventure.originalPrice}
                      </span>
                    )}
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="w-full">Book Now</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Book Your Adventure</SheetTitle>
                        <SheetDescription>
                          Fill out the form below and we'll get back to you shortly with availability.
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
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input 
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="participants">Number of Participants</Label>
                          <Input 
                            id="participants"
                            type="number"
                            value={formData.participants}
                            onChange={e => setFormData({...formData, participants: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Special Requests</Label>
                          <Textarea 
                            id="message"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            placeholder="Any special requirements or questions?"
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Submit Booking Request
                        </Button>
                      </form>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
