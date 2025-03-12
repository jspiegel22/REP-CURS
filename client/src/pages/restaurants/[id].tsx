import { useParams } from 'wouter';
import { Restaurant } from '@/types/restaurant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, DollarSign, Clock, Phone, Globe, Calendar, Users, ChefHat } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { restaurants } from "@/data/restaurants";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Restaurant not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4 text-white hover:text-white/80"
            >
              ← Back to Restaurants
            </Button>
            <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>{restaurant.rating} ({restaurant.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <span>{restaurant.priceRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                <span>{restaurant.cuisine}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{restaurant.description}</p>
                <div className="space-y-4">
                  {restaurant.features && (
                    <div>
                      <h3 className="font-semibold mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.features.map((feature) => (
                          <Badge key={feature} variant="secondary">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {restaurant.menu && Object.entries(restaurant.menu).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold capitalize mb-4">{category}</h3>
                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <span className="font-medium">${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {restaurant.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Visit Website
                        </a>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Hours of Operation</h3>
                    <div className="space-y-2">
                      {restaurant.hours && Object.entries(restaurant.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-muted-foreground">
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Location</h3>
                    <p className="text-muted-foreground mb-4">{restaurant.address}</p>
                    <Button variant="outline" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservation Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Make a Reservation</CardTitle>
              </CardHeader>
              <CardContent>
                {restaurant.bookingsToday && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 inline-block mr-2" />
                    Booked {restaurant.bookingsToday} times today
                  </p>
                )}
                {restaurant.availableTimeslots && restaurant.availableTimeslots.length > 0 ? (
                  <>
                    <p className="text-sm font-medium mb-2">Available times today:</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {restaurant.availableTimeslots.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(restaurant.openTableUrl, '_blank')}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    No available times for today
                  </p>
                )}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(restaurant.openTableUrl, '_blank')}
                >
                  Reserve on OpenTable
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}