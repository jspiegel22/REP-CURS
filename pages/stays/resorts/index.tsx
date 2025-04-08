import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

// Mock data for resorts
const resorts = [
  {
    id: 1,
    name: 'Waldorf Astoria Los Cabos',
    location: 'Pedregal',
    description: 'Luxury beachfront resort with world-class amenities',
    priceRange: '$$$$$',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    amenities: ['Spa', 'Beach Club', 'Fine Dining', 'Golf'],
    features: ['Ocean View Rooms', '5 Restaurants', '3 Pools']
  },
  {
    id: 2,
    name: 'One&Only Palmilla',
    location: 'San Jose del Cabo',
    description: 'Iconic luxury resort with legendary service',
    priceRange: '$$$$$',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    amenities: ['Private Beach', 'Golf Course', 'Spa', 'Tennis'],
    features: ['Butler Service', '4 Restaurants', 'Kids Club']
  },
  {
    id: 3,
    name: 'Las Ventanas al Paraíso',
    location: 'Corridor',
    description: 'A Rosewood Resort with unparalleled luxury',
    priceRange: '$$$$$',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
    amenities: ['Infinity Pools', 'Spa', 'Beach Club', 'Fine Dining'],
    features: ['Ocean View Suites', '7 Restaurants', 'Private Pool Villas']
  },
  // Add more resorts as needed
];

export default function ResortsPage() {
  return (
    <>
      <Head>
        <title>Luxury Resorts in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Experience world-class luxury at Cabo's finest resorts. From beachfront properties to golf resorts, find your perfect getaway." />
      </Head>

      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[60vh] flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/resorts-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <p className="text-white text-sm md:text-base font-medium">Luxury Resort Collection</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Experience World-Class<br />Luxury in Cabo
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover our curated selection of the finest luxury resorts in Cabo San Lucas
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border rounded-lg">
                <option>Price Range</option>
                <option>$$$</option>
                <option>$$$$</option>
                <option>$$$$$</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>Location</option>
                <option>Cabo San Lucas</option>
                <option>San Jose del Cabo</option>
                <option>Corridor</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>Resort Type</option>
                <option>Beach Resort</option>
                <option>Golf Resort</option>
                <option>All-Inclusive</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>Amenities</option>
                <option>Spa</option>
                <option>Golf</option>
                <option>Beach Club</option>
              </select>
              <Button className="ml-auto">
                Apply Filters
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Resorts Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resorts.map((resort) => (
              <div key={resort.id} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                <div className="relative h-64">
                  <Image
                    src={resort.imageUrl}
                    alt={resort.name}
                    layout="fill"
                    objectFit="cover"
                    className="transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-semibold">{resort.priceRange}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{resort.name}</h3>
                  <p className="text-gray-600 mb-4">{resort.location}</p>
                  <p className="text-gray-700 mb-4">{resort.description}</p>
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(resort.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resort.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2 mb-6">
                    {resort.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#2F4F4F] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help Planning Your Stay?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Our luxury travel specialists are here to help you find the perfect resort and create an unforgettable Cabo experience.
            </p>
            <Button className="bg-white text-[#2F4F4F] hover:bg-gray-100">
              Contact a Specialist
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
} 