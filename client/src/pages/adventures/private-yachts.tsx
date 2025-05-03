import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { FaStar, FaRegCalendarAlt, FaAnchor, FaWineGlass, FaSwimmer, FaUmbrellaBeach, FaGlassMartiniAlt, FaWifi, FaMusic, FaUsers } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar, MdOutlinePeopleAlt, MdAir, MdSupportAgent } from 'react-icons/md';
import { GiSailboat, GiSpeedBoat, GiSunset, GiSnorkel, GiChampagneCork, GiCaptainHatProfile, GiLifeJacket } from 'react-icons/gi';
import { BiSpa } from 'react-icons/bi';
import { IoFishOutline } from 'react-icons/io5';
import { LuLifeBuoy } from 'react-icons/lu';
import { yachtTestimonials } from '@/data/testimonials';

interface Adventure {
  id: number;
  title: string;
  slug: string;
  description: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  duration: string;
  imageUrl: string;
  imageUrls: string[];
  minAge: string;
  provider?: string;
  category: string;
  keyFeatures: string[];
  thingsToBring: string[];
  topRecommended: boolean;
  rating?: number;
  featured: boolean;
  hidden?: boolean;
  maxGuests?: number;
}

const YachtAdventuresPage: React.FC = () => {
  const [yachtAdventures, setYachtAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);

  useEffect(() => {
    async function fetchYachtAdventures() {
      try {
        setLoading(true);
        const response = await fetch('/api/adventures');
        if (!response.ok) {
          throw new Error('Failed to fetch adventures');
        }
        
        const data = await response.json();
        // Filter adventures with category "yacht"
        const yachtData = data.filter((adventure: Adventure) => 
          adventure.category === 'yacht' && !adventure.hidden
        );
        
        // Add Express Bay Liner 35ft yacht
        const expressBayLiner = {
          id: 9999, // Use a high ID to avoid conflicts
          title: "EXPRESS BAY LINER 35FT",
          slug: "express-bay-liner-35ft",
          description: `Step aboard the Express Bay Liner 35ft, a luxurious yacht cruiser in Cabo designed for relaxation and adventure. This 35-foot beauty features spacious front bed seating, a stylish dining area, a fully equipped kitchen, bedroom, and bathroom, everything you need for a perfect day on the water. With an open bar and gourmet dining included, you can indulge while taking in the breathtaking views of Cabo San Lucas.`,
          currentPrice: "$990",
          originalPrice: "$1,100",
          duration: "3 Hours",
          imageUrl: "/yachts/express-bay-liner/main.jpg",
          imageUrls: [
            "/yachts/express-bay-liner/image-1.jpg",
            "/yachts/express-bay-liner/image-2.jpg",
            "/yachts/express-bay-liner/image-3.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "One bedroom",
            "One bathroom",
            "Interior dining table",
            "Shaded back seating with table",
            "Front seating/sun bathing area",
            "Unlimited open bar",
            "Food included",
            "Private transportation",
            "Certified crew",
            "Snorkel equipment"
          ],
          thingsToBring: [
            "Towels",
            "Sunscreen",
            "Swimsuits",
            "Hats",
            "Sunglasses"
          ],
          topRecommended: true,
          rating: 4.9,
          featured: true,
          hidden: false,
          maxGuests: 8
        };
        
        // Add Silverton Sport Bridge 42 yacht
        const silvertonSportBridge = {
          id: 9998,
          title: "SILVERTON SPORT BRIDGE 42FT",
          slug: "silverton-sport-bridge-42",
          description: `Discover Cabo San Lucas aboard our Silverton Sport Bridge 42ft yacht, perfect for groups seeking both luxury and adventure. This 42-foot vessel features two spacious bedrooms, two full bathrooms, a well-appointed living room, dining area, and kitchen. The flybridge offers breathtaking 360° views while the stern provides ultimate relaxation with ample seating. Dive into the crystal-clear waters for snorkeling or simply unwind on the comfortable sunbathing areas.`,
          currentPrice: "$1,250",
          originalPrice: "$1,500",
          duration: "3 Hours",
          imageUrl: "/yachts/silverton-42/main.jpg",
          imageUrls: [
            "/yachts/silverton-42/image-1.jpg",
            "/yachts/silverton-42/image-2.jpg",
            "/yachts/silverton-42/image-3.jpg",
            "/yachts/silverton-42/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Two bedrooms",
            "Two bathrooms",
            "Flybridge with 360° views",
            "Shaded back seating area",
            "Front sun lounging area",
            "Premium open bar",
            "Gourmet food included",
            "Private transportation",
            "Professional bilingual crew",
            "Snorkel equipment provided"
          ],
          thingsToBring: [
            "Towels",
            "Sunscreen",
            "Swimsuit",
            "Camera",
            "Light jacket (for evening charters)"
          ],
          topRecommended: true,
          rating: 5.0,
          featured: true,
          hidden: false,
          maxGuests: 12
        };
        
        // Add Sea Ray Sundancer 45 yacht
        const seaRaySundancer = {
          id: 9997,
          title: "SEA RAY SUNDANCER 45FT",
          slug: "sea-ray-sundancer-45",
          description: `Experience the perfect blend of performance and luxury aboard our Sea Ray Sundancer 45ft yacht. This sleek vessel offers elegant accommodations with two luxurious cabins, two bathrooms, a stylish salon, and a well-equipped galley. The spacious cockpit features comfortable seating and a wet bar, while the large swim platform provides easy ocean access. Whether you're hosting a celebration or enjoying a sunset cruise, this yacht delivers an unforgettable Cabo experience.`,
          currentPrice: "$1,350",
          originalPrice: "$1,600",
          duration: "3 Hours",
          imageUrl: "/yachts/sea-ray-45/main.jpg",
          imageUrls: [
            "/yachts/sea-ray-45/image-1.jpg",
            "/yachts/sea-ray-45/image-2.jpg",
            "/yachts/sea-ray-45/image-3.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Two luxury cabins",
            "Two bathrooms", 
            "Elegantly appointed salon",
            "Spacious cockpit with seating",
            "Large swim platform",
            "Premium open bar",
            "Gourmet catering",
            "Private round-trip transportation",
            "Professional crew",
            "Water toys and snorkeling gear"
          ],
          thingsToBring: [
            "Beach towel",
            "Reef-safe sunscreen",
            "Swimsuit",
            "Sunglasses",
            "Hat or cap"
          ],
          topRecommended: true,
          rating: 4.8,
          featured: true,
          hidden: false,
          maxGuests: 15
        };
        
        // Add Sunseeker 80 Savi yacht
        const sunseeker80 = {
          id: 9996,
          title: "SUNSEEKER 80 SAVI",
          slug: "sunseeker-80-savi",
          description: `Indulge in the ultimate luxury aboard our magnificent Sunseeker 80 Savi yacht. This 80-foot masterpiece features four lavish staterooms, each with ensuite bathrooms, a grand salon with panoramic windows, formal dining area, and a state-of-the-art entertainment system. The flybridge offers a jacuzzi, bar, and alfresco dining space, while the spacious deck areas provide multiple lounging options. With a professional crew including a private chef, experience the pinnacle of yachting excellence in Cabo San Lucas.`,
          currentPrice: "$4,500",
          originalPrice: "$5,000",
          duration: "4 Hours",
          imageUrl: "/yachts/sunseeker-80/main.jpg",
          imageUrls: [
            "/yachts/sunseeker-80/image-1.jpg",
            "/yachts/sunseeker-80/image-2.jpg",
            "/yachts/sunseeker-80/image-3.jpg",
            "/yachts/sunseeker-80/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Four luxury staterooms with ensuite bathrooms",
            "Jacuzzi on flybridge",
            "Multiple outdoor lounging areas",
            "Formal indoor dining",
            "Alfresco dining options",
            "Premium open bar with signature cocktails",
            "Private chef and gourmet cuisine",
            "Luxury transportation",
            "Professional crew of 4",
            "Water toys including jet skis and SeaBobs"
          ],
          thingsToBring: [
            "Swimwear",
            "Cover-ups",
            "Sun protection",
            "Camera",
            "Casual evening attire (for sunset cruises)"
          ],
          topRecommended: true,
          rating: 5.0,
          featured: true,
          hidden: false,
          maxGuests: 25
        };
        
        // Add Azimut 95 yacht
        const azimut95 = {
          id: 9995,
          title: "AZIMUT 95FT LUXURY YACHT",
          slug: "azimut-95",
          description: `Elevate your Cabo experience aboard our spectacular Azimut 95ft luxury yacht. This Italian-crafted masterpiece features five sumptuous staterooms, elegantly designed living spaces, and expansive deck areas for entertainment. The flybridge includes a jacuzzi, bar, and dining area with breathtaking panoramic views. The aft deck offers alfresco dining while the foredeck provides sun loungers for private sunbathing. With a professional crew including a captain, stewardess, and chef, enjoy impeccable service throughout your journey.`,
          currentPrice: "$4,900",
          originalPrice: "$5,500",
          duration: "3 Hours",
          imageUrl: "/yachts/azimut-95/main.jpg",
          imageUrls: [
            "/yachts/azimut-95/image-1.jpg",
            "/yachts/azimut-95/image-2.jpg",
            "/yachts/azimut-95/image-3.jpg",
            "/yachts/azimut-95/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Five luxury staterooms",
            "Jacuzzi on flybridge",
            "Multiple entertainment areas",
            "Interior and exterior dining options",
            "Premium sound system",
            "Top-shelf open bar",
            "Gourmet chef on board",
            "VIP transportation",
            "Professional crew of 5",
            "Water toys and snorkeling equipment"
          ],
          thingsToBring: [
            "Swimwear",
            "Light clothing",
            "Sunscreen",
            "Sunglasses",
            "Camera"
          ],
          topRecommended: true,
          rating: 5.0,
          featured: true,
          hidden: false,
          maxGuests: 30
        };
        
        // Add Patron Ferretti 88 yacht
        const patronFerretti88 = {
          id: 9994,
          title: "PATRON FERRETTI 88FT",
          slug: "patron-ferretti-88",
          description: `Experience unparalleled luxury aboard our Patron Ferretti 88ft yacht. This magnificent vessel offers four elegant cabins including a full-beam master suite, a sophisticated salon with panoramic windows, formal dining area, and a high-end entertainment system. The generous flybridge features a jacuzzi, bar, and dining options, while the aft deck provides comfortable seating for alfresco entertaining. With a dedicated crew of five including a private chef, immerse yourself in the ultimate Cabo San Lucas yachting experience.`,
          currentPrice: "$4,500",
          originalPrice: "$5,200",
          duration: "3 Hours",
          imageUrl: "/yachts/patron-ferretti-88/main.jpg",
          imageUrls: [
            "/yachts/patron-ferretti-88/image-1.jpg",
            "/yachts/patron-ferretti-88/image-2.jpg",
            "/yachts/patron-ferretti-88/image-3.jpg",
            "/yachts/patron-ferretti-88/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Four luxury cabins including master suite",
            "Jacuzzi on flybridge",
            "Indoor and outdoor dining areas",
            "Full-service bar with premium spirits",
            "High-end audio system",
            "Gourmet chef and custom menus",
            "Luxury transportation to and from your resort",
            "Professional crew of 5",
            "Snorkeling equipment and water toys",
            "Swimming platform with shower"
          ],
          thingsToBring: [
            "Bathing suit",
            "Sunscreen",
            "Hat",
            "Light jacket (for evening cruises)",
            "Camera"
          ],
          topRecommended: true,
          rating: 5.0,
          featured: true,
          hidden: false,
          maxGuests: 25
        };
        
        // Add Papillon Catamaran 47
        const papillonCatamaran47 = {
          id: 9993,
          title: "PAPILLON CATAMARAN 47FT",
          slug: "papillon-catamaran-47",
          description: `Discover the perfect blend of adventure and comfort aboard our Papillon Catamaran 47ft. This spacious sailing catamaran provides exceptional stability and generous deck space ideal for socializing and sunbathing. The vessel features two double cabins, two bathrooms, a comfortable salon, and a well-equipped galley. The expansive net at the bow offers a unique lounging experience directly above the crystal waters of Cabo. Perfect for day trips to secluded beaches, snorkeling adventures, or romantic sunset cruises.`,
          currentPrice: "$990",
          originalPrice: "$1,200",
          duration: "3 Hours",
          imageUrl: "/yachts/papillon-catamaran-47/main.jpg",
          imageUrls: [
            "/yachts/papillon-catamaran-47/image-1.jpg",
            "/yachts/papillon-catamaran-47/image-2.jpg",
            "/yachts/papillon-catamaran-47/image-3.jpg",
            "/yachts/papillon-catamaran-47/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Two cabins with double beds",
            "Two bathrooms",
            "Comfortable salon area",
            "Spacious front net for sunbathing",
            "Shaded cockpit with seating",
            "Open bar with domestic drinks",
            "Fresh lunch or appetizers",
            "Professional crew",
            "Snorkeling equipment",
            "Great stability - perfect for those prone to seasickness"
          ],
          thingsToBring: [
            "Towel",
            "Biodegradable sunscreen",
            "Swimwear",
            "Hat",
            "Light jacket for wind protection"
          ],
          topRecommended: true,
          rating: 4.9,
          featured: true,
          hidden: false,
          maxGuests: 18
        };
        
        // Add Lagoon 65 Catamaran
        const lagoon65 = {
          id: 9992,
          title: "LAGOON 65 LUXURY CATAMARAN",
          slug: "lagoon-65",
          description: `Experience the epitome of catamaran luxury aboard our Lagoon 65. This premium sailing catamaran offers exceptional space with four ensuite cabins, a spacious salon with panoramic views, a fully equipped galley, and multiple outdoor lounging areas. The flybridge provides additional seating with breathtaking 360° vistas, while the forward cockpit offers a perfect setting for cocktails and conversation. The stable and comfortable design ensures a smooth journey whether you're cruising, swimming, or enjoying gourmet cuisine prepared by your onboard chef.`,
          currentPrice: "$3,200",
          originalPrice: "$3,600",
          duration: "4 Hours",
          imageUrl: "/yachts/lagoon-65/main.jpg",
          imageUrls: [
            "/yachts/lagoon-65/image-1.jpg",
            "/yachts/lagoon-65/image-2.jpg",
            "/yachts/lagoon-65/image-3.jpg",
            "/yachts/lagoon-65/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Four luxury cabins with ensuite bathrooms",
            "Flybridge with additional seating and views",
            "Forward cockpit lounge area",
            "Spacious main salon with panoramic windows",
            "Aft cockpit dining area",
            "Premium open bar service",
            "Gourmet catering with customizable menu",
            "Professional crew including captain and chef",
            "Water toys and snorkeling gear",
            "Bluetooth sound system throughout"
          ],
          thingsToBring: [
            "Swimwear",
            "Towels",
            "Reef-safe sunscreen",
            "Sunglasses",
            "Light clothing"
          ],
          topRecommended: true,
          rating: 5.0,
          featured: true,
          hidden: false,
          maxGuests: 25
        };
        
        // Add Leopard Catamaran
        const leopardCatamaran = {
          id: 9991,
          title: "LEOPARD CATAMARAN",
          slug: "leopard-catamaran",
          description: `Set sail on our premium Leopard Catamaran for an unforgettable Cabo adventure. This exceptional vessel offers a perfect balance of performance and comfort with three private cabins, three bathrooms, a modern salon with entertainment system, and a well-appointed galley. The spacious outdoor areas include a covered cockpit for alfresco dining, a flybridge for panoramic views, and a forward lounge with trampolines for sunbathing. The stable double-hull design ensures a smooth, comfortable ride even in varied sea conditions.`,
          currentPrice: "$1,890",
          originalPrice: "$2,200",
          duration: "3 Hours",
          imageUrl: "/yachts/leopard/main.jpg",
          imageUrls: [
            "/yachts/leopard/image-1.jpg",
            "/yachts/leopard/image-2.jpg",
            "/yachts/leopard/image-3.jpg",
            "/yachts/leopard/image-4.jpg"
          ],
          minAge: "All Ages",
          provider: "Papillon Yachts",
          category: "yacht",
          keyFeatures: [
            "Three private cabins",
            "Three bathrooms",
            "Forward lounge with trampolines",
            "Covered cockpit for dining",
            "Flybridge seating area",
            "Premium open bar",
            "Fresh gourmet meals and snacks",
            "Experienced captain and crew",
            "Snorkeling equipment",
            "Bluetooth sound system"
          ],
          thingsToBring: [
            "Large net for sunbathing",
            "Unlimited open bar"
          ],
          topRecommended: true,
          rating: 5.0,
          featured: true,
          hidden: false,
          maxGuests: 35
        };

        // Add our custom yachts to the beginning of the array
        setYachtAdventures([
          expressBayLiner, 
          silvertonSportBridge, 
          seaRaySundancer, 
          sunseeker80, 
          azimut95, 
          patronFerretti88, 
          papillonCatamaran47, 
          lagoon65, 
          leopardCatamaran, 
          ...yachtData
        ]);
      } catch (error) {
        console.error('Error fetching yacht adventures:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchYachtAdventures();
  }, []);

  // Function to open the image modal
  const openImageModal = (imageUrl: string, adventure: Adventure) => {
    setSelectedImage(imageUrl);
    setSelectedAdventure(adventure);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedAdventure(null);
  };

  // Function to navigate to the next image in the modal
  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedAdventure || !selectedImage) return;
    
    const allImages = [selectedAdventure.imageUrl, ...(selectedAdventure.imageUrls || [])];
    const currentIndex = allImages.indexOf(selectedImage);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % allImages.length;
    } else {
      newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    }
    
    setSelectedImage(allImages[newIndex]);
  };

  // Helper function to render star ratings
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Luxury Yacht Charters in Cabo San Lucas | Private Boats & Catamarans</title>
        <meta name="description" content="Experience the ultimate luxury with our private yacht charters in Cabo San Lucas. Choose from motor yachts and sailing catamarans for the perfect ocean adventure." />
        <meta name="keywords" content="yacht rental cabo, private yacht charter, luxury yachts cabo san lucas, catamaran rental, sunset cruise, private boat tour, cabo yacht experience" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-[60vh] md:h-[70vh] overflow-hidden">
          <img 
            src="/yachts/azimut-yacht-main.jpg" 
            alt="Luxury Yacht Charter in Cabo San Lucas" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6 md:p-12">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Luxury Yacht Charters in Cabo
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-3xl">
                Experience the breathtaking Sea of Cortez on a private luxury yacht
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Main yacht listings (full width) */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Available Yacht Charters</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : yachtAdventures.length === 0 ? (
              <p className="text-gray-600 py-8">No yacht adventures available at this time.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center mb-6 space-x-2">
                  <span className="text-gray-700 font-medium">Sort by:</span>
                  <button 
                    onClick={() => setYachtAdventures([...yachtAdventures].sort((a, b) => (b.rating || 0) - (a.rating || 0)))}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                  >
                    Top Rated
                  </button>
                  <button 
                    onClick={() => setYachtAdventures([...yachtAdventures].sort((a, b) => parseInt(b.currentPrice.replace(/[^\d]/g, '')) - parseInt(a.currentPrice.replace(/[^\d]/g, ''))))}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                  >
                    Highest Price
                  </button>
                  <button 
                    onClick={() => setYachtAdventures([...yachtAdventures].sort((a, b) => parseInt(a.currentPrice.replace(/[^\d]/g, '')) - parseInt(b.currentPrice.replace(/[^\d]/g, ''))))}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                  >
                    Lowest Price
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {yachtAdventures.map((adventure) => (
                    <div key={adventure.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      {/* Yacht Image - Larger, full-width image */}
                      <Link to={`/adventures/${adventure.slug}`} className="block">
                        <div className="relative h-80 md:h-96 w-full">
                          <img 
                            src={adventure.imageUrl} 
                            alt={adventure.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {adventure.topRecommended && (
                            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                              Top Rated
                            </div>
                          )}
                          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            +{adventure.imageUrls?.length || 0} photos
                          </div>
                        </div>
                      </Link>
                      
                      {/* Yacht Details - Now below the image */}
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {adventure.title}
                          </h3>
                          {adventure.rating && (
                            <div className="flex items-center">
                              {renderRatingStars(adventure.rating)}
                              <span className="ml-1 text-sm text-gray-600">{adventure.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <FaRegCalendarAlt className="mr-2" />
                          <span>{adventure.duration}</span>
                          {adventure.provider && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{adventure.provider}</span>
                            </>
                          )}
                          {adventure.maxGuests && (
                            <>
                              <span className="mx-2">•</span>
                              <FaUsers className="mr-1" />
                              <span>Up to {adventure.maxGuests} guests</span>
                            </>
                          )}
                        </div>
                        

                        
                        {/* Price and CTA */}
                        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-blue-700">{adventure.currentPrice}</span>
                            </div>
                            <p className="text-xs text-gray-500">per charter</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/adventures/${adventure.slug}`} className="inline-block bg-white text-blue-600 border border-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                              View Details
                            </Link>
                            <Link to={`/adventures/${adventure.slug}#book`} className="inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Why Book a Yacht in Cabo - Full Width */}
          <div className="bg-blue-50 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Book a Yacht in Cabo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                <FaAnchor className="text-blue-600 text-3xl mb-3" />
                <h4 className="font-bold text-lg text-gray-900 mb-2">Exclusive Experience</h4>
                <p className="text-gray-700">Enjoy privacy and luxury with your own private yacht charter, away from crowded beaches and tourist spots.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                <GiSunset className="text-blue-600 text-3xl mb-3" />
                <h4 className="font-bold text-lg text-gray-900 mb-2">Spectacular Views</h4>
                <p className="text-gray-700">Witness the famous Arch of Cabo San Lucas, pristine beaches, and dramatic cliff formations from the water.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                <MdOutlineFoodBank className="text-blue-600 text-3xl mb-3" />
                <h4 className="font-bold text-lg text-gray-900 mb-2">Gourmet Dining</h4>
                <p className="text-gray-700">Savor fresh, chef-prepared meals and appetizers while enjoying the stunning marine landscape.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                <MdOutlineLocalBar className="text-blue-600 text-3xl mb-3" />
                <h4 className="font-bold text-lg text-gray-900 mb-2">Premium Open Bar</h4>
                <p className="text-gray-700">Enjoy unlimited premium drinks and cocktails prepared by your personal bartender onboard.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                <FaSwimmer className="text-blue-600 text-3xl mb-3" />
                <h4 className="font-bold text-lg text-gray-900 mb-2">Water Activities</h4>
                <p className="text-gray-700">Access exclusive snorkeling spots, paddle boards, and other water toys for an unforgettable ocean adventure.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                <MdSupportAgent className="text-blue-600 text-3xl mb-3" />
                <h4 className="font-bold text-lg text-gray-900 mb-2">Professional Crew</h4>
                <p className="text-gray-700">Our certified, bilingual crew ensures your experience is safe, comfortable, and tailored to your preferences.</p>
              </div>
            </div>
          </div>
          
          {/* Customer Testimonials - Full Width */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Customers Say</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yachtTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <div className="flex items-center mb-3">
                    {renderRatingStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-500 text-xs">{testimonial.location}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Section - Full Width */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-2">What types of yacht charters do you offer?</h4>
                <p className="text-gray-700 mb-6">We offer motor yacht and sailing catamaran charters ranging from 3 hours to full-day experiences. Options include sunset cruises, snorkeling excursions, private events, and custom itineraries.</p>
                
                <h4 className="font-bold text-lg mb-2">What's included in a yacht charter?</h4>
                <p className="text-gray-700 mb-6">Our yacht charters typically include an experienced captain and crew, open bar service, food (ranging from snacks to gourmet meals depending on vessel), snorkeling equipment, and round-trip transportation from your accommodation.</p>
                
                <h4 className="font-bold text-lg mb-2">Can we customize our itinerary?</h4>
                <p className="text-gray-700 mb-6">Absolutely! While we have suggested routes, your captain can customize the experience based on your preferences, whether that's seeking wildlife, visiting secluded beaches, or focusing on photography opportunities.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-2">How many people can join a yacht charter?</h4>
                <p className="text-gray-700 mb-6">Our vessels accommodate anywhere from 8 to 35 guests depending on the yacht. We offer options for intimate gatherings, family outings, or corporate events.</p>
                
                <h4 className="font-bold text-lg mb-2">What should I bring on a yacht charter?</h4>
                <p className="text-gray-700 mb-6">We recommend bringing a bathing suit, towel, biodegradable sunscreen, hat, sunglasses, light jacket (for evening charters), and a camera. All other essentials are provided onboard.</p>
                
                <h4 className="font-bold text-lg mb-2">How do I book a yacht charter?</h4>
                <p className="text-gray-700 mb-6">Simply select your preferred yacht, choose a date and time, and complete the booking form. A 50% deposit is required to secure your reservation, with the balance due on the day of your charter.</p>
              </div>
            </div>
          </div>
          
          {/* Final CTA - Full Width */}
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src="/yachts/azimut-yacht-3.jpg"
              alt="Sunset yacht charter in Cabo"
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-3xl font-bold text-white mb-4">Ready for an Unforgettable Adventure?</h3>
              <p className="text-xl text-white mb-6 max-w-2xl">Book your private yacht charter today and create memories that will last a lifetime</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="#" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  View All Yachts
                </Link>
                <Link to="#" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact a Specialist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Gallery Modal */}
      {selectedImage && selectedAdventure && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4 md:p-8">
          <button 
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-xl bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black"
          >
            ✕
          </button>
          
          <div className="relative w-full max-w-4xl">
            <img 
              src={selectedImage} 
              alt={selectedAdventure.title} 
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            
            <button 
              onClick={() => navigateImage('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black"
            >
              ←
            </button>
            
            <button 
              onClick={() => navigateImage('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black"
            >
              →
            </button>
            
            <div className="mt-4 flex justify-between items-center">
              <h4 className="text-white text-xl font-bold">{selectedAdventure.title}</h4>
              <Link 
                to={`/adventures/${selectedAdventure.slug}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={closeImageModal}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YachtAdventuresPage;
