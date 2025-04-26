import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface EventItem {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const upcomingEvents: EventItem[] = [
  {
    title: "Summer Music Festival",
    description: "Join us for a weekend of live music on the beach",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3",
    link: "/events/summer-music-festival"
  },
  {
    title: "Cabo Food & Wine Festival",
    description: "Experience culinary delights from top local chefs",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3",
    link: "/events/food-wine-festival"
  }
];

export default function EventsSection() {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row-reverse justify-between">
          <div className="mb-8 md:w-1/3 md:pl-12 md:text-right">
            <h2 className="text-3xl font-bold relative inline-block mb-2">
              Events
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FF8C38] rounded"></span>
            </h2>
            <p className="text-gray-700 mt-3 mb-2">
              Plan your special occasions in paradise with our comprehensive event services.
            </p>
            <Link href="/events" className="inline-flex items-center mt-2 text-[#FF8C38] hover:text-[#E67D29] font-medium">
              View All Events <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3">
            {upcomingEvents.map((event) => (
              <Link key={event.title} href={event.link} className="group block">
                <div className="relative rounded-lg overflow-hidden h-[18.75rem]">
                  <img 
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <p className="text-gray-200 mt-1">{event.description}</p>
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