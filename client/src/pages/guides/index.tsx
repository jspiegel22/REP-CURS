import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import Footer from "@/components/footer";
import SEO, { generateGuideSchema } from "@/components/SEO";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GuideDownloadForm } from "@/components/guide-download-form";

// Sample guides data
const guides = [
  {
    id: 1,
    title: "Cabo Restaurant Guide",
    description: "Discover the best restaurants, bars, and hidden culinary gems in Cabo.",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88",
    type: "Food & Dining"
  },
  {
    id: 2,
    title: "Beach & Activities Guide",
    description: "Complete guide to beaches, water sports, and outdoor activities.",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13",
    type: "Activities"
  },
  {
    id: 3,
    title: "Real Estate Investment Guide",
    description: "Everything you need to know about investing in Cabo real estate.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    type: "Real Estate"
  },
  {
    id: 4,
    title: "Wedding Planning Guide",
    description: "Plan your perfect destination wedding in Cabo San Lucas.",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f",
    type: "Events"
  },
  {
    id: 5,
    title: "Transportation Guide",
    description: "Getting around Cabo - from airport transfers to local transit.",
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7",
    type: "Travel"
  },
  {
    id: 6,
    title: "Seasonal Events Guide",
    description: "Year-round calendar of events, festivals, and local celebrations.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    type: "Events"
  }
];

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<(typeof guides)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleDownloadClick = (guide: typeof guides[0]) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Give time for animation to complete before clearing selection
    setTimeout(() => setSelectedGuide(null), 300);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Cabo Travel Guides & Resources | Cabo Adventures"
        description="Download expert travel guides for Cabo San Lucas. Get insider tips on restaurants, activities, beaches, and more to make the most of your Cabo experience."
        canonicalUrl="https://cabo-adventures.com/guides"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Cabo Travel Guides',
          description: 'Collection of expert travel guides for Cabo San Lucas',
          publisher: {
            '@type': 'Organization',
            name: 'Cabo Adventures',
            url: 'https://cabo-adventures.com'
          },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: guides.map((guide, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: generateGuideSchema(guide)
            }))
          }
        }}
        openGraph={{
          title: "Expert Travel Guides for Cabo San Lucas",
          description: "Download comprehensive guides for your Cabo adventure. Restaurant recommendations, activity guides, and local insights.",
          image: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af",
          url: "https://cabo-adventures.com/guides"
        }}
        keywords={[
          'Cabo San Lucas guides',
          'travel tips',
          'restaurant guide',
          'activity guide',
          'local recommendations',
          'beach guide',
          'Cabo travel planning'
        ]}
      />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[40vh] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516546453174-5e1098a4b4af"
            alt="Cabo Guides"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Cabo Travel Guides</h1>
            <p className="text-xl md:text-2xl mb-6 max-w-2xl">
              Download our expert guides and experience Cabo like a local
            </p>
          </div>
        </div>

        {/* Guides Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-[#2F4F4F] text-sm font-medium px-3 py-1 rounded-full">
                        {guide.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    <Button 
                      className="w-full gap-2"
                      onClick={() => handleDownloadClick(guide)}
                    >
                      <Download className="h-4 w-4" />
                      Download Guide
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Guide Download Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGuide ? selectedGuide.title : "Download Guide"}
            </DialogTitle>
            <DialogDescription>
              Enter your information to receive your free guide via email.
            </DialogDescription>
          </DialogHeader>
          
          {selectedGuide && (
            <GuideDownloadForm 
              guideType={selectedGuide.type}
              tags={`Guide Request, ${selectedGuide.type}, Website`}
              title=""
              buttonText={`Get ${selectedGuide.title}`}
              onSuccessCallback={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}