import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  FaStar, FaRegCalendarAlt, FaUsers, FaRegClock, FaAnchor, 
  FaWineGlass, FaSwimmer, FaUmbrellaBeach, FaGlassMartiniAlt,
  FaWifi
} from 'react-icons/fa';
import { 
  MdOutlineFoodBank, MdOutlineLocalBar, MdOutlinePeopleAlt,
  MdOutlineLocationOn, MdAir
} from 'react-icons/md';
import { GiSailboat, GiSpeedBoat, GiSunset, GiSnorkel, GiShipWheel } from 'react-icons/gi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AdventureBookingForm from '@/components/adventure-booking-form';

export default function SilvertonYachtDetailPage() {
  const [currentImage, setCurrentImage] = useState('/yachts/silverton-42/main.jpg');
  const { toast } = useToast();
  
  const yacht = {
    id: 9998,
    title: "SILVERTON SPORT BRIDGE 42",
    slug: "silverton-sport-bridge-42",
    description: `Experience the yacht "PURA VIDA", a luxury vessel designed for comfort, style, and unforgettable adventures on the pristine waters of Los Cabos.

Whether you're planning a sunset cruise, snorkeling excursion, or a celebratory event, our Silverton Sport Bridge yacht offers an unparalleled way to explore Cabo in complete luxury.

## ABOUT THE PAPILLON YACHT SILVERTON 42

The Yacht Silverton Sport Bridge 42 is a premier yacht in our fleet, perfectly designed for intimate gatherings and family adventures. This 42-foot yacht boasts a spacious flybridge, where you can enjoy panoramic views of Cabo's famous landmarks, such as El Arco and Lover's Beach, while cruising in comfort.

The well-appointed interior features a modern, open layout with plenty of natural light, creating a perfect space to relax or entertain guests. With two private cabins and a spacious salon, this yacht comfortably accommodates up to 16 guests, making it ideal for small groups seeking a private and luxurious Cabo yacht experience.

## INCLUSIONS

Your yacht rental includes:
- 3 hours (plus transportation time)
- Private round-trip transportation
- Bilingual & certified friendly crew
- Unlimited open bar (Rum, Tequila, Vodka, Beer, Juices, Sodas, Mixers, Water)
- Food menu (Ceviche, Mix fajitas, Guacamole, Pico de gallo, Chips, Fruit platter)
- Water toys (1 paddle board, Large floating mat, Complete snorkel gear, Life vests)

## PAPILLON EXPERIENCE

The Papillon Yachts experience is designed to create memorable moments on the Sea of Cortez. Whether you're looking for dolphin and whale spotting opportunities (seasonal), snorkeling in pristine waters, or simply relaxing with premium beverages and gourmet food, our experienced crew will ensure your yacht charter exceeds expectations.`,
    currentPrice: "$1,750",
    duration: "3 Hours",
    imageUrl: "/yachts/silverton-42/main.jpg",
    imageUrls: [
      "/yachts/silverton-42/image-1.jpg",
      "/yachts/silverton-42/image-2.jpg",
      "/yachts/silverton-42/image-3.jpg",
      "/yachts/silverton-42/image-4.jpg",
      "/yachts/silverton-42/image-5.jpg"
    ],
    minAge: "All Ages",
    provider: "Papillon Yachts",
    category: "yacht",
    keyFeatures: [
      "Air conditioned",
      "Main cabin",
      "Bathroom",
      "Interior living room",
      "Shaded back seating",
      "Sunbathing area",
      "Dining table",
      "Fly bridge",
      "Unlimited open bar",
      "Gourmet food included",
      "Private transportation",
      "Bilingual crew"
    ],
    thingsToBring: [
      "Towels",
      "Sunscreen",
      "Swimsuits",
      "Hats",
      "Sunglasses",
      "Phone to play music (optional)"
    ],
    topRecommended: true,
    rating: 5.0,
    specialInfo: "Extra guest: $80 USD per guest (max. capacity 16). Extra hour: $500 USD.",
    capacity: "Maximum 16 guests",
    specialDeal: "SPECIAL - 2 HOUR SUNSET CRUISE: FROM $1,200 USD FOR 1-8 GUESTS"
  };
  
  const images = [yacht.imageUrl, ...yacht.imageUrls];
  
  const formatPrice = (price: string) => {
    return price.replace(/\$([0-9,]+)/, '$$$1');
  };
  
  const renderRatingStars = (rating: number = 5) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < rating ? "text-yellow-500" : "text-gray-300"} 
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };
  
  const scheduleOptions = [
    { label: "Morning (9:00 AM - 12:00 PM)", value: "morning" },
    { label: "Afternoon (1:00 PM - 4:00 PM)", value: "afternoon" },
    { label: "Sunset (5:00 PM - 8:00 PM)", value: "sunset" }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>SILVERTON SPORT BRIDGE 42FT | Luxury Yacht Charter in Cabo San Lucas</title>
        <meta name="description" content="Charter the SILVERTON SPORT BRIDGE 42FT 'PURA VIDA' yacht in Cabo San Lucas for a luxurious private experience. Perfect for groups up to 16 with unlimited open bar and gourmet dining." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/adventures">Adventures</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/adventures/private-yachts">Yacht Rentals</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/adventures/silverton-sport-bridge-42">SILVERTON SPORT BRIDGE 42</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Yacht details */}
          <div className="lg:col-span-2">
            {/* Yacht title and rating */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{yacht.title}</h1>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <FaRegCalendarAlt className="mr-2" />
                  <span>{yacht.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{yacht.provider}</span>
                  {yacht.capacity && (
                    <>
                      <span className="mx-2">•</span>
                      <MdOutlinePeopleAlt className="mr-1" />
                      <span>{yacht.capacity}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {renderRatingStars(yacht.rating)}
                </div>
                <span className="text-lg font-semibold">{yacht.rating.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Special deal banner */}
            {yacht.specialDeal && (
              <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg shadow-md">
                <p className="font-semibold text-lg">{yacht.specialDeal}</p>
              </div>
            )}
            
            {/* Images gallery */}
            <div className="mb-8">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl mb-4">
                <img 
                  src={currentImage} 
                  alt={yacht.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`aspect-[4/3] overflow-hidden rounded-lg cursor-pointer border-2 ${img === currentImage ? 'border-blue-600' : 'border-transparent'}`}
                    onClick={() => setCurrentImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${yacht.title} - Image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Yacht description */}
            <div className="mb-8 prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">About This Yacht Charter</h2>
              <div className="text-gray-700">
                {yacht.description.split('\n\n').map((paragraph, idx) => (
                  paragraph.startsWith('##') ? (
                    <h3 key={idx} className="text-xl font-semibold mt-6 mb-3">
                      {paragraph.replace('##', '').trim()}
                    </h3>
                  ) : paragraph.includes('- ') ? (
                    <ul key={idx} className="list-disc pl-5 my-4 space-y-1">
                      {paragraph.split('\n').map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  )
                ))}
              </div>
            </div>
            
            {/* Key Features and What to Bring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaAnchor className="mr-2 text-blue-600" /> 
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {yacht.keyFeatures.map((feature, index) => {
                    // Select appropriate icon
                    let FeatureIcon = GiSailboat;
                    if (feature.toLowerCase().includes('bar') || feature.toLowerCase().includes('drink')) {
                      FeatureIcon = MdOutlineLocalBar;
                    } else if (feature.toLowerCase().includes('food') || feature.toLowerCase().includes('dining')) {
                      FeatureIcon = MdOutlineFoodBank;
                    } else if (feature.toLowerCase().includes('swim') || feature.toLowerCase().includes('snorkel')) {
                      FeatureIcon = FaSwimmer;
                    } else if (feature.toLowerCase().includes('sun') || feature.toLowerCase().includes('bathing')) {
                      FeatureIcon = FaUmbrellaBeach;
                    } else if (feature.toLowerCase().includes('transportation')) {
                      FeatureIcon = MdOutlineLocationOn;
                    } else if (feature.toLowerCase().includes('crew') || feature.toLowerCase().includes('bilingual')) {
                      FeatureIcon = MdOutlinePeopleAlt;
                    } else if (feature.toLowerCase().includes('air')) {
                      FeatureIcon = MdAir;
                    } else if (feature.toLowerCase().includes('bridge') || feature.toLowerCase().includes('fly')) {
                      FeatureIcon = GiShipWheel;
                    }
                    
                    return (
                      <li key={index} className="flex items-center">
                        <FeatureIcon className="text-blue-600 mr-2" />
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaRegClock className="mr-2 text-green-600" /> 
                  What to Bring
                </h3>
                <ul className="space-y-2">
                  {yacht.thingsToBring.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mb-12">
              <Tabs defaultValue="inclusions">
                <TabsList className="mb-6">
                  <TabsTrigger value="inclusions">What's Included</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="cancellation">Cancellation Policy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="inclusions" className="space-y-4">
                  <h3 className="text-xl font-semibold">Inclusions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <MdOutlineLocalBar className="text-blue-600 mr-3 mt-1 text-lg" />
                      <div>
                        <h4 className="font-medium">Premium Open Bar</h4>
                        <p className="text-sm text-gray-600">Unlimited beverages including rum, tequila, vodka, beer, juices, sodas, and water.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MdOutlineFoodBank className="text-blue-600 mr-3 mt-1 text-lg" />
                      <div>
                        <h4 className="font-medium">Gourmet Food</h4>
                        <p className="text-sm text-gray-600">Enjoy ceviche, mix fajitas, fresh guacamole, pico de gallo, chips, and a fruit platter.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MdOutlineLocationOn className="text-blue-600 mr-3 mt-1 text-lg" />
                      <div>
                        <h4 className="font-medium">Private Transportation</h4>
                        <p className="text-sm text-gray-600">Round-trip transportation from your hotel or villa in Cabo San Lucas.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaSwimmer className="text-blue-600 mr-3 mt-1 text-lg" />
                      <div>
                        <h4 className="font-medium">Water Activities Equipment</h4>
                        <p className="text-sm text-gray-600">Paddle board, floating mat, snorkel gear, and life vests included.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="activities" className="space-y-4">
                  <h3 className="text-xl font-semibold">Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                      <GiSnorkel className="text-3xl text-blue-600 mb-2" />
                      <h4 className="font-medium text-center">Snorkeling Tour</h4>
                      <p className="text-sm text-center text-gray-600">Explore vibrant marine life in the Sea of Cortez with provided snorkel gear.</p>
                    </div>
                    
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                      <FaAnchor className="text-3xl text-blue-600 mb-2" />
                      <h4 className="font-medium text-center">Visit to the Arch</h4>
                      <p className="text-sm text-center text-gray-600">See the iconic Arch of Cabo San Lucas and rock formations up close.</p>
                    </div>
                    
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                      <FaUmbrellaBeach className="text-3xl text-blue-600 mb-2" />
                      <h4 className="font-medium text-center">Beach Stops</h4>
                      <p className="text-sm text-center text-gray-600">Visit secluded beaches including Lover's Beach if conditions permit.</p>
                    </div>
                    
                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                      <GiSunset className="text-3xl text-blue-600 mb-2" />
                      <h4 className="font-medium text-center">Sunset Views</h4>
                      <p className="text-sm text-center text-gray-600">Experience breathtaking sunset views of the Cabo coastline (sunset tour only).</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cancellation" className="space-y-4">
                  <h3 className="text-xl font-semibold">Cancellation Policy</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 font-bold mr-2">•</span>
                        <p><span className="font-medium">Free cancellation:</span> Up to 48 hours before your charter time for a full refund.</p>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 font-bold mr-2">•</span>
                        <p><span className="font-medium">24-48 hours before:</span> 50% cancellation fee applies.</p>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 font-bold mr-2">•</span>
                        <p><span className="font-medium">Less than 24 hours:</span> No refund available for last-minute cancellations.</p>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">•</span>
                        <p><span className="font-medium">Weather policy:</span> If your charter is canceled due to unsafe weather conditions, you'll receive a full refund or the option to reschedule.</p>
                      </li>
                    </ul>
                    
                    <div className="mt-4 bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                      <p className="text-sm">
                        <span className="font-semibold">Important:</span> Gratuity is not included, and a 16% VAT tax applies to credit card payments. Cash payments are tax-free.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right column - Booking form */}
          <div id="book">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl border shadow-lg p-6">
                <div className="mb-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-bold">{formatPrice(yacht.currentPrice)}</h3>
                  </div>
                  <p className="text-sm text-gray-600">for 1-8 guests (3-hour charter)</p>
                </div>
                
                <Separator className="my-4" />
                
                <AdventureBookingForm 
                  adventureId={yacht.id.toString()}
                  adventureTitle={yacht.title}
                  adventureType="yacht"
                  price={yacht.currentPrice}
                  scheduleOptions={scheduleOptions}
                  depositAmount="800"
                  maxGuests={16}
                />
                
                {yacht.specialInfo && (
                  <div className="mt-4 bg-amber-50 p-3 rounded-lg text-sm text-amber-800 border border-amber-200">
                    <p>{yacht.specialInfo}</p>
                  </div>
                )}
                
                <div className="mt-6 flex items-center text-sm text-gray-600">
                  <FaGlassMartiniAlt className="text-blue-600 mr-2" />
                  <p>Special packages available for bachelor/bachelorette parties</p>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Link href="/yacht-policies" className="text-xs text-blue-600 hover:underline">
                    Read our yacht rental policies
                  </Link>
                </div>
              </div>
              
              {/* Support contact */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Need help booking?</p>
                  <p className="text-xs text-gray-600">Our concierge team is here to assist</p>
                </div>
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}