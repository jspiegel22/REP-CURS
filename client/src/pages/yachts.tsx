import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// This would come from your database
const yachtAdventures = [
  {
    id: 1,
    title: "Luxury Sailing Experience",
    description: "Experience the ultimate luxury sailing adventure aboard our premium yacht. Perfect for romantic getaways or special occasions.",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166",
    price: 1200,
    duration: "4 hours",
    maxGuests: 8,
    features: ["Open bar", "Snorkeling gear", "Lunch included", "Professional crew"],
    category: "yacht"
  },
  {
    id: 2,
    title: "Private Yacht Charter",
    description: "Exclusive private yacht rental for your special occasion. Customize your experience with our professional crew.",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13",
    price: 2500,
    duration: "Full day",
    maxGuests: 12,
    features: ["Private chef", "Water sports", "Sunset viewing", "Luxury amenities"],
    category: "yacht"
  },
  {
    id: 3,
    title: "Sunset Sailing Cruise",
    description: "Romantic sunset sailing experience with breathtaking views of the Cabo coastline.",
    image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8",
    price: 800,
    duration: "3 hours",
    maxGuests: 6,
    features: ["Sunset viewing", "Wine tasting", "Appetizers", "Professional crew"],
    category: "yacht"
  }
];

export default function YachtsPage() {
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [priceRange, setPriceRange] = useState([0, 3000]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[60vh] rounded-lg overflow-hidden mb-12">
        <img
          src="https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
          alt="Luxury Yachts in Cabo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Luxury Yacht Experiences</h1>
            <p className="text-xl md:text-2xl">Discover exclusive yacht charters and sailing adventures in Cabo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guest Count */}
              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={3000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="half-day">Half Day (4 hours)</SelectItem>
                    <SelectItem value="full-day">Full Day (8 hours)</SelectItem>
                    <SelectItem value="sunset">Sunset Cruise (3 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yacht Listings */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {yachtAdventures.map((yacht) => (
              <Card key={yacht.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={yacht.image}
                    alt={yacht.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{yacht.title}</CardTitle>
                  <CardDescription>{yacht.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{yacht.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Guests:</span>
                      <span className="text-sm font-medium">{yacht.maxGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="text-sm font-medium">${yacht.price}</span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {yacht.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/adventures/${yacht.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 