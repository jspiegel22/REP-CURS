import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';
import { AdventureCard } from '@/components/adventure-card';

// Sample water activities data
const waterActivities = [
  {
    title: 'Sunset Sailing',
    slug: 'sunset-sailing',
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13',
    category: 'Water Activities',
    duration: '3 hours',
    minAge: 5,
    currentPrice: '$89',
    rating: 4.9,
  },
  {
    title: 'Whale Watching',
    slug: 'whale-watching',
    imageUrl: 'https://images.unsplash.com/photo-1541956064527-8ec10ac76c31',
    category: 'Water Activities',
    duration: '4 hours',
    minAge: 3,
    currentPrice: '$129',
    rating: 4.8,
  },
  {
    title: 'Snorkeling Adventure',
    slug: 'snorkeling-adventure',
    imageUrl: 'https://images.unsplash.com/photo-1564543331-0b5aa2eda2ce',
    category: 'Water Activities',
    duration: '3 hours',
    minAge: 5,
    currentPrice: '$79',
    rating: 4.7,
  },
  {
    title: 'Private Yacht Charter',
    slug: 'private-yacht-charter',
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13',
    category: 'Water Activities',
    duration: 'Full day',
    minAge: 0,
    currentPrice: '$1,200',
    rating: 4.9,
  },
];

export default function WaterActivitiesPage() {
  return (
    <>
      <Head>
        <title>Water Activities in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Experience the best water activities in Cabo San Lucas. From sunset sailing to whale watching, find your perfect ocean adventure." />
        <meta property="og:title" content="Water Activities in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Experience the best water activities in Cabo San Lucas. From sunset sailing to whale watching, find your perfect ocean adventure." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/adventures/water" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1564543331-0b5aa2eda2ce"
            alt="Water Activities in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Water Activities</h1>
              <p className="text-xl md:text-2xl mb-8">
                Experience the magic of Cabo's waters with our curated selection of ocean adventures
              </p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6"
              >
                Book Your Adventure
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
                <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                <p className="text-gray-600">All activities are conducted with certified guides and top-quality equipment</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
                <p className="text-gray-600">Easy booking process with free cancellation up to 24 hours before</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Experience</h3>
                <p className="text-gray-600">Handpicked activities for the ultimate Cabo experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Available Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {waterActivities.map((activity) => (
                <AdventureCard key={activity.slug} adventure={activity} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 