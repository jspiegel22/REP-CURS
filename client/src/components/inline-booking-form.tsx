import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import StripePayment from './stripe-payment';
import { z } from 'zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

type InlineBookingFormProps = {
  adventureName: string;
  price: number;
  image?: string;
  provider?: string;
};

// Make sure to call loadStripe outside of a component's render
// to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const bookingFormSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  guests: z.number().min(1, { message: "Number of guests is required" }),
  special_requests: z.string().optional(),
  booking_type: z.literal('adventure'),
  adventure_name: z.string(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function InlineBookingForm({ adventureName, price, image, provider = "" }: InlineBookingFormProps) {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Get today and tomorrow dates in AZ timezone (UTC-7)
  const getArizonaDate = (offsetDays = 0) => {
    // Arizona is UTC-7 (doesn't observe DST)
    const today = new Date();
    // Set to Arizona time (UTC-7)
    const tzOffset = -7 * 60; // Arizona timezone offset in minutes
    const nowUtc = today.getTime() + (today.getTimezoneOffset() * 60000);
    const azTime = new Date(nowUtc + (tzOffset * 60000));
    
    // Add the offset days
    if (offsetDays > 0) {
      azTime.setDate(azTime.getDate() + offsetDays);
    }
    
    // Format as YYYY-MM-DD for input[type="date"]
    return azTime.toISOString().split('T')[0];
  };
  
  // Determine minimum booking date based on provider
  const minBookingDate = provider?.toLowerCase().includes("cabo adventures") 
    ? getArizonaDate(1) // Next day for Cabo Adventures 
    : getArizonaDate(0); // Same day for others
  
  // Set default date based on provider
  const defaultDate = provider?.toLowerCase().includes("cabo adventures")
    ? getArizonaDate(1) // Next day for Cabo Adventures
    : "";
  
  const [formData, setFormData] = useState<BookingFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date: defaultDate,
    guests: 1,
    special_requests: '',
    booking_type: 'adventure',
    adventure_name: adventureName
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'hidden' | 'details' | 'payment'>('hidden');

  const validateForm = () => {
    try {
      bookingFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const proceedToPayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Convert the price to cents for Stripe
      const amount = Math.round(price * 100);
      
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount,
        description: `Booking for ${adventureName}`,
        bookingData: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem setting up your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
  };

  const resetForm = () => {
    setStep('hidden');
    setClientSecret(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date: defaultDate, // Use the default date based on provider
      guests: 1,
      special_requests: '',
      booking_type: 'adventure',
      adventure_name: adventureName
    });
    setErrors({});
  };

  const toggleBookingForm = () => {
    if (step === 'hidden') {
      setStep('details');
    } else {
      resetForm();
    }
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#FF8C38',
    },
  };

  return (
    <div className="w-full">
      <Button 
        onClick={toggleBookingForm}
        className={`w-full bg-[#FF8C38] hover:bg-[#E67D29] text-white shadow-lg hover:shadow-xl transition-all ${step !== 'hidden' ? 'mb-4' : ''}`}
        size="lg"
      >
        {step === 'hidden' ? (
          <>Book Now <ChevronDown className="ml-1 h-4 w-4" /></>
        ) : (
          <>Close Booking Form <ChevronUp className="ml-1 h-4 w-4" /></>
        )}
      </Button>

      {step !== 'hidden' && (
        <div className="border rounded-lg p-4 shadow-md mb-6 bg-white transition-all">
          {step === 'details' ? (
            <div className="grid gap-4">
              <h3 className="text-xl font-semibold">Book Your Adventure</h3>
              <p className="text-gray-600 mb-2">Fill out your details to book your adventure</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-500">{errors.first_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={errors.last_name ? "border-red-500" : ""}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-500">{errors.last_name}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={minBookingDate}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  {provider?.toLowerCase().includes("cabo adventures") && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Cabo Adventures requires booking at least 1 day in advance
                    </p>
                  )}
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests <span className="text-red-500">*</span></Label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className={errors.guests ? "border-red-500" : ""}
                  />
                  {errors.guests && (
                    <p className="text-sm text-red-500">{errors.guests}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="special_requests">Special Requests</Label>
                <Textarea
                  id="special_requests"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or questions?"
                />
              </div>
              <div className="py-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-xl font-bold">${(price * formData.guests).toFixed(2)} USD</span>
                </div>
                <Button 
                  onClick={proceedToPayment} 
                  className="w-full bg-[#FF8C38] hover:bg-[#E67D29]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <div className="my-4">
                  <h3 className="text-xl font-semibold mb-4">Complete Your Payment</h3>
                  <div className="mb-4 text-sm">
                    <div className="flex justify-between mb-2">
                      <span>{adventureName}</span>
                      <span>${price.toFixed(2)} × {formData.guests}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(price * formData.guests).toFixed(2)} USD</span>
                    </div>
                  </div>
                  <StripePayment />
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('details')}
                      className="w-full"
                    >
                      Back to Details
                    </Button>
                  </div>
                </div>
              </Elements>
            )
          )}
        </div>
      )}
    </div>
  );
}