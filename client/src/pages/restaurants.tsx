import { useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
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
import { useLocation } from "wouter";
import { restaurants, cuisineTypes, priceRanges } from "@/data/restaurants";

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [sortOption, setSortOption] = useState<RestaurantSortOptions>({
    field: 'bookingsToday',
    direction: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
      return false;
    }
    if (filters.priceRange && restaurant.priceRange !== filters.priceRange) {
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

  const locations = Array.from(new Set(restaurants.map(r => r.location)));

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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
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
                <SelectItem value="All">All Cuisines</SelectItem>
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
                <SelectItem value="All">All Locations</SelectItem>
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
            {sortedRestaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setLocation(`/restaurants/${restaurant.id}`)}
              >
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