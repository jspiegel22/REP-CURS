import HeroSection from "@/components/hero-section";
import CategoryGrid from "@/components/category-grid";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";

const guides = [
  { title: "Bachelorette Guide", image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31?ixlib=rb-4.0.3", link: "/guides/bachelorette" },
  { title: "Wedding Planning", image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?ixlib=rb-4.0.3", link: "/guides/weddings" },
  { title: "Real Estate Investment", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3", link: "/guides/real-estate" }
];

const featuredAdventures = [
  { title: "Luxury Yacht Tour", image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3" },
  { title: "Private Beach Experience", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3" },
  { title: "Sunset Sailing", image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?ixlib=rb-4.0.3" }
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />

      {/* Main Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-[#2F4F4F]">Explore Cabo San Lucas</h2>
        <CategoryGrid />
      </div>

      {/* Featured Adventures */}
      <div className="bg-[#F5F5DC] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-[#2F4F4F]">Featured Adventures</h2>
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

      {/* Digital Guides */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-[#2F4F4F]">Digital Travel Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link key={guide.title} href={guide.link}>
              <div className="cursor-pointer group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img src={guide.image} alt={guide.title} className="w-full aspect-[3/2] object-cover transition-transform group-hover:scale-105" />
                </div>
                <h3 className="text-xl font-semibold text-[#2F4F4F] group-hover:text-[#2F4F4F]/80">{guide.title}</h3>
              </div>
            </Link>
          ))}
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
                <li>WhatsApp: +52 624 XXX XXXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiTiktok size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiInstagram size={24} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiFacebook size={24} />
              </a>
              <a href="https://wa.me/526241234567" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiWhatsapp size={24} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiPinterest size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiYoutube size={24} />
              </a>
            </div>
            <p className="text-center text-sm text-gray-300">&copy; {new Date().getFullYear()} Cabo Travels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}