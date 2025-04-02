import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
  const phoneNumber = "+526242446303";
  const message = "Hi! I'm interested in learning more about Cabo experiences.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center gap-2 group"
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
} 