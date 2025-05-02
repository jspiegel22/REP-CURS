import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaCreditCard, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Types for our checkout data
type BookingItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
};

type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type BookingDetails = {
  type: "villa" | "transportation" | "adventure" | "restaurant";
  startDate?: string;
  endDate?: string;
  guests?: number;
  specialRequests?: string;
  additionalInfo?: Record<string, any>;
};

type CheckoutData = {
  bookingItems: BookingItem[];
  customer: CustomerInfo;
  details: BookingDetails;
  subtotal: number;
  tax: number;
  total: number;
};

const CheckoutTemplate: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  
  // Placeholder data - in a real app, this would come from localStorage, context, or query params
  useEffect(() => {
    // For demo purposes, we're creating sample data based on what's in localStorage
    // In a real app, this would be passed from the previous page or retrieved from an API
    
    const type = localStorage.getItem("bookingType") || "transportation";
    let mockData: CheckoutData;
    
    if (type === "transportation") {
      // Use transportation data from localStorage
      const amount = parseFloat(localStorage.getItem("transportationAmount") || "0");
      const vehicle = localStorage.getItem("transportationVehicle") || "SUV";
      const from = localStorage.getItem("transportationFrom") || "";
      const to = localStorage.getItem("transportationTo") || "";
      
      mockData = {
        bookingItems: [{
          id: "transport-1",
          name: `${vehicle} - ${from} to ${to}`,
          description: `Airport transportation service`,
          price: amount,
          quantity: 1,
          image: vehicle.includes("SUV") ? "/suburban.png" : 
                 vehicle.includes("Van") ? "/van.png" : 
                 "/sprinter.png"
        }],
        customer: customerInfo,
        details: {
          type: "transportation",
          startDate: localStorage.getItem("transportationDepartureDate") || "",
          endDate: localStorage.getItem("transportationReturnDate") !== "null" 
            ? localStorage.getItem("transportationReturnDate") || "" 
            : undefined,
          guests: parseInt(localStorage.getItem("transportationPassengers") || "1"),
          additionalInfo: {
            fromLocation: from,
            toLocation: to,
            tripType: localStorage.getItem("transportationReturnDate") !== "null" ? "roundTrip" : "oneWay"
          }
        },
        subtotal: amount,
        tax: amount * 0.1, // Example 10% tax
        total: amount * 1.1
      };
    } else if (type === "villa") {
      // Mock data for villa bookings
      mockData = {
        bookingItems: [{
          id: "villa-1",
          name: "Luxury Villa with Ocean View",
          description: "Spacious villa with private pool and stunning ocean views",
          price: 1200,
          quantity: 1,
          image: "https://villa-image-url.jpg"
        }],
        customer: customerInfo,
        details: {
          type: "villa",
          startDate: "2025-05-15",
          endDate: "2025-05-22",
          guests: 4,
          specialRequests: "Early check-in requested"
        },
        subtotal: 1200,
        tax: 120,
        total: 1320
      };
    } else {
      // Generic mock data
      mockData = {
        bookingItems: [{
          id: "generic-1",
          name: "Cabo Experience",
          description: "Your amazing Cabo experience",
          price: 500,
          quantity: 1,
          image: "https://experience-image-url.jpg"
        }],
        customer: customerInfo,
        details: {
          type: "adventure",
          startDate: "2025-05-10",
          guests: 2
        },
        subtotal: 500,
        tax: 50,
        total: 550
      };
    }
    
    setCheckoutData(mockData);
  }, []);

  // Update customer info when form changes
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle progression to the payment step
  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    
    // Validate the form fields
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill out all required fields");
      setIsProcessing(false);
      return;
    }
    
    try {
      // In a real app, you would create a payment intent here
      // For demo purposes, we'll simulate it after a short delay
      setTimeout(() => {
        const mockClientSecret = "pi_" + Math.random().toString(36).substring(2, 15);
        setClientSecret(mockClientSecret);
        setStep("payment");
        setIsProcessing(false);
      }, 1500);
      
      /*
      // In a real application with Stripe:
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: checkoutData?.total,
          metadata: {
            bookingType: checkoutData?.details.type,
            ...checkoutData?.details.additionalInfo
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep("payment");
      */
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      alert("There was a problem proceeding to payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle simulated payment completion
  const handleCompletePayment = () => {
    setIsProcessing(true);
    
    // In a real app, this would be handled by Stripe redirect
    // For demo purposes, we'll simulate a successful payment
    setTimeout(() => {
      const mockConfirmationNumber = "CB" + Math.floor(100000 + Math.random() * 900000);
      setConfirmationNumber(mockConfirmationNumber);
      setPaymentSuccess(true);
      setStep("confirmation");
      setIsProcessing(false);
    }, 2000);
  };

  // Render the step content
  const renderStepContent = () => {
    if (!checkoutData) return <div>Loading checkout data...</div>;
    
    if (step === "details") {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Booking Summary</h3>
            </div>
            <div className="p-4">
              {checkoutData.bookingItems.map(item => (
                <div key={item.id} className="flex gap-4 mb-4">
                  {item.image && (
                    <div className="w-24 h-24 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/100?text=Image';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                    <div className="flex justify-between">
                      <span>${item.price.toFixed(2)} × {item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Booking Details Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium mb-2">Booking Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {checkoutData.details.startDate && (
                    <div>
                      <span className="text-gray-600">Date:</span>{' '}
                      <span>{new Date(checkoutData.details.startDate).toLocaleDateString()}</span>
                      {checkoutData.details.endDate && (
                        <span> - {new Date(checkoutData.details.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                  {checkoutData.details.guests && (
                    <div>
                      <span className="text-gray-600">Guests:</span>{' '}
                      <span>{checkoutData.details.guests}</span>
                    </div>
                  )}
                  {checkoutData.details.type === "transportation" && checkoutData.details.additionalInfo && (
                    <>
                      <div>
                        <span className="text-gray-600">From:</span>{' '}
                        <span>{checkoutData.details.additionalInfo.fromLocation}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">To:</span>{' '}
                        <span>{checkoutData.details.additionalInfo.toLocation}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Trip Type:</span>{' '}
                        <span>{checkoutData.details.additionalInfo.tripType === "roundTrip" ? "Round Trip" : "One Way"}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${checkoutData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${checkoutData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${checkoutData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Customer Information</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea
                  name="specialRequests"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Any special requirements or questions?"
                ></textarea>
              </div>
              
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition duration-150 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment <FaCreditCard className="ml-2" />
                  </>
                )}
              </button>

              {/* Payment methods */}
              <div className="mt-4 flex items-center justify-center space-x-4">
                <span className="text-xs text-gray-500">We accept:</span>
                <div className="flex space-x-3">
                  <FaCcVisa size={28} className="text-blue-600" />
                  <FaCcMastercard size={28} className="text-red-500" />
                  <FaCcPaypal size={28} className="text-blue-700" />
                  <FaApplePay size={28} className="text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (step === "payment") {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Payment Details</h3>
            </div>
            <div className="p-4">
              {/* In a real app, this would be the Stripe payment form */}
              <div className="border rounded-md p-5 bg-gray-50 mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Code (CVC)</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium mb-2">Order Summary</h4>
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>${checkoutData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Tax</span>
                  <span>${checkoutData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-blue-200 mt-2">
                  <span>Total</span>
                  <span>${checkoutData.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition duration-150 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay Now ${checkoutData.total.toFixed(2)} <FaShoppingCart className="ml-2" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep("details")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={isProcessing}
                >
                  Back to Details
                </button>
              </div>
              
              {/* Security badges */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">Secure Payment</p>
                <div className="flex justify-center space-x-3">
                  <img src="https://via.placeholder.com/60x30?text=SSL" alt="SSL Secure" className="h-6" />
                  <img src="https://via.placeholder.com/60x30?text=PCI" alt="PCI Compliant" className="h-6" />
                  <img src="https://via.placeholder.com/60x30?text=Stripe" alt="Powered by Stripe" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (step === "confirmation") {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
                <FaCheckCircle className="h-8 w-8 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Thank you for your booking.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Your confirmation number</p>
                <p className="text-xl font-bold text-blue-600">{confirmationNumber}</p>
              </div>
              
              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="font-medium">Booking Details</h3>
                </div>
                <div className="p-4">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {checkoutData.details.startDate && (
                      <div>
                        <dt className="text-gray-500">Date</dt>
                        <dd className="font-medium text-gray-900">
                          {new Date(checkoutData.details.startDate).toLocaleDateString()}
                          {checkoutData.details.endDate && (
                            <> - {new Date(checkoutData.details.endDate).toLocaleDateString()}</>
                          )}
                        </dd>
                      </div>
                    )}
                    {checkoutData.details.type === "transportation" && checkoutData.details.additionalInfo && (
                      <>
                        <div>
                          <dt className="text-gray-500">From</dt>
                          <dd className="font-medium text-gray-900">{checkoutData.details.additionalInfo.fromLocation}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">To</dt>
                          <dd className="font-medium text-gray-900">{checkoutData.details.additionalInfo.toLocation}</dd>
                        </div>
                      </>
                    )}
                    {checkoutData.details.guests && (
                      <div>
                        <dt className="text-gray-500">Guests</dt>
                        <dd className="font-medium text-gray-900">{checkoutData.details.guests}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Customer</dt>
                      <dd className="font-medium text-gray-900">{customerInfo.firstName} {customerInfo.lastName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Email</dt>
                      <dd className="font-medium text-gray-900">{customerInfo.email}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Phone</dt>
                      <dd className="font-medium text-gray-900">{customerInfo.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Total Amount</dt>
                      <dd className="font-medium text-gray-900">${checkoutData.total.toFixed(2)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Booking Date</dt>
                      <dd className="font-medium text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="space-y-3 text-left text-sm text-gray-600 mb-6">
                <p>• We've sent the booking details to your email address.</p>
                <p>• For any questions, please contact our support team.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <a className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Back to Home
                  </a>
                </Link>
                <Link href={`/${checkoutData.details.type}`}>
                  <a className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Browse More {checkoutData.details.type === "transportation" ? "Transportation" : 
                                 checkoutData.details.type === "villa" ? "Villas" :
                                 checkoutData.details.type === "adventure" ? "Adventures" : "Experiences"}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Simple header */}
      <header className="bg-white shadow-sm py-3 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-800">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Checkout Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between md:justify-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "details" || step === "payment" || step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                1
              </div>
              <span className="text-sm mt-1 hidden md:inline">Details</span>
            </div>
            <div className={`flex-grow mx-2 h-1 ${step === "payment" || step === "confirmation" ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "payment" || step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                2
              </div>
              <span className="text-sm mt-1 hidden md:inline">Payment</span>
            </div>
            <div className={`flex-grow mx-2 h-1 ${step === "confirmation" ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                3
              </div>
              <span className="text-sm mt-1 hidden md:inline">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default CheckoutTemplate;