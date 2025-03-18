import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
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

// Schema for booking form
const bookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Please select a check-in date",
  }),
  endDate: z.date({
    required_error: "Please select a check-out date",
  }),
  guests: z.string().min(1, "Please enter number of guests"),
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
  imageUrl: string;
  pricingOptions: PricingOption[];
  features?: string[];
  extras?: Extra[];
  faqs?: Array<{ question: string; answer: string }>;
  amenities?: string[];
  onBookingSubmit?: (data: BookingFormData) => Promise<void>;
}

export default function BookingTemplate({
  title,
  subtitle,
  description,
  imageUrl,
  pricingOptions,
  features = [],
  extras = [],
  faqs = [],
  amenities = [],
  onBookingSubmit,
}: BookingTemplateProps) {
  const { toast } = useToast();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: "",
      extras: [],
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      if (onBookingSubmit) {
        await onBookingSubmit(data);
      } else {
        // Default booking handler
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-xl md:text-2xl mb-6">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="prose max-w-none">
              <p className="text-lg">{description}</p>
            </div>

            {/* Pricing Options */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pricing Options</h2>
              <div className="grid gap-4">
                {pricingOptions.map((option) => (
                  <div
                    key={option.id}
                    className="bg-card p-6 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{option.name}</h3>
                      <p className="text-xl font-bold">${option.price}</p>
                    </div>
                    <p className="text-muted-foreground">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-6">Book Now</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => bookingMutation.mutate(data))}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                      <FormLabel>Check-out Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {extras.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Additional Options</h3>
                    {extras.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-start space-x-4 p-4 bg-background rounded-lg"
                      >
                        <FormField
                          control={form.control}
                          name="extras"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value?.includes(extra.id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const currentValue = field.value || [];
                                    field.onChange(
                                      checked
                                        ? [...currentValue, extra.id]
                                        : currentValue.filter((val) => val !== extra.id)
                                    );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  {extra.name} - ${extra.price}
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  {extra.description}
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirm Booking
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* FAQs Section */}
        {faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
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
