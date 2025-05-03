import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach, FaWifi } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdAir, MdTv } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat, GiHelmet } from 'react-icons/gi';
import AdventureBookingForm from '@/components/adventure-booking-form';

const PatronFerretti88Page: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/patron-ferretti-88/main.jpg');
  
  const images = [
    {
      src: '/yachts/patron-ferretti-88/main.jpg',
      alt: 'Patron Ferretti 88ft yacht exterior'
    },
    {
      src: '/yachts/patron-ferretti-88/image-1.jpg',
      alt: 'Patron Ferretti 88ft yacht deck view'
    },
    {
      src: '/yachts/patron-ferretti-88/image-2.jpg',
      alt: 'Patron Ferretti 88ft yacht interior salon' 
    },
    {
      src: '/yachts/patron-ferretti-88/image-3.jpg',
      alt: 'Patron Ferretti 88ft yacht bedroom'
    },
    {
      src: '/yachts/patron-ferretti-88/image-4.jpg',
      alt: 'Patron Ferretti 88ft yacht cruising in Cabo'
    }
  ];
  
  const keyFeatures = [
    {
      icon: <MdAir className="text-3xl text-blue-600" />,
      title: 'Air Conditioned',
      description: 'Full interior air conditioning for ultimate comfort in any weather'
    },
    {
      icon: <GiSailboat className="text-3xl text-blue-600" />,
      title: 'Italian Craftsmanship',
      description: 'Prestigious Italian Ferretti 88ft yacht with premium finishes'
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
      title: 'Up to 40 Guests',
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
      description: 'WiFi, 5 TVs, PlayStation, and premium audio system'
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
        <title>Patron Ferretti 88ft Yacht | Luxury Charter in Cabo San Lucas</title>
        <meta name="description" content="Experience ultimate luxury aboard our Patron Ferretti 88ft yacht in Cabo San Lucas. With 4 bedrooms, chef on board, and capacity for up to 40 guests." />
        <meta name="keywords" content="Ferretti yacht, Italian yacht Cabo, 88ft yacht charter, Patron yacht, luxury yacht rental, Cabo San Lucas yacht party" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src="/yachts/patron-ferretti-88/main.jpg" 
          alt="Patron Ferretti 88ft Yacht Charter" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              PATRON FERRETTI 88FT YACHT
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-white">5.0 (30 reviews)</span>
            </div>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              Italian craftsmanship with 4 bedrooms, chef on board, and luxury amenities
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
                  alt="Patron Ferretti 88ft Yacht" 
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
              <h2>The Ultimate Luxury Experience: Patron Ferretti 88ft Yacht</h2>
              
              <p>
                Step aboard The Patron, an exquisite 88ft Italian Ferretti yacht designed for those who 
                seek the pinnacle of luxury and adventure in the stunning waters of Cabo San Lucas, Mexico. 
                With its sleek design, elegant interiors, and world-class amenities, this yacht offers the 
                ultimate private charter experience.
              </p>
              
              <p>
                Whether you're celebrating a special occasion, hosting an exclusive gathering, or simply 
                indulging in a serene escape, Patron Yacht provides a seamless blend of comfort, sophistication, 
                and breathtaking ocean views. Fully equipped with spacious lounges, premium dining areas, and 
                top-tier service, this yacht is the perfect setting for unforgettable moments at sea.
              </p>
              
              <h3>Luxury Interior</h3>
              
              <p>
                Step aboard The Patron and immerse yourself in an ambiance of unparalleled elegance. This 
                88ft Italian Ferretti yacht features an open-concept interior, adorned with sleek natural 
                wood finishes, plush furnishings, and sophisticated décor. Every detail is designed to 
                provide the perfect balance of comfort and style, creating a refined yet inviting setting.
              </p>
              
              <h3>Spacious Exterior</h3>
              
              <p>
                The outdoor areas of The Patron are designed for both relaxation and entertainment, offering 
                the best vantage points to soak in the stunning Cabo coastline. Lounge on the expansive sundeck, 
                sip handcrafted cocktails on the shaded aft deck, or enjoy front-row views of the turquoise 
                waters from the spacious bow seating area.
              </p>
              
              <h3>Yacht Specifications</h3>
              
              <ul>
                <li><strong>Length:</strong> 88 feet</li>
                <li><strong>Capacity:</strong> Up to 40 guests</li>
                <li><strong>Bedrooms:</strong> 4 bedrooms (2 master suites, 2 guest cabins)</li>
                <li><strong>Bathrooms:</strong> 3 full bathrooms</li>
                <li><strong>Interior:</strong> Luxury salon with air conditioning</li>
                <li><strong>Exterior:</strong> Indoor & outdoor kitchen, seating on teak deck, shaded areas, large front sun bathing area, fly bridge with seating</li>
                <li><strong>Entertainment:</strong> WiFi, 5 TVs, PlayStation, premium audio system</li>
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
            
            {/* World-Class Amenities */}
            <div className="bg-blue-50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-4">World-Class Amenities</h2>
              
              <p className="mb-4">
                Whether you're celebrating a special occasion or simply indulging in the finer things in life, 
                The Patron offers:
              </p>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span> Spacious dining areas both indoors and outdoors, perfect for intimate gatherings or lively celebrations
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span> Four luxurious staterooms with en-suite bathrooms for ultimate comfort and privacy
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span> An open bar and gourmet dining experience, featuring a curated selection of premium beverages and freshly prepared cuisine
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span> Exciting water toys, including snorkeling gear and paddleboards, to enhance your adventure on the water
                </li>
              </ul>
              
              <p className="mt-4">
                With its timeless Italian craftsmanship, top-tier service, and stunning oceanfront setting, 
                The Patron redefines luxury yacht charters in Cabo San Lucas. Whether for a romantic getaway, 
                a celebration with friends, or a family adventure, this yacht is the ultimate way to experience 
                the magic of the sea in style.
              </p>
            </div>
            
            {/* Activities Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Included Activities</h2>
              
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
          </div>
          
          {/* Booking Section (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">Book Your Charter</h2>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-blue-600">$4,700</span>
                    <span className="ml-2 text-gray-700">for 1-15 guests (3 hours)</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center mb-2">
                      <FaRegCalendarAlt className="mr-2 text-gray-600" />
                      <span>3 Hours Charter</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-600" />
                      <span>Up to 40 guests ($100 per extra guest after 15)</span>
                    </div>
                  </div>
                  
                  <div id="book">
                    <AdventureBookingForm
                      adventureId="patron-ferretti-88"
                      adventureTitle="Patron Ferretti 88ft Yacht"
                      adventureType="yacht"
                      price="4700"
                      scheduleOptions={scheduleOptions}
                      depositAmount="1500"
                      maxGuests={40}
                    />
                  </div>
                </div>
              </div>
              
              {/* Important Information */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-2">Important Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Gratuity is not included, and a 16% VAT tax applies to credit card payments. Cash payments are tax-free.</li>
                  <li>• Prefer cash? Pay in full on the day of your charter, and we'll refund your deposit, including the tax, for added flexibility.</li>
                </ul>
              </div>
              
              {/* Need Help Box */}
              <div className="bg-gray-50 rounded-xl p-6">
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

export default PatronFerretti88Page;