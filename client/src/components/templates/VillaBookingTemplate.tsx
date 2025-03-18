import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Star, MapPin, ThumbsUp, Waves, Palmtree, Dumbbell, Clock, Car, Wifi, Wind, GlassWater, Monitor, LockKeyhole, Mountain } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import { Link } from "wouter";

// Villa booking form schema with additional fields
const villaBookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Check-in date is required",
  }),
  endDate: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.string().min(1, "Number of guests is required"),
  villaId: z.number(),
  specialRequests: z.string().optional(),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  contactEmail: z.string().email("Valid email is required"),
});

type VillaBookingFormData = z.infer<typeof villaBookingFormSchema>;

// Reuse existing interface structure with villa-specific additions
interface VillaBookingTemplateProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrls: string[];
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  location: string;
  maximumGuests: number;
  features?: string[];
  amenities: string[];
  villaId: number;
  reviews?: Array<{
    author: string;
    rating: number;
    content: string;
    date: string;
    helpful: number;
  }>;
  host?: {
    name: string;
    image: string;
    joinedDate: string;
  };
}

export default function VillaBookingTemplate({
  title,
  subtitle,
  description,
  imageUrls,
  pricePerNight,
  rating,
  reviewCount,
  location,
  maximumGuests,
  features = [],
  amenities,
  villaId,
  reviews = [],
  host,
}: VillaBookingTemplateProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<VillaBookingFormData>({
    resolver: zodResolver(villaBookingFormSchema),
    defaultValues: {
      guests: "1",
      villaId,
      specialRequests: "",
    },
  });

  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mobileForm = document.getElementById('booking-form-mobile');
      const desktopForm = document.getElementById('booking-form');

      if (mobileForm || desktopForm) {
        const mobileRect = mobileForm?.getBoundingClientRect();
        const desktopRect = desktopForm?.getBoundingClientRect();

        const isMobileHidden = mobileRect ? 
          (mobileRect.bottom < 0 || mobileRect.top > window.innerHeight) : true;
        const isDesktopHidden = desktopRect ? 
          (desktopRect.bottom < 0 || desktopRect.top > window.innerHeight) : true;

        setShowFloatingCTA(window.innerWidth < 1024 ? isMobileHidden : isDesktopHidden);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Villa-specific booking mutation that integrates with Airtable
  const bookingMutation = useMutation({
    mutationFn: async (data: VillaBookingFormData) => {
      if (!user) {
        throw new Error("Please log in to make a booking");
      }

      try {
        const response = await apiRequest("POST", "/api/villa-bookings", data);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create booking");
        }
        return response.json();
      } catch (error) {
        console.error("Villa booking error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Sent",
        description: "The villa owner will contact you shortly to confirm your reservation.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/villa-bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const numberOfNights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const basePrice = numberOfNights * pricePerNight;
  const serviceFee = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + serviceFee;

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Private Beach Access": <Waves className="h-5 w-5" />,
      "Infinity Pool": <GlassWater className="h-5 w-5" />,
      "Full-Service Spa": <Palmtree className="h-5 w-5" />,
      "Fitness Center": <Dumbbell className="h-5 w-5" />,
      "24-Hour Room Service": <Clock className="h-5 w-5" />,
      "Valet Parking": <Car className="h-5 w-5" />,
      "High-Speed WiFi": <Wifi className="h-5 w-5" />,
      "Air Conditioning": <Wind className="h-5 w-5" />,
      "Mini Bar": <GlassWater className="h-5 w-5" />,
      "Flat-screen TV": <Monitor className="h-5 w-5" />,
      "In-room Safe": <LockKeyhole className="h-5 w-5" />,
      "Ocean View": <Mountain className="h-5 w-5" />,
    };
    return iconMap[amenity] || <Star className="h-5 w-5" />;
  };

  // Filter out features that overlap with amenities
  const uniqueFeatures = features.filter(
    feature => !amenities.some(amenity => 
      amenity.toLowerCase().includes(feature.toLowerCase()) ||
      feature.toLowerCase().includes(amenity.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Rest of the template remains similar to BookingTemplate, 
          but with villa-specific form fields added to BookingFormContent */}
      <main className="flex-1">
        {/* ... Header section ... */}
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
          <h1 className="text-3xl font-semibold mb-2">{title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* ... Image Gallery section ... */}
        {/* ... Main content area ... */}
        {/* ... Footer ... */}

        {/* Villa-specific Booking Form */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="lg:hidden">
                <div id="booking-form-mobile" className="bg-card rounded-xl border p-6 shadow-lg mb-8">
                  <VillaBookingFormContent
                    form={form}
                    pricePerNight={pricePerNight}
                    rating={rating}
                    numberOfNights={numberOfNights}
                    basePrice={basePrice}
                    serviceFee={serviceFee}
                    totalPrice={totalPrice}
                    maximumGuests={maximumGuests}
                    bookingMutation={bookingMutation}
                  />
                </div>
              </div>

              {/* ... Rest of content sections ... */}
            </div>

            <div className="hidden lg:block lg:sticky lg:top-8 h-fit">
              <div id="booking-form" className="bg-card rounded-xl border p-6 shadow-lg">
                <VillaBookingFormContent
                  form={form}
                  pricePerNight={pricePerNight}
                  rating={rating}
                  numberOfNights={numberOfNights}
                  basePrice={basePrice}
                  serviceFee={serviceFee}
                  totalPrice={totalPrice}
                  maximumGuests={maximumGuests}
                  bookingMutation={bookingMutation}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating CTA */}
        {showFloatingCTA && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg lg:hidden z-50">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div>
                <span className="text-xl font-bold">${pricePerNight}</span>
                <span className="text-muted-foreground"> / night</span>
              </div>
              <Button
                onClick={() => {
                  const bookingForm = document.getElementById('booking-form-mobile');
                  bookingForm?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
              >
                Check Availability
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* ... Footer section ... */}
    </div>
  );
}

// Villa-specific booking form content
function VillaBookingFormContent({
  form,
  pricePerNight,
  rating,
  numberOfNights,
  basePrice,
  serviceFee,
  totalPrice,
  maximumGuests,
  bookingMutation,
}: {
  form: any;
  pricePerNight: number;
  rating: number;
  numberOfNights: number;
  basePrice: number;
  serviceFee: number;
  totalPrice: number;
  maximumGuests: number;
  bookingMutation: any;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold">${pricePerNight}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data: any) => bookingMutation.mutate(data))}
          className="space-y-4"
        >
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-in</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MMM d, yyyy")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-out</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MMM d, yyyy")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Guest Count */}
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max={maximumGuests}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Information */}
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
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
                  <Textarea 
                    placeholder="Any special requirements or requests..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Breakdown */}
          {numberOfNights > 0 && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <span>
                  ${pricePerNight} × {numberOfNights} nights
                </span>
                <span>${basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            size="lg"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Check Availability
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
