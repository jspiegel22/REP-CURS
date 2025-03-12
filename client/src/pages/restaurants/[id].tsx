import { useState } from "react";
import { useRouter } from "next/router";
import { MapPin, Star, Clock, Phone, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Restaurant, TimeSlot, PartySize, ReservationDetails } from "@/types/restaurant";

// Sample data - in production, this would come from your API based on the ID
const restaurant: Restaurant = {
  id: 1,
  name: "El Farallon",
  cuisine: "Seafood",
  priceRange: "$$$",
  rating: 4.8,
  reviews: 245,
  images: [
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3",
  ],
  location: "Cabo San Lucas",
  address: "Camino del Mar 1, Cabo San Lucas, BCS 23455",
  description: "Cliffside seafood restaurant with stunning ocean views. Experience the finest seafood while watching the sunset over the Pacific Ocean.",
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
  menu: [
    {
      category: "Starters",
      items: [
        { name: "Fresh Oysters", price: 24, description: "Half dozen fresh local oysters" },
        { name: "Seafood Ceviche", price: 18, description: "Local catch with lime, cilantro" },
      ],
    },
    {
      category: "Main Courses",
      items: [
        { name: "Grilled Sea Bass", price: 42, description: "Fresh catch with herbs" },
        { name: "Lobster Thermidor", price: 65, description: "Local spiny lobster" },
      ],
    },
  ],
};

const timeSlots: TimeSlot[] = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

const partySizes: PartySize[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = router.query;
  const [reservationDetails, setReservationDetails] = useState<Partial<ReservationDetails>>({
    restaurantId: Number(id),
    date: "",
    time: "",
    partySize: 2,
  });

  const handleReservation = () => {
    // In production, this would make an API call to create the reservation
    console.log("Making reservation:", reservationDetails);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0 grid grid-cols-3 gap-2">
          {restaurant.images.map((image, index) => (
            <div
              key={index}
              className="relative h-full overflow-hidden"
              style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {restaurant.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{restaurant.cuisine}</Badge>
                      <Badge variant="secondary">{restaurant.priceRange}</Badge>
                      {restaurant.features.map((feature) => (
                        <Badge key={feature} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-gray-500 ml-1">({restaurant.reviews})</span>
                  </div>
                </div>
                <p className="text-gray-600">{restaurant.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="menu" className="mb-8">
              <TabsList>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="menu">
                <Card>
                  <CardContent className="p-6">
                    {restaurant.menu.map((section) => (
                      <div key={section.category} className="mb-8 last:mb-0">
                        <h3 className="text-xl font-semibold mb-4">{section.category}</h3>
                        <div className="space-y-4">
                          {section.items.map((item) => (
                            <div key={item.name} className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-gray-600">{item.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">${item.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="info">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold flex items-center mb-2">
                        <Clock className="w-4 h-4 mr-2" /> Hours
                      </h3>
                      {Object.entries(restaurant.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-gray-600">
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center mb-2">
                        <Phone className="w-4 h-4 mr-2" /> Contact
                      </h3>
                      <p className="text-gray-600">{restaurant.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center mb-2">
                        <Globe className="w-4 h-4 mr-2" /> Website
                      </h3>
                      <a href={restaurant.website} className="text-blue-600 hover:underline">
                        {restaurant.website}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={reservationDetails.date}
                      onChange={(e) =>
                        setReservationDetails({ ...reservationDetails, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <Select
                      value={reservationDetails.time}
                      onValueChange={(value) =>
                        setReservationDetails({ ...reservationDetails, time: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Party Size</label>
                    <Select
                      value={String(reservationDetails.partySize)}
                      onValueChange={(value) =>
                        setReservationDetails({
                          ...reservationDetails,
                          partySize: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select party size" />
                      </SelectTrigger>
                      <SelectContent>
                        {partySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} {parseInt(size) === 1 ? "person" : "people"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleReservation}>
                    Reserve Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 