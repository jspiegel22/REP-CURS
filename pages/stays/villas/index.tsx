import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';
import { VillaCard } from '@/components/villa-card';

// Sample villa data
const villas = [
  {
    name: 'Villa Paradiso',
    location: 'Cabo San Lucas',
    imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
    bedrooms: 4,
    maxGuests: 8,
    pricePerNight: '$1,200',
  },
  {
    name: 'Casa del Mar',
    location: 'San José del Cabo',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
    bedrooms: 3,
    maxGuests: 6,
    pricePerNight: '$950',
  },
  {
    name: 'Villa Serenidad',
    location: 'Cabo San Lucas',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
    bedrooms: 5,
    maxGuests: 10,
    pricePerNight: '$1,500',
  },
  // Add more villas as needed
];

export default function VillasPage() {
  return (
    <>
      <Head>
        <title>Luxury Villas in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Discover our collection of luxury villas in Cabo San Lucas. From beachfront properties to private oases, find your perfect stay." />
        <meta property="og:title" content="Luxury Villas in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Discover our collection of luxury villas in Cabo San Lucas. From beachfront properties to private oases, find your perfect stay." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/stays/villas" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"
            alt="Luxury Villas in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Luxury Villas in Cabo</h1>
              <p className="text-xl md:text-2xl mb-8">
                Experience the ultimate in private luxury with our collection of exclusive villas
              </p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Book Your Stay
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
                <h3 className="text-xl font-semibold mb-2">Premium Properties</h3>
                <p className="text-gray-600">Carefully selected luxury villas with exceptional amenities</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Dedicated concierge service for a seamless stay</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Rates</h3>
                <p className="text-gray-600">Exclusive deals and competitive pricing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Villas Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Available Villas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {villas.map((villa) => (
                <VillaCard key={villa.name} villa={villa} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 