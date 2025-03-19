import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { IMAGE_SIZES, validateImageDimensions } from '@/lib/imageUtils';

interface Image {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink: string;
  category: string;
  tags: string[];
}

export function ImageManager() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newDescriptor, setNewDescriptor] = useState('');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/images?category=${selectedCategory}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch images',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage || !newCategory || !newPurpose || !newSize) return;

    try {
      // Validate image dimensions
      const isValid = await validateImageDimensions(newImage, newCategory, newSize);
      if (!isValid) {
        toast({
          title: 'Error',
          description: `Image dimensions do not match the required size for ${newCategory}-${newSize}`,
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', newImage);
      formData.append('category', newCategory);
      formData.append('purpose', newPurpose);
      formData.append('size', newSize);
      formData.append('descriptor', newDescriptor);
      formData.append('tags', newTags);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      setNewImage(null);
      setNewCategory('');
      setNewPurpose('');
      setNewSize('');
      setNewDescriptor('');
      setNewTags('');
      fetchImages();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images?imageId=${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      fetchImages();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const getAvailableSizes = () => {
    if (!newCategory) return [];
    return Object.keys(IMAGE_SIZES[newCategory] || {});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Image Manager</h2>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <option value="all">All Categories</option>
          {Object.keys(IMAGE_SIZES).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="image">Select Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={newCategory}
            onValueChange={setNewCategory}
          >
            <option value="">Select category</option>
            {Object.keys(IMAGE_SIZES).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Input
            id="purpose"
            value={newPurpose}
            onChange={(e) => setNewPurpose(e.target.value)}
            placeholder="e.g., main, featured, thumbnail"
          />
        </div>

        <div>
          <Label htmlFor="size">Size</Label>
          <Select
            id="size"
            value={newSize}
            onValueChange={setNewSize}
            disabled={!newCategory}
          >
            <option value="">Select size</option>
            {getAvailableSizes().map((size) => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="descriptor">Descriptor (Optional)</Label>
          <Input
            id="descriptor"
            value={newDescriptor}
            onChange={(e) => setNewDescriptor(e.target.value)}
            placeholder="e.g., sunset, beach, etc."
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Enter tags"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isUploading || !newImage || !newCategory || !newPurpose || !newSize}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border rounded-lg p-4">
            <img
              src={image.thumbnailLink}
              alt={image.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-2">
              <p className="font-medium">{image.name}</p>
              <p className="text-sm text-gray-500">Category: {image.category}</p>
              <p className="text-sm text-gray-500">
                Tags: {image.tags.join(', ')}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={() => handleDelete(image.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 