import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const blogPosts = [
  {
    title: "Ultimate Guide to Cabo's Best Beaches",
    slug: "best-beaches-cabo",
    excerpt: "Discover the most beautiful and secluded beaches in Los Cabos, from Lover's Beach to Chileno Bay.",
    imageUrl: "https://images.unsplash.com/photo-1582260455046-3697a73dcd1c",
    category: "Beaches",
    readTime: "5 min read",
    date: "April 1, 2024"
  },
  {
    title: "Top 10 Adventure Activities in Cabo",
    slug: "top-adventure-activities",
    excerpt: "From swimming with whale sharks to ATV desert tours, these are the must-try adventures in Cabo.",
    imageUrl: "https://images.unsplash.com/photo-1564543597735-7920b5c9f7c6",
    category: "Activities",
    readTime: "7 min read",
    date: "March 28, 2024"
  },
  {
    title: "A Food Lover's Guide to Cabo",
    slug: "food-lovers-guide",
    excerpt: "Explore the best restaurants, local markets, and hidden gems in Cabo's culinary scene.",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    category: "Food & Drink",
    readTime: "6 min read",
    date: "March 25, 2024"
  },
  {
    title: "Planning the Perfect Cabo Wedding",
    slug: "cabo-wedding-guide",
    excerpt: "Everything you need to know about planning a destination wedding in Cabo San Lucas.",
    imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
    category: "Weddings",
    readTime: "8 min read",
    date: "March 20, 2024"
  },
  {
    title: "Best Time to Visit Cabo",
    slug: "best-time-to-visit",
    excerpt: "A month-by-month guide to weather, events, and activities in Los Cabos.",
    imageUrl: "https://images.unsplash.com/photo-1512036849132-48508f294900",
    category: "Travel Tips",
    readTime: "4 min read",
    date: "March 15, 2024"
  },
  {
    title: "Luxury Villa vs. Resort: Which to Choose?",
    slug: "villa-vs-resort",
    excerpt: "Compare the pros and cons of staying in a private villa versus a luxury resort in Cabo.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    category: "Accommodations",
    readTime: "6 min read",
    date: "March 10, 2024"
  }
];

const categories = [
  "All",
  "Travel Tips",
  "Activities",
  "Food & Drink",
  "Beaches",
  "Nightlife",
  "Accommodations",
  "Events",
  "Weddings"
];

export default function Blog() {
  return (
    <>
      <Head>
        <title>Cabo Travel Blog & Guides | @cabo</title>
        <meta name="description" content="Your ultimate source for Cabo San Lucas travel tips, guides, and insider knowledge. Discover the best of Cabo through local expertise." />
      </Head>

      <main className="pt-20">
        {/* Featured Post */}
        <div className="relative h-[60vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1582260455046-3697a73dcd1c')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
          <div className="relative z-10 container mx-auto px-4 text-white">
            <span className="inline-block bg-primary px-4 py-1 rounded-full text-sm mb-4">Featured</span>
            <h1 className="text-5xl font-bold mb-4 max-w-2xl">Ultimate Guide to Cabo's Best Beaches</h1>
            <p className="text-xl mb-6 max-w-2xl">Discover the most beautiful and secluded beaches in Los Cabos, from Lover's Beach to Chileno Bay.</p>
            <Link
              href="/blog/best-beaches-cabo"
              className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition-colors border"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                    <div className="relative h-48">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readTime}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Never Miss a Post</h2>
            <p className="text-lg mb-8">Get the latest travel tips and insider knowledge delivered to your inbox</p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 