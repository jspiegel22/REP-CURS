import { Adventure, parseAdventureData } from "@/types/adventure";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clock, Users } from "lucide-react";

// Import adventure data (in a real app, this would come from an API)
const adventureData = `group href,h-full src,ais-Highlight-nonHighlighted,text-base,text-xs-4,absolute,font-sans,flex src (2),font-sans (2),gl-font-meta,group href (2)
https://www.cabo-adventures.com/en/tour/luxury-day-sailing/,https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp?w=640&q=65&fit=clip&auto=format,4-HOUR LUXURY CABO SAILING BOAT TOUR,$104 USD,$149 USD,-30%,4 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/signature-swim/,https://cdn.sanity.io/images/esqfj3od/production/bd7bfbf824efdf124cf41220ef1830bf4335a462-608x912.webp?w=640&q=65&fit=clip&auto=format,CABO DOLPHIN SWIM SIGNATURE,$146 USD,$209 USD,-30%,40 Minutes,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min. 4 years old,ADD TO CART,
https://www.cabo-adventures.com/en/tour/outdoor-adventure-cabo/,https://cdn.sanity.io/images/esqfj3od/production/82ad01cfa3a513e85d158016f76161a9460e5247-608x912.webp?w=640&q=65&fit=clip&auto=format,OUTDOOR ADVENTURE 4X4 + CABO ZIPLINE + RAPPEL,$97 USD,$139 USD,-30%,3.5 Hours,https://cdn.sanity.io/images/esqfj3od/production/7bba402f8a80a81c964f504de9e5a9cf8a7e0a3a-24x24.svg?w=48&q=65&fit=clip&auto=format,Min 8 years old,ADD TO CART,`;

interface TopAdventuresProps {
  currentAdventureId?: number;
}

export default function TopAdventures({ currentAdventureId }: TopAdventuresProps) {
  const adventures = parseAdventureData(adventureData)
    .filter(adventure => adventure.id !== currentAdventureId)
    .slice(0, 3); // Show max 3 other adventures

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Other Top Adventures</h2>
            <p className="text-muted-foreground">Discover more exciting experiences in Cabo San Lucas</p>
          </div>
          <Link href="/adventures" className="text-[#FF8C38] hover:underline font-medium">
            View all adventures
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adventures.map((adventure) => (
            <Card key={adventure.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={adventure.imageUrl}
                  alt={adventure.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                {adventure.discount && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                    {adventure.discount}
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
                  {adventure.title}
                </h3>
                
                <div className="flex items-center gap-6 my-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{adventure.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{adventure.minAge}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="font-bold text-lg">{adventure.currentPrice}</span>
                    {adventure.originalPrice && (
                      <span className="text-sm line-through text-muted-foreground ml-2">
                        {adventure.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/adventures/${adventure.slug}`}>
                    <Button variant="outline" className="text-[#FF8C38] border-[#FF8C38] hover:bg-[#FF8C38]/10">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}