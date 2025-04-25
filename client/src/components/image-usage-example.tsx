import React from 'react';
import { CaboImage, ResponsiveCaboImage } from '@/components/ui/cabo-image';
import { images } from '@/lib/imageMap';

/**
 * Example component showing how to use the image system
 */
export function ImageUsageExample() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Image System Usage Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic image usage */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Basic Usage</h3>
          <CaboImage 
            src={images.resort.featured1} 
            alt="Featured Resort" 
            category="resort"
            className="w-full h-64 rounded-lg object-cover" 
          />
          <p className="text-sm text-gray-600">
            Basic image with fallback to resort category if image fails to load
          </p>
        </div>
        
        {/* Responsive image usage */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Responsive with Aspect Ratio</h3>
          <ResponsiveCaboImage 
            src={images.villa.featured1} 
            alt="Luxury Villa" 
            category="villa"
            aspectRatio="4/3"
            className="rounded-lg" 
          />
          <p className="text-sm text-gray-600">
            Responsive image that maintains 4:3 aspect ratio at all screen sizes
          </p>
        </div>
        
        {/* Card with image */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Card with Image</h3>
          <div className="rounded-lg overflow-hidden shadow-md bg-white">
            <CaboImage 
              src={images.activity.featured1} 
              alt="Cabo Activities" 
              category="activity"
              className="w-full h-48 object-cover" 
            />
            <div className="p-4">
              <h4 className="font-semibold">Exciting Activities</h4>
              <p className="text-sm text-gray-600">
                Experience the best activities Cabo has to offer
              </p>
            </div>
          </div>
        </div>
        
        {/* Hero image */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Hero Image</h3>
          <div className="relative">
            <ResponsiveCaboImage 
              src={images.hero.main} 
              alt="Cabo San Lucas" 
              category="hero"
              aspectRatio="16/9"
              className="rounded-lg" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 p-4 rounded text-white">
                <h4 className="text-xl font-bold">Discover Cabo</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">How to Implement</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="overflow-x-auto text-sm">
            {`// Import the components and image map
import { CaboImage, ResponsiveCaboImage } from '@/components/ui/cabo-image';
import { images } from '@/lib/imageMap';

// Basic usage
<CaboImage 
  src={images.resort.featured1} 
  alt="Featured Resort" 
  category="resort"
  className="w-full h-64 rounded-lg object-cover" 
/>

// Responsive usage with aspect ratio
<ResponsiveCaboImage 
  src={images.villa.featured1} 
  alt="Luxury Villa" 
  category="villa"
  aspectRatio="4/3"
  className="rounded-lg" 
/>
`}
          </pre>
        </div>
      </div>
    </div>
  );
}