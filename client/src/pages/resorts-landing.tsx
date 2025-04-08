import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import { generateSlug, generateResortSlug } from "@/lib/utils"; //Import generateResortSlug
import { resorts } from "@/data/resorts";
import SEO from "@/components/SEO";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ResortInquiryForm from "@/components/resort-inquiry-form";

export default function ResortsLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [selectedResort, setSelectedResort] = useState<string>("");

  const locations = Array.from(new Set(resorts.map(resort => resort.location)));
  const priceLevels = Array.from(new Set(resorts.map(resort => resort.priceLevel)));

  const filteredResorts = resorts.filter(resort => {
    const matchesSearch = resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        resort.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === "all" || resort.location === locationFilter;
    const matchesPriceLevel = priceFilter === "all" || resort.priceLevel === priceFilter;

    return matchesSearch && matchesLocation && matchesPriceLevel;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Luxury Resorts in Cabo San Lucas | Cabo Adventures"
        description="Discover world-class resorts in Cabo San Lucas. From beachfront luxury to cliff-side retreats, find your perfect stay with exclusive amenities and stunning views."
        canonicalUrl="https://cabo-adventures.com/resorts"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Cabo San Lucas Luxury Resorts',
          description: 'Collection of premium resorts in Cabo San Lucas',
          publisher: {
            '@type': 'Organization',
            name: 'Cabo Adventures',
            url: 'https://cabo-adventures.com'
          },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: resorts.map((resort, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'LodgingBusiness',
                name: resort.name,
                description: resort.description,
                image: resort.imageUrl,
                priceRange: resort.priceLevel,
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: resort.rating,
                  reviewCount: resort.reviewCount
                }
              }
            }))
          }
        }}
        openGraph={{
          title: "Luxury Resorts in Cabo San Lucas",
          description: "Experience world-class hospitality at our carefully curated selection of premium resorts in Cabo San Lucas.",
          image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
          url: "https://cabo-adventures.com/resorts"
        }}
        keywords={[
          'Cabo San Lucas resorts',
          'luxury hotels',
          'beachfront resorts',
          'all-inclusive resorts',
          'Cabo accommodation',
          'luxury stays',
          'Mexico resorts'
        ]}
      />
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

        {/* Search and Filters */}
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            {/* Search */}
            <div className="max-w-xl mx-auto">
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
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Price Levels</option>
                {priceLevels.map(price => (
                  <option key={price} value={price}>{price}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-8 mb-6 text-center text-muted-foreground">
            Found {filteredResorts.length} resorts
          </div>

          {/* Resort Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResorts.map((resort) => (
              <Link
                key={resort.id}
                href={`/resorts/${generateResortSlug(resort.name)}`}
                className="block group"
              >
                <Card className="overflow-hidden transition-transform hover:scale-[1.02] h-full">
                  <div className="aspect-[16/9] relative">
                    <img
                      src={resort.imageUrl}
                      alt={resort.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {(resort.isBeachfront || resort.isOceanfront) && (
                      <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
                        {resort.isBeachfront ? 'Beachfront' : 'Oceanfront'}
                      </div>
                    )}
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
                    <p className="line-clamp-2 text-muted-foreground mb-4">
                      {resort.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{resort.priceLevel}</span>
                      <div className="space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedResort(resort.name);
                              }}
                            >
                              Inquire Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Inquire about {resort.name}</DialogTitle>
                              <DialogDescription>
                                Fill out this form and our team will get back to you with availability and rates.
                              </DialogDescription>
                            </DialogHeader>
                            <ResortInquiryForm resortName={resort.name} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}