import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { SiWhatsapp, SiFacebook, SiX, SiPinterest } from "react-icons/si";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect, useState } from "react";

interface SocialShareProps {
  listingId: number;
  title: string;
  imageUrl: string;
}

export function SocialShare({ listingId, title, imageUrl }: SocialShareProps) {
  const { user } = useAuth();
  const [currentUrl, setCurrentUrl] = useState("");
  
  // Set the current URL only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleShare = async (platform: string) => {
    // If we're not on the client side or currentUrl hasn't been set yet, do nothing
    if (typeof window === 'undefined' || !currentUrl) {
      return;
    }
    
    let shareUrl = "";
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(currentUrl);
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
        size="sm"
        onClick={() => handleShare("whatsapp")}
        className="hover:text-green-500 h-9 w-9 p-0"
      >
        <SiWhatsapp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="hover:text-blue-600 h-9 w-9 p-0"
      >
        <SiFacebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="hover:text-sky-400 h-9 w-9 p-0"
      >
        <SiX className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("pinterest")}
        className="hover:text-red-600 h-9 w-9 p-0"
      >
        <SiPinterest className="h-4 w-4" />
      </Button>
    </div>
  );
}