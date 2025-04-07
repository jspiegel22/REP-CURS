import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/checkout-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation, useRoute, Link } from 'wouter';
import { Loader2 } from 'lucide-react';

// Load stripe outside of component render to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function CheckoutPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/checkout/:listingId');
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [listing, setListing] = useState<any>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get booking details from local storage
  useEffect(() => {
    const storedBookingDetails = localStorage.getItem('bookingDetails');
    if (storedBookingDetails) {
      try {
        setBookingDetails(JSON.parse(storedBookingDetails));
      } catch (e) {
        console.error('Error parsing booking details:', e);
        setError('Error loading booking details. Please try again.');
      }
    } else {
      setError('No booking details found. Please start your booking again.');
    }
  }, []);

  // Fetch listing details
  useEffect(() => {
    if (!match || !params.listingId) return;

    const fetchListing = async () => {
      try {
        const response = await apiRequest('GET', `/api/listings/${params.listingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError('Error loading listing details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [match, params.listingId]);

  // Create payment intent when booking details and listing are available
  useEffect(() => {
    if (!bookingDetails || !listing) return;

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount: listing.price, // Use the listing price
          listingId: listing.id,
          bookingDetails: bookingDetails
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        setError(error.message || 'Error setting up payment. Please try again.');
        toast({
          title: 'Payment Setup Error',
          description: error.message || 'There was a problem setting up your payment',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [bookingDetails, listing, toast]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setIsLoading(true);
      
      // Call the complete-payment endpoint to record the booking
      const response = await apiRequest('POST', '/api/complete-payment', {
        paymentIntentId,
        bookingDetails
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete booking');
      }

      const bookingData = await response.json();
      
      // Clear booking details from local storage
      localStorage.removeItem('bookingDetails');
      
      // Set payment as completed
      setPaymentCompleted(true);
      
      // Show success toast
      toast({
        title: 'Payment Successful!',
        description: `Your booking is confirmed with reference: ${bookingData.confirmationCode}`,
      });
      
      // Redirect to confirmation page
      setTimeout(() => {
        setLocation('/booking-confirmation');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error completing booking:', error);
      toast({
        title: 'Booking Error',
        description: error.message || 'There was a problem recording your booking',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Review your trip details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !listing ? (
              <>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/3" />
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium">{listing.title}</h3>
                <p className="text-muted-foreground mb-4">{listing.location}</p>
                
                {listing.imageUrl && (
                  <img 
                    src={listing.imageUrl} 
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                
                <div className="space-y-3 text-sm">
                  {bookingDetails && (
                    <>
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">{bookingDetails.checkInDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">{bookingDetails.checkOutDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-medium">{bookingDetails.guestCount}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>${listing.price ? listing.price.toFixed(2) : "0.00"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Payment Form */}
        <div>
          {!clientSecret ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Setting up secure payment...</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: 'stripe' } }}
            >
              <CheckoutForm 
                bookingDetails={bookingDetails}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}