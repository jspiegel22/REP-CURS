import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach, FaMotorcycle } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdAir, MdTv } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat, GiWaterfall } from 'react-icons/gi';
import AdventureBookingForm from '@/components/adventure-booking-form';

const Lagoon65Page: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/lagoon-65/main.jpg');
  
  const images = [
    {
      src: '/yachts/lagoon-65/main.jpg',
      alt: 'Lagoon 65 luxury catamaran exterior'
    },
    {
      src: '/yachts/lagoon-65/image-1.jpg',
      alt: 'Lagoon 65 catamaran deck view'
    },
    {
      src: '/yachts/lagoon-65/image-2.jpg',
      alt: 'Lagoon 65 catamaran interior salon' 
    },
    {
      src: '/yachts/lagoon-65/image-3.jpg',
      alt: 'Lagoon 65 catamaran bedroom'
    },
    {
      src: '/yachts/lagoon-65/image-4.jpg',
      alt: 'Lagoon 65 catamaran cruising in Cabo'
    }
  ];
  
  const keyFeatures = [
    {
      icon: <MdAir className="text-3xl text-blue-600" />,
      title: 'Elegant Interiors',
      description: 'Modern design with high-quality finishes and panoramic windows'
    },
    {
      icon: <GiSailboat className="text-3xl text-blue-600" />,
      title: 'Spacious Design',
      description: 'Large open decks for sunbathing, relaxing, and socializing'
    },
    {
      icon: <MdOutlineLocalBar className="text-3xl text-blue-600" />,
      title: 'Premium Open Bar',
      description: 'Top-shelf spirits, cocktails, beer, and non-alcoholic beverages'
    },
    {
      icon: <MdOutlineFoodBank className="text-3xl text-blue-600" />,
      title: 'Gourmet Dining',
      description: 'Fully equipped kitchen and dining area for gourmet meals'
    },
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: 'Up to 25 Guests',
      description: 'Comfortable capacity for private tours and events'
    },
    {
      icon: <GiCaptainHatProfile className="text-3xl text-blue-600" />,
      title: 'Professional Crew',
      description: 'Attentive captain and host tailored to your preferences'
    },
    {
      icon: <FaMotorcycle className="text-3xl text-blue-600" />,
      title: 'Jet Ski Included',
      description: 'One hour of Jet Ski included in the price'
    },
    {
      icon: <FaSwimmer className="text-3xl text-blue-600" />,
      title: 'Water Activities',
      description: 'Paddleboards, floating mat, and snorkeling gear included'
    }
  ];
  
  // Schedule options for the booking form
  const scheduleOptions = [
    { value: 'morning', label: 'Morning Charter (9:00 AM - 1:00 PM)' },
    { value: 'afternoon', label: 'Afternoon Charter (2:00 PM - 6:00 PM)' },
    { value: 'sunrise', label: 'Sunrise Cruise (6:30 AM - 9:30 AM)' },
    { value: 'fullday', label: 'Full Day Charter (9:00 AM - 5:00 PM)' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Lagoon 65 Luxury Catamaran | Premium Charter in Cabo San Lucas</title>
        <meta name="description" content="Experience ultimate luxury aboard our Lagoon 65ft catamaran in Cabo San Lucas. With gourmet dining, water activities, and jet ski included." />
        <meta name="keywords" content="Lagoon 65 catamaran, luxury charter Cabo, catamaran rental, Cabo San Lucas boat, Lagoon catamaran" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src="/yachts/lagoon-65/main.jpg" 
          alt="Lagoon 65 Luxury Catamaran Charter" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              LAGOON 65 LUXURY CATAMARAN
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-white">5.0 (25 reviews)</span>
            </div>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              Premium all-inclusive catamaran experience with jet ski, gourmet dining, and luxury amenities
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
                  alt="Lagoon 65 Luxury Catamaran" 
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
            
            {/* Catamaran Description */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2>Discover the experience of cruising on the Lagoon 65 in Los Cabos, Mexico</h2>
              
              <p>
                Experience the ultimate luxury aboard the Lagoon 65ft catamaran in Cabo San Lucas. 
                Perfect for private charters, enjoy gourmet dining, water activities, and breathtaking views. 
                Sail in style with Papillon Yachts, where every detail is tailored to your dream adventure.
              </p>
              
              <h3>Key Features of the Lagoon 65ft Catamaran</h3>
              
              <h4>1. Spacious Design</h4>
              <ul>
                <li>Large, open decks for sunbathing, relaxing, and socializing.</li>
                <li>Expansive trampolines at the front for lounging and enjoying the sea breeze.</li>
                <li>Comfortable shaded areas for dining or relaxing.</li>
              </ul>
              
              <h4>2. Elegant Interiors</h4>
              <ul>
                <li>Modern, luxurious design with high-quality finishes.</li>
                <li>Spacious lounge area with panoramic windows for stunning ocean views.</li>
                <li>Fully equipped kitchen and dining area for gourmet meals.</li>
              </ul>
              
              <h4>3. Capacity</h4>
              <ul>
                <li>Accommodates up to 25 guests comfortably for private tours in Cabo San Lucas, Mexico.</li>
              </ul>
              
              <h4>4. Activities & Entertainment</h4>
              <ul>
                <li>Paddleboards, floating mat and snorkeling gear included for exploring the crystal-clear waters.</li>
                <li>1 hour of Jetski included in the price.</li>
                <li>Premium sound system to set the perfect mood.</li>
              </ul>
              
              <h4>5. Crewed Charter</h4>
              <ul>
                <li>Professional and attentive crew, including captain and host.</li>
                <li>Customized service tailored to your preferences.</li>
              </ul>
              
              <h4>6. Dining & Drinks</h4>
              <ul>
                <li>Gourmet meals prepared onboard, with menus customizable.</li>
                <li>Open bar with premium beverages and cocktails.</li>
              </ul>
            </div>
            
            {/* Key Features Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Catamaran Features</h2>
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
            
            {/* Activities Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Activities Included</h2>
              
              <p className="mb-6">
                Your catamaran rental includes optional activities such as a private snorkeling tour, 
                visit to the arch, lovers beach and all the rock formations in the way. As this is a 
                private tour, you're able to decide if you would like to spend more time swimming or 
                cruising in amazing Sea of Cortez.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img 
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
                  <img 
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
                  <img 
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
            
            {/* Menu Options */}
            <div className="bg-blue-50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-4">Menu Options</h2>
              
              <p className="mb-6">
                Choose from our carefully crafted menu options, prepared fresh onboard by our talented chef.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-xl mb-3 text-blue-600">Menu Option 1</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Fresh guacamole with tortilla chips</li>
                    <li>• Selection of seafood tapas</li>
                    <li>• Baja-style fish tacos</li>
                    <li>• Grilled vegetables with local herbs</li>
                    <li>• Tropical fruit platter</li>
                    <li>• Selection of desserts</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-xl mb-3 text-blue-600">Menu Option 2</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Charcuterie and cheese board</li>
                    <li>• Fresh ceviche (seafood or vegetarian)</li>
                    <li>• Grilled chicken skewers</li>
                    <li>• Mexican rice and black beans</li>
                    <li>• Seasonal salad with citrus dressing</li>
                    <li>• Chef's special dessert selection</li>
                  </ul>
                </div>
              </div>
              
              <p className="mt-4 text-center text-blue-800 font-medium">
                Custom menu options available upon request
              </p>
            </div>
          </div>
          
          {/* Booking Section (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">Book Your Charter</h2>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-blue-600">$6,900</span>
                    <span className="ml-2 text-gray-700">for 1-10 guests (4 hours)</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center mb-2">
                      <FaRegCalendarAlt className="mr-2 text-gray-600" />
                      <span>4 Hours Charter</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-600" />
                      <span>Up to 25 guests ($150 per extra guest)</span>
                    </div>
                  </div>
                  
                  <div id="book">
                    <AdventureBookingForm
                      adventureId="lagoon-65"
                      adventureTitle="Lagoon 65 Luxury Catamaran"
                      adventureType="catamaran"
                      price="6900"
                      scheduleOptions={scheduleOptions}
                      depositAmount="2500"
                      maxGuests={25}
                    />
                  </div>
                </div>
              </div>
              
              {/* Special Sunrise Offer */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 mb-8 text-white">
                <h3 className="text-lg font-bold mb-2">SPECIAL - 2 HOUR SUNRISE CRUISE</h3>
                <p className="text-white mb-2">Experience the breathtaking Cabo sunrise in style</p>
                <div className="text-2xl font-bold mb-4">FROM $2,500 USD</div>
                <p className="text-sm">For 1-10 guests • 6:30 AM - 9:30 AM • Limited availability</p>
                <a 
                  href="#book" 
                  className="mt-4 block w-full bg-white text-indigo-600 text-center py-3 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Book Sunrise Cruise
                </a>
              </div>
              
              {/* Need Help Box */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">Have questions about this catamaran charter or want to customize your experience?</p>
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

export default Lagoon65Page;