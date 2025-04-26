import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface DiningOption {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const diningOptions: DiningOption[] = [
  {
    title: "Fine Dining",
    description: "Exquisite meals with spectacular views",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
    link: "/dining/fine-dining"
  },
  {
    title: "Local Cuisine",
    description: "Authentic Mexican flavors and fresh seafood",
    imageUrl: "https://images.unsplash.com/photo-1560964645-1e4aef057e8b?ixlib=rb-4.0.3",
    link: "/dining/local-cuisine"
  }
];

export default function DiningSection() {
  return (
    <section className="w-full bg-[#FEF6E6]">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:w-1/3">
            <h2 className="text-3xl font-bold relative inline-block mb-2">
              Dining
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FF8C38] rounded"></span>
            </h2>
            <p className="text-gray-700 mt-3 mb-2">
              Savor the flavors of Cabo with world-class restaurants and authentic local cuisine.
            </p>
            <Link href="/dining" className="inline-flex items-center mt-2 text-[#FF8C38] hover:text-[#E67D29] font-medium">
              View All Restaurants <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3">
            {diningOptions.map((option) => (
              <Link key={option.title} href={option.link} className="group block">
                <div className="relative rounded-lg overflow-hidden h-[18.75rem]">
                  <img 
                    src={option.imageUrl}
                    alt={option.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">{option.title}</h3>
                    <p className="text-gray-200 mt-1">{option.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}