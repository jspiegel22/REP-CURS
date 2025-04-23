import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface CollectionItem {
  title: string;
  image: string;
  path: string;
  color: string;
}

const collections: CollectionItem[] = [
  {
    title: "Luxury Getaways",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3",
    path: "/collections/luxury",
    color: "bg-blue-900"
  },
  {
    title: "Adventure Seekers",
    image: "https://images.unsplash.com/photo-1533760881669-80db4d7b341c?ixlib=rb-4.0.3",
    path: "/collections/adventure",
    color: "bg-green-900"
  },
  {
    title: "Foodie Tours",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3",
    path: "/collections/food",
    color: "bg-amber-900"
  },
  {
    title: "Beach Paradise",
    image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?ixlib=rb-4.0.3",
    path: "/collections/beach",
    color: "bg-cyan-900"
  }
];

export default function CuratedCollections() {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <div>
          <h2 className="text-3xl font-bold">Curated Collections</h2>
          <p className="text-gray-600 mt-1">Hand-picked experiences tailored to every type of traveler</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <Link key={collection.title} href={collection.path}>
            <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-56 overflow-hidden relative group`}>
              <div className="absolute inset-0">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 opacity-60 ${collection.color}`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white">{collection.title}</h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}