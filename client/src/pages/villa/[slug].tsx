import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Bed, Bath, Users, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Villa {
  id: number;
  name: string;
  address: string;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  imageUrls: string[];
  amenities: string[];
  featured: boolean;
  trackHsId?: string;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function VillaDetailPage() {
  const { slug } = useParams();
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const { toast } = useToast();
  const decodedSlug = slug ? decodeURIComponent(slug) : "";
  const formattedSlug = decodedSlug.replace(/-/g, " ");
  
  // Query to fetch all villas
  const { data: villas, isLoading, error } = useQuery({
    queryKey: ["/api/villas"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/villas");
      if (!response.ok) {
        throw new Error("Failed to fetch villas");
      }
      return response.json();
    },
  });

  // Find the villa that matches the slug
  const villa = villas?.find((v: Villa) => 
    v.name.toLowerCase() === formattedSlug.toLowerCase() ||
    (v.trackHsId && v.trackHsId === decodedSlug)
  );

  // Format amenities into categories for better display
  const amenityCategories = {
    indoor: [
      "WiFi", "Kitchen", "Washer", "Dryer", "TV", "Air Conditioning", 
      "Heating", "Workspace", "Iron", "Hair Dryer", "Fireplace"
    ],
    outdoor: [
      "Pool", "Hot Tub", "Patio", "BBQ Grill", "Beach Access", "Garden", 
      "Balcony", "Ocean View", "Fire Pit", "Parking"
    ],
    services: [
      "Daily Cleaning", "Concierge", "Security", "Chef", "Butler", "Childcare",
      "Transportation", "Massage", "Yoga"
    ]
  };

  const categorizedAmenities = {
    indoor: villa?.amenities?.filter(a => amenityCategories.indoor.includes(a)) || [],
    outdoor: villa?.amenities?.filter(a => amenityCategories.outdoor.includes(a)) || [],
    services: villa?.amenities?.filter(a => amenityCategories.services.includes(a)) || [],
    other: villa?.amenities?.filter(a => 
      !amenityCategories.indoor.includes(a) && 
      !amenityCategories.outdoor.includes(a) && 
      !amenityCategories.services.includes(a)
    ) || []
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !villa) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error ? "Error loading villa details. Please try again later." : "Villa not found."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Make sure villa has imageUrls populated
  if (!villa.imageUrls || !Array.isArray(villa.imageUrls)) {
    villa.imageUrls = ["https://via.placeholder.com/800x600?text=No+Image+Available"];
  }

  const heroImage = villa.imageUrls[0];
  const galleryImages = villa.imageUrls.slice(1);

  return (
    <>
      <Helmet>
        <title>{villa.name} | Cabo Adventure</title>
        <meta name="description" content={`Experience luxury at ${villa.name} in ${villa.location}, Cabo San Lucas with ${villa.bedrooms} bedrooms and ${villa.bathrooms} bathrooms.`} />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Villa Title and Location */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{villa.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{villa.location}</span>
              <div className="flex items-center ml-4">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">4.8</span>
                <span className="text-gray-500 ml-1">(24 reviews)</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main hero image - larger */}
            <div 
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer transition-all hover:opacity-95"
              onClick={() => setImageGalleryOpen(true)}
            >
              <img 
                src={heroImage} 
                alt={`${villa.name} main image`} 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Grid of smaller images */}
            <div className="grid grid-cols-2 gap-2">
              {galleryImages.slice(0, 4).map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all hover:opacity-90"
                  onClick={() => setImageGalleryOpen(true)}
                >
                  <img 
                    src={img} 
                    alt={`${villa.name} image ${index + 2}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {index === 3 && galleryImages.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                      <span>+{galleryImages.length - 4} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* View all photos button */}
          <Button
            variant="outline"
            onClick={() => setImageGalleryOpen(true)}
            className="w-full md:w-auto"
          >
            View All Photos
          </Button>

          {/* Content Grid - Details and booking form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Villa Details */}
            <div className="col-span-1 lg:col-span-2">
              {/* Summary section */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <span>{villa.bedrooms} Bedroom{villa.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <span>{villa.bathrooms} Bathroom{villa.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span>Sleeps {villa.maxGuests}</span>
                  </div>
                  {villa.featured && (
                    <Badge variant="secondary" className="bg-[#2F4F4F] text-white">Featured</Badge>
                  )}
                </div>
                <p className="text-gray-600 whitespace-pre-line">{villa.description}</p>
              </div>

              {/* Amenities section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <Tabs defaultValue="indoor" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="indoor">Indoor</TabsTrigger>
                    <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    {categorizedAmenities.other.length > 0 && (
                      <TabsTrigger value="other">Other</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="indoor">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categorizedAmenities.indoor.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-[#2F4F4F]" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="outdoor">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categorizedAmenities.outdoor.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-[#2F4F4F]" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="services">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categorizedAmenities.services.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-[#2F4F4F]" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  {categorizedAmenities.other.length > 0 && (
                    <TabsContent value="other">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categorizedAmenities.other.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-[#2F4F4F]" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>

              {/* Location section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <p className="mb-2">{villa.address}</p>
                <p className="text-gray-600">{villa.location}, Cabo San Lucas, Mexico</p>
                {/* If we had a map component we could add it here */}
              </div>
            </div>

            {/* Right Column - Booking/Inquiry Form */}
            <div className="col-span-1">
              <Card className="sticky top-8 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold">${villa.pricePerNight.toLocaleString()}</span>
                      <span className="text-gray-500"> / night</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>4.8</span>
                      <span className="text-gray-400">(24)</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 mb-4"
                    onClick={() => setIsInquiryFormOpen(true)}
                  >
                    Learn More
                  </Button>
                  
                  <div className="text-gray-600 text-sm space-y-3">
                    <div className="flex justify-between">
                      <span>No charge to learn more</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability for your dates</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Special rates for longer stays</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Villa Inquiry Form Modal - To be implemented */}
      
      {/* Full Image Gallery Modal - To be implemented */}
    </>
  );
}