import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Star, Users } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

// Land adventures data
const landAdventures = [
  {
    id: 1,
    title: 'ATV Desert Tour',
    description: 'Experience the thrill of riding through the Baja desert on our guided ATV tour. Visit scenic viewpoints and learn about the local flora and fauna.',
    imageUrl: 'https://images.unsplash.com/photo-1525186402429-b4ff38bedec6',
    duration: '2 hours',
    price: 149,
    rating: 4.8,
    reviewCount: 112,
    maxGroupSize: 8
  },
  {
    id: 2,
    title: 'Camel Safari',
    description: 'Take a unique journey through the desert on camelback. Includes a traditional Mexican lunch and tequila tasting.',
    imageUrl: 'https://images.unsplash.com/photo-1582260455046-3697a73dcd1c',
    duration: '3 hours',
    price: 129,
    rating: 4.7,
    reviewCount: 88,
    maxGroupSize: 12
  },
  {
    id: 3,
    title: 'Zipline Adventure',
    description: 'Soar through the treetops on our thrilling zipline course. Multiple lines with varying heights and speeds for all thrill levels.',
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13',
    duration: '2.5 hours',
    price: 99,
    rating: 4.9,
    reviewCount: 156,
    maxGroupSize: 10
  },
  {
    id: 4,
    title: 'Horseback Riding',
    description: 'Explore the beautiful Baja landscape on horseback. Choose from beach rides or mountain trails with experienced guides.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    duration: '2 hours',
    price: 119,
    rating: 4.6,
    reviewCount: 74,
    maxGroupSize: 6
  }
];

export default function LandAdventuresPage() {
  return (
    <>
      <Head>
        <title>Land Adventures in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Discover exciting land adventures in Cabo San Lucas, from ATV tours to ziplining and horseback riding." />
        <meta property="og:title" content="Land Adventures in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Discover exciting land adventures in Cabo San Lucas, from ATV tours to ziplining and horseback riding." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/adventures/land" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1525186402429-b4ff38bedec6"
            alt="Land Adventures in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Land Adventures in Cabo
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                From ATV tours to ziplining, experience thrilling land adventures in Cabo San Lucas.
              </p>
            </div>
          </div>
        </section>

        {/* Adventures Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {landAdventures.map((adventure) => (
                <div key={adventure.id} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative h-64">
                    <Image
                      src={adventure.imageUrl}
                      alt={adventure.title}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-semibold">${adventure.price}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{adventure.title}</h3>
                    <p className="text-gray-600 mb-4">{adventure.description}</p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{adventure.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Up to {adventure.maxGroupSize} people</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{adventure.rating} ({adventure.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      Book Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Land Adventures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Safety First</h3>
                <p className="text-gray-600">All activities are conducted with certified guides and top-quality safety equipment.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Best Equipment</h3>
                <p className="text-gray-600">We use modern, well-maintained equipment for all activities.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Flexible Booking</h3>
                <p className="text-gray-600">Easy booking process with flexible cancellation policies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Adventure?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us help you plan the perfect land adventure in Cabo San Lucas.
            </p>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Book Your Activity
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 