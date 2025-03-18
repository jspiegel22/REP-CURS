import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
}: BookingTemplateProps) {
  const { toast } = useToast();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: "1",
      extras: [],
    },
  });

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

  // Calculate number of nights and total price
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const numberOfNights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const basePrice = numberOfNights * pricePerNight;
  const serviceFee = Math.round(basePrice * 0.12); // 12% service fee
  const totalPrice = basePrice + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
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

      {/* Main Content and Booking Form */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Information */}
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

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <Star className="h-5 w-5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4">About this property</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Amenities */}
            <div className="pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card rounded-xl border p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold">${pricePerNight}</span>
                  <span className="text-muted-foreground"> / night</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              </div>

              <Form {...form}>
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

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reserve
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
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
    </div>
  );
}