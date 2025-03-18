import { Link } from "wouter";
import { SiInstagram, SiFacebook } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#2F4F4F] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">@cabo</h3>
            <p className="text-sm text-white/70">
              Your premier destination for luxury accommodations in Cabo San Lucas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/villa">
                  <a className="text-sm text-white/70 hover:text-white">Villas</a>
                </Link>
              </li>
              <li>
                <Link href="/resort">
                  <a className="text-sm text-white/70 hover:text-white">Resorts</a>
                </Link>
              </li>
              <li>
                <Link href="/adventures">
                  <a className="text-sm text-white/70 hover:text-white">Adventures</a>
                </Link>
              </li>
              <li>
                <Link href="/restaurants">
                  <a className="text-sm text-white/70 hover:text-white">Restaurants</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-white/70">
                Email: contact@cabo.com
              </li>
              <li className="text-sm text-white/70">
                Phone: +1 (555) 123-4567
              </li>
              <li className="text-sm text-white/70">
                Address: Cabo San Lucas, Mexico
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white">
                <SiInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-white">
                <SiFacebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} @cabo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}