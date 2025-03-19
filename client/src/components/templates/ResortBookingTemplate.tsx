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

// Resort inquiry form schema
const resortInquiryFormSchema = z.object({
  startDate: z.date({
    required_error: "Check-in date is required",
  }),
  endDate: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.string().min(1, "Number of guests is required"),
  resortId: z.number(),
  specialRequests: z.string().optional(),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  contactEmail: z.string().email("Valid email is required"),
});

type ResortInquiryFormData = z.infer<typeof resortInquiryFormSchema>;

interface ResortBookingTemplateProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrls: string[];
  priceLevel: string;
  rating: number;
  reviewCount: number;
  location: string;
  maximumGuests: number;
  features?: string[];
  amenities: string[];
  resortId: number;
  reviews?: Array<{
    author: string;
    rating: number;
    content: string;
    date: string;
    helpful: number;
  }>;
}

export default function ResortBookingTemplate({
  title,
  subtitle,
  description,
  imageUrls,
  priceLevel,
  rating,
  reviewCount,
  location,
  maximumGuests,
  features = [],
  amenities,
  resortId,
  reviews = [],
}: ResortBookingTemplateProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ResortInquiryFormData>({
    resolver: zodResolver(resortInquiryFormSchema),
    defaultValues: {
      guests: "1",
      resortId,
      specialRequests: "",
    },
  });

  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mobileForm = document.getElementById('inquiry-form-mobile');
      const desktopForm = document.getElementById('inquiry-form');

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

  const inquiryMutation = useMutation({
    mutationFn: async (data: ResortInquiryFormData) => {
      if (!user) {
        throw new Error("Please log in to make an inquiry");
      }

      try {
        const response = await apiRequest("POST", "/api/resort-inquiries", data);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit inquiry");
        }
        return response.json();
      } catch (error) {
        console.error("Resort inquiry error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Our team will contact you shortly to discuss your stay.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/resort-inquiries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Inquiry Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Header section */}
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

        {/* Image Gallery */}
        <div className="w-full aspect-video relative overflow-hidden mb-8">
          <img
            src={imageUrls[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main content area */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="lg:hidden">
                <div id="inquiry-form-mobile" className="bg-card rounded-xl border p-6 shadow-lg mb-8">
                  <ResortInquiryFormContent
                    form={form}
                    priceLevel={priceLevel}
                    rating={rating}
                    maximumGuests={maximumGuests}
                    inquiryMutation={inquiryMutation}
                  />
                </div>
              </div>

              {/* About this Resort Section */}
              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">About this Resort</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-semibold mb-2">Resort Highlights</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Perfect for families and groups</li>
                        <li>{maximumGuests} guest maximum capacity per room</li>
                        <li>Multiple room types available</li>
                        <li>Full resort amenities</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Location Benefits</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Prime location in {location}</li>
                        <li>Close to local attractions</li>
                        <li>Easy access to beaches</li>
                        <li>Nearby restaurants and shopping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              {features.length > 0 && (
                <div className="pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Special Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities Section */}
              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">What this resort offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">Guest Reviews</h2>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="mb-2">{review.content}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-8 h-fit">
              <div id="inquiry-form" className="bg-card rounded-xl border p-6 shadow-lg">
                <ResortInquiryFormContent
                  form={form}
                  priceLevel={priceLevel}
                  rating={rating}
                  maximumGuests={maximumGuests}
                  inquiryMutation={inquiryMutation}
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
                <span className="text-xl font-bold">{priceLevel}</span>
                <span className="text-muted-foreground"> / night</span>
              </div>
              <Button
                onClick={() => {
                  const inquiryForm = document.getElementById('inquiry-form-mobile');
                  inquiryForm?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
              >
                Check Availability
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ResortInquiryFormContent({
  form,
  priceLevel,
  rating,
  maximumGuests,
  inquiryMutation,
}: {
  form: any;
  priceLevel: string;
  rating: number;
  maximumGuests: number;
  inquiryMutation: any;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold">{priceLevel}</span>
          <span className="text-muted-foreground"> avg/night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data: any) => inquiryMutation.mutate(data))}
          className="space-y-4"
        >
          {/* Email */}
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

          {/* Guest Count and Phone */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guests</FormLabel>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Input
                        type="number"
                        min="1"
                        max={maximumGuests}
                        className="border-0 p-0 focus-visible:ring-0"
                        {...field}
                      />
                    </Button>
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
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="border-0 p-0 focus-visible:ring-0"
                        {...field}
                      />
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            size="lg"
            disabled={inquiryMutation.isPending}
          >
            {inquiryMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request Information
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
