import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach, FaUtensils } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdAir, MdHouseSiding } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat, GiKitchenKnives } from 'react-icons/gi';
import AdventureBookingForm from '@/components/adventure-booking-form';

const LeopardCatamaranPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/leopard/main.jpg');
  
  const images = [
    {
      src: '/yachts/leopard/main.jpg',
      alt: 'Leopard Catamaran exterior'
    },
    {
      src: '/yachts/leopard/image-1.jpg',
      alt: 'Leopard Catamaran deck view'
    },
    {
      src: '/yachts/leopard/image-2.jpg',
      alt: 'Leopard Catamaran interior salon' 
    },
    {
      src: '/yachts/leopard/image-3.jpg',
      alt: 'Leopard Catamaran bedroom'
    },
    {
      src: '/yachts/leopard/image-4.jpg',
      alt: 'Leopard Catamaran cruising in Cabo'
    }
  ];
  
  const keyFeatures = [
    {
      icon: <MdAir className="text-3xl text-blue-600" />,
      title: 'Air Conditioned',
      description: 'Interior air conditioning for optimal comfort in any weather'
    },
    {
      icon: <MdHouseSiding className="text-3xl text-blue-600" />,
      title: 'Two Cabins',
      description: 'Comfortable cabins for changing or resting during your journey'
    },
    {
      icon: <GiSailboat className="text-3xl text-blue-600" />,
      title: 'Modern Catamaran',
      description: 'Stable, spacious design perfect for smooth sailing'
    },
    {
      icon: <FaUmbrellaBeach className="text-3xl text-blue-600" />,
      title: 'Relaxation Areas',
      description: 'Large net at the front, beds to lay on, and seating around the boat'
    },
    {
      icon: <MdOutlineLocalBar className="text-3xl text-blue-600" />,
      title: 'Premium Open Bar',
      description: 'Top-shelf spirits, cocktails, beer, and non-alcoholic options'
    },
    {
      icon: <GiKitchenKnives className="text-3xl text-blue-600" />,
      title: 'Fully Equipped Kitchen',
      description: 'Complete kitchen with professional chef to prepare gourmet meals'
    },
    {
      icon: <FaUtensils className="text-3xl text-blue-600" />,
      title: 'Dining Areas',
      description: 'Interior and exterior dining tables for meals with a view'
    },
    {
      icon: <GiCaptainHatProfile className="text-3xl text-blue-600" />,
      title: 'Expert Crew',
      description: 'Professional bilingual crew ensuring a safe and enjoyable experience'
    }
  ];
  
  // Schedule options for the booking form
  const scheduleOptions = [
    { value: 'morning', label: 'Morning Charter (9:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon Charter (1:00 PM - 4:00 PM)' },
    { value: 'sunset', label: 'Sunset Cruise (5:00 PM - 7:00 PM)' },
    { value: 'fullday', label: 'Full Day Charter (9:00 AM - 5:00 PM)' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Luxury Leopard Catamaran | Premium Charter in Los Cabos</title>
        <meta name="description" content="Experience nautical luxury aboard our Leopard Catamaran in Los Cabos. All-inclusive private tours with premium amenities, open bar, and gourmet dining." />
        <meta name="keywords" content="Leopard catamaran, Los Cabos boat charter, luxury catamaran rental, private boat tour Cabo, all-inclusive catamaran" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src="/yachts/leopard/main.jpg" 
          alt="Luxury Leopard Catamaran Charter" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              LUXURY LEOPARD CATAMARAN
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-white">5.0 (27 reviews)</span>
            </div>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              A unique blend of tranquility, excitement, and excellent service on the waters of Los Cabos
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
                  alt="Leopard Catamaran in Los Cabos" 
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
              <h2>Premium Catamaran Experience in Cabo</h2>
              
              <p>
                Crafted for those who seek the finest in nautical adventures, this private catamaran in 
                cabo is not just a vessel, it's a gateway to a unique blend of tranquility, excitement, 
                and excellent service.
              </p>
              
              <p>
                Every detail on board is designed to ensure your journey is as seamless as it is memorable. 
                Whether you're for a peaceful day basking on the Sea of Cortez, an exhilarating snorkeling 
                adventure, or an exploration of Cabo San Lucas's mesmerizing waters, our luxury sailing 
                catamaran is your perfect companion.
              </p>
              
              <p>
                With Papillon Yachts, every moment is an invitation to indulge in the extraordinary.
              </p>
              
              <h3>Key Features</h3>
              
              <ul>
                <li><strong>Air conditioned interior</strong> for your comfort throughout the journey</li>
                <li><strong>Two cabins</strong> for changing or resting during the cruise</li>
                <li><strong>Two modern bathrooms</strong> with all necessary amenities</li>
                <li><strong>Interior dining table</strong> for comfortable meals</li>
                <li><strong>Fully equipped kitchen with chef</strong> to prepare delicious meals</li>
                <li><strong>Exterior dining table</strong> for meals with a view</li>
                <li><strong>Shaded back seating</strong> to protect from the sun</li>
                <li><strong>Large net to lay on the front</strong> for relaxation and sunbathing</li>
                <li><strong>Beds and seats around the boat</strong> for maximum comfort</li>
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
                    src="/activities/sunset-cruise.jpg" 
                    alt="Sunset Cruise" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">Sunset Cruise</h3>
                    <p className="text-sm text-gray-600">Experience the magical Cabo sunset during our special evening cruises.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* What's Included */}
            <div className="bg-blue-50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Unlimited Open Bar</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Rum</li>
                    <li>• Tequila</li>
                    <li>• Vodka</li>
                    <li>• Beer</li>
                    <li>• Juices</li>
                    <li>• Sodas</li>
                    <li>• Mixers</li>
                    <li>• Water</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Food Menu</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Cheese quesadillas</li>
                    <li>• Guacamole</li>
                    <li>• Pico de gallo</li>
                    <li>• Chips</li>
                    <li>• Fruit platter</li>
                    <li className="italic">• Custom menu available upon request</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Water Toys</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 2 paddle boards</li>
                    <li>• Large floating mat</li>
                    <li>• Complete snorkel gear</li>
                    <li>• Life vests</li>
                    <li className="italic">• Kid floats available</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Additional Services</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Private transportation (round trip)</li>
                    <li>• Bilingual & friendly certified crew</li>
                    <li>• 3 hours charter + transportation time</li>
                    <li>• Optional add-ons and packages available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Section (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">Book Your Charter</h2>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-blue-600">$2,000</span>
                    <span className="ml-2 text-gray-700">for 1-14 guests</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center mb-2">
                      <FaRegCalendarAlt className="mr-2 text-gray-600" />
                      <span>3 Hours Charter</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-600" />
                      <span>Up to 35 guests ($90 per extra guest)</span>
                    </div>
                  </div>
                  
                  <div id="book">
                    <AdventureBookingForm
                      adventureId="leopard-catamaran"
                      adventureTitle="Leopard Luxury Catamaran"
                      adventureType="catamaran"
                      price="2000"
                      scheduleOptions={scheduleOptions}
                      depositAmount="1000"
                      maxGuests={35}
                    />
                  </div>
                </div>
              </div>
              
              {/* Special Sunset Offer */}
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl p-6 mb-8 text-white">
                <h3 className="text-lg font-bold mb-2">SPECIAL - 2 HOUR SUNSET CRUISE</h3>
                <p className="text-white mb-2">Experience the magical Cabo sunset in style</p>
                <div className="text-2xl font-bold mb-4">FROM $1,400 USD</div>
                <p className="text-sm">For 1-14 guests • Limited availability</p>
                <a 
                  href="#book" 
                  className="mt-4 block w-full bg-white text-teal-600 text-center py-3 px-4 rounded-lg font-medium hover:bg-teal-50 transition-colors"
                >
                  Book Sunset Cruise
                </a>
              </div>
              
              {/* Photo Gallery Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Catamaran Photo Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div 
                        key={index}
                        className="cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => setActiveImage(image.src)}
                      >
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          className="w-full h-20 object-cover hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
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

export default LeopardCatamaranPage;