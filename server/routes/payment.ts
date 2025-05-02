import { Request, Response } from "express";
import Stripe from "stripe";

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const { amount, fromLocation, toLocation, departureDate, returnDate, passengers, vehicleType } = req.body;

    if (!amount || !fromLocation || !toLocation || !departureDate || !passengers || !vehicleType) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      // Store metadata about the booking
      metadata: {
        fromLocation,
        toLocation,
        departureDate,
        returnDate: returnDate || "",
        passengers: passengers.toString(),
        vehicleType,
      },
    });

    // Send publishable key and PaymentIntent details to client
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ 
      error: "Failed to create payment intent",
      message: error.message 
    });
  }
}