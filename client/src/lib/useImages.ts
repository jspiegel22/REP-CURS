import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ImageCategory } from '@/lib/imageMap';
import type { SiteImage } from '@shared/schema';

const IMAGES_QUERY_KEY = '/api/images';

/**
 * Hook to fetch all images with optional filtering
 */
export function useImages(options?: { 
  category?: ImageCategory, 
  featured?: boolean,
  tags?: string[]
}) {
  const queryKey = options 
    ? [IMAGES_QUERY_KEY, options]
    : [IMAGES_QUERY_KEY];
    
  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (options?.category) {
        params.append('category', options.category);
      }
      
      if (options?.featured) {
        params.append('featured', 'true');
      }
      
      if (options?.tags?.length) {
        options.tags.forEach(tag => params.append('tags', tag));
      }
      
      const queryString = params.toString();
      const url = queryString 
        ? `${IMAGES_QUERY_KEY}?${queryString}`
        : IMAGES_QUERY_KEY;
        
      const response = await apiRequest('GET', url);
      const data = await response.json();
      return data.images as SiteImage[];
    }
  });
}

/**
 * Hook to fetch a single image by ID
 */
export function useImage(id: number | null) {
  return useQuery({
    queryKey: [IMAGES_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest('GET', `${IMAGES_QUERY_KEY}/${id}`);
      const data = await response.json();
      return data.image as SiteImage;
    },
    enabled: !!id
  });
}

/**
 * Type for image creation/update
 */
export interface ImageInput {
  name: string;
  image_file: string;
  image_url: string;
  alt_text: string;
  description?: string;
  width?: number;
  height?: number;
  category: ImageCategory;
  tags?: string[];
  featured?: boolean;
}

/**
 * Hook to create a new image
 */
export function useCreateImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: ImageInput) => {
      const response = await apiRequest('POST', IMAGES_QUERY_KEY, imageData);
      const data = await response.json();
      return data.image as SiteImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_QUERY_KEY] });
    }
  });
}

/**
 * Hook to update an existing image
 */
export function useUpdateImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<ImageInput> }) => {
      const response = await apiRequest('PUT', `${IMAGES_QUERY_KEY}/${id}`, data);
      const responseData = await response.json();
      return responseData.image as SiteImage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_QUERY_KEY, data.id] });
      queryClient.invalidateQueries({ queryKey: [IMAGES_QUERY_KEY] });
    }
  });
}

/**
 * Hook to delete an image
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `${IMAGES_QUERY_KEY}/${id}`);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_QUERY_KEY] });
    }
  });
}

/**
 * Hook to scan for images in a specific category
 */
export function useScanImages() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: ImageCategory) => {
      const response = await apiRequest('POST', `${IMAGES_QUERY_KEY}/scan`, { category });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IMAGES_QUERY_KEY] });
    }
  });
}