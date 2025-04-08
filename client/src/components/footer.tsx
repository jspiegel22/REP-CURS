import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">@cabo</h3>
            <p className="text-gray-400">Your ultimate guide to experiencing the best of Cabo San Lucas.</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/cabo" className="hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/cabo" className="hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/cabo" className="hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/villas" className="text-gray-400 hover:text-white">Luxury Villas</Link></li>
              <li><Link href="/adventures" className="text-gray-400 hover:text-white">Adventures</Link></li>
              <li><Link href="/dining" className="text-gray-400 hover:text-white">Fine Dining</Link></li>
              <li><Link href="/nightlife" className="text-gray-400 hover:text-white">Nightlife</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cancellation" className="text-gray-400 hover:text-white">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} @cabo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}