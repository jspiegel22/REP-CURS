import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verify webhook signature
  const transmissionId = req.headers["paypal-transmission-id"];
  const timestamp = req.headers["paypal-transmission-time"];
  const webhookEvent = req.headers["paypal-transmission-sig"];
  const certUrl = req.headers["paypal-cert-url"];
  const authAlgo = req.headers["paypal-auth-algo"];

  try {
    const isVerified = await verifyWebhookSignature(
      transmissionId as string,
      timestamp as string,
      webhookEvent as string,
      certUrl as string,
      authAlgo as string,
      JSON.stringify(req.body)
    );

    if (!isVerified) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    // Handle the event
    const event = req.body;
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handleSuccessfulPayment(event.resource);
        break;

      case "PAYMENT.CAPTURE.DENIED":
        await handleFailedPayment(event.resource);
        break;

      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    const err = error as Error;
    console.error("Error processing webhook:", err.message);
    res.status(500).json({ message: "Webhook handler failed" });
  }
}

async function verifyWebhookSignature(
  transmissionId: string,
  timestamp: string,
  webhookEvent: string,
  certUrl: string,
  authAlgo: string,
  requestBody: string
): Promise<boolean> {
  // In production, implement proper webhook signature verification
  // This is a placeholder that always returns true
  // See PayPal documentation for proper implementation
  return true;
}

async function handleSuccessfulPayment(resource: any) {
  // Update your database
  // Send confirmation email
  // Update inventory
  // etc.
  console.log("Payment succeeded:", resource.id);
}

async function handleFailedPayment(resource: any) {
  // Update your database
  // Send failure notification
  // etc.
  console.log("Payment failed:", resource.id);
} 