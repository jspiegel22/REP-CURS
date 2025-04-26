import { useState } from 'react';
import Head from 'react-helmet';
import { useImages } from '@/lib/useImages';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageCategory } from '@shared/schema';
import { Loader2, Search, X, Edit, Trash2 } from 'lucide-react';

export default function AdminImagesPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: images, isLoading, error } = useImages(category ? { category: category as any } : undefined);

  // Filter images based on search term
  const filteredImages = searchTerm 
    ? images?.filter(img => 
        img.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        img.alt_text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (img.tags && img.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : images;

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>Image Manager | Cabo San Lucas</title>
      </Head>

      <h1 className="text-3xl font-bold mb-8">Image Manager</h1>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10 pr-10"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <Select
                value={category}
                onValueChange={(value) => setCategory(value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ImageCategory.map((cat: string) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-destructive mb-2">Error loading images</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredImages?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground mb-2">No images found</p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages?.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={image.image_url}
                        alt={image.alt_text}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <div className="text-white text-xs font-medium line-clamp-1">
                          {image.name}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      {image.featured && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        {image.width} x {image.height}
                      </div>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="max-w-2xl mx-auto">
          <ImageUploader />
        </TabsContent>
      </Tabs>
    </div>
  );
}