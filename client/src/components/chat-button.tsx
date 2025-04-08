import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatButton() {
  return (
    <Button
      onClick={() => window.open('https://chat.cabo.is', '_blank')}
      className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-lg"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}