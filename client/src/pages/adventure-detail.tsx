import { useParams } from "wouter";
import { Adventure, parseAdventureData } from "@/types/adventure";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Clock, Users, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFooter } from "@/components/product-footer";
import { RewardsPanel } from "@/components/rewards-panel";
import { SocialShare } from "@/components/social-share";
import TopAdventures from "@/components/top-adventures";
import InlineBookingForm from "@/components/inline-booking-form";

// Removed next/router import
import SEO, { generateAdventureSchema } from "@/components/SEO";

// Import complete CSV data
const adventureData = `group href,h-full src,ais-Highlight-nonHighlighted,text-base,text-xs-4,absolute,font-sans,flex src (2),font-sans (2),gl-font-meta,group href (2)
https://www.cabo-adventures.com/en/tour/luxury-day-sailing/,https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp?w=640&q=65&fit=clip&auto=format,4-HOUR LUXURY CABO SAILING BOAT TOUR,$104 USD,$149 USD,-30%,4 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/signature-swim/,https://cdn.sanity.io/images/esqfj3od/production/bd7bfbf824efdf124cf41220ef1830bf4335a462-608x912.webp?w=640&q=65&fit=clip&auto=format,CABO DOLPHIN SWIM SIGNATURE,$146 USD,$209 USD,-30%,40 Minutes,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min. 4 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/outdoor-adventure-cabo/,https://cdn.sanity.io/images/esqfj3od/production/82ad01cfa3a513e85d158016f76161a9460e5247-608x912.webp?w=640&q=65&fit=clip&auto=format,OUTDOOR ADVENTURE 4X4 + CABO ZIPLINE + RAPPEL,$97 USD,$139 USD,-30%,3.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/atv-adventure/,/uploads/ATV-Tour-Cabo.png,CABO ATV ADVENTURE TOUR,$89 USD,$129 USD,-30%,2.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 16 years old,ADD TO CART,`;

const adventures = parseAdventureData(adventureData);

const faqs = [
  {
    question: "What's included in the tour?",
    answer: "Our tours include professional guides, all necessary equipment, safety briefings, and round-trip transportation from most Cabo San Lucas hotels. Many tours also include snacks, drinks, and lunch depending on the duration."
  },
  {
    question: "What should I bring?",
    answer: "We recommend bringing sunscreen, comfortable clothing appropriate for the activity, a camera (waterproof if applicable), and a sense of adventure! Specific requirements will be provided upon booking."
  },
  {
    question: "Is transportation included?",
    answer: "Yes, round-trip transportation from most hotels in Cabo San Lucas and San José del Cabo is included."
  }
];

const reviews = [
  {
    name: "Sarah M.",
    date: "February 2025",
    rating: 5,
    comment: "Absolutely amazing experience! The guides were professional and made sure everyone was safe while having fun."
  },
  {
    name: "James R.",
    date: "January 2025",
    rating: 5,
    comment: "Best tour we've taken in Cabo. Will definitely book with them again!"
  }
];

const socialProof = {
  images: [
    {
      url: "https://images.unsplash.com/photo-1565776874372-9f4800aae553?w=800",
      author: "@mariasol"
    },
    {
      url: "https://images.unsplash.com/photo-1565776874459-a8ea3c4aa2b1?w=800",
      author: "@jacktravel"
    },
    {
      url: "https://images.unsplash.com/photo-1565776874789-c80e2475c229?w=800",
      author: "@beachlife"
    }
  ]
};

