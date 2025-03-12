import { useRouter } from 'next/router';
import { Restaurant } from '@/types/restaurant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, DollarSign, Clock, Phone, Globe } from 'lucide-react';

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
    imageUrl: 'https://resizer.otstatic.com/v2/photos/legacy/2/47401755.jpg',
    bookingsToday: 16,
    description: 'Its all about the atmoshphere and service. They provide it all. The food was delicious, and presented beautifully.',
    openTableUrl: 'https://www.opentable.com/r/bagetelle-los-cabos-cabo-san-lucas',
    availableTimeslots: ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM']
  },
  // Add more mock data here
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back to Restaurants
          </Button>
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5" />
              <span>{restaurant.rating} ({restaurant.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5" />
              <span>{restaurant.priceRange}</span>
            </div>
          </div>
        </div>

        {restaurant.imageUrl && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{restaurant.description}</p>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Cuisine</h3>
                  <p className="text-muted-foreground">{restaurant.cuisine}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                {restaurant.bookingsToday && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Booked {restaurant.bookingsToday} times today
                  </p>
                )}
                {restaurant.availableTimeslots && restaurant.availableTimeslots.length > 0 ? (
                  <>
                    <p className="text-sm font-medium mb-2">Available times:</p>
                    <div className="grid grid-cols-2 gap-2">
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
                  <p className="text-sm text-muted-foreground">
                    No available times for today
                  </p>
                )}
                {restaurant.openTableUrl && (
                  <Button
                    className="w-full mt-4"
                    onClick={() => window.open(restaurant.openTableUrl, '_blank')}
                  >
                    Reserve on OpenTable
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 