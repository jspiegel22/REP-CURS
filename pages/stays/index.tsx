import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

export default function StaysPage() {
  return (
    <>
      <Head>
        <title>Stays in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Discover the best places to stay in Cabo San Lucas, from luxury villas to world-class resorts." />
        <meta property="og:title" content="Stays in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Discover the best places to stay in Cabo San Lucas, from luxury villas to world-class resorts." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/stays" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd"
            alt="Luxury Stays in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect Stay in Cabo
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                From luxury villas to world-class resorts, discover accommodations that match your style and preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Villas */}
              <Link href="/stays/villas" className="group">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811"
                    alt="Luxury Villas"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Luxury Villas</h2>
                    <p className="text-lg mb-6">Experience the ultimate in private luxury with stunning ocean views and exclusive amenities.</p>
                    <Button variant="outline" className="w-fit">
                      Explore Villas
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Resorts */}
              <Link href="/stays/resorts" className="group">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd"
                    alt="World-Class Resorts"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">World-Class Resorts</h2>
                    <p className="text-lg mb-6">Enjoy exceptional service, amenities, and entertainment at premier resort destinations.</p>
                    <Button variant="outline" className="w-fit">
                      Explore Resorts
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose @cabo for Your Stay</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Best Rates Guaranteed</h3>
                <p className="text-gray-600">We offer competitive rates and exclusive deals for our properties.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our concierge team is always available to assist you during your stay.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Properties</h3>
                <p className="text-gray-600">All properties are personally verified to ensure quality and comfort.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Stay?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us help you find the perfect accommodation for your Cabo vacation.
            </p>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Start Planning
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 