import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImageModalProps {
  image: {
    id: string;
    name: string;
    webViewLink: string;
    thumbnailLink: string;
    category: string;
    tags: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 bg-black/50 hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-6 w-6 text-white" />
          </Button>
          <img
            src={image.webViewLink}
            alt={image.name}
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
            <h3 className="text-white text-xl font-medium">{image.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white/80 text-sm">{image.category}</span>
              {image.tags.length > 0 && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80 text-sm">
                    {image.tags.join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 