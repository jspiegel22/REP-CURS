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
        {/* Enhanced Hero Section */}
        <div className="relative min-h-[90vh] bg-white">
          <div className="container mx-auto px-4 pt-16">
            <div className="text-center max-w-4xl mx-auto">
              {/* Category Label */}
              <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-6">
                <p className="text-[#2F4F4F] text-sm md:text-base font-medium">Your Complete Cabo Travel Guide</p>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                Discover the Magic of Cabo San Lucas
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                From luxury villas to thrilling adventures, experience the best of Cabo with our curated travel guide
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center mb-8">
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
                <span className="ml-4 text-gray-600">
                  Trusted by <span className="font-semibold">227,000+</span> travelers
                </span>
              </div>

              {/* Enhanced CTA Button - Desktop */}
              <Button 
                className="hidden md:inline-flex items-center gap-3 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              >
                Get Your Free Cabo Guide
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Mobile CTA Button */}
              <Button 
                className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
              >
                Get Your Free Guide
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Hero Image */}
              <div className="relative mt-12 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/attached_assets/image_1742331906326.png"
                  alt="Cabo San Lucas Destination"
                  className="w-full rounded-2xl"
                />
              </div>
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
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Luxury Concierge Services</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Experience Cabo San Lucas like never before with our premium concierge services. From private jets to yacht charters, we handle every detail.
            </p>
            <Button asChild variant="outline" className="bg-white text-[#2F4F4F] hover:bg-[#F5F5DC]">
              <Link href="/concierge">Learn More</Link>
            </Button>
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


        {/* Footer */}
        <footer className="bg-[#2F4F4F] text-white pt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">About Us</h3>
                <p className="text-gray-300">Your premier destination for luxury travel experiences in Cabo San Lucas.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/resorts">Resorts & Hotels</Link></li>
                  <li><Link href="/villas">Luxury Villas</Link></li>
                  <li><Link href="/adventures">Adventures</Link></li>
                  <li><Link href="/restaurants">Restaurants</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Travel Guides</h3>
                <ul className="space-y-2">
                  <li><Link href="/guides/bachelorette">Bachelorette</Link></li>
                  <li><Link href="/guides/weddings">Wedding Planning</Link></li>
                  <li><Link href="/guides/real-estate">Real Estate</Link></li>
                  <li><Link href="/guides/restaurants">Dining Guide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>Email: info@cabotravels.com</li>
                  <li>Phone: +1 (888) 123-4567</li>
                  <li>WhatsApp: +52 624 244 6303</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 pt-8">
              <div className="flex justify-center space-x-6 mb-4">
                <a href="https://www.tiktok.com/@atcabo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                  <SiTiktok size={24} />
                </a>
                <a href="https://instagram.com/cabo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                  <SiInstagram size={24} />
                </a>
                <a href="https://www.youtube.com/@atCabo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                  <SiYoutube size={24} />
                </a>
                <a href="https://wa.me/526242446303" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                  <SiWhatsapp size={24} />
                </a>
                <a href="https://www.facebook.com/cabosanlucasbaja" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                  <SiFacebook size={24} />
                </a>
                <a href="https://www.pinterest.com/instacabo/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                  <SiPinterest size={24} />
                </a>
              </div>
              <p className="text-center text-sm text-gray-300">&copy; {new Date().getFullYear()} Cabo Travels. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}