import { useState } from "react";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Restaurant, RestaurantFilters } from "@/types/restaurant";
import Link from "next/link";

// Sample data - in production, this would come from your API
const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "El Farallon",
    cuisine: "Seafood",
    priceRange: "$$$",
    rating: 4.8,
    reviews: 245,
    images: ["https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3"],
    location: "Cabo San Lucas",
    address: "Camino del Mar 1, Cabo San Lucas, BCS 23455",
    description: "Cliffside seafood restaurant with stunning ocean views",
    features: ["Ocean View", "Fine Dining", "Romantic"],
    hours: {
      Monday: "5:00 PM - 11:00 PM",
      Tuesday: "5:00 PM - 11:00 PM",
      Wednesday: "5:00 PM - 11:00 PM",
      Thursday: "5:00 PM - 11:00 PM",
      Friday: "5:00 PM - 12:00 AM",
      Saturday: "5:00 PM - 12:00 AM",
      Sunday: "5:00 PM - 11:00 PM",
    },
    phone: "+52 624 123 4567",
    website: "https://elfarallon.com",
    menu: [],
  },
  {
    id: 2,
    name: "Nobu Los Cabos",
    cuisine: "Japanese",
    priceRange: "$$$$",
    rating: 4.9,
    reviews: 189,
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3"],
    location: "Tourist Corridor",
    address: "Polígono 1, Cabo San Lucas, BCS 23455",
    description: "World-class Japanese cuisine with Cabo flair",
    features: ["Fine Dining", "Sushi Bar", "Celebrity Chef"],
    hours: {
      Monday: "5:00 PM - 11:00 PM",
      Tuesday: "5:00 PM - 11:00 PM",
      Wednesday: "5:00 PM - 11:00 PM",
      Thursday: "5:00 PM - 11:00 PM",
      Friday: "5:00 PM - 12:00 AM",
      Saturday: "5:00 PM - 12:00 AM",
      Sunday: "5:00 PM - 11:00 PM",
    },
    phone: "+52 624 123 4567",
    website: "https://nobuhotels.com/los-cabos/dining",
    menu: [],
  },
  // Add more restaurants...
];

const cuisineTypes = [
  "All",
  "Seafood",
  "Mexican",
  "Japanese",
  "Italian",
  "Mediterranean",
  "Steakhouse",
];

const priceRanges = ["All", "$", "$$", "$$$", "$$$$"];

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({
    searchQuery: "",
    cuisine: "All",
    priceRange: "All",
  });

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (
      filters.searchQuery &&
      !restaurant.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !restaurant.cuisine.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filters.cuisine !== "All" && restaurant.cuisine !== filters.cuisine) {
      return false;
    }

    if (filters.priceRange !== "All" && restaurant.priceRange !== filters.priceRange) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#2F4F4F] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Restaurants in Cabo</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover the finest dining experiences in Cabo San Lucas, from local gems to world-class establishments.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search restaurants..."
                className="pl-10"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
          </div>
          <Select
            value={filters.cuisine}
            onValueChange={(value) => setFilters({ ...filters, cuisine: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((price) => (
                <SelectItem key={price} value={price}>
                  {price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-video relative">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {restaurant.location}
                      </div>
                    </div>
                    <Badge variant="secondary">{restaurant.priceRange}</Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-gray-500 ml-1">({restaurant.reviews})</span>
                    </div>
                    <div className="flex gap-2">
                      {restaurant.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 