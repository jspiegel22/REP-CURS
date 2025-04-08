import { Card, CardContent } from "@/components/ui/card";
import { Sun } from "lucide-react";

export function WeatherModule() {
  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1">Cabo San Lucas</p>
            <p className="text-2xl font-bold">82°F</p>
            <p className="text-xs">Sunny</p>
          </div>
          <Sun className="w-8 h-8" />
        </div>
      </CardContent>
    </Card>
  );
}