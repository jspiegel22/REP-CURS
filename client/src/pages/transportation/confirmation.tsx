import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const TransportationConfirmation: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [confirmationNumber, setConfirmationNumber] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const { toast } = useToast();

  const sendConfirmationEmail = async (bookingDetails: any) => {
    try {
      const userEmail = localStorage.getItem("transportationEmail") || "";
      const userName = localStorage.getItem("transportationName") || "Customer";
      
      if (!userEmail) {
        console.warn("No email address found in localStorage, skipping confirmation email");
        return false;
      }

      const response = await apiRequest("POST", "/api/send-booking-confirmation", {
        email: userEmail,
        name: userName,
        bookingType: "transportation",
        confirmationNumber,
        booking: bookingDetails
      });

      if (response.ok) {
        setEmailSent(true);
        return true;
      } else {
        console.error("Failed to send confirmation email:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      return false;
    }
  };

  useEffect(() => {
    // Get URL parameters
    const query = new URLSearchParams(window.location.search);
    const paymentIntentId = query.get("payment_intent");
    const redirectStatus = query.get("redirect_status");

    if (paymentIntentId && redirectStatus) {
      if (redirectStatus === "succeeded") {
        // Generate a confirmation number (in production this would come from the backend)
        const generatedConfirmation = "CB" + Math.floor(100000 + Math.random() * 900000);
        setConfirmationNumber(generatedConfirmation);
        setStatus("success");

        // Prepare booking details
        const bookingDetails = {
          id: paymentIntentId,
          confirmationNumber: generatedConfirmation,
          date: new Date().toLocaleDateString(),
          amount: localStorage.getItem("transportationAmount") || "N/A",
          fromLocation: localStorage.getItem("transportationFrom") || "N/A",
          toLocation: localStorage.getItem("transportationTo") || "N/A",
          departureDate: localStorage.getItem("transportationDepartureDate") || "N/A",
          returnDate: localStorage.getItem("transportationReturnDate") || "N/A",
          passengers: localStorage.getItem("transportationPassengers") || "N/A",
          vehicleType: localStorage.getItem("transportationVehicle") || "N/A",
          name: localStorage.getItem("transportationName") || "N/A",
          email: localStorage.getItem("transportationEmail") || "N/A",
          phone: localStorage.getItem("transportationPhone") || "N/A"
        };

        setPaymentInfo(bookingDetails);
        
        // Send confirmation email
        sendConfirmationEmail(bookingDetails).then(sent => {
          if (sent) {
            toast({
              title: "Confirmation Email Sent",
              description: "We've sent your booking details to your email address.",
              variant: "default"
            });
          } else {
            toast({
              title: "Email Notification",
              description: "Your booking is confirmed, but we couldn't send the confirmation email.",
              variant: "destructive"
            });
          }
        });
        
        // Also save the booking to the database via API
        apiRequest("POST", "/api/bookings", {
          type: "transportation",
          status: "confirmed",
          firstName: localStorage.getItem("transportationName")?.split(" ")[0] || "",
          lastName: localStorage.getItem("transportationName")?.split(" ").slice(1).join(" ") || "",
          email: localStorage.getItem("transportationEmail") || "",
          phone: localStorage.getItem("transportationPhone") || "",
          details: bookingDetails,
          paymentId: paymentIntentId,
          amount: parseFloat(localStorage.getItem("transportationAmount") || "0"),
          notes: `Transportation booking from ${bookingDetails.fromLocation} to ${bookingDetails.toLocation}`
        }).catch(err => {
          console.error("Failed to save booking to database:", err);
        });
      } else {
        setStatus("failed");
        setError(`Payment was not successful. Status: ${redirectStatus}`);
      }
    } else {
      setStatus("failed");
      setError("No payment information found in the URL");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white shadow-sm py-3 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-800">Cabo Transportation</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Processing your booking...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-green-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Thank you for booking with Cabo Transportation.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Your confirmation number</p>
                <p className="text-xl font-bold text-blue-600">{confirmationNumber}</p>
              </div>
              
              {paymentInfo && (
                <div className="text-left border rounded-lg overflow-hidden mb-6">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h3 className="font-medium">Trip Details</h3>
                  </div>
                  <div className="p-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                        <dt className="text-gray-500">From</dt>
                        <dd className="font-medium text-gray-900">{paymentInfo.fromLocation}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">To</dt>
                        <dd className="font-medium text-gray-900">{paymentInfo.toLocation}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Departure Date</dt>
                        <dd className="font-medium text-gray-900">{paymentInfo.departureDate}</dd>
                      </div>
                      {paymentInfo.returnDate && paymentInfo.returnDate !== "null" && (
                        <div>
                          <dt className="text-gray-500">Return Date</dt>
                          <dd className="font-medium text-gray-900">{paymentInfo.returnDate}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-gray-500">Passengers</dt>
                        <dd className="font-medium text-gray-900">{paymentInfo.passengers}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Vehicle</dt>
                        <dd className="font-medium text-gray-900">{paymentInfo.vehicleType}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Amount</dt>
                        <dd className="font-medium text-gray-900">${paymentInfo.amount} USD</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Booking Date</dt>
                        <dd className="font-medium text-gray-900">{paymentInfo.date}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 text-left text-sm text-gray-600 mb-6">
                <p>• Your driver will meet you at the airport with a sign with your name.</p>
                <p>• We've sent the booking details to your email address.</p>
                <p>• For any questions, please contact our support team at support@cabotransportation.com</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <a className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Back to Home
                  </a>
                </Link>
                <Link href="/transportation">
                  <a className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Book Another Trip
                  </a>
                </Link>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-red-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">We couldn't process your payment.</p>
              
              {error && (
                <div className="bg-red-50 p-4 rounded-lg mb-6 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/transportation">
                  <a className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Try Again
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransportationConfirmation;