import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  showThumbnails?: boolean;
  onImageClick?: (image: string) => void;
}

export function ImageGallery({
  images,
  title,
  showThumbnails = true,
  onImageClick,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const nextImage = () => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(images[index]);
    } else {
      setCurrentIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img
          src={images[currentIndex]}
          alt={title || `Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager" // Load main image immediately
          onLoad={handleImageLoad}
          onClick={() => handleImageClick(currentIndex)}
        />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              previousImage();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 overflow-x-auto hide-scrollbar">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                index === currentIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy" // Lazy load thumbnails
              />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={images[currentIndex]}
              alt={title || `Image ${currentIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 bg-white/10 text-white px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}