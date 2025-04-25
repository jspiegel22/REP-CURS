import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CaboImage } from "@/components/ui/cabo-image";
import { useImages, useScanImages, useCreateImage, useDeleteImage } from "@/lib/useImages";
import { ImageCategory } from "@/lib/imageMap";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export function ImageManager() {
  const { data: imagesData, isLoading, refetch } = useImages();
  const { mutate: scanImages, isPending: isScanning } = useScanImages();
  const { mutate: createImage, isPending: isCreating } = useCreateImage();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();
  
  const [category, setCategory] = useState<ImageCategory>("hero");
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    alt_text: "",
    description: "",
  });
  
  const handleScan = () => {
    scanImages(category, {
      onSuccess: (data) => {
        toast({
          title: "Images Scanned",
          description: `Found ${data.created + data.updated} images. Added ${data.created} new images.`,
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Scan Failed",
          description: "Failed to scan images. Check console for details.",
          variant: "destructive",
        });
        console.error(error);
      }
    });
  };
  
  const handleCreate = () => {
    if (!formData.name || !formData.image_url || !formData.alt_text) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    createImage({
      ...formData,
      image_file: formData.image_url,
      category,
      tags: [category]
    }, {
      onSuccess: () => {
        toast({
          title: "Image Created",
          description: "Successfully added new image to the database.",
        });
        setFormData({
          name: "",
          image_url: "",
          alt_text: "",
          description: "",
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Create Failed",
          description: "Failed to create image. Check console for details.",
          variant: "destructive",
        });
        console.error(error);
      }
    });
  };
  
  const handleDelete = (id: number) => {
    deleteImage(id, {
      onSuccess: () => {
        toast({
          title: "Image Deleted",
          description: "Successfully removed image from the database.",
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Delete Failed",
          description: "Failed to delete image. Check console for details.",
          variant: "destructive",
        });
        console.error(error);
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Cabo Image Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Scan for Images</CardTitle>
            <CardDescription>
              Scan the public/images directory to import images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="scan-category">Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ImageCategory)}
                >
                  <option value="hero">Hero Images</option>
                  <option value="resort">Resorts</option>
                  <option value="villa">Villas</option>
                  <option value="restaurant">Restaurants</option>
                  <option value="activity">Activities</option>
                  <option value="beach">Beaches</option>
                  <option value="wedding">Weddings</option>
                  <option value="yacht">Yachts</option>
                  <option value="luxury">Luxury</option>
                  <option value="family">Family</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? "Scanning..." : "Scan for Images"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Image</CardTitle>
            <CardDescription>
              Manually add a new image to the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Image Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Luxury Beachfront Villa"
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="/images/villas/villa-1.webp"
                />
              </div>
              <div>
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleInputChange}
                  placeholder="Luxury beachfront villa with ocean view"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Beautiful luxury villa on the beach in Cabo San Lucas"
                />
              </div>
              <div>
                <Label htmlFor="add-category">Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ImageCategory)}
                >
                  <option value="hero">Hero Images</option>
                  <option value="resort">Resorts</option>
                  <option value="villa">Villas</option>
                  <option value="restaurant">Restaurants</option>
                  <option value="activity">Activities</option>
                  <option value="beach">Beaches</option>
                  <option value="wedding">Weddings</option>
                  <option value="yacht">Yachts</option>
                  <option value="luxury">Luxury</option>
                  <option value="family">Family</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? "Adding..." : "Add Image"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Separator className="my-8" />
      
      <h2 className="text-2xl font-bold mb-4">Image Library</h2>
      
      {isLoading ? (
        <div className="text-center py-8">Loading images...</div>
      ) : imagesData?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No images found in the database.</p>
          <p className="text-sm text-gray-400 mt-2">Use the scan tool above to import images from the file system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {imagesData?.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <CaboImage
                  src={image.image_url}
                  alt={image.alt_text}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg truncate">{image.name}</CardTitle>
                <CardDescription className="truncate">
                  {image.category}
                  {image.featured && " • Featured"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <span className="text-xs text-gray-500">
                  {image.width}×{image.height}
                </span>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}