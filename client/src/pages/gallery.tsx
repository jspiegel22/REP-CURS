import React, { useState } from 'react';
import { ImageGallery } from '@/components/ImageGallery';
import { ImageModal } from '@/components/ImageModal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'hero', label: 'Hero Images' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'blog', label: 'Blog' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <ImageGallery
        category={selectedCategory === 'all' ? undefined : selectedCategory}
        columns={3}
        showLoadMore
        onImageClick={setSelectedImage}
      />

      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
} 