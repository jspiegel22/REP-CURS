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
import { Restaurant, RestaurantFilters, RestaurantSortOptions } from "@/types/restaurant";
import Link from "next/link";
import { useRouter } from "next/router";

// Mock data based on OpenTable CSV
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bagatelle Los Cabos',
    rating: 'Awesome',
    reviewCount: 99,
    priceRange: 'Very Expensive',
    cuisine: 'International',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg',
    bookingsToday: 16,
    description: 'Its all about the atmosphere and service. They provide it all. The food was delicious, and presented beautifully.',
    openTableUrl: 'https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas',
    availableTimeslots: ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM']
  },
  {
    id: '2',
    name: 'El Farallon',
    rating: 'Exceptional',
    reviewCount: 245,
    priceRange: 'Very Expensive',
    cuisine: 'Seafood',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/1/47401803.jpg',
    bookingsToday: 24,
    description: 'Carved into the cliffs of The Resort at Pedregal, El Farallon offers an unparalleled dining experience with the best views in Cabo.',
    openTableUrl: 'https://www.opentable.com/r/el-farallon-cabo-san-lucas',
    availableTimeslots: ['5:30 PM', '6:00 PM', '8:00 PM', '8:30 PM']
  },
  {
    id: '3',
    name: 'Nobu Los Cabos',
    rating: 'Exceptional',
    reviewCount: 178,
    priceRange: 'Very Expensive',
    cuisine: 'Japanese',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/3/47401844.jpg',
    bookingsToday: 19,
    description: 'World-renowned Japanese cuisine meets breathtaking Pacific Ocean views at Nobu Los Cabos. Experience Chef Nobu Matsuhisa\'s signature dishes.',
    openTableUrl: 'https://www.opentable.com/r/nobu-los-cabos',
    availableTimeslots: ['6:00 PM', '7:00 PM', '7:30 PM', '9:00 PM']
  },
  {
    id: '4',
    name: 'Don Manuel\'s',
    rating: 'Exceptional',
    reviewCount: 156,
    priceRange: 'Expensive',
    cuisine: 'Mexican',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/2/47401890.jpg',
    bookingsToday: 12,
    description: 'Farm-to-table Mexican cuisine in an elegant setting at the Waldorf Astoria Los Cabos Pedregal. Ocean views and exceptional service.',
    openTableUrl: 'https://www.opentable.com/r/don-manuels-cabo-san-lucas',
    availableTimeslots: ['5:30 PM', '6:00 PM', '7:00 PM', '8:30 PM']
  },
  {
    id: '5',
    name: 'Sunset MonaLisa',
    rating: 'Exceptional',
    reviewCount: 312,
    priceRange: 'Expensive',
    cuisine: 'Mediterranean',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/1/47401922.jpg',
    bookingsToday: 28,
    description: 'Spectacular views of the Arch and Sea of Cortez complement the Mediterranean cuisine. Perfect for romantic dinners and special occasions.',
    openTableUrl: 'https://www.opentable.com/r/sunset-monalisa-cabo-san-lucas',
    availableTimeslots: ['5:00 PM', '5:30 PM', '6:00 PM', '7:30 PM']
  },
  {
    id: '6',
    name: 'Salvatore\'s Restaurant',
    rating: 'Awesome',
    reviewCount: 89,
    priceRange: 'Expensive',
    cuisine: 'Italian',
    location: 'San José del Cabo',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/2/47401966.jpg',
    bookingsToday: 8,
    description: 'Authentic Italian cuisine in the heart of San José del Cabo. Hand-made pasta and wood-fired pizzas in a romantic setting.',
    openTableUrl: 'https://www.opentable.com/r/salvatores-san-jose-del-cabo',
    availableTimeslots: ['6:00 PM', '6:30 PM', '7:00 PM', '8:00 PM']
  },
  {
    id: '7',
    name: 'Nicksan',
    rating: 'Exceptional',
    reviewCount: 167,
    priceRange: 'Very Expensive',
    cuisine: 'Japanese',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/3/47402001.jpg',
    bookingsToday: 15,
    description: 'Japanese cuisine with Mexican influences. Known for their innovative sushi rolls and fresh seafood dishes.',
    openTableUrl: 'https://www.opentable.com/r/nicksan-cabo-san-lucas',
    availableTimeslots: ['5:30 PM', '6:30 PM', '7:30 PM', '8:30 PM']
  },
  {
    id: '8',
    name: 'La Casona',
    rating: 'Exceptional',
    reviewCount: 134,
    priceRange: 'Expensive',
    cuisine: 'Steakhouse',
    location: 'San José del Cabo',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/1/47402045.jpg',
    bookingsToday: 11,
    description: 'Fine dining steakhouse featuring premium cuts and an extensive wine cellar. Elegant atmosphere with attentive service.',
    openTableUrl: 'https://www.opentable.com/r/la-casona-san-jose-del-cabo',
    availableTimeslots: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
  },
  {
    id: '9',
    name: 'Cocina del Mar',
    rating: 'Exceptional',
    reviewCount: 287,
    priceRange: 'Very Expensive',
    cuisine: 'Seafood',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/3/47402089.jpg',
    bookingsToday: 32,
    description: 'Perched on the cliffs of Esperanza Resort, offering fresh seafood and spectacular whale watching during season. Romantic oceanfront dining.',
    openTableUrl: 'https://www.opentable.com/r/cocina-del-mar-cabo-san-lucas',
    availableTimeslots: ['5:00 PM', '6:30 PM', '7:00 PM', '8:30 PM']
  },
  {
    id: '10',
    name: 'Agua by Larbi',
    rating: 'Exceptional',
    reviewCount: 198,
    priceRange: 'Very Expensive',
    cuisine: 'Mediterranean',
    location: 'San José del Cabo',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/2/47402112.jpg',
    bookingsToday: 21,
    description: 'Farm-to-table Mediterranean cuisine with Mexican influences. Stunning ocean views and fresh local ingredients create an unforgettable dining experience.',
    openTableUrl: 'https://www.opentable.com/r/agua-by-larbi-san-jose-del-cabo',
    availableTimeslots: ['5:30 PM', '6:00 PM', '7:30 PM', '8:00 PM']
  },
  {
    id: '11',
    name: 'Cielomar Rooftop',
    rating: 'Exceptional',
    reviewCount: 145,
    priceRange: 'Expensive',
    cuisine: 'International',
    location: 'San José del Cabo',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/1/47402156.jpg',
    bookingsToday: 18,
    description: 'Stunning rooftop venue offering panoramic views of the Sea of Cortez. International cuisine with a focus on fresh local ingredients.',
    openTableUrl: 'https://www.opentable.com/r/cielomar-rooftop-san-jose-del-cabo',
    availableTimeslots: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
  },
  {
    id: '12',
    name: 'Mi Casa',
    rating: 'Awesome',
    reviewCount: 276,
    priceRange: 'Moderate',
    cuisine: 'Mexican',
    location: 'Cabo San Lucas',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/xlarge/3/47402198.jpg',
    bookingsToday: 45,
    description: 'Authentic Mexican cuisine in a vibrant, colorful setting. Live mariachi music and traditional recipes passed down through generations.',
    openTableUrl: 'https://www.opentable.com/r/mi-casa-cabo-san-lucas',
    availableTimeslots: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
  }
];

