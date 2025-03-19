import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { VillaCard } from "@/components/villa-card";
import Footer from "@/components/footer";
import type { Villa } from "@shared/schema";
import { sampleVillas } from "@/data/sample-villas";

export default function VillasLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [guestFilter, setGuestFilter] = useState<string>("all");

  // Use sample data instead of API call temporarily
  const villas = sampleVillas;

  const locations = Array.from(new Set(villas.map(villa => villa.location))).sort();
  const bedroomOptions = Array.from(new Set(villas.map(villa => villa.bedrooms))).sort((a, b) => a - b);
  const guestOptions = Array.from(new Set(villas.map(villa => villa.maxGuests))).sort((a, b) => a - b);

  const filteredVillas = villas.filter(villa => {
    const matchesSearch = villa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       villa.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === "all" || villa.location === locationFilter;
    const matchesBedrooms = bedroomFilter === "all" || villa.bedrooms === parseInt(bedroomFilter);
    const matchesGuests = guestFilter === "all" || villa.maxGuests === parseInt(guestFilter);

    return matchesSearch && matchesLocation && matchesBedrooms && matchesGuests;
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

              <select
                className="border rounded-md px-3 py-2"
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
              >
                <option value="all">All Guest Capacities</option>
                {guestOptions.map(num => (
                  <option key={num} value={num}>Up to {num} Guests</option>
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
              <VillaCard
                key={villa.trackHsId}
                villa={villa}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}