import { Adventure, parseAdventureData } from "@/types/adventure";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

// Import adventure data (in a real app, this would come from an API)
const adventureData = `group href,h-full src,ais-Highlight-nonHighlighted,text-base,text-xs-4,absolute,font-sans,flex src (2),font-sans (2),gl-font-meta,group href (2)
https://www.cabo-adventures.com/en/tour/luxury-day-sailing/,https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp?w=640&q=65&fit=clip&auto=format,4-HOUR LUXURY CABO SAILING BOAT TOUR,$104 USD,$149 USD,-30%,4 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/signature-swim/,https://cdn.sanity.io/images/esqfj3od/production/bd7bfbf824efdf124cf41220ef1830bf4335a462-608x912.webp?w=640&q=65&fit=clip&auto=format,CABO DOLPHIN SWIM SIGNATURE,$146 USD,$209 USD,-30%,40 Minutes,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min. 4 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/outdoor-adventure-cabo/,https://cdn.sanity.io/images/esqfj3od/production/82ad01cfa3a513e85d158016f76161a9460e5247-608x912.webp?w=640&q=65&fit=clip&auto=format,OUTDOOR ADVENTURE 4X4 + CABO ZIPLINE + RAPPEL,$97 USD,$139 USD,-30%,3.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,`;

interface TopAdventuresProps {
  currentAdventureId?: number;
}

export default function TopAdventures({ currentAdventureId }: TopAdventuresProps) {
  const adventures = parseAdventureData(adventureData)
    .filter(adventure => {
      if (currentAdventureId === undefined) return true;
      return Number(adventure.id) !== currentAdventureId;
    })
    .slice(0, 3); // Show max 3 other adventures

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

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/adventures" className="text-[#FF8C38] hover:underline font-medium ml-auto">
            View all adventures
          </Link>
        </div>

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
                      <Button variant="outline" className="text-[#FF8C38] border-[#FF8C38] hover:bg-[#FF8C38]/10">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right navigation arrow */}
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}