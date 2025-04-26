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
  autoRotate = false, // Set default to false as we don't want to rotate
  rotationInterval = 5000,
}: TestimonialFacesProps) {
  // Use testimonial faces directly without shuffling
  // Only slice if count is less than the total available faces
  const displayedFaces = testimonialFaces.slice(0, count);
  
  // Size mapping for avatar component
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
  };
  
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