import { Villa } from "@/types/villa";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface VillaCardProps {
  villa: Villa;
  className?: string;
}

export function VillaCard({ villa, className = "" }: VillaCardProps) {
  return (
    <Link href={`/villas/${villa.id}`} className={className}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
          <img
            src={villa.imageUrl}
            alt={villa.name}
            className="object-cover w-full h-full"
          />
          {(villa.isBeachfront || villa.isOceanfront) && (
            <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
              {villa.isBeachfront ? 'Beachfront' : 'Oceanfront'}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1">{villa.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{villa.location}</p>
          <div className="flex items-center gap-4 text-sm">
            <span>{villa.rating}</span>
            <span>•</span>
            <span>{villa.bedrooms} BR</span>
            <span>•</span>
            <span>Up to {villa.maxOccupancy} guests</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}