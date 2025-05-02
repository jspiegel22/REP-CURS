import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaCcAmex } from 'react-icons/fa';
import { SiVenmo, SiCashapp, SiGooglepay } from 'react-icons/si';
import { BiTransfer } from 'react-icons/bi';
import { FiCalendar, FiUsers, FiCheck } from 'react-icons/fi';
import { MdAirportShuttle } from "react-icons/md";

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
      {/* Google Flights-style header */}
      <header className="bg-blue-600 py-3 border-b border-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <MdAirportShuttle className="text-white text-2xl mr-2" />
            <h1 className="text-xl font-medium text-white">Cabo Transportation</h1>
          </div>
        </div>
      </header>

      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Google Flights style search card */}
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Search Header */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h2 className="text-2xl font-medium mb-1">Book Airport Transportation</h2>
              <p className="text-blue-100">Premium, reliable transportation service in Los Cabos</p>
            </div>
            
            <div className="p-6">
              {/* Trip type selector - Google Flights style pill */}
              <div className="mb-8 flex justify-center">
                <div className="inline-flex rounded-full p-1 bg-gray-100 shadow-sm">
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      tripType === "oneWay" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setTripType("oneWay")}
                  >
                    One Way
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      tripType === "roundTrip" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setTripType("roundTrip")}
                  >
                    Round Trip
                  </button>
                </div>
              </div>
              
              {/* Google Flights style search form */}
              <div className="flex flex-col md:flex-row gap-2 mb-8">
                <div className="flex-1">
                  {/* From/To locations - Merged in single line for Google Flights style */}
                  <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow group flex items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                      <select
                        className="w-full border-none p-0 text-gray-900 text-lg focus:ring-0 focus:outline-none bg-transparent"
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
                    
                    <div className="px-2">
                      <BiTransfer className="text-gray-400 text-lg transform rotate-90 md:rotate-0" />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                      <select
                        className="w-full border-none p-0 text-gray-900 text-lg focus:ring-0 focus:outline-none bg-transparent"
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
                </div>
                
                {/* Date selection - Google Flights style */}
                <div className="flex-1">
                  <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Departure</label>
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-2" />
                        <input
                          type="date"
                          className="w-full border-none p-0 text-gray-900 text-lg focus:ring-0 focus:outline-none bg-transparent"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          min={getTodayFormatted()}
                        />
                      </div>
                    </div>
                    
                    {tripType === "roundTrip" && (
                      <>
                        <div className="px-2">
                          <div className="h-8 border-r border-gray-300"></div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Return</label>
                          <div className="flex items-center">
                            <FiCalendar className="text-gray-400 mr-2" />
                            <input
                              type="date"
                              className="w-full border-none p-0 text-gray-900 text-lg focus:ring-0 focus:outline-none bg-transparent"
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              min={departureDate || getTodayFormatted()}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Passenger count - Google Flights style */}
                <div className="md:w-48">
                  <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Passengers</label>
                    <div className="flex items-center">
                      <FiUsers className="text-gray-400 mr-2" />
                      <select
                        className="w-full border-none p-0 text-gray-900 text-lg focus:ring-0 focus:outline-none bg-transparent"
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
                  </div>
                </div>
              </div>

              {/* Google Flights-style vehicle selection */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4">Select your vehicle</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vehicleTypes.map((vehicle, index) => {
                    const isSelected = selectedVehicle === index;
                    const isDisabled = passengers > vehicle.capacity;
                    
                    return (
                      <div 
                        key={index}
                        className={`rounded-xl overflow-hidden transition-all ${
                          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                        } ${
                          isSelected 
                            ? 'border-2 border-blue-500 shadow-md' 
                            : 'border border-gray-200'
                        }`}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedVehicle(index);
                          }
                        }}
                      >
                        {/* Vehicle Image */}
                        <div className="aspect-video relative bg-gray-50">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/300x200?text=Vehicle+Image';
                            }}
                          />
                          
                          {/* Google Flights style selection indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                              <FiCheck size={16} />
                            </div>
                          )}
                        </div>
                        
                        {/* Vehicle Info */}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">Up to {vehicle.capacity} passengers</p>
                            </div>
                            
                            {vehicle.surcharge > 0 && (
                              <div className="text-right">
                                <span className="text-sm font-medium text-blue-600">+${vehicle.surcharge}</span>
                                <p className="text-xs text-gray-500">surcharge</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Feature list */}
                          <ul className="mt-3 space-y-1">
                            <li className="text-xs text-gray-600 flex items-center">
                              <span className="mr-1 text-green-500">✓</span> Air conditioning
                            </li>
                            <li className="text-xs text-gray-600 flex items-center">
                              <span className="mr-1 text-green-500">✓</span> Professional driver
                            </li>
                            <li className="text-xs text-gray-600 flex items-center">
                              <span className="mr-1 text-green-500">✓</span> Bottled water included
                            </li>
                          </ul>

                          {isDisabled && (
                            <p className="text-xs font-medium text-red-500 mt-2">Too small for your group</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Google Flights-style price and booking section */}
              <div className="mt-6 bg-blue-50 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  {fromLocation && toLocation ? (
                    <div>
                      <div className="text-gray-500 text-sm">Total price</div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-blue-700">${getEstimatedPrice()}</span>
                        <span className="text-gray-600 text-sm ml-1">USD</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tripType === "roundTrip" ? "Round trip" : "One way"} · {vehicleTypes[selectedVehicle].name}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Please complete your selection</span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <button
                    className={`px-8 py-3 rounded-full font-medium transition-all flex items-center justify-center ${
                      !isValidBooking || isProcessing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg'
                    }`}
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
                  
                  {/* Payment methods */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <FaCcVisa size={20} className="text-blue-600" />
                    <FaCcMastercard size={20} className="text-red-500" />
                    <FaCcAmex size={20} className="text-blue-700" />
                    <FaCcPaypal size={20} className="text-blue-800" />
                    <FaApplePay size={20} className="text-gray-800" />
                    <SiGooglepay size={20} className="text-gray-600" />
                    <SiVenmo size={16} className="text-blue-500" />
                  </div>
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