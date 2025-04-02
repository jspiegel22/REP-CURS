import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GuideDownloadForm } from "./guide-download-form";

export default function HeroSection() {
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const youtubeVideoId = "02mzc-SyIYA";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Handle YouTube video error
  useEffect(() => {
    const handleError = () => {
      console.error("YouTube video failed to load");
      setVideoLoaded(false);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('error', handleError);
      
      return () => {
        iframe.removeEventListener('error', handleError);
      };
    }
  }, []);
  
  return (
    <div className="relative min-h-[600px] md:h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=1920&auto=format&fit=crop)`,
        }}
      />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10">
        <div className="container mx-auto px-4 h-full flex flex-col items-center">
          <div className="max-w-3xl text-white py-12 md:py-6 mt-8 md:mt-16">
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
          
          {/* YouTube Video Section */}
          <div className="w-full max-w-4xl mt-8 md:mt-10 mb-8 rounded-lg overflow-hidden shadow-2xl">
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe 
                ref={iframeRef}
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${youtubeVideoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                title="Cabo San Lucas Promotional Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoLoaded(true)}
              ></iframe>
              
              {/* Fallback if video doesn't load */}
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-6 text-center">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cabo San Lucas Video</h3>
                    <p>Click to watch our promotional video showcasing the beauty of Cabo San Lucas.</p>
                    <Button 
                      className="mt-4 bg-[#2F4F4F] hover:bg-[#1F3F3F]"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${youtubeVideoId}`, '_blank')}
                    >
                      Watch on YouTube
                    </Button>
                  </div>
                </div>
              )}
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