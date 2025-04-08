import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatButton() {
  return (
    <Button
      size="icon"
      className="fixed bottom-24 right-6 h-12 w-12 rounded-full shadow-lg bg-[#2F4F4F] hover:bg-[#2F4F4F]/90 text-white z-50"
      onClick={() => {
        // Add chat functionality here
        console.log('Chat button clicked');
      }}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}