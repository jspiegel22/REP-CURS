import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Hotel, Users, Calendar } from "lucide-react";
import StripeBookingButton from "../stripe-booking-button";

interface VillaDetailBookingProps {
  listingId: string | number;
  title: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

export function VillaDetailBooking({
  listingId,
  title,
  price,
  maxGuests,
  bedrooms,
  bathrooms,
  amenities = []
}: VillaDetailBookingProps) {
  return (
    <Card className="w-full shadow-lg border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">${price.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/night</span></CardTitle>
        <CardDescription>
          Exclusive rates for your selected dates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Property details */}
        <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-center p-2 border rounded-md">
            <Users className="h-4 w-4 mb-1" />
            <span>{maxGuests} guests</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border rounded-md">
            <Hotel className="h-4 w-4 mb-1" />
            <span>{bedrooms} bedrooms</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border rounded-md">
            <Calendar className="h-4 w-4 mb-1" />
            <span>{bathrooms} baths</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Key amenities */}
        <div className="space-y-2">
          <h4 className="font-medium">Key amenities</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
            {amenities.slice(0, 6).map((amenity, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        {/* Price breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>${price.toLocaleString()} x 5 nights</span>
            <span>${(price * 5).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Cleaning fee</span>
            <span>$150</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>$85</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${(price * 5 + 150 + 85).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <StripeBookingButton 
          listingId={listingId}
          listingTitle={title}
          listingType="villa"
          buttonText="Book Now with Secure Payment"
          buttonSize="lg"
          buttonVariant="default"
        />
      </CardFooter>
    </Card>
  );
}