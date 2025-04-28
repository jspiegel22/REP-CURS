import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ResponsiveGalleryProps {
  images: GalleryImage[];
  isOpen: boolean;
  onClose: () => void;
}

export function ResponsiveGallery({ images, isOpen, onClose }: ResponsiveGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black text-white">
        <DialogTitle>
          <VisuallyHidden>Image Gallery</VisuallyHidden>
        </DialogTitle>
        
        <div className="relative h-full flex flex-col">
          {/* Header with count and close button */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-h-[80vh] max-w-full object-contain"
              loading="eager"
            />
          </div>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Thumbnails */}
          <div className="p-2 overflow-x-auto bg-black/80">
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 relative h-16 w-24 rounded-md overflow-hidden transition-all ${
                    index === currentIndex ? "ring-2 ring-white" : "opacity-70"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}