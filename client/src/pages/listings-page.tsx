import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { Loader2 } from "lucide-react";

export default function ListingsPage() {
  const { type } = useParams();
  
  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: [`/api/listings?type=${type}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{type}s in Cabo San Lucas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings?.map((listing) => (
          <Card key={listing.id}>
            <CardHeader className="p-0">
              <div className="aspect-[4/3] relative">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{listing.description}</p>
              {listing.price && (
                <p className="text-lg font-bold mt-2">${listing.price} USD</p>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/booking/${listing.id}`}>
                  {listing.bookingType === "direct" ? "Book Now" : "Inquire"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
