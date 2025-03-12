import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const locations = [
  "SJD Airport",
  "San Jose",
  "Palmilla",
  "Tourist Corridor",
  "Tezal",
  "Cabo San Lucas",
  "Pedregal",
  "Querencia",
  "Diamante",
  "Cabo Airport",
  "Todos Santos",
] as const;

export default function TransportationPage() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [pickup, setPickup] = useState<string>("");
  const [dropoff, setDropoff] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cabo Transportation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reliable and luxurious transportation services in Los Cabos. Book your ride now.
          </p>
        </div>

        {/* Booking Form */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Transportation</CardTitle>
              <CardDescription>
                Select your pickup and drop-off locations to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Type */}
              <div className="flex items-center space-x-4">
                <Switch
                  id="round-trip"
                  checked={isRoundTrip}
                  onCheckedChange={setIsRoundTrip}
                />
                <Label htmlFor="round-trip">Round Trip</Label>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <Select value={pickup} onValueChange={setPickup}>
                  <SelectTrigger id="pickup" className="w-full">
                    <SelectValue placeholder="Select pickup location" />
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

              {/* Dropoff Location */}
              <div className="space-y-2">
                <Label htmlFor="dropoff">Drop-off Location</Label>
                <Select value={dropoff} onValueChange={setDropoff}>
                  <SelectTrigger id="dropoff" className="w-full">
                    <SelectValue placeholder="Select drop-off location" />
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

              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Date</Label>
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

                {isRoundTrip && (
                  <div className="space-y-2">
                    <Label>Return Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Number of Passengers */}
              <div className="space-y-2">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger id="passengers" className="w-full">
                    <SelectValue placeholder="Select number of passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Section */}
              <div className="pt-6 border-t">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Options</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full">
                      <img
                        src="/stripe.svg"
                        alt="Stripe"
                        className="h-6"
                      />
                    </Button>
                    <Button variant="outline" className="w-full">
                      <img
                        src="/paypal.svg"
                        alt="PayPal"
                        className="h-6"
                      />
                    </Button>
                    <Button variant="outline" className="w-full">
                      <img
                        src="/apple-pay.svg"
                        alt="Apple Pay"
                        className="h-6"
                      />
                    </Button>
                  </div>
                  <Button className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Luxury Fleet</CardTitle>
              <CardDescription>
                Modern vehicles with professional drivers
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>24/7 Service</CardTitle>
              <CardDescription>
                Available any time, day or night
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fixed Pricing</CardTitle>
              <CardDescription>
                No hidden fees or surge pricing
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
} 