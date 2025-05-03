import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  onPaymentSuccess: () => Promise<void>;
}

export default function CheckoutForm({ onPaymentSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    
    try {
      // For demo purposes, we'll just simulate a successful payment
      // In a production environment, this would actually confirm the payment with Stripe
      
      // Simulate delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the success handler from parent component
      await onPaymentSuccess();
      
      toast({
        title: "Payment Successful",
        description: "Thank you for your payment!",
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="text-sm font-medium">Card Information</div>
        <div className="border rounded-md p-3 bg-background/40">
          {/* In a real implementation, this would be a real Stripe CardElement */}
          <div className="h-10 flex items-center text-muted-foreground">
            **** **** **** 4242 (Demo Card)
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          This is a demonstration. In production, a real Stripe payment form would appear here.
        </p>
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-[#FF8C38] hover:bg-[#E67D29] text-white"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Complete Payment</>
        )}
      </Button>
      
      <div className="flex items-center justify-center space-x-2 mt-4">
        <div className="h-6 w-10 bg-muted rounded">
          <span className="sr-only">Visa</span>
        </div>
        <div className="h-6 w-10 bg-muted rounded">
          <span className="sr-only">Mastercard</span>
        </div>
        <div className="h-6 w-10 bg-muted rounded">
          <span className="sr-only">American Express</span>
        </div>
        <div className="h-6 w-10 bg-muted rounded">
          <span className="sr-only">Discover</span>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        Your payment information is processed securely. We do not store your credit card details.
      </p>
    </form>
  );
}