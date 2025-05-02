import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { FaStar, FaRegCalendarAlt, FaAnchor, FaWineGlass, FaSwimmer, FaUmbrellaBeach, FaGlassMartiniAlt, FaWifi, FaMusic } from 'react-icons/fa';
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
        
        setYachtAdventures(yachtData);
      } catch (error) {
        console.error('Error fetching yacht adventures:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchYachtAdventures();
  }, []);

  const openImageModal = (imageUrl: string, adventure: Adventure) => {
    setSelectedImage(imageUrl);
    setSelectedAdventure(adventure);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedAdventure(null);
    document.body.style.overflow = 'auto';
  };

  // Function to render rating stars
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

  // Function to extract first paragraph from description
  const getShortDescription = (description: string) => {
    const firstParagraph = description.split('\n\n')[0];
    return firstParagraph.length > 150 
      ? firstParagraph.substring(0, 150) + '...' 
      : firstParagraph;
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Luxury Yacht Charters & Rentals in Cabo San Lucas | Private Yachts Experiences</title>
        <meta name="description" content="Experience the ultimate luxury with private yacht charters in Cabo San Lucas. Choose from premium yachts and catamarans for sunset cruises, day trips, and exclusive events." />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main yacht listings (2/3 width) */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Available Yacht Charters</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : yachtAdventures.length === 0 ? (
              <p className="text-gray-600 py-8">No yacht adventures available at this time.</p>
            ) : (
              <div className="space-y-8">
                {yachtAdventures.map((adventure) => (
                  <div key={adventure.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      {/* Yacht Image */}
                      <div className="md:col-span-1 relative h-64 md:h-full cursor-pointer" onClick={() => openImageModal(adventure.imageUrl, adventure)}>
                        <img 
                          src={adventure.imageUrl} 
                          alt={adventure.title} 
                          className="w-full h-full object-cover"
                        />
                        {adventure.topRecommended && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Top Rated
                          </div>
                        )}
                        {adventure.discount && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {adventure.discount}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          +{adventure.imageUrls?.length || 0} photos
                        </div>
                      </div>
                      
                      {/* Yacht Details */}
                      <div className="md:col-span-2 p-5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
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
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {getShortDescription(adventure.description)}
                        </p>
                        
                        {/* Key Features with Icons */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {adventure.keyFeatures?.slice(0, 4).map((feature, index) => {
                              // Select appropriate icon based on feature content
                              let FeatureIcon = GiSailboat; // Default icon
                              if (feature.toLowerCase().includes('bar') || feature.toLowerCase().includes('drink')) {
                                FeatureIcon = MdOutlineLocalBar;
                              } else if (feature.toLowerCase().includes('food') || feature.toLowerCase().includes('meal') || feature.toLowerCase().includes('dining')) {
                                FeatureIcon = MdOutlineFoodBank;
                              } else if (feature.toLowerCase().includes('captain') || feature.toLowerCase().includes('crew')) {
                                FeatureIcon = GiCaptainHatProfile;
                              } else if (feature.toLowerCase().includes('swim') || feature.toLowerCase().includes('snorkel')) {
                                FeatureIcon = FaSwimmer;
                              } else if (feature.toLowerCase().includes('music') || feature.toLowerCase().includes('sound')) {
                                FeatureIcon = FaMusic;
                              } else if (feature.toLowerCase().includes('people') || feature.toLowerCase().includes('passenger') || feature.toLowerCase().includes('guest')) {
                                FeatureIcon = MdOutlinePeopleAlt;
                              } else if (feature.toLowerCase().includes('wifi')) {
                                FeatureIcon = FaWifi;
                              } else if (feature.toLowerCase().includes('air conditioning') || feature.toLowerCase().includes('climate')) {
                                FeatureIcon = MdAir;
                              } else if (feature.toLowerCase().includes('fishing')) {
                                FeatureIcon = IoFishOutline;
                              } else if (feature.toLowerCase().includes('champagne') || feature.toLowerCase().includes('wine')) {
                                FeatureIcon = GiChampagneCork;
                              } else if (feature.toLowerCase().includes('jacuzzi') || feature.toLowerCase().includes('spa')) {
                                FeatureIcon = BiSpa;
                              } else if (feature.toLowerCase().includes('safety') || feature.toLowerCase().includes('life')) {
                                FeatureIcon = GiLifeJacket;
                              } else if (feature.toLowerCase().includes('support') || feature.toLowerCase().includes('assistance')) {
                                FeatureIcon = MdSupportAgent;
                              } else if (feature.toLowerCase().includes('beach')) {
                                FeatureIcon = FaUmbrellaBeach;
                              } else if (feature.toLowerCase().includes('luxury') || feature.toLowerCase().includes('premium')) {
                                FeatureIcon = FaGlassMartiniAlt;
                              } else if (feature.toLowerCase().includes('speed') || feature.toLowerCase().includes('fast')) {
                                FeatureIcon = GiSpeedBoat;
                              }
                              
                              return (
                                <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                  <FeatureIcon className="h-3.5 w-3.5" />
                                  {feature}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Price and CTA */}
                        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-blue-700">{adventure.currentPrice}</span>
                              {adventure.originalPrice && (
                                <span className="ml-2 text-sm text-gray-500 line-through">{adventure.originalPrice}</span>
                              )}
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
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar (1/3 width) */}
          <div className="lg:col-span-1">
            {/* Why Book a Yacht in Cabo */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Book a Yacht in Cabo</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaAnchor className="text-blue-600 mt-1 mr-3 text-lg" />
                  <div>
                    <h4 className="font-medium text-gray-900">Exclusive Experience</h4>
                    <p className="text-sm text-gray-700">Enjoy privacy and luxury with your own private yacht charter, away from crowded beaches and tourist spots.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <GiSunset className="text-blue-600 mt-1 mr-3 text-lg" />
                  <div>
                    <h4 className="font-medium text-gray-900">Spectacular Views</h4>
                    <p className="text-sm text-gray-700">Witness the famous Arch of Cabo San Lucas, pristine beaches, and dramatic cliff formations from the water.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdOutlineFoodBank className="text-blue-600 mt-1 mr-3 text-lg" />
                  <div>
                    <h4 className="font-medium text-gray-900">Gourmet Dining</h4>
                    <p className="text-sm text-gray-700">Savor fresh, chef-prepared meals and appetizers while enjoying the stunning marine landscape.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdOutlineLocalBar className="text-blue-600 mt-1 mr-3 text-lg" />
                  <div>
                    <h4 className="font-medium text-gray-900">Premium Open Bar</h4>
                    <p className="text-sm text-gray-700">Enjoy unlimited premium drinks and cocktails prepared by your personal bartender onboard.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaSwimmer className="text-blue-600 mt-1 mr-3 text-lg" />
                  <div>
                    <h4 className="font-medium text-gray-900">Water Activities</h4>
                    <p className="text-sm text-gray-700">Access exclusive snorkeling spots, paddle boards, and other water toys for an unforgettable ocean adventure.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Testimonials */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What Our Customers Say</h3>
              
              <div className="space-y-5">
                {yachtTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      {renderRatingStars(testimonial.rating)}
                    </div>
                    <p className="text-sm text-gray-700 italic mb-2">"{testimonial.comment}"</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-500 text-xs">{testimonial.location}</p>
                      </div>
                      <span className="text-xs text-gray-500">{testimonial.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Best Time to Visit */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Best Time for Yacht Charter</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="font-medium">December - April</span>
                  <span className="text-sm text-green-600 font-medium">Whale Season</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="font-medium">May - July</span>
                  <span className="text-sm text-blue-600 font-medium">Perfect Weather</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="font-medium">August - November</span>
                  <span className="text-sm text-orange-600 font-medium">Less Crowded</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Year-round</span>
                  <span className="text-sm text-purple-600 font-medium">Sunset Cruises</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SEO Content Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Experience Luxury at Sea in Cabo San Lucas</h2>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Cabo San Lucas offers some of the most breathtaking coastal scenery in Mexico, and there's no better way to experience it than aboard a private luxury yacht. Our fleet of premium yachts provides the perfect setting for unforgettable celebrations, romantic getaways, family gatherings, or corporate events.
            </p>
            
            <p>
              Each yacht charter includes a professional captain and crew dedicated to ensuring your experience exceeds expectations. From the moment you step aboard, you'll be treated to exceptional service, gourmet cuisine, premium beverages, and access to the best snorkeling locations and marine wildlife viewing opportunities.
            </p>
            
            <p>
              The calm, crystal-clear waters of the Sea of Cortez offer perfect conditions for yacht charters throughout the year. During winter months (December to April), you might spot humpback whales, while year-round you'll likely encounter dolphins, sea lions, manta rays, and tropical fish during your yacht adventure.
            </p>
            
            <h3>Yacht Charter Options in Cabo San Lucas</h3>
            
            <p>
              We offer multiple yacht charter options to suit your preferences:
            </p>
            
            <ul>
              <li><strong>Half-Day Charters (4 hours):</strong> Perfect for a morning or afternoon excursion around Cabo's iconic landmarks.</li>
              <li><strong>Full-Day Charters (8 hours):</strong> Explore more remote locations with time for multiple swimming and snorkeling stops.</li>
              <li><strong>Sunset Cruises (2.5 hours):</strong> Witness Cabo's legendary sunsets with cocktails and appetizers on the water.</li>
              <li><strong>Custom Charters:</strong> Celebrate special occasions with a customized itinerary tailored to your group's interests.</li>
            </ul>
            
            <p>
              All yacht charters include premium open bar, snorkeling equipment, water toys, Bluetooth sound system, and attentive crew service. Catering options range from light appetizers to full gourmet meals prepared by experienced chefs.
            </p>
            
            <h3>Popular Yacht Routes in Cabo</h3>
            
            <p>
              Our yacht charters typically explore these spectacular locations:
            </p>
            
            <ul>
              <li><strong>Lands End & The Arch:</strong> See Cabo's most iconic landmark up close, with stops at Lover's Beach and Pelican Rock for swimming.</li>
              <li><strong>Santa Maria & Chileno Bay:</strong> Visit these protected marine sanctuaries offering Cabo's best snorkeling experiences.</li>
              <li><strong>Cabo Pulmo National Marine Park:</strong> For full-day charters, explore this UNESCO-protected coral reef system with exceptional marine diversity.</li>
            </ul>
            
            <p>
              Each charter is customizable to your interests, whether you prefer more time for swimming, relaxing on deck, or exploring Cabo's coastline.
            </p>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions About Yacht Charters</h3>
            
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-2">How many people can join a yacht charter?</h4>
                <p className="text-gray-700">Our yacht capacities range from 6 to 25 passengers depending on the vessel. The Azimut 68ft can accommodate up to 16 guests comfortably.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-2">What's included in the yacht charter price?</h4>
                <p className="text-gray-700">All charters include: professional captain and crew, premium open bar, snorkeling equipment, water toys, Bluetooth sound system, and fuel. Food options range from light appetizers to gourmet meals depending on the package selected.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-2">How far in advance should I book?</h4>
                <p className="text-gray-700">We recommend booking at least 2-3 weeks in advance during regular season and 1-2 months ahead for peak season (December-April) to secure your preferred date and yacht.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-2">What should I bring on a yacht charter?</h4>
                <p className="text-gray-700">We recommend bringing swimwear, towel, sunscreen, sunglasses, camera, and a light jacket for evening cruises. Everything else is provided onboard.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-2">Can I customize my yacht charter experience?</h4>
                <p className="text-gray-700">Absolutely! We can customize every aspect of your charter including route, duration, catering options, and special occasion celebrations. Just let us know your preferences when booking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full">
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                closeImageModal();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative">
              <img 
                src={selectedImage} 
                alt={selectedAdventure?.title || 'Yacht image'} 
                className="w-full h-auto object-contain max-h-[80vh]"
              />
              
              {selectedAdventure && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                  <h3 className="text-xl font-bold">{selectedAdventure.title}</h3>
                  {selectedAdventure.provider && (
                    <p className="text-sm">{selectedAdventure.provider}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {selectedAdventure?.imageUrls && selectedAdventure.imageUrls.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
                <div 
                  className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 ${selectedImage === selectedAdventure.imageUrl ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedAdventure.imageUrl);
                  }}
                >
                  <img src={selectedAdventure.imageUrl} alt="Main" className="w-full h-full object-cover" />
                </div>
                
                {selectedAdventure.imageUrls.map((img, index) => (
                  <div 
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(img);
                    }}
                  >
                    <img src={img} alt={`Yacht view ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Cabo from the Water?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Book your luxury yacht charter today and create unforgettable memories on the beautiful Sea of Cortez.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Contact Us
            </Link>
            <Link to={yachtAdventures.length > 0 ? `/adventures/${yachtAdventures[0]?.slug}#book` : '/adventures'} className="bg-transparent text-white border-2 border-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YachtAdventuresPage;