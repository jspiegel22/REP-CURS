import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface StayOption {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const stayOptions: StayOption[] = [
  {
    title: "Luxury Resorts",
    description: "World-class amenities with stunning ocean views",
    imageUrl: "/uploads/four-seasons-cds.webp",
    link: "/stays/resorts"
  },
  {
    title: "Private Villas",
    description: "Exclusive retreats for families and groups",
    imageUrl: "/uploads/villa-chavez.webp",
    link: "/stays/villas"
  }
];

export default function StaysSection() {
  return (
    <section className="w-full bg-[#F0F4F8]">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:w-1/3">
            <h2 className="text-3xl font-bold relative inline-block mb-2">
              Stays
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded"></span>
            </h2>
            <p className="text-gray-700 mt-3 mb-2">
              From luxury resorts to private villas, find the perfect accommodation for your Cabo getaway.
            </p>
            <Link href="/stays">
              <a className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 font-medium">
                View All Stays <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3">
            {stayOptions.map((option) => (
              <Link key={option.title} href={option.link}>
                <a className="group block">
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
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}