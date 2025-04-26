import React from 'react';
import { getFallbackImage, getImageUrl, ImageCategory } from '@/lib/imageMap';
import { useImage, useImages } from '@/lib/useImages';

interface CaboImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  category?: ImageCategory;
  fallback?: string;
  className?: string;
  imageId?: number; // Optional database image ID
  imageName?: string; // Optional image name to find in the database
}

/**
 * CaboImage component that handles image loading with fallbacks
 * 
 * Enhanced with database support. Can use either:
 * - Direct path: <CaboImage src="/images/villa/villa-1.webp" alt="Luxury Villa" />
 * - Image map: <CaboImage src={images.resort.featured1} alt="Luxury Resort" category="resort" />
 * - Database ID: <CaboImage imageId={42} alt="Beach sunset" /> 
 * - Database name: <CaboImage imageName="Beachfront Villa" category="villa" alt="Beachfront Villa" />
 */
export function CaboImage({ 
  src, 
  alt, 
  category, 
  fallback, 
  className, 
  imageId,
  imageName,
  ...props 
}: CaboImageProps) {
  const [error, setError] = React.useState(false);
  
  // If imageId is provided, try to fetch image from database
  const { data: dbImage, isLoading: isLoadingById } = useImage(imageId || null);
  
  // If imageName is provided, try to find it in the database
  const { data: dbImages, isLoading: isLoadingByName } = useImages(
    imageName && category 
      ? { category: category } 
      : undefined
  );
  
  // Find image by name if needed
  const namedImage = React.useMemo(() => {
    if (!imageName || !dbImages) return null;
    return dbImages.find(img => img.name === imageName) || null;
  }, [dbImages, imageName]);
  
  // Determine the image source from various possibilities
  const imageSrc = React.useMemo(() => {
    // First priority: DB image if found
    if (dbImage) return dbImage.image_url;
    if (namedImage) return namedImage.image_url;
    
    // Second priority: Passed in src if available
    if (src) return src;
    
    // Fallback for loading states
    if (isLoadingById || isLoadingByName) return '';
    
    // Final fallback: category default or global default
    return category ? getFallbackImage(category) : '/images/blog/blog-default.svg';
  }, [dbImage, namedImage, src, isLoadingById, isLoadingByName, category]);
  
  // Use provided alt text or get it from the database
  const imageAlt = React.useMemo(() => {
    if (alt) return alt;
    if (dbImage?.alt_text) return dbImage.alt_text;
    if (namedImage?.alt_text) return namedImage.alt_text;
    return 'Cabo San Lucas image';
  }, [alt, dbImage, namedImage]);
  
  // Handle error state
  const finalSrc = React.useMemo(() => {
    if (error) {
      return fallback || (category ? getFallbackImage(category) : '/images/blog/blog-default.svg');
    }
    return imageSrc;
  }, [error, fallback, category, imageSrc]);
  
  // Get the full URL for the image
  const imageUrl = getImageUrl(finalSrc);
  
  // Show loading state
  if ((isLoadingById || isLoadingByName) && !src) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse rounded`}
        {...props}
      />
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      className={className}
      onError={() => setError(true)}
      width={dbImage?.width ? dbImage.width : (namedImage?.width || undefined)}
      height={dbImage?.height ? dbImage.height : (namedImage?.height || undefined)}
      {...props}
    />
  );
}

/**
 * Responsive CaboImage component with aspect ratio preservation
 */
export function ResponsiveCaboImage({
  src,
  alt,
  category,
  fallback,
  className,
  imageId,
  imageName,
  aspectRatio = "16/9",
  objectFit = "fill",
  ...props
}: CaboImageProps & {
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}) {
  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ aspectRatio }}
    >
      <CaboImage
        src={src}
        alt={alt}
        category={category}
        fallback={fallback}
        imageId={imageId}
        imageName={imageName}
        className={`absolute inset-0 w-full h-full`}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
}