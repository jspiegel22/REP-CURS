import { useState } from "react";
import { Search, MapPin, Star, CalendarIcon, Loader2 } from "lucide-react";
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
import { useLocation, useRouter } from "wouter";
import { priceRanges } from "@/data/restaurants";
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
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import SEO, { generateRestaurantSchema } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";

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

type ReservationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  partySize: string;
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
  const router = useRouter();

  // Fetch restaurants from the API
  const { 
    data: restaurants = [], 
    isLoading, 
    isError 
  } = useQuery<Restaurant[]>({ 
    queryKey: ['/api/restaurants'],
    staleTime: 60 * 1000, // 1 minute
  });

  // Extract cuisine types from loaded restaurants
  const cuisineTypes = Array.from(
    new Set(restaurants.map(r => r.cuisine))
  ).sort();

  const form = useForm<ReservationFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      time: '',
      partySize: '2',
    }
  });

  const onSubmit = (data: ReservationFormData) => {
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

  // Generate schema for all restaurants
  const restaurantsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: restaurants.map((restaurant, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateRestaurantSchema(restaurant)
    }))
  };

  return (
    <>
      <SEO
        title="Best Restaurants in Cabo San Lucas | Fine Dining & Local Cuisine"
        description="Discover the finest restaurants in Cabo San Lucas. From oceanfront dining to authentic Mexican cuisine, find the perfect spot for your next meal. Book your table today!"
        canonicalUrl="https://cabo-adventures.com/restaurants"
        schema={restaurantsSchema}
        openGraph={{
          title: "Best Restaurants in Cabo San Lucas | Fine Dining & Local Cuisine",
          description: "Discover the finest restaurants in Cabo San Lucas. From oceanfront dining to authentic Mexican cuisine, find the perfect spot for your next meal.",
          image: "https://cabo-adventures.com/restaurants-og.jpg",
          url: "https://cabo-adventures.com/restaurants"
        }}
      />
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

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading restaurants...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
                <p className="text-red-700">There was an error loading restaurants. Please try again later.</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && sortedRestaurants.length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-md border-gray-300">
                <p className="text-lg text-muted-foreground">No restaurants found for the selected filters.</p>
                <Button className="mt-4" onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                }}>Reset Filters</Button>
              </div>
            )}

            {/* Restaurant Grid */}
            {!isLoading && !isError && sortedRestaurants.length > 0 && (
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
                      {restaurant.bookingsToday && restaurant.bookingsToday > 20 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Popular: {restaurant.bookingsToday} bookings today
                        </div>
                      )}
                    </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
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
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="firstName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>First Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="lastName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Last Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
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
                                name="date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full pl-3 text-left font-normal",
                                              !field.value && "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}