export default function AdventureDetail() {
  const { slug } = useParams();
  const adventure = adventures.find(a => a.slug === slug);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "1",
    message: "",
    showMobileCTA: false
  });
  const [bookingOpen, setBookingOpen] = useState(false);
  const adventureId = adventure?.id || -1;

  // Add scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const showCTA = scrollPosition > 300; // Show after scrolling 300px

      setFormData(prev => ({
        ...prev,
        showMobileCTA: showCTA
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!adventure) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Adventure not found</h1>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${adventure.title} - Adventure in Cabo San Lucas | Cabo Adventures`}
        description={`Experience ${adventure.title}, an exciting adventure in Cabo San Lucas. Book your adventure today!`}
        canonicalUrl={`https://cabo-adventures.com/adventures/${adventure.slug}`}
        schema={generateAdventureSchema(adventure)}
        openGraph={{
          title: `${adventure.title} - Adventure in Cabo San Lucas`,
          description: `Join us for this amazing ${adventure.duration} adventure in Cabo San Lucas.`,
          image: adventure.imageUrl,
          url: `https://cabo-adventures.com/adventures/${adventure.slug}`
        }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <img
            src={adventure.imageUrl}
            alt={adventure.title}
            className="w-full h-full object-fill"
          />
          <div className="absolute inset-0 bg-[#2F4F4F]/40"> {/* Match footer color */}
            <div className="container mx-auto px-4 h-full flex items-end py-8">
              <div className="text-white w-full max-w-4xl">
                <h1 className="text-4xl font-bold mb-2">{adventure.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400 text-xl" style={{ letterSpacing: '-3px' }}>
                    {"★".repeat(Math.floor(adventure.rating || 0))}
                    {(adventure.rating || 0) % 1 > 0 && "★"}
                  </span>
                  <span>({adventure.rating} / 5)</span>
                </div>
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

        {/* Top Booking Section */}
        <div className="bg-gray-50 py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-2xl font-bold">{adventure.currentPrice}</span>
                {adventure.discount && (
                  <span className="ml-2 text-sm line-through text-muted-foreground">
                    {adventure.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-[#2F4F4F]/10"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      guests: Math.max(1, parseInt(prev.guests) - 1).toString()
                    }))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-20 text-center font-medium">
                    {formData.guests} Guest{parseInt(formData.guests) !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-[#2F4F4F]/10"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      guests: Math.min(10, parseInt(prev.guests) + 1).toString()
                    }))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {/* Removed popup button & dialog form from here */}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">About This Adventure</h2>
                <p className="text-muted-foreground mb-8">
                  Experience an unforgettable adventure with {adventure.provider}. This {adventure.duration.toLowerCase()} tour offers an exciting opportunity to explore Cabo's natural wonders. Our professional guides ensure your safety while providing an engaging and memorable experience. Perfect for {adventure.minAge.toLowerCase()} looking for adventure!
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

                {/* Social Proof Section */}
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">Guest Photos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {socialProof.images.map((image, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image.url}
                          alt={`Photo by ${image.author}`}
                          className="object-fill w-full h-full"
                        />
                        <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                          {image.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <h2 className="text-2xl font-semibold mb-6">Guest Reviews</h2>
                <div className="space-y-6 mb-12">
                  {reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-semibold">{review.name}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-400" style={{ letterSpacing: '-3px' }}>
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                        <p className="text-sm">"{review.comment}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Accordion */}
                <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                <div className="mb-12">
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border rounded-md">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="order-first lg:order-last">
              {/* Booking Card */}
              <Card className="sticky top-4 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Book this adventure</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price per person:</span>
                      <span>{adventure.currentPrice}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-medium">Duration:</span>
                      <span>{adventure.duration}</span>
                    </div>
                    <div className="pt-2">
                      <InlineBookingForm 
                        adventureName={adventure.title}
                        price={parseFloat(adventure.currentPrice.replace(/[^0-9.]/g, ''))}
                        image={adventure.imageUrl}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards Section */}
              <div className="mb-6">
                <RewardsPanel />
              </div>

              {/* Social Share */}
              <SocialShare
                title={adventure.title}
                imageUrl={adventure.imageUrl}
                listingId={Number(adventure.id)}
              />
            </div>
          </div>
        </div>

        {/* Other Top Adventures Section */}
        <TopAdventures currentAdventureId={Number(adventure.id)} />

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden transform transition-transform duration-300 z-50"
          style={{
            transform: formData.showMobileCTA ? 'translateY(0)' : 'translateY(100%)'
          }}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-semibold">{adventure.currentPrice}</span>
              {adventure.discount && (
                <span className="text-xs text-muted-foreground line-through">
                  {adventure.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    guests: Math.max(1, parseInt(prev.guests) - 1).toString()
                  }))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-5 text-center">
                  {formData.guests}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    guests: Math.min(10, parseInt(prev.guests) + 1).toString()
                  }))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                size="sm"
                className="bg-[#FF8C38] hover:bg-[#E67D29] text-white shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  const bookingElement = document.querySelector('.sticky.top-4');
                  if (bookingElement) {
                    window.scrollTo({
                      top: bookingElement.getBoundingClientRect().top + window.scrollY - 100,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}