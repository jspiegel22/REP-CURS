import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdventureCard } from "@/components/adventure-card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Adventure } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

const ITEMS_PER_PAGE = 12;

export default function AdventuresLanding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'water' | 'land' | 'luxury' | 'family'>('all');

  const { data: adventures = [], isLoading } = useQuery<Adventure[]>({
    queryKey: ["/api/adventures"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const filteredAdventures = adventures.filter(adventure => {
    if (filter === 'all') return true;
    return adventure.category === filter;
  });

  const totalPages = Math.ceil(filteredAdventures.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAdventures = filteredAdventures.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
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

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
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
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Adventures Grid */}
        {!isLoading && (
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
    </div>
  );
}