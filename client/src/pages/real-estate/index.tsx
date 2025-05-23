import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Home, TrendingUp, MapPin, Download } from "lucide-react";
import SEO from "@/components/SEO";
import { GuideDownloadForm } from "@/components/guide-download-form";



// Sample listings data
const sampleListings = [
  {
    id: 1,
    title: "Oceanfront Villa in Pedregal",
    price: "$4,500,000",
    beds: 5,
    baths: 5.5,
    sqft: "6,500",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    features: ["Ocean View", "Infinity Pool", "Private Beach Access"]
  },
  {
    id: 2,
    title: "Luxury Penthouse at Puerto Los Cabos",
    price: "$2,800,000",
    beds: 3,
    baths: 3.5,
    sqft: "3,200",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    features: ["Marina View", "Private Terrace", "Concierge Service"]
  },
  {
    id: 3,
    title: "Golf Course Estate at Diamante",
    price: "$5,200,000",
    beds: 6,
    baths: 6.5,
    sqft: "7,800",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    features: ["Golf Course View", "Guest House", "Wine Cellar"]
  }
];

export default function RealEstatePage() {
  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Premium Properties",
      description: "Exclusive listings in prime locations"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Expertise",
      description: "Deep knowledge of Cabo real estate market"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Investment Guidance",
      description: "Expert advice on property investments"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Luxury Real Estate in Cabo San Lucas | Cabo Adventures"
        description="Discover exclusive luxury real estate opportunities in Cabo San Lucas. From oceanfront villas to premium penthouses, find your dream property in paradise."
        canonicalUrl="https://cabo-adventures.com/real-estate"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: 'Cabo Adventures Real Estate',
          description: 'Premium real estate services in Cabo San Lucas',
          areaServed: {
            '@type': 'Place',
            name: 'Cabo San Lucas',
            address: {
              '@type': 'PostalAddress',
              addressRegion: 'Baja California Sur',
              addressCountry: 'MX'
            }
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Cabo San Lucas Properties',
            itemListElement: sampleListings.map(listing => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'House',
                name: listing.title,
                description: listing.title,
                numberOfRooms: listing.beds,
                numberOfBathroomsTotal: listing.baths,
                floorSize: {
                  '@type': 'QuantitativeValue',
                  value: listing.sqft,
                  unitCode: 'FTK'
                }
              }
            }))
          }
        }}
        openGraph={{
          title: "Luxury Real Estate in Cabo San Lucas",
          description: "Find your dream property in Cabo San Lucas. Exclusive listings of luxury homes, villas, and penthouses.",
          image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
          url: "https://cabo-adventures.com/real-estate"
        }}
        keywords={[
          'Cabo San Lucas real estate',
          'luxury properties',
          'oceanfront villas',
          'investment properties',
          'Pedregal homes',
          'Puerto Los Cabos real estate'
        ]}
      />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[80vh] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811"
            alt="Luxury Real Estate"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Cabo Real Estate</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Find your dream property in paradise. From oceanfront villas to luxury penthouses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                <a href="#listings">View Listings</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                <a href="#guide">Download Guide</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Listings Section */}
        <section id="listings" className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                    <p className="text-2xl font-bold text-[#2F4F4F] mb-4">{listing.price}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>{listing.beds} beds</span>
                      <span>{listing.baths} baths</span>
                      <span>{listing.sqft} sq ft</span>
                    </div>
                    <div className="space-y-2">
                      {listing.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Real Estate Guide Section */}
        <section id="guide" className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#2F4F4F] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-white">
                <h2 className="text-3xl font-bold mb-4">Download Our Free Real Estate Guide</h2>
                <p className="text-gray-200 mb-6">
                  Get our comprehensive guide to buying property in Cabo San Lucas. Learn about the local market,
                  legal requirements, financing options, and insider tips for finding the perfect property.
                </p>
                <GuideDownloadForm 
                  guideType="Real Estate"
                  tags="Real Estate, Investment, Luxury"
                  backgroundColor="bg-white"
                  textColor="text-[#2F4F4F]"
                />
              </div>
              <div className="md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1554469384-e58fac16e23a"
                  alt="Real Estate Guide"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}