const cuisineTypes = [
  "All",
  "International",
  "Seafood",
  "Japanese",
  "Mexican",
  "Mediterranean",
  "Italian",
  "Steakhouse"
];

const priceRanges = ["All", "Moderate", "Expensive", "Very Expensive"];
const locations = ["All", "Cabo San Lucas", "San José del Cabo"];

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [sortOption, setSortOption] = useState<RestaurantSortOptions>({
    field: 'bookingsToday',
    direction: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
      return false;
    }
    if (filters.priceRange && restaurant.priceRange !== filters.priceRange) {
      return false;
    }
    if (filters.rating && restaurant.rating !== filters.rating) {
      return false;
    }
    if (filters.location && restaurant.location !== filters.location) {
      return false;
    }
    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    const aValue = a[sortOption.field] ?? 0;
    const bValue = b[sortOption.field] ?? 0;
    if (sortOption.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const filteredAndSortedRestaurants = sortedRestaurants.map((restaurant) => ({
    ...restaurant,
    availableTimeslots: restaurant.availableTimeslots || []
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#2F4F4F] text-white py-16 cursor-pointer" onClick={() => router.push('/restaurants')}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Restaurants in Cabo</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover the finest dining experiences in Cabo San Lucas, from local gems to world-class establishments.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 
              className="text-3xl font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => router.push('/restaurants')}
            >
              Restaurants in Los Cabos
            </h1>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select
                value={`${sortOption.field}-${sortOption.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setSortOption({ field: field as any, direction: direction as 'asc' | 'desc' });
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookingsToday-desc">Most Popular</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="reviewCount-desc">Most Reviewed</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search restaurants..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select
              value={filters.cuisine}
              onValueChange={(value) => setFilters({ ...filters, cuisine: value === "All" ? undefined : value })}
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
              value={filters.location}
              onValueChange={(value) => setFilters({ ...filters, location: value === "All" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => router.push(`/restaurants/${restaurant.id}`)}>
                <div className="relative h-48">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(restaurant.bookingsToday ?? 0) > 20 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular: {restaurant.bookingsToday} bookings today
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {restaurant.location}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-muted-foreground ml-1">({restaurant.reviewCount})</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {restaurant.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-muted-foreground">{restaurant.priceRange}</span>
                      <span className="mx-2">•</span>
                      <span className="text-muted-foreground">{restaurant.cuisine}</span>
                    </div>
                    {restaurant.availableTimeslots && restaurant.availableTimeslots.length > 0 && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(restaurant.openTableUrl, '_blank');
                        }}
                      >
                        Reserve Now
                      </Button>
                    )}
                  </div>
                  {restaurant.availableTimeslots && restaurant.availableTimeslots.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {restaurant.availableTimeslots.slice(0, 4).map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(restaurant.openTableUrl, '_blank');
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 