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
  Bus,
  Circle,
  MoveHorizontal,
  User,
  Globe,
  ArrowLeftRight
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
import { Checkbox } from "@/components/ui/checkbox";
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

  // Helper function to get price
  const getPrice = (destination: string, vehicleType: string, tripType: string): number | null => {
    if (!destination || !vehicleType || !tripType) return null;
    
    try {
      // Type assertion to handle the indexing more safely
      type DestKey = keyof typeof transportationPricing;
      const dest = destination as DestKey;
      
      if (!transportationPricing[dest]) return null;
      
      const vehicleData = transportationPricing[dest][vehicleType as keyof typeof transportationPricing[DestKey]];
      if (!vehicleData) return null;
      
      return vehicleData[tripType as keyof typeof vehicleData];
    } catch (error) {
      console.error("Error calculating price:", error);
      return null;
    }
  };

  // Calculate price whenever relevant fields change
  useEffect(() => {
    setPrice(getPrice(watchDestination, watchVehicleType, watchTripType));
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
      {/* Main Google Flights Style Title */}
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-0">Flights</h1>
        </div>
      </div>

      {/* Google Flights Style Search Widget */}
      <div className="container mx-auto px-4 mb-16">
        <Card className="shadow-lg border border-gray-200 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                {/* Google Flights Style Search Bar - Exact Match from Screenshot */}
                <div className="p-4">
                  {/* Top row with trip type, passenger count, and cabin class */}
                  <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex flex-wrap items-center space-x-6">
                      {/* Trip Type Toggle Dropdown */}
                      <FormField
                        control={form.control}
                        name="tripType"
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <div className="relative">
                              <div className="flex items-center cursor-pointer">
                                <MoveHorizontal className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">{field.value === "oneWay" ? "One way" : "Round trip"}</span>
                                <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                              </div>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="hidden"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="oneWay" />
                                    </FormControl>
                                    <FormLabel>One way</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="roundTrip" />
                                    </FormControl>
                                    <FormLabel>Round trip</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* People Count - Just for visual match */}
                      <div className="cursor-pointer flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium">1</span>
                        <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                      </div>
                      
                      {/* Economy Class - Just for visual match */}
                      <div className="cursor-pointer flex items-center">
                        <span className="text-sm font-medium">Economy</span>
                        <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                      </div>
                    </div>
                    
                    {/* Add Hotels Checkbox - For exact visual match */}
                    <div className="flex items-center mt-2 sm:mt-0">
                      <Globe className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-700 mr-2">Also find me hotels</span>
                      <input type="checkbox" id="hotels" className="rounded border-gray-300" />
                    </div>
                  </div>
                  
                  {/* Main Search Controls - Styled like Google Flights */}
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    {/* From Location - Fixed to SJD */}
                    <div className="col-span-12 sm:col-span-5 border border-gray-200 rounded-full py-3 px-4 bg-white flex items-center">
                      <div className="mr-3 text-gray-500">
                        <Circle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">From</div>
                        <div className="font-medium text-sm">San José del Cabo</div>
                      </div>
                    </div>
                    
                    {/* Swap Icon - Just for visual match */}
                    <div className="hidden sm:flex col-span-0 sm:col-span-2 items-center justify-center">
                      <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm hover:shadow cursor-pointer">
                        <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Destination Dropdown */}
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem className="col-span-12 sm:col-span-5 mb-0">
                          <FormControl>
                            <div className="border border-gray-200 rounded-full py-3 px-4 bg-white">
                              <div className="flex items-center">
                                <div className="mr-3 text-gray-500">
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <div className="w-full">
                                  <div className="text-xs text-gray-500">Where to?</div>
                                  <select 
                                    className="w-full bg-transparent border-0 focus:ring-0 cursor-pointer p-0 text-sm font-medium"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    value={field.value || ""}
                                  >
                                    <option value="" disabled>Select destination</option>
                                    <option value="San Jose (downtown)">San Jose del Cabo (downtown)</option>
                                    <option value="Palmilla">Palmilla</option>
                                    <option value="Tourist Corridor">Tourist Corridor</option>
                                    <option value="Cabo San Lucas (main)">Cabo San Lucas (main)</option>
                                    <option value="Pedregal">Pedregal</option>
                                    <option value="Tezal">Tezal</option>
                                    <option value="Diamante">Diamante</option>
                                    <option value="Todos Santos">Todos Santos</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Date Fields Row */}
                  <div className="grid grid-cols-12 gap-4 mt-4">
                    {/* Date Fields (Combined) */}
                    <div className={`${watchTripType === "roundTrip" ? "col-span-12 sm:col-span-12" : "col-span-12 sm:col-span-6 sm:col-start-4"} border border-gray-200 rounded-full py-3 px-4 bg-white`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center flex-1">
                          <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                          <div>
                            <div className="text-xs text-gray-500">Departure</div>
                            <input 
                              type="text" 
                              placeholder="Add date" 
                              className="border-0 p-0 w-full text-sm font-medium focus:ring-0" 
                            />
                          </div>
                        </div>
                        {watchTripType === "roundTrip" && (
                          <>
                            <div className="border-r border-gray-200 h-8 mx-4"></div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-500">Return</div>
                              <input 
                                type="text" 
                                placeholder="Add date" 
                                className="border-0 p-0 w-full text-sm font-medium focus:ring-0" 
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Centered Search Button - Floating */}
                  <div className="flex justify-center relative mt-8 mb-4">
                    <Button 
                      type="button" 
                      className="px-8 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
                      onClick={() => {
                        if (watchDestination) {
                          const element = document.getElementById('vehicle-options');
                          if (element) {
                            window.scrollTo({
                              top: element.offsetTop - 100,
                              behavior: 'smooth'
                            });
                          }
                        } else {
                          form.setError('destination', { 
                            type: 'manual', 
                            message: 'Please select a destination' 
                          });
                        }
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                  </div>
                </div>

                {/* Google Flights Style Map + Results Display */}
                {watchDestination && (
                  <div id="vehicle-options" className="mt-8">
                    <div className="flex text-sm mb-4 border-b">
                      <div className="px-4 py-2 text-blue-600 font-medium border-b-2 border-blue-600">Best Vehicles</div>
                      <div className="px-4 py-2 text-gray-600">Price</div>
                      <div className="px-4 py-2 text-gray-600">Capacity</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                      {/* Map Section on Left */}
                      <div className="md:col-span-1 h-[300px] bg-blue-50 rounded-lg overflow-hidden relative">
                        {/* Simplified Map Visualization */}
                        <div className="h-full w-full bg-blue-50 relative">
                          {/* Map Image Background */}
                          <ResponsiveCaboImage
                            src="https://images.unsplash.com/photo-1585152968992-d2b9444408cc"
                            alt="Map of Los Cabos"
                            category="luxury"
                            objectFit="cover"
                            className="w-full h-full opacity-40"
                          />
                          
                          {/* Route Visualization */}
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="bg-white p-1 rounded-full z-10">
                              <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                            </div>
                            <div className="h-[2px] w-32 bg-blue-600"></div>
                            <div className="bg-white p-1 rounded-full z-10">
                              <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* Location Labels */}
                          <div className="absolute bottom-4 left-0 w-full flex justify-between px-6">
                            <div className="bg-white px-2 py-1 rounded text-xs shadow">
                              San José del Cabo
                            </div>
                            <div className="bg-white px-2 py-1 rounded text-xs shadow">
                              {watchDestination}
                            </div>
                          </div>
                        </div>
                        
                        {/* Distance Display */}
                        <div className="absolute bottom-0 left-0 w-full bg-white p-2 text-xs text-center border-t">
                          <span className="font-medium">Estimated Travel Time:</span> 20-45 minutes
                        </div>
                      </div>
                      
                      {/* Vehicle Cards on Right */}
                      <div className="md:col-span-2 space-y-2">
                        {/* Suburban Card - Google Flights Style */}
                        <div 
                          className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                            watchVehicleType === "Suburban (5 pax)" 
                              ? "border-blue-500 ring-1 ring-blue-500" 
                              : ""
                          }`}
                          onClick={() => form.setValue("vehicleType", "Suburban (5 pax)")}
                        >
                          <div className="p-4 cursor-pointer">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                <Car className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold">Suburban SUV</h4>
                                    <div className="flex text-xs text-gray-500 mt-1">
                                      <span className="flex items-center mr-3">
                                        <Users className="h-3 w-3 mr-1" /> Up to 5 passengers
                                      </span>
                                      <span className="flex items-center">
                                        <Luggage className="h-3 w-3 mr-1" /> 4 bags
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">
                                      ${getPrice(watchDestination, "Suburban (5 pax)", watchTripType) || '--'}
                                    </p>
                                    <p className="text-xs text-gray-500">{watchTripType === "oneWay" ? "One way" : "Round trip"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Passenger Van Card - Google Flights Style */}
                        <div 
                          className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                            watchVehicleType === "Van (6 pax)" 
                              ? "border-blue-500 ring-1 ring-blue-500" 
                              : ""
                          }`}
                          onClick={() => form.setValue("vehicleType", "Van (6 pax)")}
                        >
                          <div className="p-4 cursor-pointer">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                <Car className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold">Passenger Van</h4>
                                    <div className="flex text-xs text-gray-500 mt-1">
                                      <span className="flex items-center mr-3">
                                        <Users className="h-3 w-3 mr-1" /> Up to 6 passengers
                                      </span>
                                      <span className="flex items-center">
                                        <Luggage className="h-3 w-3 mr-1" /> 6 bags
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">
                                      ${getPrice(watchDestination, "Van (6 pax)", watchTripType) || '--'}
                                    </p>
                                    <p className="text-xs text-gray-500">{watchTripType === "oneWay" ? "One way" : "Round trip"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Large Van Card - Google Flights Style */}
                        <div 
                          className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                            watchVehicleType === "Large Van (10-14 pax)" 
                              ? "border-blue-500 ring-1 ring-blue-500" 
                              : ""
                          }`}
                          onClick={() => form.setValue("vehicleType", "Large Van (10-14 pax)")}
                        >
                          <div className="p-4 cursor-pointer">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                <Bus className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="flex items-center">
                                      <h4 className="font-semibold">Large Van</h4>
                                      <Badge variant="outline" className="ml-2 text-xs">Best for groups</Badge>
                                    </div>
                                    <div className="flex text-xs text-gray-500 mt-1">
                                      <span className="flex items-center mr-3">
                                        <Users className="h-3 w-3 mr-1" /> 10-14 passengers
                                      </span>
                                      <span className="flex items-center">
                                        <Luggage className="h-3 w-3 mr-1" /> 12+ bags
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">
                                      ${getPrice(watchDestination, "Large Van (10-14 pax)", watchTripType) || '--'}
                                    </p>
                                    <p className="text-xs text-gray-500">{watchTripType === "oneWay" ? "One way" : "Round trip"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
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

      {/* Google Flights Style Map - Match to reference image */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <h2 className="text-xl font-medium">Find cheap flights from San José del Cabo to anywhere</h2>
        </div>
        
        {/* Location Pills */}
        <div className="mb-4 flex space-x-2">
          <div className="bg-blue-100 text-blue-800 font-medium px-4 py-1 rounded-full text-sm">
            San José del Cabo
          </div>
          <div className="bg-gray-100 text-gray-800 font-medium px-4 py-1 rounded-full text-sm">
            La Paz
          </div>
        </div>
        
        {/* Map View - Exactly like Google Flights */}
        <div className="rounded-lg overflow-hidden h-[300px] w-full relative bg-blue-50">
          <ResponsiveCaboImage
            src="https://images.unsplash.com/photo-1585152968992-d2b9444408cc" 
            alt="Map of Los Cabos area"
            category="luxury"
            objectFit="cover"
            className="w-full h-full"
          />
          
          {/* Dots on map */}
          <div className="absolute top-[40%] left-[40%]">
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="absolute top-[30%] left-[50%]">
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="absolute top-[20%] right-[30%]">
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="absolute top-[25%] right-[40%]">
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          </div>
          
          {/* Explore Destinations Button */}
          <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <button className="bg-white py-2 px-6 rounded-full text-sm text-blue-600 font-medium shadow-md">
              Explore destinations
            </button>
          </div>
          
          {/* Google map data attribution */}
          <div className="absolute bottom-1 right-1 text-[10px] text-gray-700 bg-white/80 px-1">
            Map data ©2025 Google, INEGI
          </div>
        </div>
      </div>

      {/* Vehicle Comparison Section (Google Flights Style) */}
      <div className="container mx-auto px-4 py-8 border-t">
        <div className="mb-4">
          <h2 className="text-xl font-medium">Compare our vehicles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-blue-50">
              <h3 className="font-medium">Suburban SUV</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Car className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">Up to 5 passengers</span>
              </div>
              <div className="flex items-center mb-3">
                <Luggage className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">4 standard suitcases</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">Air-conditioned, leather seats</span>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500 block mb-1">Starting from</span>
                <span className="font-bold text-lg">$55 one way</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-blue-50">
              <h3 className="font-medium">Passenger Van</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">Up to 6 passengers</span>
              </div>
              <div className="flex items-center mb-3">
                <Luggage className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">6 standard suitcases</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">Perfect for small groups</span>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500 block mb-1">Starting from</span>
                <span className="font-bold text-lg">$45 one way</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-blue-50">
              <h3 className="font-medium">Large Van</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">10-14 passengers</span>
              </div>
              <div className="flex items-center mb-3">
                <Luggage className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">12+ suitcases</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm">Ideal for large groups & families</span>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500 block mb-1">Starting from</span>
                <span className="font-bold text-lg">$70 one way</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs (Google Flights Style) */}
      <div className="container mx-auto px-4 py-8 border-t">
        <h2 className="text-xl font-medium mb-4">Frequently asked questions</h2>
        
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">How do I locate my driver at the airport?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm">
                Our driver will be waiting for you in the arrival area with a sign displaying your name. For international arrivals at Los Cabos Airport, exit the terminal after customs and look for your driver in the designated pickup area.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">What happens if my flight is delayed?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm">
                Don't worry! We monitor all flight arrivals. If your flight is delayed, we will adjust your pickup time accordingly at no additional cost. Your driver will be waiting for you when you arrive.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">Is the price per person or per vehicle?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm">
                Our prices are per vehicle, not per person. This means you pay one flat rate regardless of how many passengers are in your group (up to the maximum capacity of the vehicle).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">Do you provide car seats for children?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm">
                Yes, we can provide car seats for infants and children upon request. Please specify this in the "Special Requests" section when booking, and let us know the age and weight of the child.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer - Simplified (Google Flights Style) */}
      <div className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2025 @Cabo. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}