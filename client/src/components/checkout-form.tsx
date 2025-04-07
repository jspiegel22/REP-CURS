import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutForm({
  bookingDetails,
  onSuccess
}: {
  bookingDetails: any;
  onSuccess?: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve payment intent status from URL query params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          setPaymentStatus('success');
          onSuccess?.(paymentIntent.id);
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          setPaymentStatus('processing');
          break;
        case 'requires_payment_method':
          setMessage('Please provide a payment method.');
          setPaymentStatus('idle');
          break;
        default:
          setMessage('Something went wrong.');
          setPaymentStatus('error');
          break;
      }
    });
  }, [stripe, onSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer should be redirected after payment
        return_url: `${window.location.origin}/booking-confirmation`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Otherwise, customer is redirected to return_url.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An unexpected error occurred");
      } else {
        setMessage("An unexpected error occurred");
      }
      setPaymentStatus('error');
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <CardDescription>
          Secure payment for your Cabo adventure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="payment-form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <PaymentElement id="payment-element" />
          </div>
          <Button
            disabled={isLoading || !stripe || !elements || paymentStatus === 'success'}
            className="w-full"
            type="submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span>Pay Securely Now</span>
            )}
          </Button>
        </form>
        
        {message && (
          <div className="mt-4 p-3 rounded-md bg-background border">
            {paymentStatus === 'success' ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>{message}</span>
              </div>
            ) : paymentStatus === 'error' ? (
              <div className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{message}</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>{message}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Your payment is secure and processed by Stripe</p>
      </CardFooter>
    </Card>
  );
}