import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Resort } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import Footer from "@/components/footer";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample amenities - ideally these would come from the database
const amenities = [
  "Pool",
  "Spa",
  "Free parking",
  "Free Wi-Fi",
  "Restaurant",
  "Room service",
  "Fitness center",
  "Beach access",
  "Concierge service",
  "Air conditioning"
];

export default function ResortDetail() {
  const { slug } = useParams();
  
  const { data: resorts, isLoading } = useQuery<Resort[]>({
    queryKey: ['/api/resorts'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/resorts");
      return response.json();
    }
  });

  const resort = resorts?.find(r => generateSlug(r.name) === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="animate-pulse">
              <div className="h-[400px] bg-muted rounded-lg mb-8" />
              <div className="h-8 bg-muted rounded w-1/3 mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-4 bg-muted rounded w-4/6" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!resort) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Resort Not Found</h1>
            <p>Sorry, we couldn't find the resort you're looking for.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={resort.imageUrl}
            alt={resort.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex items-end pb-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{resort.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{resort.rating} ({resort.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{resort.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">About {resort.name}</h2>
              <p className="text-muted-foreground mb-8">{resort.description}</p>

              {/* Amenities */}
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Card */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold mb-4">${resort.priceLevel}</div>
                  <Button className="w-full mb-4">Check Availability</Button>
                  <p className="text-sm text-muted-foreground">
                    Contact us for special rates and availability. Our concierge team is ready to assist you with your booking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
