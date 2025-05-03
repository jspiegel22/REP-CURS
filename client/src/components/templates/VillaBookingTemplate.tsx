import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Star, Check, Info, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// Import a sample checkout form
const CheckoutForm = ({ onPaymentSuccess }: { onPaymentSuccess: () => Promise<void> }) => {
  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground">
        This is a placeholder payment form. In a production environment, this would be an actual Stripe payment form.
      </p>
      <div className="border rounded-md p-4 bg-background">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Card number</label>
            <div className="border rounded h-10 px-3 mt-1 bg-background/50"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Expiration</label>
              <div className="border rounded h-10 px-3 mt-1 bg-background/50"></div>
            </div>
            <div>
              <label className="text-sm font-medium">CVC</label>
              <div className="border rounded h-10 px-3 mt-1 bg-background/50"></div>
            </div>
          </div>
        </div>
      </div>
      <Button 
        className="w-full bg-[#FF8C38] hover:bg-[#E67D29] text-white"
        onClick={() => onPaymentSuccess()}
      >
        Complete Payment
      </Button>
    </div>
  );
};
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Load Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Villa booking form schema with validation
const villaBookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Check-in date is required",
  }),
  endDate: z.date({
    required_error: "Check-out date is required",
  }).refine(date => date instanceof Date, {
    message: "Invalid date"
  }),
  guests: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Number of guests must be at least 1"
  }),
  villaId: z.number().or(z.string().transform(val => parseInt(val))),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  specialRequests: z.string().optional(),
  paymentOption: z.enum(["deposit", "full"], {
    required_error: "Please select a payment option",
  }),
});

type VillaBookingFormData = z.infer<typeof villaBookingFormSchema>;

