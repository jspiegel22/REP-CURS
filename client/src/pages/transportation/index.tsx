import React, { useState } from "react";

// Simple pricing data - can be replaced with actual API data
const PRICING = {
  "San Jose (downtown)": { base: 80 },
  "Palmilla": { base: 85 },
  "Tourist Corridor": { base: 100 },
  "Cabo San Lucas (main)": { base: 110 },
  "Pedregal": { base: 95 },
  "Tezal": { base: 115 },
  "Diamante": { base: 125 },
  "Todos Santos": { base: 145 },
};

const VEHICLE_TYPES = [
  "Suburban (5 pax)",
  "Van (6 pax)",
  "Large Van (10-14 pax)"
];

const TransportationIndexPage = () => {
  // Basic state
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Cabo Transportation</h1>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                About
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Book Airport Transportation</h2>
              <p className="text-gray-600">Reliable transportation from Cabo Airport (SJD) to your destination</p>
            </div>
            
            {/* Trip Type */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsRoundTrip(false)}
                  className={`px-4 py-2 rounded-full ${!isRoundTrip 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700"}`}
                >
                  One Way
                </button>
                <button
                  onClick={() => setIsRoundTrip(true)}
                  className={`px-4 py-2 rounded-full ${isRoundTrip 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700"}`}
                >
                  Round Trip
                </button>
              </div>
            </div>
            
            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* From */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">From</label>
                <div className="flex items-center p-3 border rounded-md bg-gray-50">
                  <span className="text-gray-700">Cabo Airport (SJD)</span>
                </div>
              </div>
              
              {/* To */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">To</label>
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Select destination</option>
                  {Object.keys(PRICING).map(dest => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Pickup Date */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Pickup Date</label>
                <input 
                  type="date" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              {/* Return Date - Show only if round trip */}
              {isRoundTrip && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Return Date</label>
                  <input 
                    type="date" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>
            
            {/* Passengers & Vehicle Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Passengers */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Passengers</label>
                <select 
                  value={passengers} 
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                >
                  {Array.from({length: 15}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} passenger{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Vehicle Type */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Vehicle Type</label>
                <select className="w-full p-3 border rounded-md">
                  <option value="">Select vehicle type</option>
                  {VEHICLE_TYPES.map(vehicle => (
                    <option key={vehicle} value={vehicle}>
                      {vehicle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Airport Pickup</h3>
            <p className="text-gray-600 text-sm">Our English-speaking drivers will meet you at the airport with a sign with your name.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">No Hidden Fees</h3>
            <p className="text-gray-600 text-sm">The price you see is the price you pay. No surprises or additional costs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Flexible Cancellation</h3>
            <p className="text-gray-600 text-sm">Free cancellation up to 24 hours before your scheduled pickup.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportationIndexPage;