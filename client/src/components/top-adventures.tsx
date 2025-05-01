import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clock, Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Adventure {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  duration: string;
  minAge: string;
  provider: string;
  rating: number;
  description: string;
}

interface TopAdventuresProps {
  currentAdventureId?: number;
}

export default function TopAdventures({ currentAdventureId }: TopAdventuresProps) {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchAdventures() {
      try {
        setLoading(true);
        const response = await fetch('/api/adventures');
        if (!response.ok) {
          throw new Error('Failed to fetch adventures');
        }
        
        const allAdventures = await response.json();
        console.log("Fetched adventures:", allAdventures);
        
        // First, filter out the current adventure
        let filtered = allAdventures.filter((adventure: Adventure) => 
          currentAdventureId === undefined || adventure.id !== currentAdventureId
        );
        
        // Next, try to get adventures marked as "topRecommended" in the database
        let topAdventures = filtered.filter((adventure: any) => adventure.topRecommended === true);
        
        // If we don't have enough topRecommended adventures, or none at all,
        // fall back to our original algorithm
        if (topAdventures.length < 3) {
          // Sort by rating (highest first) for remaining slots
          const remainingAdventures = filtered
            .filter((adventure: any) => adventure.topRecommended !== true)
            .sort((a: Adventure, b: Adventure) => b.rating - a.rating)
            .slice(0, 3 - topAdventures.length);
            
          topAdventures = [...topAdventures, ...remainingAdventures];
        } else if (topAdventures.length > 3) {
          // If we have more than 3 topRecommended adventures, just take the first 3
          topAdventures = topAdventures.slice(0, 3);
        }
          
        setAdventures(topAdventures);
      } catch (err) {
        console.error('Error fetching adventures:', err);
        setError('Failed to load adventures');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAdventures();
  }, [currentAdventureId]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 330; // Approximate card width + gap
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    // Update arrow visibility on next tick after scroll
    setTimeout(() => {
      if (!container) return;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }, 300);
  };

  // If there are no other adventures to show, return null
  if (!loading && adventures.length === 0 && !error) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#2F4F4F]">Other Top Adventures</h2>
          <Link href="/adventures" className="text-[#FF8C38] hover:underline font-medium">
            View all adventures
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF8C38]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-center">
            {error}
          </div>
        ) : (
          <div className="relative">
            {/* Left navigation arrow */}
            {showLeftArrow && (
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}

            {/* Scrollable container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x"
              onScroll={() => {
                if (!scrollContainerRef.current) return;
                const container = scrollContainerRef.current;
                setShowLeftArrow(container.scrollLeft > 0);
                setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
              }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {adventures.map((adventure) => (
                <Card key={adventure.id} className="flex-none w-[330px] snap-start overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={adventure.imageUrl}
                      alt={adventure.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                    {adventure.discount && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                        {adventure.discount}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
                      {adventure.title}
                    </h3>
                    
                    <div className="flex items-center gap-6 my-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{adventure.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{adventure.minAge}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="font-bold text-lg">{adventure.currentPrice}</span>
                        {adventure.originalPrice && (
                          <span className="text-sm line-through text-muted-foreground ml-2">
                            {adventure.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <Link href={`/adventures/${adventure.slug}`}>
                        <Button className="bg-[#FF8C38] hover:bg-[#E67D29] text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right navigation arrow */}
            {showRightArrow && adventures.length > 1 && (
              <button 
                onClick={() => scroll('right')}
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}