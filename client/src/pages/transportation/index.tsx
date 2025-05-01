import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ChevronRight, Car, MapPin, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveCaboImage } from "@/components/ui/cabo-image";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

// Define pricing data
const transportationPricing = {
  "San Jose (downtown)": {
    "Van (6 pax)": { oneWay: 45 + 25, roundTrip: 85 + 40 },
    "Suburban (5 pax)": { oneWay: 55 + 25, roundTrip: 100 + 40 },
    "Large Van (10-14 pax)": { oneWay: 70 + 25, roundTrip: 130 + 40 }
  },
  "Palmilla": {
    "Van (6 pax)": { oneWay: 50 + 25, roundTrip: 95 + 40 },
    "Suburban (5 pax)": { oneWay: 60 + 25, roundTrip: 110 + 40 },
    "Large Van (10-14 pax)": { oneWay: 75 + 25, roundTrip: 140 + 40 }
  },
  "Tourist Corridor": {
    "Van (6 pax)": { oneWay: 65 + 25, roundTrip: 120 + 40 },
    "Suburban (5 pax)": { oneWay: 75 + 25, roundTrip: 135 + 40 },
    "Large Van (10-14 pax)": { oneWay: 90 + 25, roundTrip: 165 + 40 }
  },
  "Cabo San Lucas (main)": {
    "Van (6 pax)": { oneWay: 75 + 25, roundTrip: 140 + 40 },
    "Suburban (5 pax)": { oneWay: 85 + 25, roundTrip: 155 + 40 },
    "Large Van (10-14 pax)": { oneWay: 105 + 25, roundTrip: 190 + 40 }
  },
  "Pedregal": {
    "Van (6 pax)": { oneWay: 60 + 25, roundTrip: 115 + 40 },
    "Suburban (5 pax)": { oneWay: 70 + 25, roundTrip: 130 + 40 },
    "Large Van (10-14 pax)": { oneWay: 90 + 25, roundTrip: 165 + 40 }
  },
  "Tezal": {
    "Van (6 pax)": { oneWay: 80 + 25, roundTrip: 150 + 40 },
    "Suburban (5 pax)": { oneWay: 90 + 25, roundTrip: 165 + 40 },
    "Large Van (10-14 pax)": { oneWay: 110 + 25, roundTrip: 200 + 40 }
  },
  "Diamante": {
    "Van (6 pax)": { oneWay: 90 + 25, roundTrip: 170 + 40 },
    "Suburban (5 pax)": { oneWay: 100 + 25, roundTrip: 180 + 40 },
    "Large Van (10-14 pax)": { oneWay: 120 + 25, roundTrip: 220 + 40 }
  },
  "Todos Santos": {
    "Van (6 pax)": { oneWay: 110 + 25, roundTrip: 210 + 40 },
    "Suburban (5 pax)": { oneWay: 120 + 25, roundTrip: 230 + 40 },
    "Large Van (10-14 pax)": { oneWay: 150 + 25, roundTrip: 290 + 40 }
  }
};

