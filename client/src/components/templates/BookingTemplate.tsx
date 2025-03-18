import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Star, MapPin, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import NavigationBar from "@/components/navigation-bar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { SiTiktok, SiInstagram, SiWhatsapp, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";
import { Link } from "wouter";

// Schema for booking form
const bookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Check-in date is required",
  }),
  endDate: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.string().min(1, "Number of guests is required"),
  extras: z.array(z.string()).optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface PricingOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

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
  imageUrls: string[]; // Array of image URLs for gallery
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  location: string;
  maximumGuests: number;
  features: string[];
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
  features,
  extras = [],
  faqs = [],
  amenities,
  host,
  onBookingSubmit,
  reviews = [],
}: BookingTemplateProps) {
  const { toast } = useToast();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: "1",
      extras: [],
    },
  });

  // Add state for floating CTA
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Handle scroll for floating CTA
  useEffect(() => {
    const handleScroll = () => {
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        const rect = bookingForm.getBoundingClientRect();
        setShowFloatingCTA(rect.top > window.innerHeight || rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      if (onBookingSubmit) {
        await onBookingSubmit(data);
      } else {
        const res = await apiRequest("POST", "/api/bookings", data);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your reservation has been successfully processed.",
      });
      form.reset();
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
  const serviceFee = Math.round(basePrice * 0.12); // 12% service fee
  const totalPrice = basePrice + serviceFee;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavigationBar />

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
            <Button
              className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white sm:ml-auto"
              onClick={() => {
                const bookingForm = document.getElementById('booking-form');
                bookingForm?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Reserve Now
            </Button>
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
              {host && (
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

              <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-muted">
                      <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">About this property</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {description}
                </p>
              </div>

              <div className="pb-6 border-b">
                <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
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

            <div className="lg:sticky lg:top-8 h-fit">
              <div id="booking-form" className="bg-card rounded-xl border p-6 shadow-lg">
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
                    onSubmit={form.handleSubmit((data) => bookingMutation.mutate(data))}
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

        {/* Floating CTA for mobile */}
        {showFloatingCTA && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg lg:hidden z-50">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div>
                <span className="text-xl font-bold">${pricePerNight}</span>
                <span className="text-muted-foreground"> / night</span>
              </div>
              <Button
                onClick={() => {
                  const bookingForm = document.getElementById('booking-form');
                  bookingForm?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
              >
                Reserve Now
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-[#2F4F4F] text-white pt-16 pb-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">About Us</h3>
                <p className="text-gray-300">Your premier destination for luxury travel experiences in Cabo San Lucas.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/resorts">Resorts & Hotels</Link></li>
                  <li><Link href="/villas">Luxury Villas</Link></li>
                  <li><Link href="/adventures">Adventures</Link></li>
                  <li><Link href="/restaurants">Restaurants</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Travel Guides</h3>
                <ul className="space-y-2">
                  <li><Link href="/guides/bachelorette">Bachelorette</Link></li>
                  <li><Link href="/guides/weddings">Wedding Planning</Link></li>
                  <li><Link href="/guides/real-estate">Real Estate</Link></li>
                  <li><Link href="/guides/restaurants">Dining Guide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>Email: info@cabotravels.com</li>
                  <li>Phone: +1 (888) 123-4567</li>
                  <li>WhatsApp: +52 624 244 6303</li>
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
      </main>
    </div>
  );
}