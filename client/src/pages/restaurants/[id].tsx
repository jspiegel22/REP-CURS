import { useRouter } from 'next/router';
import { Restaurant } from '@/types/restaurant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, DollarSign, Clock, Phone, Globe, Calendar, Users, ChefHat, UtensilsCrossed } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data - in production, this would come from your API
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bagatelle Los Cabos',
    rating: 'Awesome',
    reviewCount: 99,
    priceRange: 'Very Expensive',
    cuisine: 'International',
    location: 'Cabo San Lucas',
    address: 'Carretera Transpeninsular Km 7.5, 23454 Cabo San Lucas, B.C.S.',
    imageUrl: 'https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg',
    bookingsToday: 16,
    description: 'Its all about the atmosphere and service. They provide it all. The food was delicious, and presented beautifully.',
    openTableUrl: 'https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas',
    availableTimeslots: ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'],
    features: ['Ocean View', 'Outdoor Seating', 'Full Bar', 'Valet Parking'],
    menu: {
      starters: [
        { name: 'Tuna Tartare', price: 24, description: 'Fresh yellowfin tuna with avocado and citrus soy dressing' },
        { name: 'Lobster Tacos', price: 28, description: 'Local spiny lobster with mango salsa and chipotle aioli' }
      ],
      mains: [
        { name: 'Grilled Sea Bass', price: 42, description: 'Local sea bass with herb butter and seasonal vegetables' },
        { name: 'Wagyu Ribeye', price: 65, description: 'Prime grade wagyu beef with truffle mashed potatoes' }
      ],
      desserts: [
        { name: 'Chocolate Soufflé', price: 16, description: 'Warm chocolate soufflé with vanilla ice cream' },
        { name: 'Crème Brûlée', price: 14, description: 'Classic vanilla bean crème brûlée' }
      ]
    },
    hours: {
      Monday: '5:00 PM - 11:00 PM',
      Tuesday: '5:00 PM - 11:00 PM',
      Wednesday: '5:00 PM - 11:00 PM',
      Thursday: '5:00 PM - 11:00 PM',
      Friday: '5:00 PM - 12:00 AM',
      Saturday: '5:00 PM - 12:00 AM',
      Sunday: '5:00 PM - 11:00 PM'
    },
    phone: '+52 624 123 4567',
    website: 'https://bagatelle.com/venues/los-cabos'
  }
];

export default function RestaurantDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const restaurant = mockRestaurants.find(r => r.id === id);

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
              onClick={() => router.push('/restaurants')}
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
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="w-full justify-start mb-8">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu">
                <Card>
                  <CardHeader>
                    <CardTitle>Menu Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About {restaurant.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{restaurant.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {restaurant.features?.map((feature) => (
                            <Badge key={feature} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              </TabsContent>
            </Tabs>
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