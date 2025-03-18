import { useParams } from "wouter";
import { Villa, parseVillaData } from "@/types/villa";
import VillaBookingTemplate from "@/components/templates/VillaBookingTemplate";
import { generateSlug } from "@/lib/utils";

// Import villa data from your data source
const villaData = `stretched-link href,w-100 src,location,detail,col-12,detail (2),detail (3),col-auto,col-auto (2),col-auto (3)
https://www.cabovillas.com/properties.asp?PID=441,https://www.cabovillas.com/Properties/Villas/Villa_Tranquilidad/FULL/Villa_Tranquilidad-1.jpg?width=486,"SAN JOSÉ DEL CABO, OCEANFRONT, BEACHFRONT",Villa Tranquilidad,Spectacular Beachfront Villa Located in Puert...,6+ -Star Platinum Villa,+,8,8+,16`;

// Sample reviews data
const reviews = [
  {
    author: "Sarah M.",
    date: "February 2025",
    rating: 5,
    content: "Absolutely stunning villa with incredible ocean views. The staff was amazing and attentive to every detail.",
    helpful: 12
  },
  {
    author: "James R.",
    date: "January 2025",
    rating: 5,
    content: "Perfect for our family vacation. The private pool and outdoor areas were spectacular.",
    helpful: 8
  }
];

// Sample features and amenities
const features = [
  "24/7 Concierge Service",
  "Daily Housekeeping",
  "Private Chef Available",
  "Sunset Views"
];

const amenities = [
  "Private Beach Access",
  "Infinity Pool",
  "Full-Service Spa",
  "Fitness Center",
  "24-Hour Room Service",
  "Valet Parking",
  "High-Speed WiFi",
  "Air Conditioning"
];

export default function VillaDetail() {
  const { slug } = useParams();
  const villas = parseVillaData(villaData);
  const villa = villas.find(v => generateSlug(v.name) === slug);

  if (!villa) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Villa Not Found</h1>
        <p>Sorry, we couldn't find the villa you're looking for.</p>
      </div>
    );
  }

  return (
    <VillaBookingTemplate
      title={villa.name}
      subtitle={villa.rating}
      description={villa.description}
      imageUrls={[villa.imageUrl]} // You'll want to add more images
      pricePerNight={1500} // Replace with actual price from your data
      rating={5}
      reviewCount={reviews.length}
      location={villa.location}
      maximumGuests={villa.maxOccupancy}
      features={features}
      amenities={amenities}
      villaId={parseInt(villa.id.replace('villa-', ''))}
      reviews={reviews}
      host={{
        name: "Villa Management Team",
        image: "https://example.com/host-image.jpg", // Replace with actual image
        joinedDate: "January 2020"
      }}
    />
  );
}