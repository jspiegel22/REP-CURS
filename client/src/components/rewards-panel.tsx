import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

export function RewardsPanel() {
  const { user } = useAuth();

  if (!user) return null;

  // Calculate progress to next level (example: need 100 points per level)
  const pointsToNextLevel = 100;
  const currentPoints = user.points || 0;
  const progress = (currentPoints % pointsToNextLevel) / pointsToNextLevel * 100;

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" />
          Rewards Level {user.level || 1}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{currentPoints} points</span>
              <span>{pointsToNextLevel - (currentPoints % pointsToNextLevel)} until next level</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Book adventures and share with friends to earn more points!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}