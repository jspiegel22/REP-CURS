import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach, FaWifi, FaHotTub } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdAir, MdTv } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat } from 'react-icons/gi';
import AdventureBookingForm from '@/components/adventure-booking-form';

const Azimut95Page: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/azimut-95/main.jpg');
  
  const images = [
    {
      src: '/yachts/azimut-95/main.jpg',
      alt: 'Azimut 95ft yacht exterior view'
    },
    {
      src: '/yachts/azimut-95/image-1.jpg',
      alt: 'Azimut 95ft yacht deck view'
    },
    {
      src: '/yachts/azimut-95/image-2.jpg',
      alt: 'Azimut 95ft yacht interior' 
    },
    {
      src: '/yachts/azimut-95/image-3.jpg',
      alt: 'Azimut 95ft yacht bedroom'
    },
    {
      src: '/yachts/azimut-95/image-4.jpg',
      alt: 'Azimut 95ft yacht cruising in Cabo'
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
      description: 'Premium Azimut 95ft yacht with elegant Italian design'
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
      title: 'Up to 30 Guests',
      description: 'Spacious yacht perfect for large groups and events'
    },
    {
      icon: <GiCaptainHatProfile className="text-3xl text-blue-600" />,
      title: 'Expert Crew',
      description: 'Professional bilingual captain and attentive service staff'
    },
    {
      icon: <FaHotTub className="text-3xl text-blue-600" />,
      title: 'Onboard Jacuzzi',
      description: 'Relax in the jacuzzi while enjoying breathtaking ocean views'
    },
    {
      icon: <FaSwimmer className="text-3xl text-blue-600" />,
      title: 'Water Activities',
      description: 'Snorkeling gear, paddle boards, and floating mat included'
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
        <title>Azimut 95ft Luxury Yacht Charter | Premium Boat Rental in Cabo San Lucas</title>
        <meta name="description" content="Experience ultimate luxury aboard our Azimut 95ft yacht in Cabo San Lucas. Featuring an onboard jacuzzi, chef on board, and capacity for up to 30 guests." />
        <meta name="keywords" content="Azimut yacht, 95ft yacht charter, luxury boat Cabo, onboard jacuzzi, Cabo San Lucas yacht party" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src="/yachts/azimut-95/main.jpg" 
          alt="Azimut 95ft Luxury Yacht Charter" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              AZIMUT 95FT LUXURY YACHT
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-white">5.0 (28 reviews)</span>
            </div>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              Cabo's premier luxury yacht with onboard jacuzzi, chef, and accommodation for up to 30 guests
            </p>
          </div>
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
                <img 
                  src={activeImage} 
                  alt="Azimut 95ft Luxury Yacht" 
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
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Yacht Description */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2>Premium Yacht Charter Experience in Cabo</h2>
              
              <p>
                Step aboard our stunning 95ft Azimut yacht, designed to provide an extraordinary 
                level of luxury, comfort, and adventure in the breathtaking waters of Los Cabos, Mexico. 
                With a spacious and stylish design, this luxury yacht is ideal for those who seek an 
                elite private experience, whether it's for a celebration, corporate event, or an 
                exclusive getaway.
              </p>
              
              <p>
                With an expansive deck, elegant interiors, and top-tier amenities, the 95ft Azimut 
                Yacht ensures an unforgettable journey while cruising along the Sea of Cortez and 
                the Pacific Ocean. Whether you're relaxing in the onboard jacuzzi, enjoying the ocean 
                breeze from the sun deck, or indulging in the yacht's luxurious spaces, every moment 
                on board is designed for comfort and exclusivity.
              </p>
              
              <h3>Features & Highlights</h3>
              
              <ul>
                <li><strong>Spacious Capacity:</strong> Accommodates up to 30 guests comfortably</li>
                <li><strong>Luxurious Interior:</strong> Modern, sophisticated décor with ample seating areas</li>
                <li><strong>Expansive Deck Spaces:</strong> Ideal for lounging, sunbathing, or enjoying breathtaking ocean views</li>
                <li><strong>Multiple Lounges & Dining Areas:</strong> Both indoor and outdoor spaces perfect for any occasion</li>
                <li><strong>Premium Sound System:</strong> Connect your own device and set the perfect ambiance</li>
                <li><strong>Fully Equipped Bar:</strong> Enjoy a selection of cocktails and beverages</li>
                <li><strong>Top-Tier Service:</strong> Professional crew dedicated to your every need</li>
                <li><strong>Swim & Snorkel Access:</strong> Jump into the crystal-clear waters of Cabo with included snorkeling gear and water toys</li>
                <li><strong>Jacuzzi on Board:</strong> Relax in ultimate comfort as you cruise the stunning coastline</li>
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
                Indulge in a culinary journey with our onboard chef, where every dish is a celebration 
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
            
            {/* Perfect For Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Perfect for Any Occasion</h2>
              
              <p className="mb-4">
                Whether you're planning a luxury getaway, a corporate retreat, a wedding, or a milestone celebration,
                the Azimut 95ft provides the perfect setting for a truly exclusive and elegant yachting experience.
              </p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5">
                <li>Luxury Sunset Cruises</li>
                <li>Bachelorette & Bachelor Parties</li>
                <li>Birthday Celebrations</li>
                <li>Anniversaries & Romantic Escapes</li>
                <li>Corporate Events & Retreats</li>
                <li>Exclusive Family & Friends Gatherings</li>
              </ul>
            </div>
          </div>
          
          {/* Booking Section (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">Book Your Charter</h2>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-blue-600">$4,900</span>
                    <span className="ml-2 text-gray-700">for 1-10 guests (3 hours)</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center mb-2">
                      <FaRegCalendarAlt className="mr-2 text-gray-600" />
                      <span>3 Hours Charter</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-600" />
                      <span>Up to 30 guests ($150 per extra guest after 10)</span>
                    </div>
                  </div>
                  
                  <div id="book">
                    <AdventureBookingForm
                      adventureId="azimut-95"
                      adventureTitle="Azimut 95ft Luxury Yacht"
                      adventureType="yacht"
                      price="4900"
                      scheduleOptions={scheduleOptions}
                      depositAmount="1500"
                      maxGuests={30}
                    />
                  </div>
                </div>
              </div>
              
              {/* Need Help Box */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">Have questions about this yacht charter or want to customize your experience?</p>
                <a 
                  href="tel:+526243555999" 
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Call Us: +52 624 355 5999
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

export default Azimut95Page;