import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SEO from "@/components/SEO";
import { Star, MapPin, CalendarDays, Clock, Users, Trophy, Heart, ThumbsUp } from "lucide-react";

export default function PartyPage() {
  return (
    <>
      <SEO
        title="Ultimate Party Experiences in Cabo San Lucas | Nightlife Guide"
        description="Discover the best party experiences in Cabo San Lucas. From yacht parties to nightclubs, find the ultimate nightlife adventures for your Cabo vacation."
        canonicalUrl="https://cabo-adventures.com/party"
        keywords={[
          'Cabo San Lucas parties',
          'yacht parties',
          'nightlife in Cabo',
          'Cabo beach clubs',
          'VIP nightclub packages',
          'bottle service Cabo',
          'bachelor parties',
          'bachelorette parties',
          'Cabo club crawl'
        ]}
        openGraph={{
          title: "Ultimate Party Experiences in Cabo San Lucas",
          description: "Experience the best nightlife and party scenes in Cabo San Lucas. Plan your ultimate party getaway with our exclusive guide.",
          image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
          url: "https://cabo-adventures.com/party"
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] w-full">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67')",
              backgroundBlendMode: "overlay",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
                Cabo's Ultimate Party Experiences
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mb-8 text-gray-200">
                From exclusive yacht parties to VIP nightclubs, experience the legendary Cabo nightlife
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Book A Party Package
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Options
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-16 px-4">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white">BEST OF CABO</Badge>
            <h2 className="text-4xl font-bold mb-6">Unforgettable Party Experiences</h2>
            <p className="text-xl text-gray-300">
              Cabo San Lucas is world-renowned for its vibrant nightlife and exclusive party scene. From 
              daytime yacht excursions to all-night club adventures, we offer premium party experiences 
              tailored to your group's needs and preferences.
            </p>
          </div>

          {/* Featured Experiences */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Luxury Yacht Party */}
            <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1544551763-92ab472cad5d" 
                  alt="Luxury Yacht Party"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600">MOST POPULAR</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Luxury Yacht Party</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.9</span>
                    <span className="text-gray-400 ml-1">(124)</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Cruise the Sea of Cortez on a private luxury yacht with open bar, DJ, and catering.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>6 hours</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Up to 20 guests</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Marina Cabo San Lucas</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold">$2,999</span>
                    <span className="text-gray-400 ml-2">per group</span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
                </div>
              </CardContent>
            </Card>

            {/* VIP Nightclub Package */}
            <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1545128485-c400ce7b23d2" 
                  alt="VIP Nightclub Experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">VIP Nightclub Package</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.8</span>
                    <span className="text-gray-400 ml-1">(87)</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Skip the lines and enjoy VIP table service at Cabo's most exclusive nightclubs.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>8 hours</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="h-4 w-4 mr-1" />
                    <span>6-12 guests</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Downtown Cabo</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold">$1,499</span>
                    <span className="text-gray-400 ml-2">per group</span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Beach Club Day Party */}
            <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-60">
                <img 
                  src="https://images.unsplash.com/photo-1563544969-60c6bb143ee8" 
                  alt="Beach Club Day Party"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Beach Club Day Party</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.7</span>
                    <span className="text-gray-400 ml-1">(105)</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Spend the day at Medano Beach's hottest clubs with reserved daybeds and bottle service.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>6 hours</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="h-4 w-4 mr-1" />
                    <span>4-8 guests</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Medano Beach</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold">$899</span>
                    <span className="text-gray-400 ml-2">per group</span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials Section */}
          <div className="bg-gray-900 rounded-xl p-8 mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">What Our Party-Goers Say</h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        JD
                      </div>
                      <div>
                        <h4 className="font-bold">Jason D.</h4>
                        <div className="flex text-yellow-400">
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      "The yacht party exceeded our expectations! Professional staff, premium drinks, and the best views of Cabo. Perfect for our bachelor party!"
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 h-12 w-12 rounded-full bg-pink-600 flex items-center justify-center">
                        KM
                      </div>
                      <div>
                        <h4 className="font-bold">Kylie M.</h4>
                        <div className="flex text-yellow-400">
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      "Our bachelorette party was AMAZING! VIP treatment at every club, no lines, great tables, and the host made sure everything was perfect!"
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                        TR
                      </div>
                      <div>
                        <h4 className="font-bold">Tyler R.</h4>
                        <div className="flex text-yellow-400">
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      "The beach club day party was incredible. Great music, amazing atmosphere, and the service was top-notch. We'll definitely be back!"
                    </p>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Party With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg flex">
                <Trophy className="h-12 w-12 text-yellow-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Premium Experiences</h3>
                  <p className="text-gray-300">
                    We partner with only the highest-rated venues and service providers to ensure an unforgettable experience.
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg flex">
                <Heart className="h-12 w-12 text-red-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Personalized Service</h3>
                  <p className="text-gray-300">
                    Our party planners work with you to customize every detail of your experience to match your group's style.
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg flex">
                <ThumbsUp className="h-12 w-12 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Worry-Free Booking</h3>
                  <p className="text-gray-300">
                    All transportation, reservations, and payments are handled for you so you can focus on having fun.
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg flex">
                <CalendarDays className="h-12 w-12 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">VIP Access</h3>
                  <p className="text-gray-300">
                    Skip the lines and enjoy preferred access to Cabo's most exclusive venues and events.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative py-16 px-4 rounded-xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1567532939604-b6b5b0db2604')",
              }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-80"></div>
            </div>
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Party in Cabo?</h2>
              <p className="text-xl mb-8">
                Contact our party planning specialists today to create your perfect Cabo nightlife experience.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                  Book a Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View All Party Packages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}