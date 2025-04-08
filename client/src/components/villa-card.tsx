import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

interface Villa {
  name: string;
  location: string;
  imageUrl: string;
  bedrooms: number;
  maxGuests: number;
  pricePerNight: string;
}

interface VillaCardProps {
  villa: Villa;
  className?: string;
}

export function VillaCard({ villa, className = "" }: VillaCardProps) {
  const { name, location, imageUrl, bedrooms, maxGuests, pricePerNight } = villa;
  
  return (
    <div className={`block transition-transform hover:scale-[1.02] ${className}`}>
      <Link 
        href={`/villas/${name.toLowerCase().replace(/\s+/g, '-')}`}
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
              {pricePerNight} per night
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}