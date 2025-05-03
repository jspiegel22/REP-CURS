import { cn } from '@/lib/utils';
import { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

/**
 * OptimizedImage Component
 * 
 * This component tries to load a WebP version of an image first,
 * and falls back to the original format if WebP is not available.
 * 
 * Usage:
 * <OptimizedImage src="/path/to/image.jpg" alt="Description" />
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Try to use WebP version first
    if (src) {
      const extension = src.split('.').pop()?.toLowerCase();
      if (extension && ['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return src.substring(0, src.lastIndexOf('.')) + '.webp';
      }
    }
    return src;
  });
  
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    if (!imgError) {
      // If WebP failed, try the original format or provided fallback
      setImgSrc(fallbackSrc || src);
      setImgError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={cn('', className)}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}

export default OptimizedImage;