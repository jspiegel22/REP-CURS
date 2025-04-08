import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

// Sample beach clubs data
const beachClubs = [
  {
    name: 'Mango Deck',
    location: 'Medano Beach',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    type: 'Beach Club',
    priceRange: '$$',
    rating: 4.8,
    description: 'Famous beach club with live music, water sports, and stunning ocean views',
  },
  {
    name: 'The Office',
    location: 'Medano Beach',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    type: 'Beach Club',
    priceRange: '$$$',
    rating: 4.7,
    description: 'Upscale beach club with gourmet dining and premium service',
  },
  {
    name: 'Nikki Beach',
    location: 'Costa Palmas',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    type: 'Luxury Beach Club',
    priceRange: '$$$',
    rating: 4.9,
    description: 'Luxury beach club with world-class amenities and entertainment',
  },
];

export default function BeachClubsPage() {
  return (
    <>
      <Head>
        <title>Best Beach Clubs in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Experience the ultimate beach club scene in Cabo San Lucas. From luxury lounges to vibrant party spots, find your perfect beach day destination." />
        <meta property="og:title" content="Best Beach Clubs in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Experience the ultimate beach club scene in Cabo San Lucas. From luxury lounges to vibrant party spots, find your perfect beach day destination." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/eats/beach-clubs" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
            alt="Beach Clubs in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Beach Clubs</h1>
              <p className="text-xl md:text-2xl mb-8">
                Experience the ultimate beach day in Cabo San Lucas
              </p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Reserve a Daybed
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Locations</h3>
                <p className="text-gray-600">Access to the best beachfront spots in Cabo</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">VIP Service</h3>
                <p className="text-gray-600">Exclusive amenities and personalized attention</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="text-gray-600">Insider tips for the best beach club experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Beach Clubs Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Beach Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beachClubs.map((club) => (
                <div key={club.name} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative h-64">
                    <Image
                      src={club.imageUrl}
                      alt={club.name}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-semibold">{club.priceRange}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{club.name}</h3>
                    <p className="text-gray-600 mb-2">{club.location}</p>
                    <p className="text-gray-700 mb-4">{club.description}</p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <span>{club.type}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">{"★".repeat(Math.floor(club.rating))}</span>
                        <span className="ml-1">{club.rating}</span>
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