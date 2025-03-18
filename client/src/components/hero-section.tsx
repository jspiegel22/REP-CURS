import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full bg-cover bg-center" 
         style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3")' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="w-full max-w-3xl text-white pt-20 pb-12 md:py-0">
            {/* Pill label */}
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <p className="text-white text-sm font-medium">✨ Your Ultimate Guide to Cabo</p>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-4 leading-tight">
              Experience Luxury<br />in Paradise 🌊
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl mb-8 md:mb-12 text-white/90">
              Discover the finest experiences Cabo San Lucas has to offer, with<br className="hidden md:block" />
              insider tips and exclusive access 🎯
            </p>

            {/* Social proof metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-base md:text-lg">17,000+ Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-base md:text-lg">Updated Monthly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-base md:text-lg">Trusted by Travel Experts</span>
              </div>
            </div>

            {/* User testimonials */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-8">
              <div className="flex -space-x-4">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=4" alt="User" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex gap-1 text-yellow-400 text-lg md:text-xl">
                  ⭐️⭐️⭐️⭐️⭐️
                </div>
                <span className="text-white/90 text-sm md:text-base">from 2,000+ happy travelers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}