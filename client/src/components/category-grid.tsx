import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

// Stays Section
const staysSection = {
  title: "Stays",
  description: "From luxury resorts to private villas, find the perfect accommodation for your Cabo getaway.",
  viewAllLink: "/villas",
  items: [
    {
      title: "Luxury Resorts",
      description: "World-class amenities with stunning ocean views",
      image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3", // Yacht/ocean view
      path: "/resorts",
    },
    {
      title: "Private Villas",
      description: "Exclusive retreats for families and groups",
      image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?ixlib=rb-4.0.3", // Arch of Cabo
      path: "/villas",
    }
  ]
};

// Activities Section
const activitiesSection = {
  title: "Activities",
  description: "Experience unforgettable adventures on land and sea with our curated activities.",
  viewAllLink: "/adventures",
  items: [
    {
      title: "Water Sports",
      description: "Snorkeling, surfing, and sailing adventures",
      image: "https://images.unsplash.com/photo-1564351943427-3d61951984e9?ixlib=rb-4.0.3",
      path: "/adventures/water-sports",
    },
    {
      title: "Land Adventures",
      description: "ATV tours, hiking, and desert expeditions",
      image: "https://images.unsplash.com/photo-1570482606740-a0b0c6b3e8b6?ixlib=rb-4.0.3",
      path: "/adventures/atv",
    }
  ]
};

// Dining Section
const diningSection = {
  title: "Dining",
  description: "Savor the flavors of Cabo with world-class restaurants and authentic local cuisine.",
  viewAllLink: "/restaurants",
  items: [
    {
      title: "Fine Dining",
      description: "Exquisite meals with spectacular views",
      image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3",
      path: "/restaurants",
    },
    {
      title: "Local Cuisine",
      description: "Authentic Mexican flavors and fresh seafood",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3",
      path: "/restaurants",
    }
  ]
};

// Events Section
const eventsSection = {
  title: "Events",
  description: "Plan your special occasions in paradise with our comprehensive event services.",
  viewAllLink: "/events",
  items: [
    {
      title: "Weddings",
      description: "Create unforgettable moments at stunning venues",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3",
      path: "/weddings",
    },
    {
      title: "Bachelor Parties",
      description: "Epic celebrations with custom itineraries",
      image: "https://images.unsplash.com/photo-1541956064527-8ec10ac76c31?ixlib=rb-4.0.3",
      path: "/group-trips/bachelor-bachelorette",
    }
  ]
};

export default function CategoryGrid() {
  const sections = [staysSection, activitiesSection, diningSection, eventsSection];

  return (
    <div className="space-y-16 py-8">
      {sections.map((section) => (
        <section key={section.title} className="bg-[#faf9f6] rounded-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
              <p className="text-gray-600 max-w-lg">{section.description}</p>
            </div>
            <Link href={section.viewAllLink} className="mt-4 md:mt-0 text-[#2F4F4F] font-medium flex items-center hover:underline">
              View All {section.title} <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.items.map((item) => (
              <Link key={item.title} href={item.path}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-48 md:h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col justify-center">
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}