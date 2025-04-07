import { Villa } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { generateVillaSlug } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import { SafeNavigation } from "@/components/safe-navigation";

/**
 * VillaCard Component
 * 
 * This component displays a villa card with image, name, location, and other details.
 * It uses the SafeNavigation component to handle client-side navigation safely without nested <a> tags.
 * It accepts a Partial<Villa> to handle both local data and database-sourced villas with different schemas.
 */
interface VillaCardProps {
  villa: Partial<Villa>;
  className?: string;
}

export function VillaCard({ villa, className = "" }: VillaCardProps) {
  // Ensure we have mandatory properties with fallbacks
  const name = villa.name || "Luxury Villa";
  const location = villa.location || "Cabo San Lucas";
  const imageUrl = villa.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945";
  const bedrooms = villa.bedrooms || 4;
  const maxGuests = villa.maxGuests || 8;
  const displayPrice = villa.pricePerNight || "$500+";
  
  return (
    <div className={`block transition-transform hover:scale-[1.02] ${className}`}>
      <SafeNavigation 
        to={`/villas/${generateVillaSlug(name)}`}
        className="block"
      >
        <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg bg-muted">
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{location}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                <span>4.5</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {bedrooms} BR • Up to {maxGuests} guests
            </div>
            <div className="mt-2 text-sm font-semibold">
              {displayPrice} per night
            </div>
          </CardContent>
        </Card>
      </SafeNavigation>
    </div>
  );
}