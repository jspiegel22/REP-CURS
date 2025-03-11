import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { SiWhatsapp, SiFacebook, SiX, SiPinterest } from "react-icons/si";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SocialShareProps {
  listingId: number;
  title: string;
  imageUrl: string;
}

export function SocialShare({ listingId, title, imageUrl }: SocialShareProps) {
  const { user } = useAuth();

  const handleShare = async (platform: string) => {
    let shareUrl = "";
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(window.location.href);
    const encodedImage = encodeURIComponent(imageUrl);

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`;
        break;
    }

    // Open share dialog
    window.open(shareUrl, "_blank", "width=600,height=400");

    // Record share and award points if user is logged in
    if (user) {
      try {
        await apiRequest("POST", "/api/social-share", {
          listingId,
          platform,
        });

        // Invalidate user query to refresh points
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });

        toast({
          title: "Thanks for sharing!",
          description: "You earned 10 points!",
        });
      } catch (error) {
        console.error("Failed to record share:", error);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("whatsapp")}
        className="hover:text-green-500"
      >
        <SiWhatsapp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("facebook")}
        className="hover:text-blue-600"
      >
        <SiFacebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("twitter")}
        className="hover:text-sky-400"
      >
        <SiX className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("pinterest")}
        className="hover:text-red-600"
      >
        <SiPinterest className="h-4 w-4" />
      </Button>
    </div>
  );
}