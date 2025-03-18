import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ClientGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ClientGallery({ images, title, subtitle, className }: ClientGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className={cn("py-16 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl p-0">
            {selectedImage && (
              <div>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto rounded-lg"
                />
                {selectedImage.caption && (
                  <p className="p-4 text-center text-muted-foreground">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
