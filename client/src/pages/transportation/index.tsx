import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent
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
  Car, 
  MapPin, 
  Calendar, 
  Check, 
  Shield,
  Clock,
  DollarSign,
  Search,
  Luggage,
  Users,
  Bus,
  ArrowLeftRight
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Define pricing data
const transportationPricing = {
  "San Jose (downtown)": {
    "Van (6 pax)": { oneWay: 70, roundTrip: 125 },
    "Suburban (5 pax)": { oneWay: 80, roundTrip: 140 },
    "Large Van (10-14 pax)": { oneWay: 95, roundTrip: 170 }
  },
  "Palmilla": {
    "Van (6 pax)": { oneWay: 75, roundTrip: 135 },
    "Suburban (5 pax)": { oneWay: 85, roundTrip: 150 },
    "Large Van (10-14 pax)": { oneWay: 100, roundTrip: 180 }
  },
  "Tourist Corridor": {
    "Van (6 pax)": { oneWay: 90, roundTrip: 160 },
    "Suburban (5 pax)": { oneWay: 100, roundTrip: 175 },
    "Large Van (10-14 pax)": { oneWay: 115, roundTrip: 205 }
  },
  "Cabo San Lucas (main)": {
    "Van (6 pax)": { oneWay: 100, roundTrip: 180 },
    "Suburban (5 pax)": { oneWay: 110, roundTrip: 195 },
    "Large Van (10-14 pax)": { oneWay: 130, roundTrip: 230 }
  },
  "Pedregal": {
    "Van (6 pax)": { oneWay: 85, roundTrip: 155 },
    "Suburban (5 pax)": { oneWay: 95, roundTrip: 170 },
    "Large Van (10-14 pax)": { oneWay: 115, roundTrip: 205 }
  },
  "Tezal": {
    "Van (6 pax)": { oneWay: 105, roundTrip: 190 },
    "Suburban (5 pax)": { oneWay: 115, roundTrip: 205 },
    "Large Van (10-14 pax)": { oneWay: 135, roundTrip: 240 }
  },
  "Diamante": {
    "Van (6 pax)": { oneWay: 115, roundTrip: 210 },
    "Suburban (5 pax)": { oneWay: 125, roundTrip: 220 },
    "Large Van (10-14 pax)": { oneWay: 145, roundTrip: 260 }
  },
  "Todos Santos": {
    "Van (6 pax)": { oneWay: 135, roundTrip: 250 },
    "Suburban (5 pax)": { oneWay: 145, roundTrip: 270 },
    "Large Van (10-14 pax)": { oneWay: 175, roundTrip: 330 }
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
  name: z.string().min(2, "Please enter your name").optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phone: z.string().min(7, "Please enter a valid phone number").optional(),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function TransportationPage() {
  const { toast } = useToast();
  const [price, setPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: "oneWay",
      vehicleType: "Suburban (5 pax)",
      destination: "",
      pickupDate: new Date().toISOString().split('T')[0],
      returnDate: "",
      numPassengers: "2",
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
  const watchPassengers = form.watch("numPassengers");

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
    } else if (watchTripType === "roundTrip" && !form.getValues("returnDate")) {
      // Set return date to 7 days after pickup date by default
      const pickupDate = form.getValues("pickupDate");
      if (pickupDate) {
        const returnDate = new Date(pickupDate);
        returnDate.setDate(returnDate.getDate() + 7);
        form.setValue("returnDate", returnDate.toISOString().split('T')[0]);
      }
    }
  }, [watchTripType, form]);

  // Handle search button click
  const handleSearch = () => {
    const destination = form.getValues("destination");
    const pickupDate = form.getValues("pickupDate");
    
    if (!destination) {
      form.setError('destination', { 
        type: 'manual', 
        message: 'Please select a destination' 
      });
      return;
    }
    
    if (!pickupDate) {
      form.setError('pickupDate', { 
        type: 'manual', 
        message: 'Please select a pickup date' 
      });
      return;
    }
    
    if (watchTripType === "roundTrip" && !form.getValues("returnDate")) {
      form.setError('returnDate', { 
        type: 'manual', 
        message: 'Please select a return date' 
      });
      return;
    }
    
    setShowSearchResults(true);
    
    // Scroll to results
    setTimeout(() => {
      const element = document.getElementById('search-results');
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  function onSubmit(data: FormData) {
    if (!selectedVehicleType) {
      toast({
        title: "Please Select a Vehicle",
        description: "Please select a vehicle type to continue with your booking.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    console.log("Form submission:", {
      ...data,
      vehicleType: selectedVehicleType
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Booking Request Submitted",
        description: "We'll contact you shortly to confirm your transportation.",
      });
      setIsSubmitting(false);
      
      // Reset form and state
      setShowSearchResults(false);
      setSelectedVehicleType(null);
      form.reset({
        tripType: "oneWay",
        vehicleType: "Suburban (5 pax)",
        destination: "",
        pickupDate: new Date().toISOString().split('T')[0],
        returnDate: "",
        numPassengers: "2",
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
      });
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Cabo Transportation</h1>
            <div className="flex items-center space-x-4">
              <Link href="/explore" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Explore Cabo
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Container */}
      <div className="container max-w-6xl mx-auto px-4 pt-6 pb-16">
        <Card className="shadow-lg border border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                {/* Main Search Controls */}
                <div className="p-5 md:p-6">
                  {/* Trip Type Toggle */}
                  <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Trip Type */}
                      <FormField
                        control={form.control}
                        name="tripType"
                        render={({ field }) => (
                          <FormItem className="space-y-0 mb-0">
                            <div className="inline-flex items-center bg-gray-100 p-1 rounded-full">
                              <FormControl>
                                <div className="flex">
                                  <button
                                    type="button"
                                    onClick={() => field.onChange("oneWay")}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                                      field.value === "oneWay"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                    }`}
                                  >
                                    One-way
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => field.onChange("roundTrip")}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                                      field.value === "roundTrip"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                    }`}
                                  >
                                    Round-trip
                                  </button>
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Passenger Count */}
                      <FormField
                        control={form.control}
                        name="numPassengers"
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <Select
                              value={field.value || "2"}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="min-w-[130px] bg-white border-gray-200">
                                <SelectValue>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{field.value || "2"} passenger{parseInt(field.value || "2") !== 1 ? 's' : ''}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                                  <SelectItem key={num} value={num.toString()}>{num} passenger{num !== 1 ? 's' : ''}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Vehicle Type */}
                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="min-w-[180px] bg-white border-gray-200">
                                <SelectValue>
                                  <div className="flex items-center">
                                    <Car className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{field.value}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Van (6 pax)">Van (6 pax)</SelectItem>
                                <SelectItem value="Suburban (5 pax)">Suburban (5 pax)</SelectItem>
                                <SelectItem value="Large Van (10-14 pax)">Large Van (10-14 pax)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Origin and Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                    {/* From Location - Fixed to SJD */}
                    <div className="md:col-span-5 bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 font-medium">FROM</div>
                          <div className="font-medium">Cabo San Lucas Airport (SJD)</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Swap Icon */}
                    <div className="hidden md:flex md:col-span-2 items-center justify-center">
                      <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm hover:shadow cursor-pointer transition-all">
                        <ArrowLeftRight className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    
                    {/* Destination Dropdown */}
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem className="md:col-span-5 mb-0">
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                                <MapPin className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 font-medium">WHERE TO?</div>
                                <FormControl>
                                  <select 
                                    className="w-full border-0 p-0 bg-transparent text-gray-900 font-medium focus:ring-0"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
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
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Pickup Date */}
                    <FormField
                      control={form.control}
                      name="pickupDate"
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                                <Calendar className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 font-medium">DEPARTURE DATE</div>
                                <FormControl>
                                  <input 
                                    type="date"
                                    className="w-full border-0 p-0 text-gray-900 font-medium focus:ring-0 bg-transparent" 
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Return Date (conditional) */}
                    {watchTripType === "roundTrip" && (
                      <FormField
                        control={form.control}
                        name="returnDate"
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-gray-500 font-medium">RETURN DATE</div>
                                  <FormControl>
                                    <input 
                                      type="date"
                                      className="w-full border-0 p-0 text-gray-900 font-medium focus:ring-0 bg-transparent" 
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  {/* Search Button */}
                  <div className="flex justify-center">
                    <Button 
                      type="button"
                      className="px-10 py-3 h-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
                      onClick={handleSearch}
                    >
                      <Search className="h-5 w-5 mr-2" />
                      <span className="text-base">Search</span>
                    </Button>
                  </div>
                </div>
                
                {/* Search Results Section */}
                {showSearchResults && (
                  <div id="search-results" className="border-t border-gray-200 bg-gray-50 p-5 md:p-6">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Available Options</h2>
                      <p className="text-sm text-gray-600">
                        Select your preferred vehicle for your trip from SJD Airport to {watchDestination}
                        {watchTripType === "roundTrip" ? " (round-trip)" : " (one-way)"}
                      </p>
                    </div>
                    
                    {/* Vehicle Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Van Option */}
                      <div 
                        className={`bg-white border rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                          selectedVehicleType === "Van (6 pax)" ? "border-blue-500 shadow-md" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedVehicleType("Van (6 pax)")}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">Van</h3>
                              <p className="text-sm text-gray-600">Up to 6 passengers</p>
                            </div>
                            <div className={`rounded-full p-1 ${selectedVehicleType === "Van (6 pax)" ? "bg-blue-100" : "bg-gray-100"}`}>
                              <Bus className={`h-5 w-5 ${selectedVehicleType === "Van (6 pax)" ? "text-blue-600" : "text-gray-500"}`} />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-end">
                            <div>
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="text-xl font-bold text-gray-900">
                                ${getPrice(watchDestination, "Van (6 pax)", watchTripType === "oneWay" ? "oneWay" : "roundTrip") || "--"}
                              </p>
                            </div>
                            {selectedVehicleType === "Van (6 pax)" && (
                              <div className="rounded-full bg-blue-100 p-1">
                                <Check className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          
                          <ul className="mt-4 space-y-2">
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Spacious and comfortable
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Professional driver
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Luggage space
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Suburban Option */}
                      <div 
                        className={`bg-white border rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                          selectedVehicleType === "Suburban (5 pax)" ? "border-blue-500 shadow-md" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedVehicleType("Suburban (5 pax)")}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">Suburban</h3>
                              <p className="text-sm text-gray-600">Up to 5 passengers</p>
                            </div>
                            <div className={`rounded-full p-1 ${selectedVehicleType === "Suburban (5 pax)" ? "bg-blue-100" : "bg-gray-100"}`}>
                              <Car className={`h-5 w-5 ${selectedVehicleType === "Suburban (5 pax)" ? "text-blue-600" : "text-gray-500"}`} />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-end">
                            <div>
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="text-xl font-bold text-gray-900">
                                ${getPrice(watchDestination, "Suburban (5 pax)", watchTripType === "oneWay" ? "oneWay" : "roundTrip") || "--"}
                              </p>
                            </div>
                            {selectedVehicleType === "Suburban (5 pax)" && (
                              <div className="rounded-full bg-blue-100 p-1">
                                <Check className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          
                          <ul className="mt-4 space-y-2">
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Premium comfort
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Professional driver
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Luggage space
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Large Van Option */}
                      <div 
                        className={`bg-white border rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                          selectedVehicleType === "Large Van (10-14 pax)" ? "border-blue-500 shadow-md" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedVehicleType("Large Van (10-14 pax)")}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">Large Van</h3>
                              <p className="text-sm text-gray-600">Up to 14 passengers</p>
                            </div>
                            <div className={`rounded-full p-1 ${selectedVehicleType === "Large Van (10-14 pax)" ? "bg-blue-100" : "bg-gray-100"}`}>
                              <Bus className={`h-5 w-5 ${selectedVehicleType === "Large Van (10-14 pax)" ? "text-blue-600" : "text-gray-500"}`} />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-end">
                            <div>
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="text-xl font-bold text-gray-900">
                                ${getPrice(watchDestination, "Large Van (10-14 pax)", watchTripType === "oneWay" ? "oneWay" : "roundTrip") || "--"}
                              </p>
                            </div>
                            {selectedVehicleType === "Large Van (10-14 pax)" && (
                              <div className="rounded-full bg-blue-100 p-1">
                                <Check className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          
                          <ul className="mt-4 space-y-2">
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Extra spacious
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Professional driver
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Plenty of luggage space
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking Details Form */}
                    {selectedVehicleType && (
                      <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Your Booking</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Name Field */}
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <input 
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50" 
                                    placeholder="Enter your full name" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Email Field */}
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <input 
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50" 
                                    placeholder="your@email.com" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Phone Field */}
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <input 
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50" 
                                    placeholder="(+1) 555-123-4567" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Special Requests Field */}
                          <FormField
                            control={form.control}
                            name="specialRequests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Special Requests</FormLabel>
                                <FormControl>
                                  <input 
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50" 
                                    placeholder="Any special requirements?" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Booking Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trip type:</span>
                              <span className="font-medium">{watchTripType === "oneWay" ? "One-way" : "Round-trip"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">From:</span>
                              <span className="font-medium">Cabo San Lucas Airport (SJD)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">To:</span>
                              <span className="font-medium">{watchDestination}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">{form.getValues("pickupDate")}</span>
                            </div>
                            {watchTripType === "roundTrip" && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Return date:</span>
                                <span className="font-medium">{form.getValues("returnDate")}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Passengers:</span>
                              <span className="font-medium">{watchPassengers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vehicle:</span>
                              <span className="font-medium">{selectedVehicleType}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                              <span className="text-gray-900 font-medium">Total price:</span>
                              <span className="text-lg font-bold text-blue-600">
                                ${getPrice(watchDestination, selectedVehicleType, watchTripType === "oneWay" ? "oneWay" : "roundTrip") || "--"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="flex justify-center">
                          <Button 
                            type="submit" 
                            className="px-8 py-3 h-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                <span>Complete Booking</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Booking Terms & Info */}
                <div className="p-5 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Safe & Secure</h3>
                        <p className="text-sm text-gray-600">Licensed and insured transportation services</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">24/7 Service</h3>
                        <p className="text-sm text-gray-600">Available for early morning and late night flights</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">No Hidden Fees</h3>
                        <p className="text-sm text-gray-600">All prices include taxes and gratuities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}