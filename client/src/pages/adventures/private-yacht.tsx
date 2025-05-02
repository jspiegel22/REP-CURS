import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { FaStar, FaRegCalendarAlt, FaAnchor, FaWineGlass, FaSwimmer, FaUmbrellaBeach } from 'react-icons/fa';
import { MdOutlineFoodBank, MdOutlineLocalBar } from 'react-icons/md';
import { GiSailboat, GiSpeedBoat, GiSunset } from 'react-icons/gi';
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
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
                        
                        {/* Key Features */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {adventure.keyFeatures?.slice(0, 4).map((feature, index) => (
                              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
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
              Cabo San Lucas, located at the southern tip of Mexico's Baja California Peninsula, is renowned for its crystal-clear waters, dramatic coastal landscapes, and exceptional marine life. There's no better way to experience the beauty of this region than aboard a private luxury yacht charter.
            </p>
            
            <p>
              The Sea of Cortez, often called "The Aquarium of the World" by Jacques Cousteau, offers some of the most biodiverse marine ecosystems on the planet. From December through April, witness the magnificent humpback whales as they migrate to the warm waters of Cabo. Year-round, you might spot dolphins, sea lions, manta rays, and tropical fish during your yacht adventure.
            </p>
            
            <h3>Unforgettable Yacht Experiences in Cabo</h3>
            
            <p>
              Whether you're seeking a romantic sunset cruise, a full-day excursion with family and friends, or a special celebration event, Cabo's yacht charter options cater to every occasion. Professional crews ensure your safety while providing exceptional service, from mixing your favorite cocktails to preparing fresh gourmet meals onboard.
            </p>
            
            <p>
              Most yacht charters include premium open bars, gourmet food, snorkeling equipment, and water toys like paddle boards and floating mats. Many vessels feature luxurious amenities such as air-conditioned cabins, spacious sun decks, and premium sound systems for the ultimate day at sea.
            </p>
            
            <h3>Popular Yacht Routes in Cabo</h3>
            
            <ul>
              <li><strong>Land's End and Arch Tour:</strong> Cruise around the famous Arch of Cabo San Lucas (El Arco) and see Lover's Beach, Divorce Beach, and the sea lion colony.</li>
              <li><strong>Santa Maria and Chileno Bays:</strong> Explore these protected marine sanctuaries known for exceptional snorkeling opportunities.</li>
              <li><strong>Sunset Cruise:</strong> Experience the breathtaking Cabo sunset while enjoying champagne and appetizers.</li>
              <li><strong>Cabo Pulmo Marine Park:</strong> For full-day charters, visit this UNESCO World Heritage site that features one of the oldest coral reefs in North America.</li>
            </ul>
            
            <p>
              Whether you choose a sleek motorized yacht, a classic sailing yacht, or a spacious catamaran, your private charter will be the highlight of your Cabo San Lucas vacation. Book your luxury yacht experience today and create memories that will last a lifetime.
            </p>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && selectedAdventure && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 z-10"
              onClick={closeImageModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Main image */}
            <img 
              src={selectedImage} 
              alt={selectedAdventure.title} 
              className="w-full h-full object-contain"
            />
            
            {/* Thumbnails */}
            {selectedAdventure.imageUrls && selectedAdventure.imageUrls.length > 0 && (
              <div className="absolute bottom-0 inset-x-0 bg-black/50 p-2 overflow-x-auto">
                <div className="flex gap-2">
                  {[selectedAdventure.imageUrl, ...selectedAdventure.imageUrls].map((img, index) => (
                    <div 
                      key={index} 
                      className={`w-16 h-16 flex-shrink-0 cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img} alt={`${selectedAdventure.title} - Image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YachtAdventuresPage;