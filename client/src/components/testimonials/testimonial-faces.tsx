import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Array of testimonial face images (using optimized WebP format of customer-provided photos)
const testimonialFaces = [
  {
    src: '/images/testimonials/testimonial-1.webp',
    alt: 'Cabo travel enthusiast',
    initials: 'CE',
  },
  {
    src: '/images/testimonials/testimonial-2.webp',
    alt: 'Cabo luxury traveler',
    initials: 'CL',
  },
  {
    src: '/images/testimonials/testimonial-3.webp',
    alt: 'Satisfied Cabo visitor',
    initials: 'PK',
  },
  {
    src: '/images/testimonials/testimonial-4.webp',
    alt: 'Cabo experience reviewer',
    initials: 'JL',
  },
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
          className={`${sizeClass[size]} border-2 border-white`}
        >
          <AvatarImage src={face.src} alt={face.alt} />
          <AvatarFallback>{face.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}