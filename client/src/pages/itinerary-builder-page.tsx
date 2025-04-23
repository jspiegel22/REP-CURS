import { useState } from "react";
import SEO from "@/components/SEO";
import ItineraryBuilder from "@/components/itinerary-builder";
import { ChevronRight } from "lucide-react";

export default function ItineraryBuilderPage() {
  return (
    <>
      <SEO
        title="Build Your Own Cabo Itinerary | @cabo"
        description="Create your perfect Cabo San Lucas itinerary with our AI-powered builder. Get personalized recommendations for activities, dining, and experiences tailored to your preferences."
        canonicalUrl="https://cabo.is/itinerary-builder"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Build Your Own Cabo Itinerary',
          description: 'Create a personalized itinerary for your Cabo trip with our AI-powered itinerary builder.',
          url: 'https://cabo.is/itinerary-builder',
          mainEntity: {
            '@type': 'TravelAction',
            name: 'Cabo Itinerary Planning',
            description: 'Plan a personalized trip to Cabo San Lucas with AI-generated recommendations.'
          }
        }}
        openGraph={{
          title: 'Build Your Own Cabo Itinerary | @cabo',
          description: 'Create your perfect Cabo San Lucas itinerary with our AI-powered builder. Get personalized recommendations tailored to your preferences.',
          image: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3',
          url: 'https://cabo.is/itinerary-builder'
        }}
        keywords={[
          'Cabo itinerary',
          'Cabo trip planner',
          'personalized Cabo itinerary',
          'Cabo San Lucas planning',
          'AI travel planner',
          'Cabo vacation builder',
          'custom Cabo experience',
          'Cabo activities',
          'Cabo restaurants'
        ]}
      />

      <main>
        {/* Hero Section */}
        <div className="relative bg-[#FEF6E6] py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <div className="inline-block bg-[#FF8C38]/10 px-4 py-2 rounded-full mb-4">
                  <p className="text-[#FF8C38] text-sm md:text-base font-medium">✨ AI-POWERED TRAVEL PLANNING ✨</p>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Create Your Perfect Cabo Experience
                </h1>
                
                <p className="text-lg mb-6 text-gray-600 max-w-2xl">
                  Our AI-powered itinerary builder creates personalized travel plans based on your preferences. 
                  Get day-by-day recommendations for activities, dining, and experiences tailored to your style.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF8C38] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700">Personalized Recommendations</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF8C38] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700">Day-by-Day Plans</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF8C38] flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700">Local Recommendations</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3" 
                  alt="Cabo San Lucas Experience"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Builder Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Build Your Dream Itinerary</h2>
                <p className="text-lg text-gray-600">
                  Tell us about your preferences and let our AI create a personalized plan for your Cabo adventure
                </p>
              </div>
              
              <ItineraryBuilder className="mb-16" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#FF8C38]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#FF8C38] font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Set Your Preferences</h3>
                  <p className="text-gray-600">Tell us about your trip type, duration, and what experiences you're looking for</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#FF8C38]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#FF8C38] font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Get Your Itinerary</h3>
                  <p className="text-gray-600">Our AI generates a personalized day-by-day plan with specific recommendations</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#FF8C38]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#FF8C38] font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Refine & Book</h3>
                  <p className="text-gray-600">Chat with our AI to refine your plans and book your perfect Cabo experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-16 bg-[#FEF6E6]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how our itinerary builder has helped travelers create unforgettable Cabo experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3" 
                      alt="Sarah J."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah J.</h4>
                    <div className="flex text-yellow-400">
                      <span>★★★★★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The itinerary builder saved me hours of research. Our family vacation was perfectly planned with activities everyone enjoyed. Will definitely use again!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3" 
                      alt="Michael T."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael T.</h4>
                    <div className="flex text-yellow-400">
                      <span>★★★★★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Incredible tool! The restaurant recommendations were spot on and we discovered hidden gems we would have never found on our own."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3" 
                      alt="Jessica R."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Jessica R.</h4>
                    <div className="flex text-yellow-400">
                      <span>★★★★★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As a solo traveler, I was worried about planning everything myself. This tool made it so easy and I felt confident with my personalized itinerary."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}