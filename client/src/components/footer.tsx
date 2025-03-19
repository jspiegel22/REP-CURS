import { Link } from "wouter";
import { SiInstagram, SiFacebook, SiWhatsapp, SiPinterest, SiYoutube, SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#2F4F4F] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300">Your premier destination for luxury travel experiences in Cabo San Lucas.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Stays</h3>
            <ul className="space-y-2">
              <li><Link href="/villas">Luxury Villas</Link></li>
              <li><Link href="/resorts">Resorts & Hotels</Link></li>
              <li><Link href="/real-estate">Real Estate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Activities</h3>
            <ul className="space-y-2">
              <li><Link href="/adventures">Adventures</Link></li>
              <li><Link href="/adventures/luxury-sailing">Luxury Yachts</Link></li>
              <li><Link href="/restaurants">Restaurants</Link></li>
              <li><Link href="/events">Local Events</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Plan Your Trip</h3>
            <ul className="space-y-2">
              <li><Link href="/guides">Travel Guides</Link></li>
              <li><Link href="/group-trips/bachelor-bachelorette">Bachelor/ette</Link></li>
              <li><Link href="/group-trips/luxury-concierge">Luxury Concierge</Link></li>
              <li><Link href="/group-trips/family">Family Trips</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>Email: info@cabotravels.com</li>
              <li>Phone: +1 (888) 123-4567</li>
              <li>WhatsApp: +52 624 244 6303</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Partner With Us</h3>
            <ul className="space-y-2">
              <li><Link href="/work-with-us">Work with Us</Link></li>
              <li><Link href="/group-trips/influencer">For Influencers</Link></li>
              <li><Link href="/weddings">Wedding Planning</Link></li>
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
  );
}