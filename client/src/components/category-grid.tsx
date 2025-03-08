import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

const categories = [
  {
    title: "Luxury Resorts",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3",
    path: "/resorts",
    bookingType: "direct",
  },
  {
    title: "Private Villas",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3",
    path: "/villas",
    bookingType: "form",
  },
  {
    title: "Ocean Adventures",
    image: "https://images.unsplash.com/photo-1564351943427-3d61951984e9?ixlib=rb-4.0.3",
    path: "/adventures",
    bookingType: "direct",
  },
  {
    title: "Restaurants & Dining",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3",
    path: "/restaurants",
    bookingType: "form",
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.title} href={category.path}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="aspect-[4/3] relative">
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl">{category.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {category.bookingType === "direct" ? "Instant Booking" : "Inquiry Required"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}