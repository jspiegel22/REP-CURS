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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import { Star, MapPin, Clock, Users, ThumbsUp, Sparkles, Heart, Leaf } from "lucide-react";

export default function WellnessPage() {
  return (
    <>
      <SEO
        title="Wellness Retreats & Spa Experiences in Cabo San Lucas"
        description="Discover rejuvenating wellness retreats and luxury spa experiences in Cabo San Lucas. From beachfront yoga to traditional Mexican healing rituals."
        canonicalUrl="https://cabo-adventures.com/wellness"
        keywords={[
          'Cabo wellness retreats',
          'luxury spas in Cabo',
          'yoga retreats Cabo',
          'Mexican healing rituals',
          'meditation retreats',
          'beachfront yoga',
          'wellness vacation',
          'detox programs Cabo',
          'mindfulness retreat'
        ]}
        openGraph={{
          title: "Wellness Retreats & Spa Experiences in Cabo San Lucas",
          description: "Revitalize your mind, body, and spirit with our curated wellness experiences in the beautiful setting of Cabo San Lucas.",
          image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
          url: "https://cabo-adventures.com/wellness"
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] w-full">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874')",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center p-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white animate-fade-in-up">
                Wellness & Rejuvenation in Cabo
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mb-8 text-white">
                Revitalize your mind, body, and spirit in one of the world's most beautiful destinations
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Explore Retreats
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Book a Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-16 px-4">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-emerald-600 text-white">WELLNESS DESTINATION</Badge>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Comprehensive Wellness Experiences</h2>
            <p className="text-xl text-gray-600">
              The healing energy of Baja California makes Cabo San Lucas the perfect setting for wellness 
              and rejuvenation. Our carefully curated experiences combine natural beauty, traditional 
              Mexican healing practices, and modern wellness techniques to create transformative journeys 
              for mind, body, and spirit.
            </p>
          </div>

          {/* Wellness Categories Tabs */}
          <Tabs defaultValue="retreats" className="max-w-5xl mx-auto mb-20">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="retreats">Wellness Retreats</TabsTrigger>
              <TabsTrigger value="spa">Luxury Spa Experiences</TabsTrigger>
              <TabsTrigger value="activities">Mindful Activities</TabsTrigger>
            </TabsList>
            
            {/* Retreats Tab */}
            <TabsContent value="retreats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Weekend Wellness Retreat */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1515377905703-c4788e51af15" 
                      alt="Weekend Wellness Retreat"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-600">MOST POPULAR</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Weekend Wellness Retreat</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.9</span>
                        <span className="text-gray-400 ml-1">(89)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      An immersive 3-day retreat featuring yoga, meditation, healthy cuisine, and spa treatments.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>3 days</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Max 12 guests</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Pacific-side resort</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$1,499</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Yoga & Surf Retreat */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" 
                      alt="Yoga & Surf Retreat"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Yoga & Surf Retreat</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.8</span>
                        <span className="text-gray-400 ml-1">(64)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Balance dynamic surf lessons with restorative yoga practices in this 5-day active retreat.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>5 days</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Max 10 guests</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Cerritos Beach</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$2,299</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mind-Body Reset */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1532798442725-41036acc7489" 
                      alt="Mind-Body Reset Retreat"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Mind-Body Reset</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.9</span>
                        <span className="text-gray-400 ml-1">(42)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      A comprehensive 7-day program featuring detox, nutrition guidance, and holistic therapies.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>7 days</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Max 8 guests</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Boutique wellness resort</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$3,499</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Spa Tab */}
            <TabsContent value="spa">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Desert Healing Ritual */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1600334129128-685c5582fd35" 
                      alt="Desert Healing Ritual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Desert Healing Ritual</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.9</span>
                        <span className="text-gray-400 ml-1">(118)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Traditional Mexican healing ceremony using indigenous herbs, hot stones, and agave rituals.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>120 minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Luxury resort spas</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$299</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ocean Purification Experience */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd" 
                      alt="Ocean Purification Experience"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-600">TOP RATED</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Ocean Purification</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">5.0</span>
                        <span className="text-gray-400 ml-1">(87)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Rejuvenating treatment using marine elements, hydrotherapy, and thalassotherapy techniques.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>150 minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Beachfront spa pavilion</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$349</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Couples Harmony Ritual */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1620733723572-11c53f73a416" 
                      alt="Couples Harmony Ritual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Couples Harmony Ritual</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.8</span>
                        <span className="text-gray-400 ml-1">(76)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      A shared journey of relaxation for couples featuring dual massages and private jacuzzi.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>180 minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Private spa suites</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$599</span>
                        <span className="text-gray-500 ml-2">per couple</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Activities Tab */}
            <TabsContent value="activities">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Sunrise Beach Yoga */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" 
                      alt="Sunrise Beach Yoga"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Sunrise Beach Yoga</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.9</span>
                        <span className="text-gray-400 ml-1">(124)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Greet the day with an energizing beachfront yoga session as the sun rises over the Sea of Cortez.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>90 minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Chileno Beach</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$49</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Desert Sound Healing */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1517091869929-c2554e8acaa0" 
                      alt="Desert Sound Healing"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-600">NEW</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Desert Sound Healing</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.9</span>
                        <span className="text-gray-400 ml-1">(42)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Experience a transformative sound bath with crystal bowls and indigenous instruments in the desert.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>120 minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>San Jose del Cabo Desert</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$89</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mindful Hiking Journey */}
                <Card className="shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-60">
                    <img 
                      src="https://images.unsplash.com/photo-1551632811-561732d1e306" 
                      alt="Mindful Hiking Journey"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">Mindful Hiking Journey</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-gray-700">4.8</span>
                        <span className="text-gray-400 ml-1">(68)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Guided meditative hiking experience through Cabo's dramatic landscape with breathwork practices.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>3 hours</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Sierra de la Laguna</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">$75</span>
                        <span className="text-gray-500 ml-2">per person</span>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Testimonials Section */}
          <div className="bg-emerald-50 rounded-xl p-8 mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Client Testimonials</h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                  <div className="h-full bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        LJ
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">Lisa J.</h4>
                        <div className="flex text-yellow-500">
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      "The Weekend Wellness Retreat was transformative. The beachfront yoga, nourishing meals, and expert guidance helped me reconnect with myself in ways I didn't expect. I returned home feeling centered and rejuvenated."
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                  <div className="h-full bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        MR
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">Michael R.</h4>
                        <div className="flex text-yellow-500">
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      "The Ocean Purification Experience was unlike any spa treatment I've ever had. The combination of marine elements and expert therapists created the most relaxing experience of my life. The oceanfront setting made it magical."
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                  <div className="h-full bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        SK
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">Sarah K.</h4>
                        <div className="flex text-yellow-500">
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      "As someone who practices yoga regularly, the sunrise sessions on the beach were extraordinary. The instructors were world-class, and watching the sun rise over the Sea of Cortez while practicing was a spiritual experience."
                    </p>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="static transform-none mr-2" />
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          </div>

          {/* Benefits of Wellness */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Benefits of Our Wellness Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <Sparkles className="h-12 w-12 text-emerald-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Stress Reduction</h3>
                  <p className="text-gray-600">
                    Our carefully designed programs help reduce cortisol levels and activate your body's natural relaxation response.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <Heart className="h-12 w-12 text-red-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Mental Clarity</h3>
                  <p className="text-gray-600">
                    Meditation and mindfulness practices help clear mental fog and improve focus, creativity, and decision-making.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <Leaf className="h-12 w-12 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Physical Rejuvenation</h3>
                  <p className="text-gray-600">
                    Our holistic approach combines movement, nutrition, and bodywork to restore physical vitality and energy.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <ThumbsUp className="h-12 w-12 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Sustainable Practices</h3>
                  <p className="text-gray-600">
                    Learn techniques and routines you can incorporate into your daily life for lasting well-being long after your retreat.
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
                backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef')",
              }}
            >
              <div className="absolute inset-0 bg-emerald-800 bg-opacity-80"></div>
            </div>
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Begin Your Wellness Journey</h2>
              <p className="text-xl mb-8 text-white">
                Our wellness experts are ready to create a personalized experience that addresses your specific needs and goals.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-800 hover:bg-gray-100">
                  Schedule a Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View All Wellness Packages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}