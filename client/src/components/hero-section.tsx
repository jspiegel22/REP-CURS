import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { GuideDownloadForm } from "./guide-download-form";

export default function HeroSection() {
  const [showGuideForm, setShowGuideForm] = useState(false);
  
  return (
    <div className="relative min-h-[600px] md:h-[80vh] w-full overflow-hidden bg-[url('https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-4.0.3')] bg-cover bg-center">
      {/* Overlay with opacity for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white py-12 md:py-0">
            {/* Pill label */}
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 rounded-full mb-6 md:mb-8">
              <p className="text-white text-xs md:text-sm font-medium">✨ Your Ultimate Guide to Cabo</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
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
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex -space-x-4">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=4" alt="User" className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex gap-1 text-lg md:text-xl text-yellow-400">
                  ⭐️⭐️⭐️⭐️⭐️
                </div>
                <span className="text-sm md:text-base text-white/90">from 2,000+ happy travelers</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="mt-8">
              <Button 
                className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white px-8 py-6 text-xl font-medium rounded-xl shadow-xl"
                onClick={() => setShowGuideForm(true)}
              >
                Get Your Free Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Guide Download Form */}
      <GuideDownloadForm 
        isOpen={showGuideForm} 
        onClose={() => setShowGuideForm(false)} 
      />
    </div>
  );
}