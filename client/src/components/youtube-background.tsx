import { useEffect, useState } from 'react';

interface YouTubeBackgroundProps {
  videoId: string;
  fallbackImage: string;
}

export function YouTubeBackground({ videoId, fallbackImage }: YouTubeBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Desktop YouTube Video */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Mobile Fallback Image */}
      {isMobile && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
} 