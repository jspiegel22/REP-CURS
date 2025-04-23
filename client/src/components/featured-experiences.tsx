import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "wouter";

interface Experience {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: number;
  reviewCount: number;
  duration: string;
  path: string;
}

const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "Sunset Sailing Adventure",
    image: "https://images.unsplash.com/photo-1564351943427-3d61951984e9?ixlib=rb-4.0.3",
    price: "$69",
    rating: 4.9,
    reviewCount: 123,
    duration: "Experience the breathtaking Cabo sunset on a luxury catamaran",
    path: "/adventures/sunset-sailing"
  },
  {
    id: "exp-2",
    title: "Whale Watching Tour",
    image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?ixlib=rb-4.0.3",
    price: "$119",
    rating: 4.8,
    reviewCount: 87,
    duration: "Get up close with majestic humpback and gray whales",
    path: "/adventures/whale-watching"
  },
  {
    id: "exp-3",
    title: "Los Cabos Luxury Resort Day Pass",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3",
    price: "$199",
    rating: 4.7,
    reviewCount: 65,
    duration: "Enjoy a day of luxury at one of Cabo's premier resorts",
    path: "/experiences/resort-day-pass"
  },
  {
    id: "exp-4",
    title: "Farm-to-Table Culinary Experience",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3",
    price: "$149",
    rating: 4.9,
    reviewCount: 42,
    duration: "Savor locally sourced cuisine prepared by expert chefs",
    path: "/experiences/farm-to-table"
  },
  {
    id: "exp-5",
    title: "Beach Horseback Riding",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
    price: "$89",
    rating: 4.8,
    reviewCount: 93,
    duration: "Ride along pristine beaches on a guided tour",
    path: "/adventures/horseback-riding"
  }
];

export default function FeaturedExperiences() {
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
    <div className="relative">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Featured Experiences</h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 mt-1">Discover the best activities and adventures in Cabo</p>
          <Link href="/adventures" className="text-[#2F4F4F] font-medium hover:underline flex items-center">
            View All Experiences <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
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
          {experiences.map((exp) => (
            <div key={exp.id} className="flex-none w-[300px] snap-start">
              <Link href={exp.path}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={exp.image} 
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
                      <span className="text-sm text-gray-600">({exp.reviewCount} reviews)</span>
                    </div>
                    <h3 className="font-semibold mb-1 line-clamp-1">{exp.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exp.duration}</p>
                    <div className="font-bold text-lg">{exp.price}</div>
                  </div>
                </div>
              </Link>
            </div>
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
  );
}