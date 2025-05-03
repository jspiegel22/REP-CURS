import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaStar, FaRegCalendarAlt, FaUsers, FaSwimmer, FaUmbrellaBeach } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdAir } from 'react-icons/md';
import { GiCaptainHatProfile, GiSailboat } from 'react-icons/gi';
import AdventureBookingForm from '@/components/adventure-booking-form';
import OptimizedImage from '@/components/ui/optimized-image';

const SeaRaySundancer45Page: React.FC = () => {
  const [activeImage, setActiveImage] = useState('/yachts/sea-ray-45/main.jpg');
  
  const images = [
    {
      src: '/yachts/sea-ray-45/main.jpg',
      alt: 'Sea Ray Sundancer 45 yacht exterior view'
    },
    {
      src: '/yachts/sea-ray-45/image-1.jpg',
      alt: 'Sea Ray Sundancer 45 yacht deck view'
    },
    {
      src: '/yachts/sea-ray-45/image-2.jpg',
      alt: 'Sea Ray Sundancer 45 yacht interior' 
    },
    {
      src: '/yachts/sea-ray-45/image-3.jpg',
      alt: 'Sea Ray Sundancer 45 yacht bedroom'
    },
    {
      src: '/yachts/sea-ray-45/image-4.jpg',
      alt: 'Sea Ray Sundancer 45 yacht cruising in Cabo'
    }
  ];
  
  const keyFeatures = [
    {
      icon: <MdAir className="text-3xl text-blue-600" />,
      title: 'Air Conditioned',
      description: 'Stay cool with full interior air conditioning even on the hottest Cabo days'
    },
    {
      icon: <GiSailboat className="text-3xl text-blue-600" />,
      title: 'Premium Yacht',
      description: 'Experience luxury aboard this pristine Sea Ray Sundancer 45ft yacht'
    },
    {
      icon: <MdOutlineLocalBar className="text-3xl text-blue-600" />,
      title: 'Open Bar',
      description: 'Enjoy unlimited beer, spirits, cocktails, soft drinks, and water'
    },
    {
      icon: <MdOutlineFoodBank className="text-3xl text-blue-600" />,
      title: 'Gourmet Food',
      description: 'Fresh appetizers, snacks, and meals prepared by onboard culinary staff'
    },
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: '14 Guests',
      description: 'Perfect for groups, with comfortable space for up to 14 passengers'
    },
    {
      icon: <GiCaptainHatProfile className="text-3xl text-blue-600" />,
      title: 'Professional Crew',
      description: 'Expert bilingual captain and crew for a safe and enjoyable experience'
    },
    {
      icon: <FaSwimmer className="text-3xl text-blue-600" />,
      title: 'Water Activities',
      description: 'Snorkeling gear, paddle boards, and floating mat included'
    },
    {
      icon: <FaUmbrellaBeach className="text-3xl text-blue-600" />,
      title: 'Beach Stops',
      description: 'Visit pristine beaches accessible only by boat'
    }
  ];
  
  // Schedule options for the booking form
  const scheduleOptions = [
    { value: 'morning', label: 'Morning Charter (9:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon Charter (1:00 PM - 4:00 PM)' },
    { value: 'sunset', label: 'Sunset Charter (5:00 PM - 8:00 PM)' },
    { value: 'fullday', label: 'Full Day Charter (9:00 AM - 5:00 PM)' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Sea Ray Sundancer 45ft Yacht Charter | Luxury Boat Rental in Cabo San Lucas</title>
        <meta name="description" content="Experience luxury aboard our Sea Ray Sundancer 45ft yacht in Cabo San Lucas. Perfect for groups up to 14, featuring air conditioning, open bar, and water activities." />
        <meta name="keywords" content="Sea Ray Sundancer, yacht charter Cabo, 45ft yacht rental, luxury boat Cabo San Lucas, private yacht party" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <OptimizedImage 
          src="/yachts/sea-ray-45/main.jpg" 
          alt="Sea Ray Sundancer 45ft Yacht Charter" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              SEA RAY SUNDANCER 45
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-white">5.0 (24 reviews)</span>
            </div>
            <p className="text-xl md:text-2xl text-white max-w-3xl">
              Luxury 45ft yacht with air conditioning, open bar, and capacity for up to 14 guests
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
                <OptimizedImage 
                  src={activeImage} 
                  alt="Sea Ray Sundancer 45 Yacht" 
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
            </div>
            
            {/* Quick Book CTA */}
            <div className="mb-8">
              <div className="bg-green-800 text-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Ready to Book This Yacht?</h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center">
                        <FaRegCalendarAlt className="mr-2" />
                        <span>3 Hours</span>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="mr-2" />
                        <span>Up to 14 guests</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold">$990</span>
                        <span className="text-sm ml-1">per charter</span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href="#book" 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
            
            {/* Yacht Description */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2>The Sea Ray Sundancer 45ft Experience</h2>
              
              <p>
                The Sea Ray Sundancer 45ft yacht is the ideal vessel for your next adventure in Cabo San Lucas. 
                With its sleek design, spacious deck areas, and luxurious air-conditioned interior, this yacht 
                offers an unforgettable experience on the stunning waters of Los Cabos.
              </p>
              
              <p>
                Whether you're looking to relax on the sun-soaked deck or dive into exciting water activities, 
                the Sea Ray 45ft provides the perfect balance of relaxation and adventure. It comfortably 
                accommodates up to 14 guests, making it ideal for group outings, family adventures, or 
                romantic escapes.
              </p>
              
              <h3>A Perfect Balance of Comfort and Adventure</h3>
              
              <p>
                Your adventure aboard the Sea Ray Sundancer 45ft includes a 3-hour tour of Cabo's most iconic 
                sights, such as El Arco, Lover's Beach, and the surrounding marine life hotspots. Sip on 
                handcrafted cocktails from the open bar while soaking in the stunning views of the Pacific 
                Ocean and the Sea of Cortez. With our dedicated crew providing impeccable service, you can 
                simply relax and enjoy every moment of your journey.
              </p>
              
              <h3>Yacht Specifications</h3>
              
              <ul>
                <li><strong>Length:</strong> 45 feet</li>
                <li><strong>Capacity:</strong> Up to 14 guests</li>
                <li><strong>Amenities:</strong> Air conditioned interior, one bedroom, one bathroom, interior living room, shaded back seating, large front seating/sun bathing area</li>
                <li><strong>Entertainment:</strong> Bluetooth sound system, water toys, snorkeling equipment</li>
                <li><strong>Catering:</strong> Open bar and food included</li>
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
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Unlimited Open Bar</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Premium tequila</li>
                    <li>• Vodka</li>
                    <li>• Rum</li>
                    <li>• Beer</li>
                    <li>• Soft drinks and juices</li>
                    <li>• Bottled water</li>
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
                    <li>• Custom menu available upon request</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Water Toys</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 1 paddle board</li>
                    <li>• Large floating mat</li>
                    <li>• Complete snorkel gear</li>
                    <li>• Life vests</li>
                    <li>• Kid floats available</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Additional Services</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Round-trip luxury transportation</li>
                    <li>• Bilingual certified crew</li>
                    <li>• Towels</li>
                    <li>• Ice</li>
                    <li>• Bluetooth sound system</li>
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
                    src="/activities/sunset-cruise.jpg" 
                    alt="Sunset Cruise" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">Sunset Option</h3>
                    <p className="text-sm text-gray-600">Experience the magical Cabo sunset with a special evening charter option.</p>
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
                    <span className="text-3xl font-bold text-blue-600">$990</span>
                    <span className="ml-2 text-gray-500 line-through">$1,100</span>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">10% OFF</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center mb-2">
                      <FaRegCalendarAlt className="mr-2 text-gray-600" />
                      <span>3 Hours Charter</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-600" />
                      <span>Up to 14 guests</span>
                    </div>
                  </div>
                  
                  <div id="book">
                    <AdventureBookingForm
                      adventureId="sea-ray-45"
                      adventureTitle="Sea Ray Sundancer 45"
                      adventureType="yacht"
                      price="990"
                      scheduleOptions={scheduleOptions}
                      depositAmount="500"
                      maxGuests={14}
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

export default SeaRaySundancer45Page;