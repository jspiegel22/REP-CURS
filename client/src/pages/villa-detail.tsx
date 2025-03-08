import { useParams } from "wouter";
import { Villa, parseVillaData } from "@/types/villa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Import CSV data (this will be replaced with actual data loading)
const villaData = `[CSV data will be replaced]`; // Placeholder
const villas = parseVillaData(villaData);

export default function VillaDetail() {
  const { id } = useParams();
  const villa = villas.find(v => v.id === id);

  if (!villa) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Villa Not Found</h1>
        <p>Sorry, we couldn't find the villa you're looking for.</p>
        <Button asChild className="mt-4">
          <a href="/villas">Back to Villas</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div 
        className="relative h-[70vh] min-h-[500px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${villa.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto px-4 h-full flex items-end pb-12">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">{villa.name}</h1>
              <p className="text-xl">{villa.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">About this Villa</h2>
            <p className="text-muted-foreground mb-8">{villa.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.maxOccupancy}</p>
                  <p className="text-sm text-muted-foreground">Max Guests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold">{villa.rating}</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Book this Villa</h3>
                <p className="text-muted-foreground mb-6">
                  Contact us to check availability and book your stay at {villa.name}.
                </p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full" size="lg">
                      Inquire Now
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Book {villa.name}</SheetTitle>
                      <SheetDescription>
                        Fill out the form below and we'll get back to you shortly with availability and pricing.
                      </SheetDescription>
                    </SheetHeader>
                    {/* Booking form will be added here */}
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
