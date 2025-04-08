import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { VillaCard } from '@/components/villa-card';
import { AdventureCard } from '@/components/adventure-card';
import { CategoryGrid } from '@/components/category-grid';
import { Footer } from '@/components/footer';
import { WeatherModule } from '@/components/weather-module';
import { ChatButton } from '@/components/chat-button';
import { WhatsappButton } from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';
import { GuideForm } from '@/components/guide-form';

// Sample data for featured items
const featuredVillas = [
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
];

const featuredAdventures = [
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
    title: 'ATV Desert Tour',
    slug: 'atv-desert-tour',
    imageUrl: 'https://images.unsplash.com/photo-1541956064527-8ec10ac76c31',
    category: 'Land Adventures',
    duration: '3 hours',
    minAge: 8,
    currentPrice: '$149',
    rating: 4.7,
  },
];

const sections = [
  {
    title: "Luxury Concierge Services",
    description: "Experience Cabo San Lucas like never before with our premium concierge services. From private jets to yacht charters, we handle every detail.",
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
    href: "/concierge",
    rating: 4.9,
    reviewCount: 128
  },
  {
    title: "Latest from Our Blog",
    description: "Stories, tips, and guides for your next Cabo adventure",
    items: [
      {
        title: "Top 10 Hidden Beaches in Cabo San Lucas",
        date: "Mar 14, 2025",
        readTime: "5 min read",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        href: "/blog/hidden-beaches",
        rating: 4.8,
        reviewCount: 95
      },
      {
        title: "Ultimate Guide to Luxury Yacht Charters",
        date: "Mar 11, 2025",
        readTime: "7 min read",
        imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        href: "/blog/yacht-charters",
        rating: 4.7,
        reviewCount: 82
      },
      {
        title: "Planning Your Dream Wedding in Cabo",
        date: "Mar 9, 2025",
        readTime: "8 min read",
        imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
        href: "/blog/dream-wedding",
        rating: 4.9,
        reviewCount: 156
      }
    ]
  },
  {
    title: "Download Our 2025 Restaurant Guide",
    description: "Discover the finest dining experiences in Cabo with our curated guide to the best restaurants, from hidden gems to Michelin-starred establishments.",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    href: "/restaurant-guide",
    rating: 4.8,
    reviewCount: 312
  }
];

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Head>
        <title>@cabo - Your Ultimate Cabo San Lucas Travel Guide</title>
        <meta name="description" content="Discover the best of Cabo San Lucas with our curated travel guide. Find luxury villas, thrilling adventures, and exclusive experiences." />
        <meta property="og:title" content="@cabo - Your Ultimate Cabo San Lucas Travel Guide" />
        <meta property="og:description" content="Discover the best of Cabo San Lucas with our curated travel guide. Find luxury villas, thrilling adventures, and exclusive experiences." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cabo.is" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <NavigationBar />

      <main>
        {/* Hero Section */}
        <div className="relative min-h-[90vh] w-full">
          {/* Background Video */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/cabo-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
            <div className="max-w-4xl">
              {/* Category Label */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <p className="text-white text-sm md:text-base font-medium">✨ #1 CABO COMMUNITY SINCE 2015 ✨</p>
              </div>

              <h1 className="text-4xl md:text-7xl font-bold mb-6">
                Your Ultimate Guide to<br />Cabo San Lucas
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                From luxury villas to thrilling adventures, discover the best of Cabo with our insider tips and exclusive deals.
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>17,000+ Downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Updated Monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Trusted by Travel Experts</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => setShowForm(true)}
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Your Free Guide
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Featured Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore Cabo</h2>
            <CategoryGrid />
          </div>
        </section>

        {/* Featured Villas */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Villas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVillas.map((villa) => (
                <VillaCard key={villa.name} villa={villa} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/stays/villas">
                <Button variant="outline" className="text-lg px-8 py-6">
                  View All Villas
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Adventures */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Adventures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAdventures.map((adventure) => (
                <AdventureCard key={adventure.slug} adventure={adventure} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/adventures">
                <Button variant="outline" className="text-lg px-8 py-6">
                  View All Adventures
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Weather Widget */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <WeatherModule />
          </div>
        </section>

        {/* Concierge Services Card */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={sections[0].imageUrl}
                      alt={sections[0].title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(sections[0].rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">({sections[0].reviewCount} reviews)</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{sections[0].title}</h2>
                  <p className="text-gray-600 mb-6">{sections[0].description}</p>
                  <Button asChild>
                    <Link href={sections[0].href}>
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">{sections[1].title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sections[1].items.map((post) => (
                <Link href={post.href} key={post.title}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                    <div className="relative h-48">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(post.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600">({post.reviewCount})</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Restaurant Guide Card */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="md:flex flex-row-reverse">
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={sections[2].imageUrl}
                      alt={sections[2].title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(sections[2].rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">({sections[2].reviewCount} reviews)</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{sections[2].title}</h2>
                  <p className="text-gray-600 mb-6">{sections[2].description}</p>
                  <Button asChild>
                    <Link href={sections[2].href}>
                      Get Your Restaurant Guide
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatButton />
      <WhatsappButton />

      {/* Guide Form Modal */}
      {showForm && <GuideForm onClose={() => setShowForm(false)} />}
    </>
  );
}