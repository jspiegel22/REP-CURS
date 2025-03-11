import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind } from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "windy";
}

export function WeatherModule() {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
    refetchInterval: 1800000, // Refresh every 30 minutes
  });

  if (isLoading) {
    return (
      <Card className="fixed bottom-20 right-6 w-[200px] bg-white/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Wind className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Card className="fixed bottom-20 right-6 w-[200px] bg-white/95 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.condition)}
          <div>
            <div className="text-xl font-bold">{weather.temperature}°C</div>
            <div className="text-sm text-muted-foreground">Cabo San Lucas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}