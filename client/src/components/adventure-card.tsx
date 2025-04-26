import { Adventure } from "@/types/adventure";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface AdventureCardProps {
  adventure: Adventure;
}

export function AdventureCard({ adventure }: AdventureCardProps) {
  return (
    <Link href={`/adventures/${adventure.slug}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
          <img
            src={adventure.imageUrl}
            alt={adventure.title}
            className="object-fill w-full h-full"
          />
          {adventure.discount && (
            <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
              Save {adventure.discount}
            </div>
          )}
          {adventure.category && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="capitalize">
                {adventure.category}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{adventure.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{adventure.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Min. {adventure.minAge}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{adventure.currentPrice}</span>
            {adventure.originalPrice !== adventure.currentPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {adventure.originalPrice}
              </span>
            )}
          </div>
          {adventure.rating && (
            <div className="mt-2 text-sm">
              <span className="text-yellow-400">{"★".repeat(Math.floor(adventure.rating))}</span>
              <span className="ml-1 text-muted-foreground">{adventure.rating}/5</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}