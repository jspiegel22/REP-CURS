import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach, FaToilet } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdBathroom } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat, GiPartyPopper } from 'react-icons/gi';
import AdventureBookingForm from '@/components/adventure-booking-form';

const PapillonCatamaran47Page: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/papillon-catamaran-47/main.jpg');
  
  const images = [
    {
      src: '/yachts/papillon-catamaran-47/main.jpg',
      alt: 'Papillon Catamaran 47 exterior view'
    },
    {
      src: '/yachts/papillon-catamaran-47/image-1.jpg',
      alt: 'Papillon Catamaran 47 front view'
    },
    {
      src: '/yachts/papillon-catamaran-47/image-2.jpg',
      alt: 'Papillon Catamaran 47 deck area' 
    },
    {
      src: '/yachts/papillon-catamaran-47/image-3.jpg',
      alt: 'Papillon Catamaran 47 interior'
    },
    {
      src: '/yachts/papillon-catamaran-47/image-4.jpg',
      alt: 'Papillon Catamaran 47 cruising in Cabo'
    }
  ];
  
  const keyFeatures = [
    {
      icon: <MdBathroom className="text-3xl text-blue-600" />,
      title: 'Two Bathrooms',
      description: 'Convenient onboard facilities for your comfort during the journey'
    },
    {
      icon: <FaUmbrellaBeach className="text-3xl text-blue-600" />,
      title: 'Adjustable Shade',
      description: 'Customizable shaded areas to protect from the sun when needed'
    },
    {
      icon: <GiSailboat className="text-3xl text-blue-600" />,
      title: 'Spacious Design',
      description: 'Large front seating area perfect for relaxing and enjoying the views'
    },
    {
      icon: <FaSwimmer className="text-3xl text-blue-600" />,
      title: 'Water Activities',
      description: 'Floating mat, paddle boards, and complete snorkeling gear included'
    },
    {
      icon: <MdOutlineLocalBar className="text-3xl text-blue-600" />,
      title: 'Open Bar',
      description: 'Unlimited drinks including premium spirits, beer, and non-alcoholic options'
    },
    {
      icon: <MdOutlineFoodBank className="text-3xl text-blue-600" />,
      title: 'Food Menu',
      description: 'Delicious selections including quesadillas, guacamole, and fruit platters'
    },
    {
      icon: <GiPartyPopper className="text-3xl text-blue-600" />,
      title: 'Entertainment Area',
      description: 'Vibrant dance area with high-quality music system for celebrations'
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
        <title>Papillon Catamaran 47 | Private Tour in Cabo San Lucas</title>
        <meta name="description" content="Experience a premium catamaran adventure aboard the Papillon Catamaran 47 in Cabo San Lucas. All-inclusive private tours with open bar, food, and water activities." />
        <meta name="keywords" content="catamaran Cabo, Papillon Catamaran 47, private catamaran tour, Cabo San Lucas boat rental, all-inclusive catamaran" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src="/yachts/papillon-catamaran-47/main.jpg" 
          alt="Papillon Catamaran 47 Private Tour" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              PAPILLON CATAMARAN 47
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-white">5.0 (35 reviews)</span>
            </div>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              Private all-inclusive catamaran tour with open bar, gourmet food, and water activities
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
                  alt="Papillon Catamaran 47" 
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
              <h2>An Exclusive Adventure in the Pristine Waters of Cabo</h2>
              
              <p>
                Welcome aboard the Catamaran Papillon 3, where elegance sails on the serene waters of Cabo San Lucas.
                This spacious catamaran offers plush seating, cozy sunbeds, and vibrant mats, all designed for your comfort.
                Equipped with cutting-edge Bluetooth speakers and a lively dance area, set the soundtrack of your sea adventure 
                as you dance, lounge, or simply soak in the stunning views.
              </p>
              
              <p>
                Papillon 3 is equipped with every convenience to ensure your journey is seamless and enjoyable.
                With two well-appointed bathrooms, there's no need to wait in line or rush back to shore. And when 
                the mood strikes, our vibrant dance area invites you to lose yourself in the music and move with 
                the rhythm of the sea. Thanks to our state-of-the-art Bluetooth speakers, you control the vibe, 
                crafting the perfect soundtrack for your adventure at sea.
              </p>
              
              <h3>Key Features</h3>
              
              <ul>
                <li><strong>Two bathrooms</strong> for convenience throughout your journey</li>
                <li><strong>Adjustable shaded areas</strong> to protect from the sun when needed</li>
                <li><strong>Large front seating area</strong> perfect for relaxing and enjoying the views</li>
                <li><strong>Water toys</strong> including a large floating mat, 4 paddle boards, and snorkeling gear</li>
                <li><strong>High-quality music system</strong> to set the perfect mood for your adventure</li>
                <li><strong>Easy water access</strong> with stairs to descend safely into the water</li>
              </ul>
              
              <h3>What to Bring</h3>
              
              <ul>
                <li>Towels</li>
                <li>Sunscreen</li>
                <li>Phone to play music (optional)</li>
                <li>Swimsuits, hats, sunglasses</li>
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
            
            {/* Included Activities */}
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
              
              <p className="mb-4">
                Expect exceptional quality from the beginning to the end of your experience.
              </p>
              
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
                    <li>• 4 paddle boards</li>
                    <li>• Large floating mat</li>
                    <li>• Complete snorkel gear</li>
                    <li>• Life vests</li>
                    <li>• Kid floats available</li>
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
                      adventureId="papillon-catamaran-47"
                      adventureTitle="Papillon Catamaran 47"
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
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-6 mb-8 text-white">
                <h3 className="text-lg font-bold mb-2">SPECIAL - 2 HOUR SUNSET CRUISE</h3>
                <p className="text-white mb-2">Experience the magical Cabo sunset in style</p>
                <div className="text-2xl font-bold mb-4">FROM $1,350 USD</div>
                <p className="text-sm">For 1-14 guests • Limited availability</p>
                <a 
                  href="#book" 
                  className="mt-4 block w-full bg-white text-orange-600 text-center py-3 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  Book Sunset Cruise
                </a>
              </div>
              
              {/* Add-ons */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Add-ons & Packages</h3>
                <p className="text-gray-600 mb-4">Uniquely tailored to suit your occasion</p>
                
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-bold text-gray-900">Birthday</h4>
                    <p className="text-sm text-gray-600">Includes sparkling wine, personalized cake, congrats banner and welcome mimosas</p>
                    <p className="text-sm font-medium text-green-600 mt-1">Included at no extra cost</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-bold text-gray-900">DJ Party</h4>
                    <p className="text-sm text-gray-600">Professional DJ curates the perfect playlist to match your mood</p>
                    <p className="text-sm font-medium text-gray-600 mt-1">350 USD for the 3 hour charter</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-bold text-gray-900">Bachelorette Party</h4>
                    <p className="text-sm text-gray-600">Special decorations and amenities for the bride-to-be</p>
                    <p className="text-sm font-medium text-green-600 mt-1">Included at no extra cost</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900">Need Help?</h4>
                    <a 
                      href="tel:+526243555999" 
                      className="mt-2 flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      Call Us: +52 624 355 5999
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PapillonCatamaran47Page;