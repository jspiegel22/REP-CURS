interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageSizeConfig {
  [key: string]: {
    [key: string]: ImageDimensions;
  };
}

export const IMAGE_SIZES: ImageSizeConfig = {
  hero: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 1024, height: 768 },
    mobile: { width: 768, height: 1024 }
  },
  gallery: {
    thumbnail: { width: 400, height: 400 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 800 }
  },
  blog: {
    featured: { width: 1200, height: 800 },
    thumbnail: { width: 400, height: 300 }
  }
};

export function generateImageName(
  category: string,
  purpose: string,
  dimensions: ImageDimensions,
  descriptor?: string
): string {
  const { width, height } = dimensions;
  const baseName = `${category}-${purpose}-${width}x${height}`;
  return descriptor ? `${baseName}-${descriptor}` : baseName;
}

export function getImageUrl(
  category: string,
  purpose: string,
  size: string,
  descriptor?: string
): string {
  const dimensions = IMAGE_SIZES[category]?.[size];
  if (!dimensions) {
    throw new Error(`Invalid image size configuration: ${category}-${size}`);
  }

  const imageName = generateImageName(category, purpose, dimensions, descriptor);
  return `/images/${imageName}.jpg`;
}

export function getResponsiveImageUrl(
  category: string,
  purpose: string,
  descriptor?: string
): string {
  const sizes = IMAGE_SIZES[category];
  if (!sizes) {
    throw new Error(`Invalid category: ${category}`);
  }

  return Object.entries(sizes)
    .map(([size, dimensions]) => {
      const imageName = generateImageName(category, purpose, dimensions, descriptor);
      return `(min-width: ${dimensions.width}px) /images/${imageName}.jpg`;
    })
    .join(', ');
}

export function validateImageDimensions(
  file: File,
  category: string,
  size: string
): boolean {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const expectedDimensions = IMAGE_SIZES[category]?.[size];
      if (!expectedDimensions) {
        resolve(false);
        return;
      }

      const matches = 
        img.width === expectedDimensions.width &&
        img.height === expectedDimensions.height;

      resolve(matches);
    };
    img.src = URL.createObjectURL(file);
  });
} 