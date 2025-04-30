import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";

interface Adventure {
  id: number;
  title: string;
  imageUrl: string;
  price: string | null;
  rating: number;
  reviewCount: number | null;
  description: string;
  slug: string;
}

// Function to extract price from description
const extractPrice = (description: string): string => {
  const priceMatch = description.match(/costs\s+\$(\d+)/i);
  return priceMatch ? `$${priceMatch[1]}` : "Request Quote";
};

// Function to extract a shorter description
const extractShortDescription = (description: string): string => {
  const firstSentence = description.split('.')[0];
  return firstSentence;
};

export default function FeaturedExperiences() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [experiences, setExperiences] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch adventures from the API
  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const response = await fetch('/api/adventures');
        if (!response.ok) {
          throw new Error('Failed to fetch adventures');
        }
        
        const data = await response.json();
        
        // Filter for featured adventures - select ones with good ratings or specific types
        const featured = data
          .filter((adv: any) => 
            // Select adventures with high ratings or popular types
            adv.rating >= 4.4 || 
            adv.title.includes('SUNSET') || 
            adv.title.includes('YACHT') || 
            adv.title.includes('WHALE') ||
            adv.title.includes('LUXURY')
          )
          .slice(0, 5); // Take only the first 5 adventures
          
        setExperiences(featured);
      } catch (error) {
        console.error('Error fetching adventures:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdventures();
  }, []);

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
    <div className="relative">
      <div className="mb-6">
        <h2 className="text-3xl font-bold relative inline-block mb-2">
          Featured Experiences
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FF8C38] rounded"></span>
        </h2>
        <p className="text-gray-700 mt-3 mb-2">
          Discover the best activities and adventures in Cabo
        </p>
        <Link href="/adventures" className="inline-flex items-center mt-2 text-[#FF8C38] hover:text-[#E67D29] font-medium">
          View All Experiences <ChevronRight className="w-4 h-4 ml-1" />
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
          className="flex overflow-x-auto gap-5 pb-6 hide-scrollbar snap-x"
          onScroll={() => {
            if (!scrollContainerRef.current) return;
            const container = scrollContainerRef.current;
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
          }}
        >
          {isLoading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex-none w-[300px] snap-start">
                <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="relative aspect-[4/3] bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="flex-none w-[300px] snap-start">
                <Link href={`/adventures/${exp.slug}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-[4/3]">
                      <img 
                        src={exp.imageUrl} 
                        alt={exp.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-yellow-400">
                          {"★".repeat(Math.floor(exp.rating))}
                          {exp.rating % 1 > 0 && "★"}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({exp.reviewCount || 'New'})
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {exp.title.charAt(0) + exp.title.slice(1).toLowerCase()}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {extractShortDescription(exp.description)}
                      </p>
                      <div className="font-bold text-lg">
                        {extractPrice(exp.description)}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
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
  );
}