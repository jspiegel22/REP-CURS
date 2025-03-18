import { format, startOfWeek, addDays, addWeeks, isSameDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Event = {
  id: string;
  title: string;
  date: Date;
  type: "music" | "food" | "sports" | "culture";
  location: string;
};

// Mock data - Replace with real API data later
const events: Event[] = [
  {
    id: "1",
    title: "Beach Concert Series",
    date: addDays(new Date(), 2),
    type: "music",
    location: "Medano Beach"
  },
  {
    id: "2",
    title: "Food & Wine Festival",
    date: addDays(new Date(), 5),
    type: "food",
    location: "Marina Golden Zone"
  },
  // Add more events...
];

export default function EventsPage() {
  const today = new Date();
  const startDate = startOfWeek(today);
  
  // Generate 4 weeks of dates
  const dates = Array.from({ length: 28 }, (_, i) => addDays(startDate, i));

  // Group events by date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventTypeColor = (type: Event["type"]) => {
    const colors = {
      music: "bg-purple-500",
      food: "bg-orange-500",
      sports: "bg-blue-500",
      culture: "bg-green-500"
    };
    return colors[type];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cabo Events Calendar</h1>
        <p className="text-lg text-gray-600">Discover what's happening in Cabo San Lucas</p>
      </div>

      {/* Event Type Legend */}
      <div className="flex gap-4 justify-center mb-8">
        {["music", "food", "sports", "culture"].map(type => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getEventTypeColor(type as Event["type"])}`} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}

        {/* Date squares */}
        {dates.map(date => {
          const dayEvents = getEventsForDate(date);
          return (
            <Card key={date.toISOString()} className="p-2 min-h-[120px]">
              <div className="text-sm text-gray-600 mb-2">
                {format(date, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  >
                    <div className="font-semibold text-white truncate">
                      {event.title}
                    </div>
                    <div className="text-white/80 truncate">
                      {event.location}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
