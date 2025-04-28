import { useState, useEffect } from "react";
import { shimmer, toBase64, getOptimizedImageUrl, getResponsiveSizes } from "@/lib/image-utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  size?: 'small' | 'medium' | 'large' | 'hero';
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  size = 'medium',
  className = '',
  priority = false,
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Convert to WebP and optimize if possible
    setImgSrc(getOptimizedImageUrl(src, width));
  }, [src, width]);

  const responsiveConfig = getResponsiveSizes(size);
  const finalWidth = width || responsiveConfig.width;
  const finalHeight = height || responsiveConfig.height;

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    setImgSrc(src); // Fallback to original src
  };

  return (
    <div 
      className={`relative overflow-hidden ${isLoaded ? '' : 'bg-gray-200'} ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      {!isLoaded && !error && (
        <div
          className="absolute inset-0 animate-pulse" 
          dangerouslySetInnerHTML={{
            __html: shimmer(finalWidth, finalHeight)
          }}
        />
      )}
      
      <img
        src={error ? src : imgSrc} 
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        className="w-full h-full transition-opacity"
      />
    </div>
  );
}