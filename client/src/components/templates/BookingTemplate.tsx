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
import { useEffect, useState } from "react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import { Link } from "wouter";


// Update booking form schema to match backend expectations
const bookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Check-in date is required",
  }),
  endDate: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.string().min(1, "Number of guests is required"),
  listingId: z.number().optional(),
  formData: z.any().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface Extra {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Review {
  author: string;
  rating: number;
  content: string;
  date: string;
  helpful: number;
}

interface BookingTemplateProps {
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
  extras?: Extra[];
  faqs?: Array<{ question: string; answer: string }>;
  amenities: string[];
  host?: {
    name: string;
    image: string;
    joinedDate: string;
  };
  onBookingSubmit?: (data: BookingFormData) => Promise<void>;
  reviews?: Review[];
  isResort: boolean;
  listingId?: number;
}

export default function BookingTemplate({
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
  extras = [],
  faqs = [],
  amenities,
  host,
  onBookingSubmit,
  reviews = [],
  isResort = false,
  listingId,
}: BookingTemplateProps) {
  const { toast } = useToast();
  const { user } = useAuth(); // Add auth context

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: "1",
      listingId: listingId, // Set listingId in default values
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

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      if (!user) {
        throw new Error("Please log in to make a booking");
      }

      if (onBookingSubmit) {
        await onBookingSubmit(data);
      } else {
        try {
          const response = await apiRequest("POST", "/api/bookings", data);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create booking");
          }
          return response.json();
        } catch (error) {
          console.error("Booking error:", error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your reservation has been successfully processed.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
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
      <main className="flex-1">
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

        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-4 gap-2 aspect-[16/9]">
            <div className="col-span-2 row-span-2 relative rounded-l-xl overflow-hidden">
              <img
                src={imageUrls[0]}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative rounded-tr-xl overflow-hidden">
              <img
                src={imageUrls[1]}
                alt={`${title} view 2`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative overflow-hidden">
              <img
                src={imageUrls[2]}
                alt={`${title} view 3`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative overflow-hidden">
              <img
                src={imageUrls[3]}
                alt={`${title} view 4`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative rounded-br-xl overflow-hidden">
              <img
                src={imageUrls[4]}
                alt={`${title} view 5`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="lg:hidden">
                <div id="booking-form-mobile" className="bg-card rounded-xl border p-6 shadow-lg mb-8">
                  <BookingFormContent
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

              {!isResort && host && (
                <div className="flex items-center justify-between pb-6 border-b">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Hosted by {host.name}
                    </h2>
                    <p className="text-muted-foreground">
                      Joined in {host.joinedDate}
                    </p>
                  </div>
                  <img
                    src={host.image}
                    alt={host.name}
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              )}

              {uniqueFeatures.length > 0 && (
                <div className="pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Special Features</h2>
                  <ul className="space-y-2">
                    {uniqueFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">About this property</h2>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {description}
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Experience the pinnacle of luxury at one of Cabo San Lucas's most prestigious resorts.
                    Our world-class amenities and unparalleled service ensure an unforgettable stay,
                    whether you're seeking a romantic getaway, family vacation, or special celebration.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Each room is thoughtfully designed to provide maximum comfort and stunning views,
                    complemented by modern conveniences and luxurious furnishings. Our attentive staff
                    is available 24/7 to ensure your every need is met with the highest level of service.
                  </p>
                </div>
              </div>

              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="text-[#2F4F4F]">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">Guest Reviews</h2>
                <div className="grid gap-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{review.author}</span>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rating ? "text-yellow-400" : "text-gray-200"
                                )}
                                fill={i < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.content}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful} found this helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-8 h-fit">
              <div id="booking-form" className="bg-card rounded-xl border p-6 shadow-lg">
                <BookingFormContent
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

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
                Reserve Now
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#2F4F4F] text-white pt-16 pb-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Column 1 - About Us & Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-300 mb-6">Your premier destination for luxury travel experiences in Cabo San Lucas.</p>
              
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Email: info@cabotravels.com</li>
                <li>Phone: +1 (888) 123-4567</li>
                <li>WhatsApp: +52 624 244 6303</li>
              </ul>
            </div>

            {/* Column 2 - Stays & Activities */}
            <div>
              <h3 className="text-xl font-bold mb-4">Stays</h3>
              <ul className="space-y-2 mb-6">
                <li><Link href="/villas">Luxury Villas</Link></li>
                <li><Link href="/resorts">Resorts & Hotels</Link></li>
                <li><Link href="/real-estate">Real Estate</Link></li>
              </ul>

              <h3 className="text-xl font-bold mb-4">Activities</h3>
              <ul className="space-y-2">
                <li><Link href="/adventures">Adventures</Link></li>
                <li><Link href="/adventures/luxury-sailing">Luxury Yachts</Link></li>
                <li><Link href="/restaurants">Restaurants</Link></li>
                <li><Link href="/events">Local Events</Link></li>
              </ul>
            </div>

            {/* Column 3 - Plan Your Trip & Partner With Us */}
            <div>
              <h3 className="text-xl font-bold mb-4">Plan Your Trip</h3>
              <ul className="space-y-2 mb-6">
                <li><Link href="/guides">Travel Guides</Link></li>
                <li><Link href="/guides/bachelorette">Bachelor/ette</Link></li>
                <li><Link href="/guides/weddings">Wedding Planning</Link></li>
                <li><Link href="/guides/real-estate">Real Estate</Link></li>
              </ul>

              <h3 className="text-xl font-bold mb-4">Partner With Us</h3>
              <ul className="space-y-2">
                <li><Link href="/work-with-us">Work with Us</Link></li>
                <li><Link href="/group-trips/influencer">For Influencers</Link></li>
                <li><Link href="/weddings">Wedding Planning</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="https://www.tiktok.com/@atcabo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiTiktok size={24} />
              </a>
              <a href="https://instagram.com/cabo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiInstagram size={24} />
              </a>
              <a href="https://www.youtube.com/@atCabo" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiYoutube size={24} />
              </a>
              <a href="https://wa.me/526242446303" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiWhatsapp size={24} />
              </a>
              <a href="https://www.facebook.com/cabosanlucasbaja" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiFacebook size={24} />
              </a>
              <a href="https://www.pinterest.com/instacabo/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F5F5DC] transition-colors">
                <SiPinterest size={24} />
              </a>
            </div>
            <p className="text-center text-sm text-gray-300">&copy; {new Date().getFullYear()} Cabo Travels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BookingFormContent({
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

          <Button
            type="submit"
            className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            size="lg"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reserve
          </Button>
        </form>
      </FormProvider>
    </>
  );
}