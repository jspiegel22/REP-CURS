import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

// Sample restaurant data
const restaurants = [
  {
    name: 'El Farallon',
    location: 'The Resort at Pedregal',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    cuisine: 'Seafood',
    priceRange: '$$$',
    rating: 4.9,
    description: 'Spectacular oceanfront dining with fresh seafood and stunning views',
  },
  {
    name: 'Flora Farms',
    location: 'San José del Cabo',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    cuisine: 'Farm-to-Table',
    priceRange: '$$',
    rating: 4.8,
    description: 'Organic farm and restaurant serving fresh, seasonal cuisine',
  },
  {
    name: 'Edith\'s',
    location: 'Cabo San Lucas',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    cuisine: 'Mexican',
    priceRange: '$$',
    rating: 4.7,
    description: 'Authentic Mexican cuisine in a romantic setting',
  },
];

export default function RestaurantsPage() {
  return (
    <>
      <Head>
        <title>Best Restaurants in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Discover the finest restaurants in Cabo San Lucas. From oceanfront dining to farm-to-table experiences, find your perfect meal." />
        <meta property="og:title" content="Best Restaurants in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Discover the finest restaurants in Cabo San Lucas. From oceanfront dining to farm-to-table experiences, find your perfect meal." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/eats/restaurants" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
            alt="Restaurants in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Best Restaurants</h1>
              <p className="text-xl md:text-2xl mb-8">
                Experience the finest dining in Cabo San Lucas
              </p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Make a Reservation
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                <p className="text-gray-600">Handpicked restaurants for the best dining experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
                <p className="text-gray-600">Simple booking process for your preferred restaurants</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="text-gray-600">Insider tips and recommendations from Cabo locals</p>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurants Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant) => (
                <div key={restaurant.name} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative h-64">
                    <Image
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-semibold">{restaurant.priceRange}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 mb-2">{restaurant.location}</p>
                    <p className="text-gray-700 mb-4">{restaurant.description}</p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <span>{restaurant.cuisine}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">{"★".repeat(Math.floor(restaurant.rating))}</span>
                        <span className="ml-1">{restaurant.rating}</span>
                      </div>
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
        </section>
      </main>

      <Footer />
    </>
  );
} 