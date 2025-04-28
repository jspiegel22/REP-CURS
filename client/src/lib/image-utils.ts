/**
 * Utility functions for image optimization
 */

/**
 * Creates a shimmer placeholder SVG for image loading
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

/**
 * Converts a string to base64 (works in both browser and Node.js)
 */
export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Determines if the image URL is already a WebP format
 */
export const isWebP = (url: string): boolean => {
  return url.toLowerCase().endsWith('.webp');
};

/**
 * Converts image URL to WebP if served through our image optimization endpoint
 */
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  // If it's already a WebP or a URL we don't control, return as is
  if (isWebP(url) || url.startsWith('http') && !url.includes(window.location.host)) {
    return url;
  }

  // For local images, use our optimization endpoint
  if (url.startsWith('/')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    params.append('fmt', 'webp');
    
    return `/api/images/optimize?src=${encodeURIComponent(url)}&${params.toString()}`;
  }

  return url;
};

/**
 * Gets appropriate size attributes for responsive images
 */
export const getResponsiveSizes = (size: 'small' | 'medium' | 'large' | 'hero' = 'medium') => {
  switch (size) {
    case 'small':
      return {
        width: 300,
        height: 200,
        sizes: '(max-width: 640px) 100vw, 300px'
      };
    case 'medium':
      return {
        width: 600,
        height: 400,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px'
      };
    case 'large':
      return {
        width: 900,
        height: 600,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 900px'
      };
    case 'hero':
      return {
        width: 1200,
        height: 800,
        sizes: '100vw'
      };
    default:
      return {
        width: 600,
        height: 400,
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px'
      };
  }
};