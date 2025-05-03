import React from "react";
import { Helmet } from "react-helmet";
import VillaBookingTemplate from "@/components/templates/VillaBookingTemplate";
import { Bed, Bath, Users, Wifi, Waves, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Example villa data (would normally come from an API)
const exampleVilla = {
  id: "123",
  name: "Villa Estrella del Mar",
  description: "Experience luxury living in this stunning beachfront villa with breathtaking ocean views, private infinity pool, and direct beach access. This spacious 4-bedroom retreat offers the perfect blend of modern amenities and traditional Mexican charm. Enjoy gourmet meals prepared by our optional private chef, relax on your private terrace, or take a short 10-minute drive to vibrant downtown Cabo San Lucas.",
  location: "Cabo San Lucas",
  bedrooms: 4,
  bathrooms: 4.5,
  maxGuests: 10,
  pricePerNight: 1250,
  imageUrl: "/images/villas/villa-estrella-main.jpg",
  imageUrls: [
    "/images/villas/villa-estrella-main.jpg",
    "/images/villas/villa-estrella-pool.jpg",
    "/images/villas/villa-estrella-living.jpg",
    "/images/villas/villa-estrella-bedroom.jpg",
    "/images/villas/villa-estrella-kitchen.jpg"
  ],
  amenities: [
    "Infinity Pool", 
    "Hot Tub", 
    "Beach Access", 
    "Ocean View", 
    "Air Conditioning", 
    "WiFi", 
    "Full Kitchen", 
    "Outdoor Dining", 
    "Daily Housekeeping", 
    "Concierge Service"
  ],
  rating: 4.9,
  reviewCount: 27
};

// Example reviews
const reviews = [
  {
    author: "Sarah M.",
    date: "February 2025",
    rating: 5,
    content: "Absolutely stunning villa with incredible ocean views. The staff was amazing and attentive to every detail. We'll definitely be back!",
    helpful: 12
  },
  {
    author: "James R.",
    date: "January 2025",
    rating: 5,
    content: "Perfect for our family vacation. The private pool and outdoor areas were spectacular. Location is ideal - close to town but still private.",
    helpful: 8
  },
  {
    author: "Michael P.",
    date: "December 2024",
    rating: 4,
    content: "Beautiful property with excellent amenities. The concierge service was top-notch and helped arrange activities for our group.",
    helpful: 5
  }
];

export default function VillaExamplePage() {
  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>{exampleVilla.name} | Luxury Villa in Cabo San Lucas</title>
        <meta 
          name="description" 
          content={`Experience luxury at ${exampleVilla.name} in ${exampleVilla.location}, with ${exampleVilla.bedrooms} bedrooms, private pool, and ocean views.`} 
        />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        {/* Villa Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Main Image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img 
              src={exampleVilla.imageUrls[0]} 
              alt={exampleVilla.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Secondary Images */}
          <div className="grid grid-cols-2 gap-4">
            {exampleVilla.imageUrls.slice(1, 5).map((image, index) => (
              <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`${exampleVilla.name} - Image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Villa Booking Template with all details */}
        <VillaBookingTemplate
          title={exampleVilla.name}
          subtitle={`Luxury ${exampleVilla.bedrooms} Bedroom Villa in ${exampleVilla.location}`}
          description={exampleVilla.description}
          imageUrls={exampleVilla.imageUrls}
          pricePerNight={exampleVilla.pricePerNight}
          rating={exampleVilla.rating}
          reviewCount={exampleVilla.reviewCount}
          location={exampleVilla.location}
          maximumGuests={exampleVilla.maxGuests}
          features={[
            `${exampleVilla.bedrooms} Bedrooms`,
            `${exampleVilla.bathrooms} Bathrooms`,
            `Sleeps ${exampleVilla.maxGuests}`,
            'Private Pool',
            'Ocean View',
            'Daily Housekeeping',
            'Concierge Service'
          ]}
          amenities={exampleVilla.amenities}
          villaId={exampleVilla.id}
          reviews={reviews}
        />

        {/* Additional Villa Details */}
        <div className="mt-12">
          <Tabs defaultValue="amenities" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="amenities" className="space-y-6">
              <h2 className="text-2xl font-semibold">Villa Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Interior</h3>
                    <ul className="space-y-2">
                      {['Air Conditioning', 'WiFi', 'Smart TVs', 'Full Kitchen', 'Coffee Maker', 'Washer/Dryer', 'Premium Linens'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Outdoor</h3>
                    <ul className="space-y-2">
                      {['Infinity Pool', 'Hot Tub', 'Ocean View', 'Beach Access', 'Outdoor Shower', 'BBQ Grill', 'Outdoor Dining'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Services</h3>
                    <ul className="space-y-2">
                      {['Daily Housekeeping', 'Concierge Service', 'Private Chef (optional)', 'Airport Transfers', 'Security System', 'Welcome Package', '24/7 Support'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="location">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <p className="text-muted-foreground mb-6">
                Located in the exclusive Pedregal neighborhood, {exampleVilla.name} offers privacy while being just 10 minutes from downtown Cabo San Lucas and 
                30 minutes from San José del Cabo International Airport (SJD).
              </p>
              
              <h3 className="font-semibold mb-2">Nearby Attractions:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-1 text-muted-foreground">
                <li>Cabo San Lucas Marina (10 min drive)</li>
                <li>Medano Beach (15 min drive)</li>
                <li>The Arch of Cabo San Lucas (15 min by boat)</li>
                <li>Puerto Paraiso Mall (12 min drive)</li>
                <li>Quivira Golf Club (20 min drive)</li>
                <li>Flora Farms (45 min drive)</li>
              </ul>
              
              <div className="aspect-video rounded-lg overflow-hidden">
                {/* Placeholder for map - would be an actual map in production */}
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Map would be displayed here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="policies">
              <h2 className="text-2xl font-semibold mb-4">Policies</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Check-in & Check-out</h3>
                  <p className="text-muted-foreground">Check-in: 3:00 PM - 8:00 PM</p>
                  <p className="text-muted-foreground">Check-out: 11:00 AM</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">House Rules</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>No smoking inside the villa</li>
                    <li>No pets allowed</li>
                    <li>No parties or events without prior approval</li>
                    <li>Quiet hours from 10:00 PM to 8:00 AM</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                  <p className="text-muted-foreground mb-2">
                    Free cancellation up to 60 days before check-in.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>60+ days before check-in: Full refund</li>
                    <li>30-59 days before check-in: 50% refund</li>
                    <li>0-29 days before check-in: No refund</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Payment</h3>
                  <p className="text-muted-foreground">
                    A 25% deposit is required to secure your booking. The remaining balance is due 60 days before check-in.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* CTA */}
        <div className="mt-12 bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Ready to Experience {exampleVilla.name}?</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            Book now to secure your preferred dates or contact our concierge team for personalized assistance with your stay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-[#FF8C38] hover:bg-[#E67D29] text-white"
              size="lg"
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Now
            </Button>
            <Button variant="outline" size="lg">
              Contact Concierge
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}