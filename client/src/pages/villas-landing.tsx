import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VillaCard } from "@/components/villa-card";
import { Villa, parseVillaData } from "@/types/villa";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Import CSV data (this will be replaced with actual data loading)
const villaData = `[CSV data will be replaced]`; // Placeholder
const villas = parseVillaData(villaData);

const ITEMS_PER_PAGE = 12;

export default function VillasLanding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'beachfront' | 'oceanfront'>('all');

  const filteredVillas = villas.filter(villa => {
    if (filter === 'beachfront') return villa.isBeachfront;
    if (filter === 'oceanfront') return villa.isOceanfront;
    return true;
  });

  const totalPages = Math.ceil(filteredVillas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedVillas = filteredVillas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Luxury Villas in Cabo San Lucas</h1>
              <p className="text-xl">Discover our handpicked collection of stunning villas with breathtaking ocean views.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Villas
          </Button>
          <Button 
            variant={filter === 'beachfront' ? 'default' : 'outline'}
            onClick={() => setFilter('beachfront')}
          >
            Beachfront
          </Button>
          <Button 
            variant={filter === 'oceanfront' ? 'default' : 'outline'}
            onClick={() => setFilter('oceanfront')}
          >
            Oceanfront
          </Button>
        </div>

        {/* Villa Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedVillas.map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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