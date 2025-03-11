import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

const luxuryResorts = [
  {
    title: "Four Seasons Resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3",
    path: "/resorts/four-seasons",
  },
  {
    title: "Waldorf Astoria",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3",
    path: "/resorts/waldorf-astoria",
  }
];

const oceanAdventures = [
  {
    title: "Sunset Sailing",
    image: "https://images.unsplash.com/photo-1564351943427-3d61951984e9?ixlib=rb-4.0.3",
    path: "/adventure/luxury-cabo-sailing",
  },
  {
    title: "Whale Watching",
    image: "https://images.unsplash.com/photo-1570482606740-a0b0c6b3e8b6?ixlib=rb-4.0.3",
    path: "/adventure/whale-watching",
  },
  {
    title: "Scuba Diving",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
    path: "/adventures",
  }
];

const digitalGuides = [
  {
    title: "Adventure Guide",
    image: "https://images.unsplash.com/photo-1533760881669-80db4d7b341c?w=800",
    path: "/guides/adventures",
  },
  {
    title: "Local Tips",
    image: "https://images.unsplash.com/photo-1563461660947-507ef49e9c47?w=800",
    path: "/guides/local-tips",
  },
  {
    title: "Restaurant Guide",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800",
    path: "/guides/restaurants",
  },
  {
    title: "Beach Guide",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    path: "/guides/beaches",
  }
];

export default function CategoryGrid() {
  return (
    <div className="space-y-12 py-8">
      {/* Luxury Resorts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Luxury Resorts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {luxuryResorts.map((resort) => (
            <Link key={resort.title} href={resort.path}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video relative">
                    <img
                      src={resort.image}
                      alt={resort.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{resort.title}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Ocean Adventures Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Ocean Adventures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {oceanAdventures.map((adventure) => (
            <Link key={adventure.title} href={adventure.path}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video relative">
                    <img
                      src={adventure.image}
                      alt={adventure.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{adventure.title}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Digital Guides Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Digital Guides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {digitalGuides.map((guide) => (
            <Link key={guide.title} href={guide.path}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}