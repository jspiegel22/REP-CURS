import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Share2, Calendar, MapPin, Users } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export default function BookingConfirmationPage() {
  const [, setLocation] = useLocation();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  
  // Extract payment intent ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentParam = urlParams.get('payment_intent');
    
    if (paymentIntentParam) {
      // Fetch payment details
      const fetchPaymentDetails = async () => {
        try {
          const response = await apiRequest('GET', `/api/payment/${paymentIntentParam}`);
          if (response.ok) {
            const data = await response.json();
            setPaymentIntent(data);
          }
        } catch (error) {
          console.error('Error fetching payment details:', error);
        }
      };
      
      fetchPaymentDetails();
    }
    
    // Get booking details from local storage
    const storedBookingDetails = localStorage.getItem('bookingDetails');
    if (storedBookingDetails) {
      try {
        setBookingDetails(JSON.parse(storedBookingDetails));
        // Clear booking details from storage
        localStorage.removeItem('bookingDetails');
      } catch (e) {
        console.error('Error parsing booking details:', e);
      }
    }
  }, []);
  
  const handleShare = async () => {
    const shareData = {
      title: 'My Cabo Trip',
      text: `I just booked my trip to Cabo San Lucas! Can't wait to enjoy the sun and beach.`,
      url: window.location.origin
    };
    
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support sharing
      try {
        await navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Your Cabo adventure is officially booked
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Please save this information for your records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentIntent?.status === 'succeeded' && (
              <div className="flex items-center justify-center bg-green-50 p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-700">Payment Successful</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Confirmation Number</div>
                <div className="font-medium text-lg">
                  {bookingDetails?.confirmationCode || 'CABO-123456'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Paid</div>
                <div className="font-medium text-lg">
                  ${paymentIntent?.amount ? (paymentIntent.amount).toFixed(2) : '---'}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-medium">Reservation Details</h3>
              
              {bookingDetails ? (
                <>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Dates</div>
                      <div className="text-sm text-muted-foreground">
                        {bookingDetails.checkInDate} to {bookingDetails.checkOutDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {bookingDetails.location || 'Cabo San Lucas, Mexico'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Guests</div>
                      <div className="text-sm text-muted-foreground">
                        {bookingDetails.guestCount} {bookingDetails.guestCount === 1 ? 'guest' : 'guests'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground italic">
                  Booking details not available. Please check your email for confirmation.
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
          
          <Button onClick={handleShare} className="flex gap-2">
            <Share2 className="h-4 w-4" />
            Share Your Trip
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center space-y-4">
        <h2 className="text-xl font-medium">Need Help With Your Trip?</h2>
        <p className="text-muted-foreground">
          Our travel concierge is available to assist with any questions or special requests.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <a href="tel:+15551234567">Call Concierge</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:concierge@cabo.is">Email Support</a>
          </Button>
        </div>
      </div>
    </div>
  );
}