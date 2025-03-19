import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

interface PaymentOptions {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'apple_pay' | 'paypal';
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(options: PaymentOptions): Promise<PaymentIntent> {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
}

export async function processStripePayment(clientSecret: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  const { error } = await stripe.confirmCardPayment(clientSecret);
  if (error) throw error;
}

export async function processApplePay(amount: number, currency: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  const { error } = await stripe.confirmApplePayPayment({
    amount,
    currency,
    paymentMethodType: 'apple_pay',
  });
  if (error) throw error;
}

export async function processPayPalPayment(amount: number, currency: string) {
  const response = await fetch('/api/payments/paypal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency }),
  });

  if (!response.ok) {
    throw new Error('PayPal payment failed');
  }

  return response.json();
} 