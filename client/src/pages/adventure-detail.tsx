import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Clock, Users, Plus, Minus, Loader2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFooter } from "@/components/product-footer";
import { RewardsPanel } from "@/components/rewards-panel";
import { SocialShare } from "@/components/social-share";
import TopAdventures from "@/components/top-adventures";
import InlineBookingForm from "@/components/inline-booking-form";
import { useToast } from "@/hooks/use-toast";

// Removed next/router import
import SEO, { generateAdventureSchema } from "@/components/SEO";

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
  const { toast } = useToast();
  const { slug } = useParams();
  const [adventure, setAdventure] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "1",
    message: "",
    showMobileCTA: false
  });
  
  // Function to open image modal
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };
  
  // Function to close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  const [bookingOpen, setBookingOpen] = useState(false);
  
  // Fetch the specific adventure data by slug
  useEffect(() => {
    async function fetchAdventure() {
      try {
        setLoading(true);
        const response = await fetch('/api/adventures');
        if (!response.ok) {
          throw new Error('Failed to fetch adventure data');
        }
        
        const adventures = await response.json();
        const foundAdventure = adventures.find((a: any) => a.slug === slug);
        
        if (foundAdventure) {
          setAdventure(foundAdventure);
        } else {
          toast({
            title: "Adventure not found",
            description: "We couldn't find the adventure you're looking for",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching adventure:', error);
        toast({
          title: "Error",
          description: "Failed to load adventure details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchAdventure();
  }, [slug, toast]);
  
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading adventure details...</h2>
        </div>
      </div>
    );
  }
  
  if (!adventure) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Adventure not found</h1>
        <p className="mb-6">We couldn't find the adventure you're looking for.</p>
        <Button 
          onClick={() => window.location.href = '/adventures'}
          className="bg-[#FF8C38] hover:bg-[#E67D29] text-white"
        >
          Browse all adventures
        </Button>
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
        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" 
            onClick={closeImageModal}
          >
            <div className="relative max-w-4xl w-full">
              <button 
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  closeImageModal();
                }}
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt={adventure?.title || 'Adventure image'} 
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <img
            src={adventure.imageUrl}
            alt={adventure.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"> {/* Black overlay with 40% opacity */}
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
                {/* Gallery Section for Yacht Photos - Only show for yacht category */}
                {adventure.category === 'yacht' && adventure.imageUrls && adventure.imageUrls.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Yacht Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[adventure.imageUrl, ...adventure.imageUrls].map((imageUrl, index) => (
                        <div 
                          key={index} 
                          className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            if (openImageModal) {
                              openImageModal(imageUrl);
                            }
                          }}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`${adventure.title} - Photo ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-semibold mb-4">About This Adventure</h2>
                <p className="text-muted-foreground mb-8">
                  Experience an unforgettable adventure with {adventure.provider}. This {adventure.duration.toLowerCase()} tour offers an exciting opportunity to explore Cabo's natural wonders. Our professional guides ensure your safety while providing an engaging and memorable experience. Perfect for {adventure.minAge.toLowerCase()} looking for adventure!
                </p>
                
                {/* Key Features Section for Yacht Adventures - Using actual features from the adventure data */}
                {adventure.category === 'yacht' && adventure.keyFeatures && adventure.keyFeatures.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {adventure.keyFeatures.map((feature, index) => {
                        // Associate icons with specific key features
                        let icon;
                        let description = "";
                        
                        if (feature.includes("Premium") || feature.includes("Luxury")) {
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          );
                          description = "State-of-the-art vessel with luxury fittings";
                        } else if (feature.includes("Refreshment") || feature.includes("Drinks") || feature.includes("Beverage")) {
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          );
                          description = "Complimentary premium drinks and refreshments";
                        } else if (feature.includes("View") || feature.includes("Ocean") || feature.includes("Scenic")) {
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          );
                          description = "Breathtaking panoramic views of Cabo's coastline";
                        } else if (feature.includes("Crew") || feature.includes("Service")) {
                          icon = (
                            <Users className="w-16 h-16 text-blue-500" />
                          );
                          description = "Professional crew providing excellent service";
                        } else if (feature.includes("Custom") || feature.includes("Private")) {
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          );
                          description = "Tailored to your preferences for a unique experience";
                        } else {
                          // Default icon for any other features
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                          );
                          description = "High-quality feature for an enhanced experience";
                        }
                      
                        return (
                          <Card key={index}>
                            <CardContent className="p-6 text-center">
                              <div className="flex justify-center mb-4">
                                {icon}
                              </div>
                              <h3 className="font-semibold text-lg">{feature}</h3>
                              <p className="text-sm text-muted-foreground mt-2">{description}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                          className="object-cover w-full h-full"
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
                        provider={adventure.provider}
                        isYacht={adventure.category === 'yacht'}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards Section removed as requested */}

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