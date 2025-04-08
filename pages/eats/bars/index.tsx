import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

// Sample bars data
const bars = [
  {
    name: 'Mango Deck',
    location: 'Medano Beach',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    type: 'Beach Bar',
    priceRange: '$$',
    rating: 4.8,
    description: 'Famous beach bar with live music and stunning ocean views',
  },
  {
    name: 'El Squid Roe',
    location: 'Cabo San Lucas',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    type: 'Nightclub',
    priceRange: '$$$',
    rating: 4.6,
    description: 'Legendary nightclub with multiple floors and live entertainment',
  },
  {
    name: 'Baja Brewing Company',
    location: 'Cabo San Lucas',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    type: 'Brewery',
    priceRange: '$$',
    rating: 4.7,
    description: 'Local craft brewery with rooftop views and great food',
  },
];

export default function BarsPage() {
  return (
    <>
      <Head>
        <title>Best Bars & Nightlife in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Experience the vibrant nightlife of Cabo San Lucas. From beach bars to nightclubs, discover the best spots for entertainment and drinks." />
        <meta property="og:title" content="Best Bars & Nightlife in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Experience the vibrant nightlife of Cabo San Lucas. From beach bars to nightclubs, discover the best spots for entertainment and drinks." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/eats/bars" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
            alt="Nightlife in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Bars & Nightlife</h1>
              <p className="text-xl md:text-2xl mb-8">
                Experience the vibrant nightlife of Cabo San Lucas
              </p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Book a Table
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">VIP Access</h3>
                <p className="text-gray-600">Skip the line and get exclusive access to the best venues</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Entertainment</h3>
                <p className="text-gray-600">Daily live music and entertainment at top venues</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Tips</h3>
                <p className="text-gray-600">Insider recommendations for the best nightlife spots</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bars Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bars.map((bar) => (
                <div key={bar.name} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative h-64">
                    <Image
                      src={bar.imageUrl}
                      alt={bar.name}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-semibold">{bar.priceRange}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{bar.name}</h3>
                    <p className="text-gray-600 mb-2">{bar.location}</p>
                    <p className="text-gray-700 mb-4">{bar.description}</p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <span>{bar.type}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">{"★".repeat(Math.floor(bar.rating))}</span>
                        <span className="ml-1">{bar.rating}</span>
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