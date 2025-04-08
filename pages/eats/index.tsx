import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

const restaurants = [
  {
    name: "El Farallon",
    type: "Seafood",
    location: "The Resort at Pedregal",
    description: "Cliffside dining with fresh catch of the day",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    priceRange: "$$$",
    rating: 4.9
  },
  {
    name: "Nobu Los Cabos",
    type: "Japanese",
    location: "Nobu Hotel Los Cabos",
    description: "World-class Japanese cuisine with Cabo flair",
    imageUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
    priceRange: "$$$$",
    rating: 4.8
  },
  {
    name: "Flora Farms",
    type: "Farm-to-Table",
    location: "San Jose del Cabo",
    description: "Organic farm-to-table dining experience",
    imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
    priceRange: "$$$",
    rating: 4.7
  },
  {
    name: "Sunset Monalisa",
    type: "Mediterranean",
    location: "Cabo San Lucas",
    description: "Spectacular sunset views and fine dining",
    imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
    priceRange: "$$$$",
    rating: 4.8
  },
  {
    name: "Edith's",
    type: "Mexican",
    location: "Cabo San Lucas",
    description: "Traditional Mexican cuisine with local seafood",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    priceRange: "$$$",
    rating: 4.6
  },
  {
    name: "Nick-San",
    type: "Japanese",
    location: "Cabo San Lucas",
    description: "Innovative Japanese fusion cuisine",
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    priceRange: "$$$",
    rating: 4.7
  }
];

const categories = [
  {
    name: "Restaurants",
    description: "Discover Cabo's finest dining establishments",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    href: "/eats/restaurants"
  },
  {
    name: "Bars & Nightlife",
    description: "Experience Cabo's vibrant nightlife scene",
    imageUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
    href: "/eats/bars"
  },
  {
    name: "Beach Clubs",
    description: "Luxury beach clubs and day parties",
    imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
    href: "/eats/beach-clubs"
  }
];

export default function Eats() {
  return (
    <>
      <Head>
        <title>Best Restaurants & Dining in Cabo | @cabo</title>
        <meta name="description" content="Discover the best restaurants and dining experiences in Cabo San Lucas. From fine dining to local favorites, find your perfect meal." />
        <meta property="og:title" content="Best Restaurants & Dining in Cabo | @cabo" />
        <meta property="og:description" content="Discover the best restaurants and dining experiences in Cabo San Lucas. From fine dining to local favorites, find your perfect meal." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/eats" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b"
            alt="Dining in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Dining in Paradise</h1>
              <p className="text-xl md:text-2xl mb-8">
                Discover Cabo's best restaurants and culinary experiences
              </p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Explore Dining Options
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore Dining Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link href={category.href} key={category.name}>
                  <div className="group cursor-pointer">
                    <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        layout="fill"
                        objectFit="cover"
                        className="transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                <p className="text-gray-600">Handpicked venues for the best dining experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
                <p className="text-gray-600">Simple booking process for your preferred venues</p>
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

        {/* Newsletter */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest restaurant reviews, dining recommendations, and exclusive offers
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="px-6 py-3">
                  Subscribe
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 