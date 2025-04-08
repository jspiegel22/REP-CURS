import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { Footer } from '@/components/footer';

export default function AdventuresPage() {
  return (
    <>
      <Head>
        <title>Adventures in Cabo San Lucas | @cabo</title>
        <meta name="description" content="Discover thrilling adventures in Cabo San Lucas, from water activities to land excursions and luxury experiences." />
        <meta property="og:title" content="Adventures in Cabo San Lucas | @cabo" />
        <meta property="og:description" content="Discover thrilling adventures in Cabo San Lucas, from water activities to land excursions and luxury experiences." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is/adventures" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <NavigationBar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
            alt="Adventures in Cabo"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Experience Cabo's Best Adventures
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                From thrilling water activities to exciting land excursions, discover unforgettable experiences in Cabo San Lucas.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Water Activities */}
              <Link href="/adventures/water" className="group">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1564543331-0b5aa2eda2ce"
                    alt="Water Activities"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Water Activities</h2>
                    <p className="text-lg mb-6">Snorkeling, diving, and more in Cabo's crystal-clear waters.</p>
                    <Button variant="outline" className="w-fit">
                      Explore Water Activities
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Land Adventures */}
              <Link href="/adventures/land" className="group">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1525186402429-b4ff38bedec6"
                    alt="Land Adventures"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Land Adventures</h2>
                    <p className="text-lg mb-6">ATV tours, desert expeditions, and thrilling land activities.</p>
                    <Button variant="outline" className="w-fit">
                      Explore Land Adventures
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Luxury Experiences */}
              <Link href="/adventures/luxury" className="group">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13"
                    alt="Luxury Experiences"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Luxury Experiences</h2>
                    <p className="text-lg mb-6">Private yacht charters and exclusive tours for the discerning traveler.</p>
                    <Button variant="outline" className="w-fit">
                      Explore Luxury Experiences
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose @cabo for Your Adventures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Safety First</h3>
                <p className="text-gray-600">All activities are conducted with the highest safety standards and certified guides.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Best Equipment</h3>
                <p className="text-gray-600">We use top-quality equipment and maintain it to the highest standards.</p>
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
              Let us help you plan the perfect adventure in Cabo San Lucas.
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