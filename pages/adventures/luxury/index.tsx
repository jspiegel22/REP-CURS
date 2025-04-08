import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Star, Users } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

// Luxury experiences data
const luxuryExperiences = [
  {
    id: 1,
    title: 'Private Yacht Charter',
    description: 'Experience ultimate luxury on our private yacht charters. Perfect for special occasions, includes gourmet dining and premium beverages.',
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13',
    duration: 'Custom',
    price: 'From $500',
    rating: 5.0,
    reviewCount: 45,
    maxGroupSize: 10
  },
  {
    id: 2,
    title: 'Helicopter Tour',
    description: 'Soar above Cabo in a private helicopter tour. Experience breathtaking views of the Arch, beaches, and desert landscape.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    duration: '1 hour',
    price: 'From $299',
    rating: 4.9,
    reviewCount: 32,
    maxGroupSize: 4
  },
  {
    id: 3,
    title: 'Private Beach Dinner',
    description: 'Enjoy a romantic candlelit dinner on a private beach. Includes personal chef, butler service, and live music.',
    imageUrl: 'https://images.unsplash.com/photo-1582260455046-3697a73dcd1c',
    duration: '3 hours',
    price: 'From $399',
    rating: 5.0,
    reviewCount: 28,
    maxGroupSize: 8
  },
  {
    id: 4,
    title: 'VIP Spa Experience',
    description: 'Indulge in a luxurious spa day with private treatment rooms, gourmet lunch, and exclusive wellness services.',
    imageUrl: 'https://images.unsplash.com/photo-1525186402429-b4ff38bedec6',
    duration: 'Full day',
    price: 'From $299',
    rating: 4.8,
    reviewCount: 56,
    maxGroupSize: 2
  }
];

export default function LuxuryExperiencesPage() {
  return (
    <>
      <Head>
        <title>Luxury Experiences in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Discover exclusive luxury experiences in Cabo San Lucas, from private yacht charters to helicopter tours and VIP spa treatments." />
        <meta property="og:title" content="Luxury Experiences in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Discover exclusive luxury experiences in Cabo San Lucas, from private yacht charters to helicopter tours and VIP spa treatments." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/adventures/luxury" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
            alt="Luxury Experiences in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Luxury Experiences in Cabo
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                From private yacht charters to helicopter tours, indulge in exclusive experiences in Cabo San Lucas.
              </p>
            </div>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {luxuryExperiences.map((experience) => (
                <div key={experience.id} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative h-64">
                    <Image
                      src={experience.imageUrl}
                      alt={experience.title}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-semibold">{experience.price}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{experience.title}</h3>
                    <p className="text-gray-600 mb-4">{experience.description}</p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Up to {experience.maxGroupSize} people</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{experience.rating} ({experience.reviewCount} reviews)</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Luxury Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Exclusive Access</h3>
                <p className="text-gray-600">Access to private locations and VIP services not available to regular tourists.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Service</h3>
                <p className="text-gray-600">Personalized attention and top-tier service from our expert staff.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Luxury?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us help you plan the perfect luxury experience in Cabo San Lucas.
            </p>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Book Your Experience
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 