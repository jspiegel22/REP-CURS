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
import { 
  Loader2, 
  ChevronRight, 
  Car, 
  MapPin, 
  Calendar, 
  Info, 
  ChevronDown, 
  ArrowRight, 
  MessageSquare, 
  Check, 
  RefreshCw,
  Shield,
  Clock,
  DollarSign,
  Search,
  Star,
  Luggage,
  Users,
  Bus 
} from "lucide-react";
import { CaboImage, ResponsiveCaboImage } from "@/components/ui/cabo-image";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

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
        <div className="h-[40vh] md:h-[60vh] relative">
          <ResponsiveCaboImage 
            src="https://images.unsplash.com/photo-1610647752706-3bb12202b035" 
            alt="Airport transportation in Cabo"
            category="luxury"
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 text-white border-white px-4 py-1 text-sm">RELIABLE & COMFORTABLE</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Los Cabos Airport Transportation</h1>
              <p className="text-xl max-w-2xl mx-auto">
                Safe, on-time private transfers between Los Cabos International Airport and your accommodation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Flights Style Search Widget */}
      <div className="container mx-auto px-4 -mt-12 relative z-10 mb-16">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Google Flights Style Search Bar */}
                <div className="rounded-xl bg-white p-1">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {/* Trip Type Toggle */}
                    <FormField
                      control={form.control}
                      name="tripType"
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <div className="flex h-14 items-center justify-center bg-gray-50 rounded-lg px-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="oneWay" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    One Way
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="roundTrip" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    Round Trip
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Destination */}
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <div className="rounded-lg overflow-hidden">
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="h-14 border-0 bg-gray-50 rounded-lg focus:ring-0">
                                  <div className="flex flex-col items-start text-left">
                                    <span className="text-xs text-gray-500">Destination</span>
                                    <SelectValue placeholder="Where are you going?" className="text-sm" />
                                  </div>
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
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Dates */}
                    <div className="flex space-x-1">
                      <FormField
                        control={form.control}
                        name="pickupDate"
                        render={({ field }) => (
                          <FormItem className="flex-1 mb-0">
                            <div className="rounded-lg overflow-hidden">
                              <FormControl>
                                <div className="relative h-14 bg-gray-50 rounded-lg px-3 flex flex-col justify-center">
                                  <span className="text-xs text-gray-500">Pickup Date</span>
                                  <input
                                    type="date"
                                    className="bg-transparent border-0 p-0 outline-none text-sm"
                                    {...field}
                                  />
                                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchTripType === "roundTrip" && (
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem className="flex-1 mb-0">
                              <div className="rounded-lg overflow-hidden">
                                <FormControl>
                                  <div className="relative h-14 bg-gray-50 rounded-lg px-3 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500">Return Date</span>
                                    <input
                                      type="date"
                                      className="bg-transparent border-0 p-0 outline-none text-sm"
                                      {...field}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  </div>
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-center items-center">
                      <Button 
                        type="button" 
                        className="h-14 w-full bg-blue-900 hover:bg-blue-800 text-white"
                        onClick={() => {
                          if (watchDestination) {
                            window.scrollTo({
                              top: document.getElementById('vehicle-options')?.offsetTop - 100 || 0,
                              behavior: 'smooth'
                            });
                          } else {
                            form.setError('destination', { 
                              type: 'manual', 
                              message: 'Please select a destination' 
                            });
                          }
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Find Transfers
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Vehicle Cards - Only show when destination is selected */}
                {watchDestination && (
                  <div id="vehicle-options" className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Available Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Suburban Card */}
                      <div 
                        className={`relative rounded-xl border p-0 overflow-hidden transition-all ${
                          watchVehicleType === "Suburban (5 pax)" 
                            ? "ring-2 ring-blue-500 shadow-lg" 
                            : "hover:border-blue-200 cursor-pointer"
                        }`}
                        onClick={() => form.setValue("vehicleType", "Suburban (5 pax)")}
                      >
                        {watchVehicleType === "Suburban (5 pax)" && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-blue-500">Selected</Badge>
                          </div>
                        )}
                        <div className="h-32 relative">
                          <ResponsiveCaboImage
                            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf"
                            alt="Suburban SUV"
                            category="luxury"
                            objectFit="cover"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">Suburban SUV</h4>
                              <p className="text-sm text-gray-500">Up to 5 passengers</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                ${transportationPricing[watchDestination as keyof typeof transportationPricing]?.["Suburban (5 pax)"]?.[watchTripType as keyof typeof transportationPricing[typeof watchDestination][typeof watchVehicleType]]}
                              </p>
                              <p className="text-xs text-gray-500">{watchTripType === "oneWay" ? "One way" : "Round trip"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Car className="h-3 w-3 mr-1" /> Luxury SUV
                            </span>
                            <span className="flex items-center text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" /> 4 bags
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Passenger Van Card */}
                      <div 
                        className={`relative rounded-xl border p-0 overflow-hidden transition-all ${
                          watchVehicleType === "Van (6 pax)" 
                            ? "ring-2 ring-blue-500 shadow-lg" 
                            : "hover:border-blue-200 cursor-pointer"
                        }`}
                        onClick={() => form.setValue("vehicleType", "Van (6 pax)")}
                      >
                        {watchVehicleType === "Van (6 pax)" && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-blue-500">Selected</Badge>
                          </div>
                        )}
                        <div className="h-32 relative">
                          <ResponsiveCaboImage
                            src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b"
                            alt="Passenger Van"
                            category="luxury"
                            objectFit="cover"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">Passenger Van</h4>
                              <p className="text-sm text-gray-500">Up to 6 passengers</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                ${transportationPricing[watchDestination as keyof typeof transportationPricing]?.["Van (6 pax)"]?.[watchTripType as keyof typeof transportationPricing[typeof watchDestination][typeof watchVehicleType]]}
                              </p>
                              <p className="text-xs text-gray-500">{watchTripType === "oneWay" ? "One way" : "Round trip"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Car className="h-3 w-3 mr-1" /> Group
                            </span>
                            <span className="flex items-center text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" /> 6 bags
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Large Van Card */}
                      <div 
                        className={`relative rounded-xl border p-0 overflow-hidden transition-all ${
                          watchVehicleType === "Large Van (10-14 pax)" 
                            ? "ring-2 ring-blue-500 shadow-lg" 
                            : "hover:border-blue-200 cursor-pointer"
                        }`}
                        onClick={() => form.setValue("vehicleType", "Large Van (10-14 pax)")}
                      >
                        {watchVehicleType === "Large Van (10-14 pax)" && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-blue-500">Selected</Badge>
                          </div>
                        )}
                        <div className="h-32 relative">
                          <ResponsiveCaboImage
                            src="https://images.unsplash.com/photo-1464219222984-216ebffaaf85"
                            alt="Large Van"
                            category="luxury"
                            objectFit="cover"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">Large Van</h4>
                              <p className="text-sm text-gray-500">10-14 passengers</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                ${transportationPricing[watchDestination as keyof typeof transportationPricing]?.["Large Van (10-14 pax)"]?.[watchTripType as keyof typeof transportationPricing[typeof watchDestination][typeof watchVehicleType]]}
                              </p>
                              <p className="text-xs text-gray-500">{watchTripType === "oneWay" ? "One way" : "Round trip"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Car className="h-3 w-3 mr-1" /> Large group
                            </span>
                            <span className="flex items-center text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" /> 12+ bags
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    {watchVehicleType && watchDestination && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Complete Your Booking</h3>
                        
                        <Card>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Passenger Details */}
                              <div>
                                <h4 className="text-base font-medium mb-4">Passenger Details</h4>
                                
                                <div className="space-y-4">
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
                                            placeholder="Number of passengers"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
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
                                  
                                  <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                          <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter your phone number"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                              
                              {/* Trip Details & Special Requests */}
                              <div>
                                <h4 className="text-base font-medium mb-4">Trip Details</h4>
                                
                                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <p className="text-gray-500">Trip type</p>
                                      <p className="font-medium">{watchTripType === "oneWay" ? "One Way" : "Round Trip"}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Vehicle</p>
                                      <p className="font-medium">{watchVehicleType}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Destination</p>
                                      <p className="font-medium">{watchDestination}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Pickup date</p>
                                      <p className="font-medium">{form.watch("pickupDate") || "Not set"}</p>
                                    </div>
                                    {watchTripType === "roundTrip" && (
                                      <div>
                                        <p className="text-gray-500">Return date</p>
                                        <p className="font-medium">{form.watch("returnDate") || "Not set"}</p>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-gray-500">Price</p>
                                      <p className="font-bold text-blue-900">${price}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <FormField
                                  control={form.control}
                                  name="specialRequests"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Special Requests</FormLabel>
                                      <FormControl>
                                        <textarea
                                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          placeholder="Enter any special requests or flight details"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-blue-900 hover:bg-blue-800 text-white px-6"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    Complete Booking
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Transportation Service</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide reliable, comfortable, and safe transportation services in Los Cabos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Reliable</h3>
                <p className="text-gray-600">
                  All our drivers are professionally trained and our vehicles are regularly maintained for your safety.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">On-Time Service</h3>
                <p className="text-gray-600">
                  We track your flight and adjust pickup times accordingly, guaranteeing we'll be there when you arrive.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <DollarSign className="h-6 w-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
                <p className="text-gray-600">
                  Our pricing is transparent with no hidden charges. What you see is what you pay.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Fleet</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern, comfortable vehicles to meet all your transportation needs in Los Cabos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-md">
              <div className="h-64">
                <ResponsiveCaboImage
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf"
                  alt="Suburban SUV"
                  category="luxury"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">Suburban SUV</h3>
                <p className="text-gray-600">Luxury SUV with seating for up to 5 passengers plus luggage</p>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-md">
              <div className="h-64">
                <ResponsiveCaboImage
                  src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b"
                  alt="Passenger Van"
                  category="luxury"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">Passenger Van</h3>
                <p className="text-gray-600">Comfortable van with seating for up to 6 passengers plus luggage</p>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-md">
              <div className="h-64">
                <ResponsiveCaboImage
                  src="https://images.unsplash.com/photo-1464219222984-216ebffaaf85"
                  alt="Large Van"
                  category="luxury"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">Large Van</h3>
                <p className="text-gray-600">Spacious van for groups of 10-14 passengers plus luggage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Process */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Easy booking process from start to finish
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Book Online</h3>
            <p className="text-gray-600">
              Complete our simple booking form with your trip details and preferences.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Confirmation</h3>
            <p className="text-gray-600">
              Receive instant confirmation with all your booking details.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Meet & Greet</h3>
            <p className="text-gray-600">
              Your driver will meet you at the airport with a sign bearing your name.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
            <p className="text-gray-600">
              Relax and enjoy a comfortable ride to your destination.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our transportation services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  How do I locate my driver at the airport?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Our driver will be waiting for you in the arrival area with a sign displaying your name. For international arrivals at Los Cabos Airport, exit the terminal after customs and look for your driver in the designated pickup area.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  What happens if my flight is delayed?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Don't worry! We monitor all flight arrivals. If your flight is delayed, we will adjust your pickup time accordingly at no additional cost. Your driver will be waiting for you when you arrive.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Is the price per person or per vehicle?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Our prices are per vehicle, not per person. This means you pay one flat rate regardless of how many passengers are in your group (up to the maximum capacity of the vehicle).
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Do you provide car seats for children?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Yes, we can provide car seats for infants and children upon request. Please specify this in the "Special Requests" section when booking, and let us know the age and weight of the child.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-white rounded-lg border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  What is your cancellation policy?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  We offer free cancellation up to 24 hours before your scheduled pickup time. Cancellations made less than 24 hours before the scheduled service may be subject to a cancellation fee.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from travelers who have used our transportation services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Our driver was waiting for us when we arrived, despite our flight being delayed by 2 hours. The vehicle was clean and comfortable, and our driver was very knowledgeable about the area."
                </p>
                <div className="mt-auto">
                  <p className="font-semibold">Michael R.</p>
                  <p className="text-sm text-gray-500">San Diego, CA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Booking was easy and the service was excellent. We had a large group and the van was spacious with plenty of room for our luggage. Will definitely use this service again on our next trip to Cabo."
                </p>
                <div className="mt-auto">
                  <p className="font-semibold">Jennifer T.</p>
                  <p className="text-sm text-gray-500">Chicago, IL</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5" />
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Professional service from start to finish. Our driver gave us great recommendations for restaurants and activities in the area. The SUV was luxurious and made our arrival in Cabo stress-free."
                </p>
                <div className="mt-auto">
                  <p className="font-semibold">David L.</p>
                  <p className="text-sm text-gray-500">Seattle, WA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Transportation?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Secure your reliable airport transfer today and start your Cabo vacation without stress
          </p>
          <Button 
            className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            Book Transportation Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}