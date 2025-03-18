import { Villa } from "@/types/villa";
import { Resort } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { Link } from "wouter";
import { generateSlug } from "@/lib/utils";

interface RecommendationsProps {
  currentItem?: Villa | Resort;
  type: "villa" | "resort";
  maxItems?: number;
}

export default function Recommendations({ currentItem, type, maxItems = 3 }: RecommendationsProps) {
  // Import the appropriate data based on type
  const data = type === "villa" ? 
    require("@/data/villas").villas : 
    require("@/data/resorts").resorts;

  const getRecommendations = () => {
    if (!currentItem) return data.slice(0, maxItems);

    // Filter out current item
    const otherItems = data.filter(item => item.id !== currentItem.id);

    // Sort by matching criteria
    return otherItems
      .map(item => ({
        item,
        score: calculateSimilarityScore(currentItem, item)
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, maxItems);
  };

  const calculateSimilarityScore = (current: Villa | Resort, item: Villa | Resort): number => {
    let score = 0;

    // Location match
    if (current.location === item.location) score += 3;

    // Guest capacity similarity (within 2 guests)
    if (Math.abs(current.maxGuests - item.maxGuests) <= 2) score += 2;

    // Property features match
    if (current.isBeachfront === item.isBeachfront) score += 1;
    if (current.isOceanfront === item.isOceanfront) score += 1;

    // Price level match (for resorts)
    if ('priceLevel' in current && 'priceLevel' in item && current.priceLevel === item.priceLevel) {
      score += 2;
    }

    return score;
  };

  const recommendations = getRecommendations();

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">
        {currentItem ? "Similar Properties" : "Recommended Properties"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <Link
            key={item.id}
            href={`/${type}/${generateSlug(item.name)}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="h-full">
              <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {(item.isBeachfront || item.isOceanfront) && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
                    {item.isBeachfront ? 'Beachfront' : 'Oceanfront'}
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>
                <p className="line-clamp-2 text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  {type === "villa" ? 
                    `${(item as Villa).bedrooms} BR • ${(item as Villa).bathrooms} BA • Up to ${item.maxGuests} guests` :
                    `${(item as Resort).priceLevel} • ${(item as Resort).rooms} Rooms • Up to ${item.maxGuests} guests/room`
                  }
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}