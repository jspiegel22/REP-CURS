import React from 'react';
import { useImages } from '@/hooks/useImages';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  category?: string;
  tags?: string[];
  limit?: number;
  columns?: 1 | 2 | 3 | 4;
  showLoadMore?: boolean;
  onImageClick?: (image: any) => void;
}

export function ImageGallery({
  category,
  tags,
  limit = 12,
  columns = 3,
  showLoadMore = false,
  onImageClick,
}: ImageGalleryProps) {
  const { images, isLoading, error, refreshImages } = useImages({
    category,
    tags,
    limit,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Failed to load images</p>
        <Button onClick={refreshImages}>Try Again</Button>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className="space-y-6">
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {isLoading ? (
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ))
        ) : (
          images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => onImageClick?.(image)}
            >
              <img
                src={image.thumbnailLink}
                alt={image.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                  <h3 className="font-medium">{image.name}</h3>
                  {image.category && (
                    <p className="text-sm text-gray-200">{image.category}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showLoadMore && !isLoading && images.length >= limit && (
        <div className="text-center">
          <Button onClick={refreshImages}>Load More</Button>
        </div>
      )}
    </div>
  );
} 