import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import { generateSlug } from "@/lib/utils";
import Footer from "@/components/footer";
import { villas } from "@/data/villas";

export default function VillasLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  const locations = Array.from(new Set(villas.map(villa => villa.location.split(',')[0].trim())));
  const bedroomOptions = Array.from(new Set(villas.map(villa => villa.bedrooms))).sort((a, b) => a - b);

  const filteredVillas = villas.filter(villa => {
    const matchesSearch = villa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         villa.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === "all" || villa.location.includes(locationFilter);
    const matchesBedrooms = bedroomFilter === "all" || villa.bedrooms === parseInt(bedroomFilter);

    return matchesSearch && matchesLocation && matchesBedrooms;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-6">Luxury Villas in Cabo San Lucas</h1>
                <p className="text-xl">Experience the ultimate privacy and comfort in our handpicked selection of luxury villas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search villas by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              <select
                className="border rounded-md px-3 py-2"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                className="border rounded-md px-3 py-2"
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
              >
                <option value="all">All Bedrooms</option>
                {bedroomOptions.map(num => (
                  <option key={num} value={num}>{num} Bedrooms</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-8 mb-6 text-center text-muted-foreground">
            Found {filteredVillas.length} villas
          </div>

          {/* Villa Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVillas.map((villa) => (
              <Link
                key={villa.id}
                href={`/villa/${generateSlug(villa.name)}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full">
                  <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                    <img
                      src={villa.imageUrl}
                      alt={villa.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {(villa.isBeachfront || villa.isOceanfront) && (
                      <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
                        {villa.isBeachfront ? 'Beachfront' : 'Oceanfront'}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{villa.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span>{villa.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{villa.location}</span>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-muted-foreground">
                      {villa.description}
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      {villa.bedrooms} BR • {villa.bathrooms} BA • Up to {villa.maxGuests} guests
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}