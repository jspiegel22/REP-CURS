import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay } from 'react-icons/fa';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// All locations (including airports)
const locations = [
  "Los Cabos Int'l Airport (SJD)",
  "Cabo San Lucas Int'l Airport (CSL)",
  "San Jose del Cabo (downtown)",
  "Palmilla",
  "Tourist Corridor",
  "Cabo San Lucas (main)",
  "Pedregal",
  "Tezal",
  "Diamante",
  "Todos Santos"
];

// Base price data (prices are in USD)
const priceData: Record<string, Record<string, number>> = {
  "Los Cabos Int'l Airport (SJD)": {
    "Cabo San Lucas Int'l Airport (CSL)": 120,
    "San Jose del Cabo (downtown)": 85,
    "Palmilla": 95,
    "Tourist Corridor": 110,
    "Cabo San Lucas (main)": 130,
    "Pedregal": 140,
    "Tezal": 125,
    "Diamante": 145,
    "Todos Santos": 210
  },
  "Cabo San Lucas Int'l Airport (CSL)": {
    "Los Cabos Int'l Airport (SJD)": 120,
    "San Jose del Cabo (downtown)": 135,
    "Palmilla": 125,
    "Tourist Corridor": 110,
    "Cabo San Lucas (main)": 75,
    "Pedregal": 85,
    "Tezal": 80,
    "Diamante": 95,
    "Todos Santos": 180
  },
  "San Jose del Cabo (downtown)": {
    "Los Cabos Int'l Airport (SJD)": 85,
    "Cabo San Lucas Int'l Airport (CSL)": 135
  },
  "Palmilla": {
    "Los Cabos Int'l Airport (SJD)": 95,
    "Cabo San Lucas Int'l Airport (CSL)": 125
  },
  "Tourist Corridor": {
    "Los Cabos Int'l Airport (SJD)": 110,
    "Cabo San Lucas Int'l Airport (CSL)": 110
  },
  "Cabo San Lucas (main)": {
    "Los Cabos Int'l Airport (SJD)": 130,
    "Cabo San Lucas Int'l Airport (CSL)": 75
  },
  "Pedregal": {
    "Los Cabos Int'l Airport (SJD)": 140,
    "Cabo San Lucas Int'l Airport (CSL)": 85
  },
  "Tezal": {
    "Los Cabos Int'l Airport (SJD)": 125,
    "Cabo San Lucas Int'l Airport (CSL)": 80
  },
  "Diamante": {
    "Los Cabos Int'l Airport (SJD)": 145,
    "Cabo San Lucas Int'l Airport (CSL)": 95
  },
  "Todos Santos": {
    "Los Cabos Int'l Airport (SJD)": 210,
    "Cabo San Lucas Int'l Airport (CSL)": 180
  }
};

// Vehicle types with images
const vehicleTypes = [
  { 
    name: "SUV - Suburban", 
    image: "/suburban.png", 
    capacity: 5, 
    surcharge: 0,
    description: "Luxury SUV with comfortable seating for up to 5 passengers"
  },
  { 
    name: "Van", 
    image: "/van.png", 
    capacity: 8, 
    surcharge: 20,
    description: "Spacious van with room for up to 8 passengers and luggage"
  },
  { 
    name: "Sprinter", 
    image: "/sprinter.png", 
    capacity: 14, 
    surcharge: 60,
    description: "Premium sprinter van with luxury seating for up to 14 passengers"
  }
];

