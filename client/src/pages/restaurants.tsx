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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormProvider } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Helper function to get badge color based on cuisine type
const getCuisineBadgeColor = (cuisine: string) => {
  const colors: { [key: string]: string } = {
    'International': 'bg-blue-100 text-blue-800',
    'Contemporary Mexican': 'bg-green-100 text-green-800',
    'Mexican': 'bg-green-100 text-green-800',
    'Japanese': 'bg-red-100 text-red-800',
    'Seafood': 'bg-cyan-100 text-cyan-800',
    'Italian': 'bg-yellow-100 text-yellow-800',
    'Steakhouse': 'bg-orange-100 text-orange-800',
    'Fine Dining': 'bg-purple-100 text-purple-800',
  };
  return colors[cuisine] || 'bg-gray-100 text-gray-800';
};

// Helper function to format price range
const formatPriceRange = (range: string) => {
  switch (range) {
    case 'Very Expensive':
      return '$$$$';
    case 'Expensive':
      return '$$$';
    case 'Moderate':
      return '$$';
    default:
      return '$';
  }
};

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [sortOption, setSortOption] = useState<RestaurantSortOptions>({
    field: 'bookingsToday',
    direction: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const form = useForm({
    defaultValues: {
      date: '',
      time: '',
      partySize: '2',
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log('Reservation request:', data);
    // Here you would typically send this to your backend
    setSelectedRestaurant(null);
  };

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
            <h2 className="text-3xl font-bold">
              Restaurants in Los Cabos
            </h2>
            <div className="flex items-center gap-4">
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
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-200">
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
                    <div className="flex gap-2 items-center">
                      <span className="text-muted-foreground">
                        {formatPriceRange(restaurant.priceRange)}
                      </span>
                      <span className="mx-2">•</span>
                      <Badge className={`${getCuisineBadgeColor(restaurant.cuisine)}`}>
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRestaurant(restaurant);
                          }}
                        >
                          Request Table
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                          <DialogTitle>Request a Table at {restaurant.name}</DialogTitle>
                          <DialogDescription>
                            Fill out the form below to request a reservation. We'll get back to you shortly to confirm your booking.
                          </DialogDescription>
                        </DialogHeader>
                        <FormProvider {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="time"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferred Time</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="partySize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Party Size</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select party size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                                          <SelectItem key={num} value={num.toString()}>
                                            {num} {num === 1 ? 'person' : 'people'}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input type="tel" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="specialRequests"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Special Requests</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">Submit Request</Button>
                          </form>
                        </FormProvider>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}