import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdventureCard } from "@/components/adventure-card";
import { Adventure } from "@/types/adventure";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import SEO, { generateAdventureSchema } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function AdventuresLanding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'water' | 'land' | 'luxury' | 'family'>('all');

  // Fetch adventures from the API
  const { data: adventures = [], isLoading, isError } = useQuery<Adventure[]>({ 
    queryKey: ['/api/adventures'],
    staleTime: 60 * 1000, // 1 minute
  });

  const filteredAdventures = adventures.filter((adventure) => {
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading adventures...</span>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
              <p className="text-red-700">There was an error loading adventures. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredAdventures.length === 0 && (
            <div className="text-center p-8 border border-dashed rounded-md border-gray-300">
              <p className="text-lg text-muted-foreground">No adventures found for the selected filter.</p>
              <Button className="mt-4" onClick={() => setFilter('all')}>View All Adventures</Button>
            </div>
          )}

          {/* Adventures Grid */}
          {!isLoading && !isError && filteredAdventures.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedAdventures.map((adventure) => (
                <AdventureCard key={adventure.id} adventure={adventure} />
              ))}
            </div>
          )}

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