const TransportationPage: React.FC = () => {
  // State for form inputs
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState(0); // Index of vehicleTypes
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter the to locations based on from location selection
  const getAvailableToLocations = () => {
    if (!fromLocation) return [];
    
    // Return locations that have a price from the selected fromLocation
    return Object.keys(priceData[fromLocation] || {});
  };

  // Get estimated price based on selections
  const getEstimatedPrice = () => {
    if (!fromLocation || !toLocation) return 0;
    
    const basePrice = priceData[fromLocation]?.[toLocation] || 0;
    const vehicleSurcharge = vehicleTypes[selectedVehicle]?.surcharge || 0;
    const totalOneWay = basePrice + vehicleSurcharge;
    
    return tripType === "oneWay" ? totalOneWay : totalOneWay * 2;
  };

  // Get formatted today's date for min date on calendar
  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle booking process
  const handleBookNow = async () => {
    setIsProcessing(true);
    
    try {
      // Save booking details to localStorage for the checkout page
      localStorage.setItem("bookingType", "transportation");
      localStorage.setItem("transportationAmount", getEstimatedPrice().toString());
      localStorage.setItem("transportationFrom", fromLocation);
      localStorage.setItem("transportationTo", toLocation);
      localStorage.setItem("transportationDepartureDate", departureDate);
      localStorage.setItem("transportationReturnDate", tripType === "roundTrip" ? returnDate : "null");
      localStorage.setItem("transportationPassengers", passengers.toString());
      localStorage.setItem("transportationVehicle", vehicleTypes[selectedVehicle].name);
      
      // Redirect to our new unified checkout page
      window.location.href = "/checkout";
      
      /* 
      // In a real implementation with direct payment integration:
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getEstimatedPrice(),
          fromLocation,
          toLocation,
          departureDate,
          returnDate: tripType === "roundTrip" ? returnDate : null,
          passengers,
          vehicleType: vehicleTypes[selectedVehicle].name
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Payment request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('No client secret returned from server');
      }
      
      // Initialize Stripe checkout
      const stripe = await stripePromise;
      if (stripe) {
        // Redirect to Stripe checkout
        // Use stripe.redirectToCheckout for a direct integration
      }
      */
    } catch (error) {
      console.error('Error processing payment:', error);
      // Show error to user
      alert(`Payment processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  // Check if the form is valid for booking
  const isValidBooking = fromLocation && toLocation && departureDate && 
    (tripType === "oneWay" || (tripType === "roundTrip" && returnDate)) &&
    passengers <= vehicleTypes[selectedVehicle].capacity;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Simple header */}
      <header className="bg-white shadow-sm py-3 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-800">Cabo Transportation</h1>
        </div>
      </header>

      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Main booking card */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Book Airport Transportation</h2>
              <p className="text-gray-600 mb-6">Reliable transportation service in Cabo San Lucas</p>
              
              {/* Trip type selector */}
              <div className="mb-6">
                <div className="inline-flex rounded-md p-1 bg-gray-100">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      tripType === "oneWay" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setTripType("oneWay")}
                  >
                    One Way
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      tripType === "roundTrip" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setTripType("roundTrip")}
                  >
                    Round Trip
                  </button>
                </div>
              </div>
              
              {/* From/To selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={fromLocation}
                    onChange={(e) => {
                      setFromLocation(e.target.value);
                      // Reset to location if it's not a valid option for the new from location
                      if (e.target.value && toLocation && !priceData[e.target.value]?.[toLocation]) {
                        setToLocation("");
                      }
                    }}
                  >
                    <option value="">Select pickup location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    disabled={!fromLocation}
                  >
                    <option value="">Select drop-off location</option>
                    {getAvailableToLocations().map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={getTodayFormatted()}
                  />
                </div>
                {tripType === "roundTrip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departureDate || getTodayFormatted()}
                    />
                  </div>
                )}
              </div>

              {/* Passenger count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                <select
                  className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'passenger' : 'passengers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle selection with images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vehicleTypes.map((vehicle, index) => (
                    <div 
                      key={index}
                      className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                        selectedVehicle === index 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${passengers > vehicle.capacity ? 'opacity-50' : ''}`}
                      onClick={() => {
                        if (passengers <= vehicle.capacity) {
                          setSelectedVehicle(index);
                        }
                      }}
                    >
                      <div className="aspect-video relative bg-gray-100">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            // Fallback if image doesn't load
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x200?text=Vehicle+Image';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
                        <p className="text-sm text-gray-500">Up to {vehicle.capacity} passengers</p>
                        {passengers > vehicle.capacity && (
                          <p className="text-xs text-red-500 mt-1">Too small for your group</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price estimate and Book Now button */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t">
                <div className="mb-4 md:mb-0">
                  {fromLocation && toLocation ? (
                    <div>
                      <span className="text-gray-600">Total price: </span>
                      <span className="text-2xl font-semibold">${getEstimatedPrice()}</span>
                      <span className="text-gray-600 text-sm ml-1">USD</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select locations to see the price</span>
                  )}
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition duration-150 flex items-center justify-center"
                  disabled={!isValidBooking || isProcessing}
                  onClick={handleBookNow}
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
                    "Book Now"
                  )}
                </button>
              </div>
              
              {/* Payment methods */}
              <div className="mt-4 flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-500">Pay with:</span>
                <div className="flex space-x-3">
                  <FaCcVisa size={24} className="text-blue-600" />
                  <FaCcMastercard size={24} className="text-red-500" />
                  <FaCcPaypal size={24} className="text-blue-700" />
                  <FaApplePay size={24} className="text-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">Airport Pickup</h3>
              <p className="text-gray-600 text-sm">Our English-speaking drivers will meet you at the airport with a sign with your name.</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-gray-600 text-sm">The price you see is the price you pay. All taxes and driver gratuity included.</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">Free Cancellation</h3>
              <p className="text-gray-600 text-sm">Cancel for free up to 24 hours before your scheduled pickup time.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransportationPage;