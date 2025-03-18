import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import { Resort } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { SiTripadvisor } from "react-icons/si";

export default function ResortsLanding() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resorts, isLoading } = useQuery<Resort[]>({
    queryKey: ['/api/resorts'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/resorts");
      return response.json();
    }
  });

  const filteredResorts = resorts?.filter(resort =>
    resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1582719508461-905c673771fd')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-6">Luxury Resorts in Cabo San Lucas</h1>
                <p className="text-xl">Discover world-class hospitality at our carefully curated selection of premium resorts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Results */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search resorts by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResorts?.map((resort) => (
                <Link
                  key={resort.id}
                  href={`/resort/${generateSlug(resort.name)}`}
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <Card className="h-full">
                    <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                      <img
                        src={resort.imageUrl}
                        alt={resort.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{resort.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                          <span>{resort.rating} ({resort.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{resort.location}</span>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-muted-foreground">
                        {resort.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="bg-[#F5F5DC] py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center">
              <SiTripadvisor className="w-12 h-12 text-[#2F4F4F]" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}