interface VillaBookingTemplateProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrls: string[];
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  location: string;
  maximumGuests: number;
  features?: string[];
  amenities?: string[];
  villaId: string;
  reviews?: Array<{
    author: string;
    date: string;
    rating: number;
    content: string;
    helpful?: number;
  }>;
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
  amenities = [],
  villaId,
  reviews = [],
}: VillaBookingTemplateProps) {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'payment'>('form');

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  // Set initial date range (default to 5-day stay)
  const defaultEndDate = addDays(tomorrow, 4);

  const form = useForm<VillaBookingFormData>({
    resolver: zodResolver(villaBookingFormSchema),
    defaultValues: {
      startDate: tomorrow,
      endDate: defaultEndDate,
      guests: "2",
      villaId: parseInt(villaId),
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
      paymentOption: "deposit",
    },
  });

  // Watch form values for calculations
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const paymentOption = form.watch("paymentOption");

  // Calculate number of nights and prices
  const numberOfNights = differenceInDays(endDate, startDate);
  const basePrice = numberOfNights * pricePerNight;
  const serviceFee = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + serviceFee;
  const depositAmount = Math.min(500, totalPrice * 0.25);
  const paymentAmount = paymentOption === "deposit" ? depositAmount : totalPrice;

  const bookingMutation = useMutation({
    mutationFn: async (data: VillaBookingFormData) => {
      // First create payment intent
      const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
        amount: paymentAmount,
        description: `Booking for ${title} - ${format(data.startDate, "MMM d")} to ${format(data.endDate, "MMM d, yyyy")}`,
        metadata: {
          villaId,
          villaName: title,
          startDate: format(data.startDate, "yyyy-MM-dd"),
          endDate: format(data.endDate, "yyyy-MM-dd"),
          guests: data.guests,
          paymentType: data.paymentOption,
        }
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const paymentData = await paymentResponse.json();
      setClientSecret(paymentData.clientSecret);
      setStep('payment');
      
      // Return data to be submitted after payment is complete
      return data;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to process booking: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const submitBooking = async (data: VillaBookingFormData) => {
    bookingMutation.mutate(data);
  };

  // Handle payment completion
  const handlePaymentSuccess = async () => {
    try {
      // Create the actual booking
      const bookingData = form.getValues();
      
      const response = await apiRequest("POST", "/api/bookings", {
        villaId: bookingData.villaId,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        startDate: format(bookingData.startDate, "yyyy-MM-dd"),
        endDate: format(bookingData.endDate, "yyyy-MM-dd"),
        guests: parseInt(bookingData.guests),
        totalAmount: paymentAmount,
        specialRequests: bookingData.specialRequests,
        paymentMethod: "stripe",
        paymentStatus: bookingData.paymentOption === "deposit" ? "deposit_paid" : "paid",
      });

      if (!response.ok) {
        throw new Error("Failed to save booking");
      }

      // Reset form and show success
      form.reset();
      setStep('form');
      setClientSecret(null);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${title} has been confirmed. Check your email for details.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save booking: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column - Villa details */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground mb-4">{subtitle}</p>}

        {/* Location and ratings */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({reviewCount} reviews)</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span>{location}</span>
        </div>

        {/* Key features */}
        {features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">About this Villa</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}

        {/* Recent reviews section */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Guest Reviews</h3>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review, index) => (
                <Card key={index} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                        <span className="ml-1">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.content}</p>
                    {review.helpful !== undefined && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column - Booking form */}
      <div>
        <div className="bg-card rounded-xl border shadow p-5 sticky top-8">
          {step === 'form' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitBooking)} className="space-y-5">
                <div>
                  <h3 className="text-xl font-semibold mb-2">${pricePerNight.toFixed(0)} <span className="text-muted-foreground text-base font-normal">/ night</span></h3>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
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
                                variant={"outline"}
                                className={cn(
                                  "text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM d, yyyy")
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
                              disabled={(date) => date < today}
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
                                variant={"outline"}
                                className={cn(
                                  "text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM d, yyyy")
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
                              disabled={(date) => date <= startDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Guests */}
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Guests
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Maximum {maximumGuests} guests allowed
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={1}
                            max={maximumGuests}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              const guests = parseInt(value);
                              if (guests > maximumGuests) {
                                field.onChange(maximumGuests.toString());
                              } else if (guests < 1) {
                                field.onChange("1");
                              } else {
                                field.onChange(value);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Info */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium">Guest Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
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
                          <Input placeholder="+1 (555) 123-4567" {...field} />
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
                          placeholder="Any special requests for your stay? (Airport transfers, chef service, etc.)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Options */}
                <FormField
                  control={form.control}
                  name="paymentOption"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment Option</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="deposit" id="deposit" />
                            <Label htmlFor="deposit" className="flex-1">
                              <div>Pay $500 deposit now</div>
                              <p className="text-sm text-muted-foreground">
                                Secure your booking with a deposit
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="full" />
                            <Label htmlFor="full" className="flex-1">
                              <div>Pay in full (${totalPrice.toFixed(0)})</div>
                              <p className="text-sm text-muted-foreground">
                                Complete payment now
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>${pricePerNight.toFixed(0)} x {numberOfNights} nights</span>
                    <span>${basePrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(0)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-600">
                    <span>You pay now</span>
                    <span>${paymentOption === "deposit" ? depositAmount.toFixed(0) : totalPrice.toFixed(0)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FF8C38] hover:bg-[#E67D29] text-white"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Book Now - $${paymentOption === "deposit" ? depositAmount.toFixed(0) : totalPrice.toFixed(0)}`
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Complete your booking</h3>
              <div className="text-muted-foreground text-sm space-y-2">
                <p><strong>Villa:</strong> {title}</p>
                <p><strong>Dates:</strong> {format(startDate, "MMM d")} to {format(endDate, "MMM d, yyyy")}</p>
                <p><strong>Guests:</strong> {form.getValues("guests")}</p>
                <p><strong>Amount:</strong> ${paymentOption === "deposit" ? depositAmount.toFixed(0) : totalPrice.toFixed(0)}</p>
              </div>
              
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              )}
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setStep('form')}
              >
                Back to booking details
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}