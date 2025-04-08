import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

// Group trip types
const tripTypes = [
  {
    name: 'Bachelor Parties',
    slug: 'bachelor',
    description: 'Epic celebrations for the groom-to-be',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    features: ['Luxury Villas', 'VIP Nightlife', 'Adventure Activities']
  },
  {
    name: 'Bachelorette Parties',
    slug: 'bachelorette',
    description: 'Unforgettable getaways for the bride-to-be',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
    features: ['Spa Days', 'Beach Clubs', 'Private Events']
  },
  {
    name: 'Family Reunions',
    slug: 'family',
    description: 'Create lasting memories with loved ones',
    imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
    features: ['Multi-Room Villas', 'Group Activities', 'Private Chef']
  },
  {
    name: 'Luxury Concierge',
    slug: 'luxury-concierge',
    description: 'Bespoke experiences for discerning groups',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    features: ['Yacht Charters', 'Private Jets', 'VIP Services']
  },
  {
    name: 'Influencer Retreats',
    slug: 'influencer',
    description: 'Picture-perfect settings for content creators',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
    features: ['Instagrammable Locations', 'Professional Photography', 'Brand Collaborations']
  }
];

// Why choose us features
const features = [
  {
    title: 'Local Expertise',
    description: 'Our team knows Cabo inside and out, ensuring you get the best experiences.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: 'Personalized Planning',
    description: 'Every trip is tailored to your group's preferences and needs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    title: '24/7 Concierge',
    description: 'Round-the-clock support throughout your stay in Cabo.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Best Value',
    description: 'Competitive pricing and exclusive group discounts.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function GroupTripsPage() {
  return (
    <>
      <Head>
        <title>Group Trips & Events in Cabo | @cabo</title>
        <meta name="description" content="Plan your perfect group trip to Cabo San Lucas. From bachelor parties to family reunions, we'll help create unforgettable memories." />
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
            <source src="/videos/group-trips-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <p className="text-white text-sm md:text-base font-medium">Group Travel Specialists</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Create Unforgettable<br />Memories Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Let us help you plan the perfect group trip to Cabo San Lucas
            </p>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl">
              Start Planning
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Trip Types Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Choose Your Trip Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tripTypes.map((type) => (
                <Link
                  key={type.slug}
                  href={`/group-trips/${type.slug}`}
                  className="group"
                >
                  <div className="relative h-96 rounded-xl overflow-hidden">
                    <Image
                      src={type.imageUrl}
                      alt={type.name}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{type.name}</h3>
                      <p className="text-white/90 mb-4">{type.description}</p>
                      <div className="space-y-2">
                        {type.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-white/80">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Plan With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-[#2F4F4F] text-white rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#2F4F4F] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Groups Say</h2>
              <div className="relative">
                <div className="mb-8">
                  <p className="text-xl italic mb-6">
                    "The team at @cabo made planning our bachelor party absolutely seamless. From the luxury villa to the activities and nightlife, everything was perfectly coordinated. Our group had the time of our lives!"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                      alt="John Smith"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-bold">John Smith</div>
                      <div className="text-white/80">Bachelor Party, 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Our group travel specialists are here to help you create the perfect Cabo experience.
            </p>
            <Button className="bg-[#2F4F4F] text-white hover:bg-[#1F3F3F]">
              Contact a Specialist
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>
    </>
  );
} 