import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input";
import { Star, MapPin, Search } from "lucide-react";
import { Villa, parseVillaData } from "@/types/villa";
import { Link } from "wouter";
import { generateSlug } from "@/lib/utils";
import { SiTripadvisor, SiExpedia } from "react-icons/si";

// Import complete CSV data
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16
https://www.cabovillas.com/properties.asp?PID=456,https://www.cabovillas.com/Properties/Villas/Villa_Lorena/FULL/Villa_Lorena-1.jpg?width=486,CABO SAN LUCAS,Villa Lorena,Comfortable Villa with Wonderful Pacific Ocean Views,4.5-Star Deluxe Villa,,4,3.5,10
https://www.cabovillas.com/properties.asp?PID=603,https://www.cabovillas.com/Properties/Villas/Villa_Esencia_Del_Mar/FULL/Villa_Esencia_Del_Mar-1.jpg?width=486,CABO SAN LUCAS,Villa Esencia Del Mar,Breathtaking Ocean Views & Modern Luxury,5.5-Star Luxury Villa,,4,3.5,10`;

const testimonials = [
  {
    name: "Sarah M.",
    title: "Family Vacation",
    content: "The villa exceeded all our expectations. Perfect for our family gathering with amazing views.",
    rating: 5
  },
  {
    name: "James R.",
    title: "Luxury Retreat",
    content: "Impeccable service and stunning accommodations. The private chef was exceptional.",
    rating: 5
  },
  {
    name: "Michelle K.",
    title: "Girls Getaway",
    content: "Perfect location and amenities for our group. The concierge service was outstanding.",
    rating: 5
  }
];

export default function VillasLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const villas = parseVillaData(villaData);

  const filteredVillas = villas.filter(villa =>
    villa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    villa.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">Luxury Villas in Cabo San Lucas</h1>
              <p className="text-xl">Experience the ultimate privacy and comfort in our handpicked selection of luxury villas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search villas by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVillas.map((villa) => (
            <Link
              key={villa.id}
              href={`/villa/${generateSlug(villa.name)}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full">
                <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                  <img
                    src={villa.imageUrl}
                    alt={villa.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{villa.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                      <span>{villa.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{villa.location}</span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {villa.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-[#F5F5DC] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-12">
            <SiTripadvisor className="w-12 h-12 text-[#2F4F4F]" />
            <SiExpedia className="w-12 h-12 text-[#2F4F4F]" />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Guest Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}