// Form schema
const formSchema = z.object({
  tripType: z.enum(["oneWay", "roundTrip"], {
    required_error: "Please select a trip type",
  }),
  vehicleType: z.enum(["Van (6 pax)", "Suburban (5 pax)", "Large Van (10-14 pax)"], {
    required_error: "Please select a vehicle type",
  }),
  destination: z.string({
    required_error: "Please select a destination",
  }),
  pickupDate: z.string().min(1, "Please select a pickup date"),
  returnDate: z.string().optional(),
  numPassengers: z.string().min(1, "Please enter the number of passengers"),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function TransportationPage() {
  const { toast } = useToast();
  const [price, setPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: "oneWay",
      vehicleType: "Suburban (5 pax)",
      destination: "",
      pickupDate: "",
      returnDate: "",
      numPassengers: "",
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  // Watch form values to calculate price
  const watchTripType = form.watch("tripType");
  const watchVehicleType = form.watch("vehicleType");
  const watchDestination = form.watch("destination");

  // Calculate price whenever relevant fields change
  useEffect(() => {
    if (watchDestination && watchVehicleType && watchTripType) {
      const destinationData = transportationPricing[watchDestination as keyof typeof transportationPricing];
      if (destinationData) {
        const vehicleData = destinationData[watchVehicleType as keyof typeof destinationData];
        if (vehicleData) {
          setPrice(vehicleData[watchTripType as keyof typeof vehicleData]);
        }
      }
    } else {
      setPrice(null);
    }
  }, [watchTripType, watchVehicleType, watchDestination]);

  // Show/hide return date based on trip type
  useEffect(() => {
    if (watchTripType === "oneWay") {
      form.setValue("returnDate", "");
    }
  }, [watchTripType, form]);

  function onSubmit(data: FormData) {
    setIsSubmitting(true);
    
    console.log("Form submission:", data);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Booking Request Submitted",
        description: "We'll contact you shortly to confirm your transportation.",
      });
      setIsSubmitting(false);
      
      // Reset form
      form.reset({
        tripType: "oneWay",
        vehicleType: "Suburban (5 pax)",
        destination: "",
        pickupDate: "",
        returnDate: "",
        numPassengers: "",
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
      });
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[40vh] md:h-[50vh] relative">
          <ResponsiveCaboImage 
            src="https://images.unsplash.com/photo-1610647752706-3bb12202b035" 
            alt="Airport transportation in Cabo"
            category="luxury"
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Airport Transportation</h1>
              <p className="text-xl max-w-2xl mx-auto">
                Reliable and comfortable transfers between Los Cabos airports and your destination
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Transportation</CardTitle>
                <CardDescription>
                  Fill out the form below to book your airport transfer service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Trip Type Selection */}
                    <FormField
                      control={form.control}
                      name="tripType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Trip Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="oneWay" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  One Way
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="roundTrip" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Round Trip
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle Type Selection */}
                    <FormField
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vehicle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Suburban (5 pax)">Suburban SUV (up to 5 passengers)</SelectItem>
                                <SelectItem value="Van (6 pax)">Passenger Van (up to 6 passengers)</SelectItem>
                                <SelectItem value="Large Van (10-14 pax)">Large Van (10-14 passengers)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Destination Selection */}
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your destination" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="San Jose (downtown)">San Jose del Cabo (downtown)</SelectItem>
                                <SelectItem value="Palmilla">Palmilla</SelectItem>
                                <SelectItem value="Tourist Corridor">Tourist Corridor</SelectItem>
                                <SelectItem value="Cabo San Lucas (main)">Cabo San Lucas (main)</SelectItem>
                                <SelectItem value="Pedregal">Pedregal</SelectItem>
                                <SelectItem value="Tezal">Tezal</SelectItem>
                                <SelectItem value="Diamante">Diamante</SelectItem>
                                <SelectItem value="Todos Santos">Todos Santos</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pickup Date */}
                    <FormField
                      control={form.control}
                      name="pickupDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Date</FormLabel>
                          <FormControl>
                            <input
                              type="date"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Return Date (Only shown for Round Trip) */}
                    {watchTripType === "roundTrip" && (
                      <FormField
                        control={form.control}
                        name="returnDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Return Date</FormLabel>
                            <FormControl>
                              <input
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Number of Passengers */}
                    <FormField
                      control={form.control}
                      name="numPassengers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Passengers</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min="1"
                              max={watchVehicleType === "Large Van (10-14 pax)" ? "14" : watchVehicleType === "Van (6 pax)" ? "6" : "5"}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Enter number of passengers"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Details Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Contact Details</h3>
                      
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <input
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <input
                                type="tel"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Special Requests */}
                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter any special requests or requirements"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Price Display */}
                    {price && (
                      <div className="p-4 bg-[#2F4F4F]/5 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Total Price:</p>
                            <p className="text-sm text-muted-foreground">
                              {watchTripType === "oneWay" ? "One-way" : "Round-trip"} • {watchVehicleType}
                            </p>
                          </div>
                          <div className="text-2xl font-bold text-[#2F4F4F]">${price}</div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Book Transportation"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Info Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>About Our Transportation</CardTitle>
                <CardDescription>
                  Reliable airport transfers between SJD (Los Cabos International Airport) and your destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Car className="h-5 w-5 text-[#2F4F4F] mt-0.5" />
                    <div>
                      <h3 className="font-medium">Modern Vehicles</h3>
                      <p className="text-sm text-muted-foreground">
                        Our fleet includes air-conditioned suburban SUVs and passenger vans for your comfort.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#2F4F4F] mt-0.5" />
                    <div>
                      <h3 className="font-medium">Flexible Scheduling</h3>
                      <p className="text-sm text-muted-foreground">
                        We monitor flight arrivals and departures to ensure timely pickup and drop-off.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#2F4F4F] mt-0.5" />
                    <div>
                      <h3 className="font-medium">All Destinations</h3>
                      <p className="text-sm text-muted-foreground">
                        We service all areas in Los Cabos including San Jose del Cabo, Cabo San Lucas, and the Tourist Corridor.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-[#2F4F4F] mt-0.5" />
                    <div>
                      <h3 className="font-medium">What to Expect</h3>
                      <p className="text-sm text-muted-foreground">
                        Professional, English-speaking drivers will meet you with a name sign and assist with luggage.
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="font-medium mb-2">Why Book with @cabo?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2F4F4F] mt-0.5 flex-shrink-0" />
                        <span>No hidden fees - prices include taxes and gratuity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2F4F4F] mt-0.5 flex-shrink-0" />
                        <span>24/7 support and service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2F4F4F] mt-0.5 flex-shrink-0" />
                        <span>Free cancellation up to 48 hours before pickup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2F4F4F] mt-0.5 flex-shrink-0" />
                        <span>Complimentary bottled water</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="font-medium mb-2">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      For group transfers or special requirements, contact our concierge team.
                    </p>
                    <Link href="/group-trips/luxury-concierge">
                      <Button className="w-full bg-white text-[#2F4F4F] border border-[#2F4F4F] hover:bg-[#2F4F4F]/10">
                        Contact Concierge
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}