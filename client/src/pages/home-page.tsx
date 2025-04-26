import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { generateSlug } from "@/lib/utils";
import { Villa, parseVillaData } from "@/types/villa";
import { VillaCard } from "@/components/villa-card";
import { ChevronRight, ArrowDown, Clock, Map, Star, Heart } from "lucide-react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import FeaturedExperiences from "@/components/featured-experiences";
import ItineraryBuilder from "@/components/itinerary-builder";
import StaysSection from "@/components/stays-section";
import ActivitiesSection from "@/components/activities-section";
import DiningSection from "@/components/dining-section";
import EventsSection from "@/components/events-section";
import SEO from "@/components/SEO";
import { sampleBlogs } from "@/data/sample-blogs";
import { format } from "date-fns";
import GuideDownloadPopup from "@/components/GuideDownloadPopup";
import GuideRequestPopup from '@/components/GuideRequestPopup';
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ResponsiveCaboImage, CaboImage } from "@/components/ui/cabo-image";
import { images } from "@/lib/imageMap";
import { TestimonialFaces } from "@/components/testimonials/testimonial-faces";

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
                {/* Testimonial faces with real customer photos */}
                <div className="flex items-center gap-4">
                  <TestimonialFaces 
                    count={4} 
                    size="lg" 
                    autoRotate={false}
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-gray-600">
                      Trusted by <span className="font-semibold">227,000+</span> travelers
                    </span>
                    <span className="text-yellow-400 mt-1">⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                onClick={() => setIsGuideFormOpen(true)}
                className="bg-[#095355] hover:bg-[#074143] text-white text-xl px-12 py-5 rounded-lg transform transition-all duration-300 hover:scale-105 hidden md:inline-flex relative backdrop-blur-sm bg-opacity-90 shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(9,83,85,0.4)] wiggle-animation"
              >
                GET YOUR 2025 ULTIMATE GUIDE TO CABO
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Mobile CTA Button */}
              <Button
                onClick={() => setIsGuideFormOpen(true)}
                className="md:hidden mx-auto w-[85%] my-8 bg-[#095355] hover:bg-[#074143] text-white text-base px-4 py-6 rounded-lg flex items-center justify-center gap-2 shadow-[0_6px_15px_rgba(0,0,0,0.25)] wiggle-animation"
              >
                GET YOUR 2025 ULTIMATE GUIDE
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

        {/* Spacer - reduced by 50% on mobile */}
        <div className="w-full py-2 md:py-4 bg-white"></div>

        {/* Featured Experiences Section - Light Orange Background */}
        <div className="w-full bg-[#FEF6E6] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <FeaturedExperiences />
          </div>
        </div>

        {/* Stays Section - White Background */}
        <StaysSection />
        
        {/* Activities Section - Light Orange Background */}
        <ActivitiesSection />
        
        {/* Dining Section - White Background */}
        <DiningSection />
        
        {/* Events Section - Light Orange Background */}
        <EventsSection />

        {/* Luxury Concierge */}
        <div className="bg-[#2F4F4F] text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column - Image */}
              <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-lg">
                <ResponsiveCaboImage 
                  src="/uploads/grand-velas-los-cabos.webp" 
                  alt="Grand Velas Los Cabos luxury resort with yacht"
                  category="luxury"
                  aspectRatio="16/9"
                  className="rounded-xl"
                />
              </div>
              {/* Right Column - Content */}
              <div className="text-left text-white">
                <h2 className="text-3xl font-bold mb-4">Luxury Concierge Services</h2>
                <p className="text-lg mb-6 text-gray-200">
                  Experience Cabo San Lucas like never before with our premium concierge services. From private jets to yacht charters, we handle every detail.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CC5500] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200">Personalized VIP service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CC5500] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200">Exclusive access to premier events</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CC5500] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200">Luxury transportation and reservations</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/concierge" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#2F4F4F] px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg">
                    Get Started
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Blog Posts */}
        <div className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">What's Going On in Cabo</h2>
            <p className="text-lg text-gray-600 mb-8">Stories, tips, and guides for your next Cabo adventure</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sampleBlogs.map((blog, index) => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`}
                  className={`group block ${index === 2 ? 'hidden md:block' : ''}`}
                >
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
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Itinerary Builder Teaser Section */}
        <div className="bg-[#2F4F4F] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column - Content */}
              <div className="text-left text-white">
                <h2 className="text-3xl font-bold mb-4">Build Your Dream Cabo Vacation</h2>
                <p className="text-lg mb-6 text-gray-200">
                  Let our AI-powered assistant create a personalized itinerary based on your preferences.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CC5500] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200">Day-by-day personalized plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CC5500] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200">Restaurant and activity recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CC5500] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200">Local insider tips and hidden gems</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/itinerary-builder" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#2F4F4F] px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg">
                    Create Your Itinerary 
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Image */}
              <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-lg">
                <ResponsiveCaboImage 
                  src="/uploads/dream-vacation-cabo.webp"
                  alt="Friends celebrating on a yacht at El Arco in Cabo San Lucas"
                  category="activity"
                  aspectRatio="16/9"
                  className="rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Feed */}
        <div className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Follow @cabo on Instagram</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Sample Instagram posts - first row only */}
              {[
                images.beach.featured1,
                images.villa.featured2,
                images.activity.featured3,
                images.restaurant.featured1
              ].map((imageSrc, i) => (
                <a 
                  key={i}
                  href="https://instagram.com/cabo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg group"
                >
                  <CaboImage 
                    src={imageSrc}
                    alt={`Cabo Instagram post ${i+1}`}
                    category={i === 0 ? "beach" : i === 1 ? "villa" : i === 2 ? "activity" : "restaurant"}
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