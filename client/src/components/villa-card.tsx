import { Villa } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { generateVillaSlug } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import { ResponsiveCaboImage } from "@/components/ui/cabo-image";
import { images } from "@/lib/imageMap";

interface VillaCardProps {
  villa: Villa;
  className?: string;
}

export function VillaCard({ villa, className = "" }: VillaCardProps) {
  return (
    <Link 
      href={`/villas/${generateVillaSlug(villa.name)}`}
      className={`block transition-transform hover:scale-[1.02] ${className}`}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg bg-muted">
          <ResponsiveCaboImage
            src={villa.imageUrl}
            alt={villa.name}
            category="villa"
            aspectRatio="16/9"
            objectFit="cover"
            className="rounded-t-lg"
            loading="lazy"
            decoding="async"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1">{villa.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{villa.location}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
              <span>4.5</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{villa.location}</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {villa.bedrooms} BR • Up to {villa.maxGuests} guests
          </div>
          <div className="mt-2 text-sm font-semibold">
            ${villa.pricePerNight} per night
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}