import { useEffect } from "react";
import { useRouter } from "next/router";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // You can handle any post-payment success logic here
    // For example, clear cart, update order status, etc.
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-gray-600">
                Thank you for your booking. We've sent a confirmation email with your
                itinerary details.
              </p>
              <div className="flex flex-col space-y-3">
                <Button onClick={() => router.push("/")}>
                  Return to Home
                </Button>
                <Button variant="outline" onClick={() => router.push("/account/bookings")}>
                  View My Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 