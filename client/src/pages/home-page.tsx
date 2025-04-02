import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { generateSlug } from "@/lib/utils";
import { Villa, parseVillaData } from "@/types/villa";
import { VillaCard } from "@/components/villa-card";
import { ChevronRight, ArrowDown } from "lucide-react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import CategoryGrid from "@/components/category-grid";
import SEO from "@/components/SEO";
import { sampleBlogs } from "@/data/sample-blogs";
import { format } from "date-fns";
import { GuideDownloadForm } from "@/components/guide-download-form";
import GuideRequestPopup from '@/components/GuideRequestPopup';
import { WhatsAppButton } from "@/components/whatsapp-button";

// Import villa data
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg?width=486,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocea...,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg?width=486,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10`;

const villas = parseVillaData(villaData);

const featuredResorts = [
  { 
    title: "Casa Dorada Resort & Spa",
    image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3",
    location: "Cabo San Lucas"
  },
  { 
    title: "Waldorf Astoria Los Cabos Pedregal",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3",
    location: "Pedregal"
  },
  { 
    title: "Montage Los Cabos",
    image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?ixlib=rb-4.0.3",
    location: "Los Cabos"
  }
];

const featuredAdventures = [
  { title: "Luxury Yacht Tour", image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3" },
  { title: "Private Beach Experience", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3" },
  { title: "Sunset Sailing", image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?ixlib=rb-4.0.3" }
];

const guides = [
  { title: "Bachelorette Guide", image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31?ixlib=rb-4.0.3", link: "/guides/bachelorette" },
  { title: "Wedding Planning", image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?ixlib=rb-4.0.3", link: "/guides/weddings" },
  { title: "Real Estate Investment", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3", link: "/guides/real-estate" }
];

export default function HomePage() {
  const [isGuidePopupOpen, setIsGuidePopupOpen] = useState(false);
  const [isGuideFormOpen, setIsGuideFormOpen] = useState(false);

  // Extract video ID from YouTube URL
  const videoId = "02mzc-SyIYA";

  return (
    <>
      <SEO
        title="Cabo Adventures - Luxury Travel & Experiences in Cabo San Lucas"
        description="Discover luxury villas, exclusive resorts, thrilling adventures, and real estate opportunities in Cabo San Lucas. Your premier destination for unforgettable experiences."
        canonicalUrl="https://cabo-adventures.com"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Cabo Adventures',
          url: 'https://cabo-adventures.com',
          logo: 'https://cabo-adventures.com/logo.png',
          sameAs: [
            'https://www.instagram.com/cabo',
            'https://www.facebook.com/cabosanlucasbaja',
            'https://www.tiktok.com/@atcabo'
          ],
          description: 'Premier luxury travel and experiences provider in Cabo San Lucas',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1 (888) 123-4567',
            contactType: 'customer service'
          }
        }}
        openGraph={{
          title: 'Cabo Adventures - Luxury Travel & Experiences',
          description: 'Your gateway to exclusive experiences in Cabo San Lucas. Discover luxury villas, resorts, and adventures.',
          image: '/attached_assets/image_1742331906326.png',
          url: 'https://cabo-adventures.com'
        }}
        keywords={[
          'Cabo San Lucas',
          'luxury villas',
          'resort booking',
          'adventures',
          'real estate',
          'travel guide',
          'luxury travel',
          'Mexico vacation'
        ]}
      />
      <main>
        {/* Hero Section */}
        <div className="relative min-h-[80vh] bg-white">
          {/* Content */}
          <div className="relative container mx-auto px-4 pt-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Category Label */}
              <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4">
                <p className="text-[#2F4F4F] text-sm md:text-base font-medium">✨ #1 CABO COMMUNITY SINCE 2015 ✨</p>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
                Discover the Magic of Cabo
              </h1>
              <p className="text-base md:text-xl mb-6 text-gray-600 max-w-2xl mx-auto">
                From luxury villas to thrilling adventures, experience the best of Cabo with our curated travel guide
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex -space-x-4">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64"
                    alt="User"
                  />
                </div>
                <div className="ml-4 flex flex-col items-center">
                  <span className="text-gray-600">
                    Trusted by <span className="font-semibold">227,000+</span> travelers
                  </span>
                  <span className="text-yellow-400 mt-1">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                onClick={() => setIsGuideFormOpen(true)}
                className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hidden md:inline-flex relative backdrop-blur-sm bg-opacity-90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(47,79,79,0.3)]"
              >
                Get Your Free Guide
              </Button>

              {/* Mobile CTA Button */}
              <Button
                onClick={() => setIsGuideFormOpen(true)}
                className="md:hidden mx-auto w-[80%] bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                Get Your Free Guide
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Embedded Video Section */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative w-full pt-[56.25%] bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3&fs=0&color=white&disablekb=1&hl=en&cc_load_policy=0&cc_lang_pref=en&widget_referrer=${window.location.href}&enablejsapi=1&playerapiid=ytplayer&version=3`}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                  {/* Overlay to prevent interactions */}
                  <div className="absolute inset-0 z-10" />
                </div>
              </div>
              
              {/* Guide Download Form Modal */}
              <GuideDownloadForm
                isOpen={isGuideFormOpen}
                onClose={() => setIsGuideFormOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Featured Villas Section */}
        <div className="container mx-auto px-4 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">Featured Luxury Villas</h2>
          <div className="relative">
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-6">
                {villas.map((villa) => (
                  <VillaCard 
                    key={villa.id} 
                    villa={villa} 
                    className="flex-none w-[300px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Social Proof Section */}
        <div className="bg-[#F5F5F5] py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trusted by Thousands of Happy Travelers</h2>
              <p className="text-lg text-gray-600">Join our community of luxury travelers who've experienced the magic of Cabo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64" 
                    alt="Sarah M."
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm text-gray-500">Honeymoon Trip</p>
                  </div>
                </div>
                <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600">"The concierge service was exceptional. They arranged everything from our airport transfer to sunset sailing. Best vacation ever!"</p>
              </div>

              {/* Review Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64" 
                    alt="Michael R."
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Michael R.</h4>
                    <p className="text-sm text-gray-500">Family Vacation</p>
                  </div>
                </div>
                <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600">"The villa exceeded our expectations. Perfect location, amazing staff, and the views were breathtaking!"</p>
              </div>

              {/* Review Card 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64" 
                    alt="Jessica L."
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Jessica L.</h4>
                    <p className="text-sm text-gray-500">Girls Trip</p>
                  </div>
                </div>
                <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600">"Their travel guide was a game-changer! Found the best restaurants and hidden gems we would've never discovered otherwise."</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#2F4F4F] mb-2">15K+</div>
                <p className="text-gray-600">Happy Travelers</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2F4F4F] mb-2">500+</div>
                <p className="text-gray-600">Luxury Villas</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2F4F4F] mb-2">98%</div>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2F4F4F] mb-2">24/7</div>
                <p className="text-gray-600">Concierge Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Luxury Resorts */}
        <div className="container mx-auto px-4 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">Luxury Resorts</h2>
          <div className="relative">
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-6">
                {featuredResorts.map((resort) => (
                  <Link 
                    key={resort.title}
                    href={`/resort/${generateSlug(resort.title)}`}
                    className="block group flex-none w-[300px]"
                  >
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={resort.image} 
                        alt={resort.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white text-xl font-semibold">{resort.title}</h3>
                        <p className="text-white/80">{resort.location}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Explore Cabo San Lucas</h2>
          <CategoryGrid />
        </div>

        {/* Featured Adventures */}
        <div className="bg-[#F5F5DC] py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Adventures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAdventures.map((adventure) => (
                <div key={adventure.title} className="relative overflow-hidden rounded-lg group">
                  <img src={adventure.image} alt={adventure.title} className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white text-xl font-semibold p-6">{adventure.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Luxury Concierge */}
        <div className="bg-[#2F4F4F] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column - Image */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3" 
                  alt="Luxury Concierge Services"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Right Column - Content */}
              <div className="text-left md:text-left text-center">
                <h2 className="text-3xl font-bold mb-4">Luxury Concierge Services</h2>
                <p className="text-lg mb-8">
                  Experience Cabo San Lucas like never before with our premium concierge services. From private jets to yacht charters, we handle every detail.
                </p>
                <Button asChild variant="outline" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]">
                  <Link href="/concierge">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Blog Posts */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Latest from Our Blog</h2>
            <p className="text-lg text-gray-600 mb-8">Stories, tips, and guides for your next Cabo adventure</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sampleBlogs.map((blog, index) => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`}
                  className={`block ${index === 2 ? 'hidden md:block' : ''}`}
                >
                  <a className="group block">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{format(new Date(blog.date), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-[#2F4F4F] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">{blog.excerpt}</p>
                      <div className="pt-2 flex items-center gap-2 text-sm">
                        <span className="text-[#2F4F4F] font-medium">{blog.author}</span>
                        <span>in</span>
                        <span className="text-[#2F4F4F] font-medium">{blog.category}</span>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Guide Download CTA */}
        <div className="container mx-auto px-4 py-12">
          <div className="bg-[#2F4F4F] rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Ultimate Cabo Guide 2025
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Discover the best of Cabo with our comprehensive guide featuring exclusive tips, recommendations, and insider knowledge.
            </p>
            <Button
              onClick={() => setIsGuideFormOpen(true)}
              className="bg-white text-[#2F4F4F] hover:bg-gray-100 text-lg py-6 px-8 rounded-xl flex items-center gap-2 mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
            >
              Download Your Guide
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Guide Download Form */}
        <GuideDownloadForm
          isOpen={isGuideFormOpen}
          onClose={() => setIsGuideFormOpen(false)}
        />

        {/* Trust & Security Indicators */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#2F4F4F]/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#2F4F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Secure Booking</h3>
                <p className="text-sm text-gray-600">SSL encrypted payment</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#2F4F4F]/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#2F4F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Travel Insurance</h3>
                <p className="text-sm text-gray-600">Full coverage options</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#2F4F4F]/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#2F4F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Flexible Payment</h3>
                <p className="text-sm text-gray-600">Multiple payment options</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#2F4F4F]/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#2F4F4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Feed */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Follow Our Journey</h2>
              <p className="text-lg text-gray-600">Tag us @CaboAdventures for a chance to be featured!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Sample Instagram posts - replace with actual Instagram API integration */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <a 
                  key={i}
                  href="https://instagram.com/caboadventures"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg group"
                >
                  <img 
                    src={`https://source.unsplash.com/random/600x600?cabo,beach,luxury&sig=${i}`}
                    alt="Instagram post"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <SiInstagram className="w-8 h-8 text-white" />
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <a 
                href="https://instagram.com/caboadventures"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#2F4F4F] hover:text-[#1F3F3F] font-medium"
              >
                <SiInstagram className="w-5 h-5" />
                Follow us on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </main>

      {/* Guide Request Popup */}
      <GuideRequestPopup
        isOpen={isGuidePopupOpen}
        onClose={() => setIsGuidePopupOpen(false)}
      />
    </>
  );
}