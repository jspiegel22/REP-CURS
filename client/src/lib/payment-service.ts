import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

export class PaymentService {
  static async initiateStripePayment(details: PaymentDetails) {
    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe failed to initialize");

    // Create a payment intent on your backend
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    const { clientSecret } = await response.json();

    // Confirm the payment with Stripe.js
    const result = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  }

  static async initiatePayPalPayment(details: PaymentDetails) {
    // Create a PayPal order on your backend
    const response = await fetch("/api/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    const order = await response.json();
    return order;
  }

  static async initiateApplePay(details: PaymentDetails) {
    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe failed to initialize");

    // Check if Apple Pay is available
    const canMakePayments = await stripe.applePay?.canMakePayments();
    if (!canMakePayments) {
      throw new Error("Apple Pay is not available");
    }

    // Create a payment request
    const paymentRequest = stripe.paymentRequest({
      country: "US",
      currency: details.currency.toLowerCase(),
      total: {
        label: details.description,
        amount: Math.round(details.amount * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Handle the payment
    paymentRequest.on("paymentmethod", async (event) => {
      const { paymentMethod, complete } = event;

      try {
        // Create a payment intent
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...details,
            payment_method_id: paymentMethod.id,
          }),
        });

        const { clientSecret } = await response.json();

        // Confirm the payment
        const { error } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          complete("fail");
          throw new Error(error.message);
        }

        complete("success");
        window.location.href = "/payment/success";
      } catch (error) {
        complete("fail");
        throw error;
      }
    });

    return paymentRequest;
  }
} 