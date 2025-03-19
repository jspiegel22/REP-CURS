import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdventureCard } from "@/components/adventure-card";
import { Adventure, parseAdventureData } from "@/types/adventure";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import SEO, { generateAdventureSchema } from "@/components/SEO";

// Import complete CSV data from the assets
const adventureData = `group href,h-full src,ais-Highlight-nonHighlighted,text-base,text-xs-4,absolute,font-sans,flex src (2),font-sans (2),gl-font-meta,group href (2)
https://www.cabo-adventures.com/en/tour/luxury-day-sailing/,https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp?w=640&q=65&fit=clip&auto=format,4-HOUR LUXURY CABO SAILING BOAT TOUR,$104 USD,$149 USD,-30%,4 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/signature-swim/,https://cdn.sanity.io/images/esqfj3od/production/bd7bfbf824efdf124cf41220ef1830bf4335a462-608x912.webp?w=640&q=65&fit=clip&auto=format,CABO DOLPHIN SWIM SIGNATURE,$146 USD,$209 USD,-30%,40 Minutes,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min. 4 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/outdoor-adventure-cabo/,https://cdn.sanity.io/images/esqfj3od/production/82ad01cfa3a513e85d158016f76161a9460e5247-608x912.webp?w=640&q=65&fit=clip&auto=format,OUTDOOR ADVENTURE 4X4 + CABO ZIPLINE + RAPPEL,$97 USD,$139 USD,-30%,3.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/camel-atv-ecofarm/,https://cdn.sanity.io/images/esqfj3od/production/35784d21127935173359fdf767ff0c62074ff0b5-608x912.webp?w=640&q=65&fit=clip&auto=format,CAMELS + ATV + LUNCH,$118 USD,$169 USD,-30%,3 hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/luxury-sunset-sailing-cabo/,https://cdn.sanity.io/images/esqfj3od/production/56c52d182d39bb86c7c5d638d537684b4c376b1b-608x912.webp?w=640&q=65&fit=clip&auto=format,LUXURY CABO SUNSET CRUISE,$76 USD,$109 USD,-30%,2.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/dolphin-experience/,https://cdn.sanity.io/images/esqfj3od/production/e561f483565d57da0f60f4b78b9d7e201e1719a5-608x912.webp?w=640&q=65&fit=clip&auto=format,CABO DOLPHIN EXPERIENCE,$125 USD,$179 USD,-30%,30 Min,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min. 4 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/luxury-two-bay-snorkel/,https://cdn.sanity.io/images/esqfj3od/production/6408a4a1046222b51e2764397e57ab987ad17be3-608x912.webp?w=640&q=65&fit=clip&auto=format,LUXURY TWO-BAY SNORKEL,$97 USD,$139 USD,-30%,4 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 5 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/outback-and-camel-safari/,https://cdn.sanity.io/images/esqfj3od/production/87cb95d909eacc583b3bcd8d9e0f8ebf8cc2bf22-608x912.webp?w=640&q=65&fit=clip&auto=format,OUTBACK & CABO CAMEL RIDE,$83 USD,$119 USD,-30%,3 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 5 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/luxury-whale-watching/,https://cdn.sanity.io/images/esqfj3od/production/76c1e97bb2129788a3907f7809aba1b85f328cbb-608x912.webp?w=640&q=65&fit=clip&auto=format,LUXURY WHALE WATCHING IN CABO,$97 USD,$139 USD,-30%,2.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 5 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/whale-shark-encounter/,https://cdn.sanity.io/images/esqfj3od/production/ae2e87b46789cce6c375dea1ebb9c678fac559f3-608x912.webp?w=640&q=65&fit=clip&auto=format,SWIM WITH WHALE SHARKS IN CABO,$202 USD,$289 USD,-30%,10 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,`;

const adventures = parseAdventureData(adventureData);

const ITEMS_PER_PAGE = 12;

export default function AdventuresLanding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'water' | 'land' | 'luxury' | 'family'>('all');

  const filteredAdventures = adventures.filter(adventure => {
    if (filter === 'all') return true;
    return adventure.category === filter;
  });

  const totalPages = Math.ceil(filteredAdventures.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAdventures = filteredAdventures.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cabo Adventures & Experiences | Thrilling Activities in Cabo San Lucas"
        description="Experience unforgettable adventures in Cabo San Lucas. From luxury yacht tours to desert safaris, discover exciting activities for all ages and interests."
        canonicalUrl="https://cabo-adventures.com/adventures"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Cabo San Lucas Adventures',
          description: 'Collection of premium adventures and experiences',
          publisher: {
            '@type': 'Organization',
            name: 'Cabo Adventures',
            url: 'https://cabo-adventures.com'
          },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: adventures.map((adventure, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: generateAdventureSchema(adventure)
            }))
          }
        }}
        openGraph={{
          title: "Exciting Adventures in Cabo San Lucas",
          description: "Discover thrilling adventures and unforgettable experiences in Cabo San Lucas. Book your next adventure today!",
          image: "https://images.unsplash.com/photo-1564351943427-3d61951984e9",
          url: "https://cabo-adventures.com/adventures"
        }}
        keywords={[
          'Cabo San Lucas activities',
          'adventure tours',
          'yacht tours',
          'water sports',
          'desert safari',
          'whale watching',
          'snorkeling',
          'luxury experiences'
        ]}
      />
      <main>
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1564351943427-3d61951984e9')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-6">Cabo Adventures & Experiences</h1>
                <p className="text-xl">Discover thrilling adventures and unforgettable experiences in Cabo San Lucas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        <div className="container mx-auto px-4 py-4 text-sm text-muted-foreground">
          <p>Total Adventures: {adventures.length}</p>
          <p>Filtered Adventures: {filteredAdventures.length}</p>
          <p>Current Page: {currentPage}</p>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-4 mb-8">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Adventures
            </Button>
            <Button
              variant={filter === 'water' ? 'default' : 'outline'}
              onClick={() => setFilter('water')}
            >
              Water Activities
            </Button>
            <Button
              variant={filter === 'land' ? 'default' : 'outline'}
              onClick={() => setFilter('land')}
            >
              Land Activities
            </Button>
            <Button
              variant={filter === 'luxury' ? 'default' : 'outline'}
              onClick={() => setFilter('luxury')}
            >
              Luxury Tours
            </Button>
            <Button
              variant={filter === 'family' ? 'default' : 'outline'}
              onClick={() => setFilter('family')}
            >
              Family Friendly
            </Button>
          </div>

          {/* Adventures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedAdventures.map((adventure) => (
              <AdventureCard key={adventure.id} adventure={adventure} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}