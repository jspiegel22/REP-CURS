import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach, FaWifi } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdAir, MdTv } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat, GiFishingPole } from 'react-icons/gi';
import { Button } from "@/components/ui/button";
import AdventureBookingForm from '@/components/adventure-booking-form';
import OptimizedImage from '@/components/ui/optimized-image';

const Sunseeker80SaviPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/sunseeker-80/main.jpg');
  
  const images = [
    {
      src: '/yachts/sunseeker-80/main.jpg',
      alt: 'Sunseeker 80ft (Savi) yacht exterior'
    },
    {
      src: '/yachts/sunseeker-80/image-1.jpg',
      alt: 'Sunseeker 80ft yacht deck view'
    },
    {
      src: '/yachts/sunseeker-80/image-2.jpg',
      alt: 'Sunseeker 80ft yacht interior salon' 
    },
    {
      src: '/yachts/sunseeker-80/image-3.jpg',
      alt: 'Sunseeker 80ft yacht master bedroom'
    },
    {
      src: '/yachts/sunseeker-80/image-4.jpg',
      alt: 'Sunseeker 80ft yacht cruising in Cabo'
    }
  ];
  
  const keyFeatures = [
    {
      icon: <MdAir className="text-3xl text-blue-600" />,
      title: 'Air Conditioned',
      description: 'Full interior air conditioning for comfort in any weather'
    },
    {
      icon: <GiSailboat className="text-3xl text-blue-600" />,
      title: 'Luxury Yacht',
      description: 'Prestigious Sunseeker Manhattan 80ft black yacht with premium finishes'
    },
    {
      icon: <MdOutlineLocalBar className="text-3xl text-blue-600" />,
      title: 'Premium Open Bar',
      description: 'Top-shelf spirits, cocktails, beer, and non-alcoholic beverages'
    },
    {
      icon: <MdOutlineFoodBank className="text-3xl text-blue-600" />,
      title: 'Chef on Board',
      description: 'Gourmet meals and appetizers prepared by a professional chef'
    },
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: 'Up to 35 Guests',
      description: 'Spacious yacht perfect for large groups and events'
    },
    {
      icon: <GiCaptainHatProfile className="text-3xl text-blue-600" />,
      title: 'Expert Crew',
      description: 'Professional bilingual captain and attentive service staff'
    },
    {
      icon: <FaWifi className="text-3xl text-blue-600" />,
      title: 'WiFi & Entertainment',
      description: 'WiFi, 5 TVs, PlayStation, and JBL sound system'
    },
    {
      icon: <FaSwimmer className="text-3xl text-blue-600" />,
      title: 'Water Activities',
      description: 'Snorkeling gear, paddle board, and floating mat included'
    }
  ];
  
  // Schedule options for the booking form
  const scheduleOptions = [
    { value: 'morning', label: 'Morning Charter (9:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon Charter (1:00 PM - 4:00 PM)' },
    { value: 'sunset', label: 'Sunset Charter (5:00 PM - 7:00 PM)' },
    { value: 'fullday', label: 'Full Day Charter (9:00 AM - 5:00 PM)' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Sunseeker 80ft (Savi) Black Yacht | Luxury Charter in Cabo San Lucas</title>
        <meta name="description" content="Experience ultimate luxury aboard our Sunseeker Manhattan 80ft black yacht in Cabo San Lucas. Featuring 4 bedrooms, chef on board, and capacity for up to 35 guests." />
        <meta name="keywords" content="Sunseeker yacht, black yacht Cabo, 80ft yacht charter, Savi yacht, luxury boat rental, Cabo San Lucas yacht party" />
      </Helmet>
      
      {/* Title Section with White Background */}
      <div className="bg-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            SUNSEEKER 80FT BLACK YACHT (SAVI)
          </h1>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-gray-700">5.0 (32 reviews)</span>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl">
            Cabo's most exclusive black yacht with 4 bedrooms, chef on board, and luxury amenities
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="mb-8">
              <div className="rounded-xl overflow-hidden">
                <OptimizedImage 
                  src={activeImage} 
                  alt="Sunseeker 80ft Black Yacht" 
                  className="w-full h-[300px] md:h-[500px] object-cover"
                />
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${activeImage === image.src ? 'border-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveImage(image.src)}
                  >
                    <OptimizedImage 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Mobile Book Now CTA Button */}
              <div className="mt-6 md:hidden">
                <Button 
                  className="w-full bg-[#F47C3E] hover:bg-[#E36C2E] text-white py-4 text-lg font-bold"
                  onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  BOOK NOW
                </Button>
              </div>
            </div>
            
            {/* Yacht Description */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2>The Ultimate Luxury Experience: Sunseeker 80ft Black Yacht</h2>
              
              <p>
                Explore Cabo like never before with comfort and luxury on board this black Sunseeker 
                Manhattan 80ft yacht, part of the premium fleet of Papillon Yachts Rental in Los Cabos, Mexico.
                This stunning vessel combines sleek design with exceptional amenities for an unforgettable 
                charter experience.
              </p>
              
              <p>
                The Papillon 9, as this jewel in the Papillon Yachts fleet is known, offers spacious 
                accommodations with 4 luxury and fully equipped bedrooms, including 2 master suites and 2 cabins. 
                The yacht's 4 bathrooms are adorned with premium fittings, ensuring comfort and privacy 
                for all guests.
              </p>
              
              <p>
                Entertainment onboard includes 5 flat-screen satellite TVs, a state-of-the-art JBL 
                sound system that you can connect easily to your phone, and PlayStation for gaming enthusiasts.
                The yacht's advanced stabilizing system offers a serene journey, essential for those 
                sensitive to the sea's motion.
              </p>
              
              <h3>Yacht Specifications</h3>
              
              <ul>
                <li><strong>Length:</strong> 80 feet</li>
                <li><strong>Capacity:</strong> Up to 35 guests</li>
                <li><strong>Bedrooms:</strong> 4 bedrooms (2 master suites, 2 guest cabins)</li>
                <li><strong>Bathrooms:</strong> 4 full bathrooms</li>
                <li><strong>Interior:</strong> Luxury salon with air conditioning</li>
                <li><strong>Exterior:</strong> Indoor & outdoor kitchen, seating on teak deck, shaded areas, large front sun bathing area</li>
                <li><strong>Special Features:</strong> Hydraulic swim platform, stabilizer system</li>
                <li><strong>Entertainment:</strong> WiFi, 5 TVs, PlayStation, JBL Bluetooth audio system</li>
                <li><strong>Activities:</strong> Fishing gear, floating mat, snorkel gear, paddle board</li>
              </ul>
            </div>
            
            {/* Key Features Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Yacht Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex p-4 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="mr-4 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* What's Included */}
            <div className="bg-blue-50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-4">Chef on Board & Premium Open Bar</h2>
              
              <p className="mb-4">
                Indulge in a culinary journey with Papillon Yachts, where every dish is a celebration 
                of flavor and freshness. Our menu is crafted to enhance your luxury charter experience, 
                featuring a selection of gourmet dishes and refreshing beverages.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Signature Snacks</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Organic Artichoke & Cheese Dip</li>
                    <li>• Fresh Local Seasonal Fruit Platter</li>
                    <li>• Organic Mixed Nuts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Appetizers</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Cheese Quesadillas</li>
                    <li>• Chips with Guacamole & Salsa</li>
                    <li>• Classic Ceviche</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Gourmet Meal Options</h3>
                  <p className="text-gray-600 mb-2">Choose from two exclusive menu options:</p>
                  <p className="text-gray-600 font-medium">Option 1:</p>
                  <ul className="space-y-1 text-gray-600 mb-2">
                    <li>• Greek, Italian, or Caesar Salad</li>
                    <li>• Roast Beef & Turkey Sandwiches</li>
                    <li>• Classic Fish & Shrimp Ceviche</li>
                  </ul>
                  <p className="text-gray-600 font-medium">Option 2:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Fresh Sushi Platter</li>
                    <li>• Classic Ceviche</li>
                    <li>• Chicken Wings (Various flavors)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Premium Open Bar</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Top-shelf tequila</li>
                    <li>• Premium vodka</li>
                    <li>• Aged rum</li>
                    <li>• Craft beer</li>
                    <li>• Custom cocktails</li>
                    <li>• Fine wines</li>
                    <li>• Fresh juices</li>
                    <li>• Soft drinks</li>
                    <li>• Bottled water</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Activities Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Included Activities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <OptimizedImage 
                    src="/activities/snorkel-tour.jpg" 
                    alt="Private Snorkel Tour" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">Snorkel Tour</h3>
                    <p className="text-sm text-gray-600">Explore Cabo's vibrant underwater world with our premium snorkeling equipment.</p>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <OptimizedImage 
                    src="/activities/arch-tour.jpg" 
                    alt="Visit to the Arch" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">Arch Tour</h3>
                    <p className="text-sm text-gray-600">See Cabo's famous landmark up close and capture perfect photo opportunities.</p>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <OptimizedImage 
                    src="/activities/whale-watching.jpg" 
                    alt="Whale Watching" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">Whale Watching</h3>
                    <p className="text-sm text-gray-600">In season (Dec-Apr), spot magnificent humpback whales in their natural habitat.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transportation Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-4">Luxury Transportation Included</h2>
              
              <p className="mb-4">
                To make your experience seamless, we offer complimentary luxury round-trip transportation 
                in our deluxe vans. From the moment you leave your hotel until you return, you'll enjoy 
                the comfort and convenience of our premium service.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <OptimizedImage 
                  src="/transportation/luxury-van-1.jpg" 
                  alt="Luxury Transportation Van" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <OptimizedImage 
                  src="/transportation/luxury-van-2.jpg" 
                  alt="Luxury Transportation Interior" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <OptimizedImage 
                  src="/transportation/yacht-transportation.jpg" 
                  alt="Yacht Transportation Service" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <OptimizedImage 
                  src="/transportation/cabo-transportation.jpg" 
                  alt="Cabo Transportation" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Booking Section (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div id="booking-form" className="bg-[#2F4F4F] rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">Book Your Charter</h2>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-white">$5,400</span>
                    <span className="ml-2 text-white/80">for up to 10 guests</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-[#263F3F]">
                    <div className="flex items-center mb-2">
                      <FaRegCalendarAlt className="mr-2 text-white" />
                      <span className="text-white">3 Hours Charter (Sunset: 2 Hours)</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FaUsers className="mr-2 text-white" />
                      <span className="text-white">1-10 guests included, max 35</span>
                    </div>
                    <div className="text-sm text-white/80 mt-2">
                      Extra guest: $170 USD per person
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold text-white mb-2">Special Offer</h3>
                    <div className="bg-[#263F3F] p-3 rounded-lg">
                      <p className="text-sm font-medium text-white">Sunset Cruise (2 Hours): <span className="text-white font-bold">$3,900</span> for 1-15 guests</p>
                    </div>
                  </div>
                  
                  <div id="book">
                    <AdventureBookingForm
                      adventureId="sunseeker-80"
                      adventureTitle="Sunseeker 80ft Black Yacht"
                      adventureType="yacht"
                      price="5400"
                      scheduleOptions={scheduleOptions}
                      depositAmount="1500"
                      maxGuests={35}
                    />
                  </div>
                </div>
              </div>
              
              {/* Need Help Box */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">For custom charter options or group events, contact our yacht specialists.</p>
                <a 
                  href="tel:+19494785441" 
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Call Us: +1 949 478 5441
                </a>
                <p className="text-center text-sm text-gray-500 mt-2">We speak English & Spanish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sunseeker80SaviPage;