import { useState, useEffect } from 'react';

interface Image {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink: string;
  category: string;
  tags: string[];
}

interface UseImagesOptions {
  category?: string;
  tags?: string[];
  limit?: number;
}

export function useImages(options: UseImagesOptions = {}) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchImages();
  }, [options.category, options.tags]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.tags?.length) params.append('tags', options.tags.join(','));
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/images?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const getImageById = (id: string) => {
    return images.find((image) => image.id === id);
  };

  const getImagesByCategory = (category: string) => {
    return images.filter((image) => image.category === category);
  };

  const getImagesByTag = (tag: string) => {
    return images.filter((image) => image.tags.includes(tag));
  };

  const refreshImages = () => {
    fetchImages();
  };

  return {
    images,
    isLoading,
    error,
    getImageById,
    getImagesByCategory,
    getImagesByTag,
    refreshImages,
  };
} 