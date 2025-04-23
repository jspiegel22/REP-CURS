import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { generateSlug } from "@/lib/utils";
import { Villa, parseVillaData } from "@/types/villa";
import { VillaCard } from "@/components/villa-card";
import { ChevronRight, ArrowDown } from "lucide-react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import CategoryGrid from "@/components/category-grid";
import FeaturedExperiences from "@/components/featured-experiences";
import CuratedCollections from "@/components/curated-collections";
import SEO from "@/components/SEO";
import { sampleBlogs } from "@/data/sample-blogs";
import { format } from "date-fns";
import GuideDownloadPopup from "@/components/GuideDownloadPopup";
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
        title="@cabo - Luxury Travel & Experiences in Cabo San Lucas | #1 Cabo Community Since 2015"
        description="Discover luxury villas, exclusive resorts, and curated experiences in Cabo San Lucas with @cabo. Your trusted source for premium travel since 2015. Get insider tips, restaurant guides, and concierge services."
        canonicalUrl="https://cabo.is"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: '@cabo',
          url: 'https://cabo.is',
          logo: 'https://cabo.is/logo.png',
          sameAs: [
            'https://www.instagram.com/cabo',
            'https://www.facebook.com/cabosanlucasbaja',
            'https://www.tiktok.com/@atcabo'
          ],
          description: 'Premier luxury travel and experiences provider in Cabo San Lucas since 2015',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1 (888) 123-4567',
            contactType: 'customer service'
          }
        }}
        openGraph={{
          title: '@cabo - Luxury Travel & Experiences in Cabo San Lucas',
          description: 'Your gateway to exclusive experiences in Cabo San Lucas. Discover luxury villas, resorts, and adventures with @cabo.',
          image: '/attached_assets/image_1742331906326.png',
          url: 'https://cabo.is'
        }}
        keywords={[
          'Cabo San Lucas',
          'luxury villas',
          'resort booking',
          'adventures',
          'real estate',
          'travel guide',
          'luxury travel',
          'Mexico vacation',
          '@cabo',
          'Cabo restaurants',
          'Cabo concierge',
          'Cabo luxury experiences'
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
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3&fs=0&color=white&disablekb=1&hl=en&cc_load_policy=0&cc_lang_pref=en&widget_referrer=${window.location.href}&version=3&autohide=1&title=0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3&fs=0&color=white&disablekb=1&hl=en&cc_load_policy=0&cc_lang_pref=en&widget_referrer=${window.location.href}&version=3&autohide=1&title=0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3&fs=0&color=white&disablekb=1&hl=en&cc_load_policy=0&cc_lang_pref=en&widget_referrer=${window.location.href}&version=3&autohide=1&title=0`}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="Cabo Experience"
                    frameBorder="0"
                  />
                  {/* Black overlay with reduced opacity */}
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                </div>
              </div>
              
              {/* Guide Download Form Modal */}
              <GuideDownloadPopup
                isOpen={isGuideFormOpen}
                onClose={() => setIsGuideFormOpen(false)}
                guideType="Ultimate Cabo Guide 2025"
                title="Download Your Free Cabo Guide"
                description="Enter your details below to get instant access to our premium Cabo travel guide."
                tags="Guide Request, Cabo Guide, Website"
              />
            </div>
          </div>
        </div>

        {/* Featured Experiences Section */}
        <div className="container mx-auto px-4 py-12 bg-gray-50">
          <FeaturedExperiences />
        </div>

        {/* Main Categories - Explore Cabo */}
        <div className="container mx-auto px-4 py-16">
          <CategoryGrid />
        </div>
        
        {/* Curated Collections */}
        <div className="container mx-auto px-4 py-16 bg-gray-50">
          <CuratedCollections />
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
        <div className="bg-[#2F4F4F] py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column - Content */}
              <div className="text-left text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Download Our 2025 Restaurant Guide
                </h2>
                <p className="text-lg mb-8 text-gray-200">
                  Discover the finest dining experiences in Cabo with our curated guide to the best restaurants, from hidden gems to Michelin-starred establishments.
                </p>
                <Button
                  onClick={() => setIsGuideFormOpen(true)}
                  className="bg-white text-[#2F4F4F] hover:bg-gray-100 text-lg py-6 px-8 rounded-xl flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
                >
                  Get Your Restaurant Guide
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              {/* Right Column - Image */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3" 
                  alt="Cabo Restaurant Guide"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Feed */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Follow @cabo on Instagram</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Sample Instagram posts - first row only */}
              {[1, 2, 3, 4].map((i) => (
                <a 
                  key={i}
                  href="https://instagram.com/cabo"
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