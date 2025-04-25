import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Array of testimonial faces using the processed WebP images
const testimonialFaces = [
  { 
    src: '/images/testimonials/webp/kylie.webp',
    initials: 'KW', 
    alt: 'Kylie, Cabo traveler',
    color: 'bg-blue-100' 
  },
  { 
    src: '/images/testimonials/webp/katie.webp',
    initials: 'KT', 
    alt: 'Katie, Cabo luxury traveler',
    color: 'bg-green-100' 
  },
  { 
    src: '/images/testimonials/webp/kellie.webp',
    initials: 'KL', 
    alt: 'Kellie, Cabo adventure seeker',
    color: 'bg-purple-100' 
  },
  { 
    src: '/images/testimonials/webp/phil-k.webp',
    initials: 'PK', 
    alt: 'Phil, Cabo experience reviewer',
    color: 'bg-amber-100' 
  }
];

interface TestimonialFacesProps {
  count?: number; // Number of faces to display
  size?: 'sm' | 'md' | 'lg'; // Size of the avatars
  autoRotate?: boolean; // Whether to automatically rotate faces
  rotationInterval?: number; // Interval in ms for rotation
}

export function TestimonialFaces({
  count = 4,
  size = 'md',
  autoRotate = true,
  rotationInterval = 5000,
}: TestimonialFacesProps) {
  // State to hold the currently displayed faces
  const [displayedFaces, setDisplayedFaces] = useState<typeof testimonialFaces>([]);
  
  // Size mapping for avatar component
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
  };
  
  // Function to shuffle and select random faces
  const shuffleFaces = () => {
    // Make a copy of the original array
    const shuffled = [...testimonialFaces];
    
    // Shuffle using Fisher-Yates algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Take only the requested number of faces
    setDisplayedFaces(shuffled.slice(0, count));
  };
  
  // Initialize with shuffled faces
  useEffect(() => {
    shuffleFaces();
  }, [count]);
  
  // Set up auto-rotation if enabled
  useEffect(() => {
    if (autoRotate) {
      const intervalId = setInterval(shuffleFaces, rotationInterval);
      
      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [autoRotate, rotationInterval]);
  
  return (
    <div className="flex -space-x-2">
      {displayedFaces.map((face, index) => (
        <Avatar 
          key={index} 
          className={`${sizeClass[size]} border-2 border-white shadow-sm transition-transform hover:scale-110 hover:z-10 rounded-full overflow-hidden`}
        >
          <AvatarImage src={face.src} alt={face.alt} className="object-cover w-full h-full" />
          <AvatarFallback className={`${face.color} text-gray-700 font-medium`}>
            {face.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}