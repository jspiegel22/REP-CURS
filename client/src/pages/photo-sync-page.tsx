import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useImages, ImageInput } from "@/lib/useImages";
import { ImageCategory } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ImageUp, Replace, Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface PhotoPreview {
  url: string;
  file: File;
  name: string;
  category: string;
  alt_text: string;
  description: string;
  tags: string;
}

export default function PhotoSyncPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  
  // Fetch existing images
  const { data: images, isLoading: isLoadingImages, refetch } = useImages();
  
  // Selected website section for synchronization
  const [selectedSection, setSelectedSection] = useState<string>("");
  
  // Photo upload state
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<PhotoPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState<string>("resort");
  const [tags, setTags] = useState<string>("");
  
  // For replacement
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreview, setReplacementPreview] = useState<string | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);

  const getWebsiteSections = () => [
    { value: "resorts", label: "Luxury Resorts & Private Villas" },
    { value: "testimonials", label: "Testimonials" },
    { value: "activities", label: "Featured Activities" },
    { value: "dining", label: "Dining Experiences" },
    { value: "hero", label: "Homepage Hero Image" },
    { value: "concierge", label: "Luxury Concierge" },
  ];
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPhotoFiles(files);
      
      // Generate previews
      const newPreviews: PhotoPreview[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        // Generate a name from filename
        const fileName = file.name.split('.')[0]
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
          
        newPreviews.push({
          url,
          file,
          name: fileName,
          category,
          alt_text: `${fileName} in Cabo San Lucas`,
          description: `${fileName} for ${category} section`,
          tags
        });
      }
      setPreviews(newPreviews);
    }
  };
  
  // Update preview data
  const updatePreview = (index: number, field: keyof PhotoPreview, value: string) => {
    const updated = [...previews];
    updated[index] = { ...updated[index], [field]: value };
    setPreviews(updated);
  };
  
  // Handle bulk upload
  const handleUpload = async () => {
    if (!previews.length) {
      toast({
        title: "No files selected",
        description: "Please select files to upload first.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < previews.length; i++) {
        const preview = previews[i];
        const formData = new FormData();
        formData.append('file', preview.file);
        formData.append('name', preview.name);
        formData.append('alt_text', preview.alt_text);
        formData.append('description', preview.description);
        formData.append('category', preview.category);
        formData.append('tags', preview.tags);
        
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${preview.name}`);
        }
        
        // Update progress
        setProgress(Math.round(((i + 1) / previews.length) * 100));
      }
      
      // Success
      toast({
        title: "Upload successful",
        description: `${previews.length} images have been uploaded.`,
        variant: "default"
      });
      
      // Refresh image list
      refetch();
      
      // Clear previews
      setPreviews([]);
      setPhotoFiles(null);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Handle replacement file selection
  const handleReplacementFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setReplacementFile(file);
      setReplacementPreview(URL.createObjectURL(file));
    }
  };
  
  // Handle image replacement
  const handleReplaceImage = async () => {
    if (!selectedImageId || !replacementFile) {
      toast({
        title: "Missing information",
        description: "Please select an image to replace and upload a replacement file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsReplacing(true);
    
    try {
      // Find the selected image
      const selectedImage = images?.find(img => img.id === selectedImageId);
      if (!selectedImage) {
        throw new Error("Selected image not found");
      }
      
      // First, delete the existing image
      const deleteResponse = await fetch(`/api/images/${selectedImageId}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        throw new Error("Failed to delete the existing image");
      }
      
      // Then upload the new one
      const formData = new FormData();
      formData.append('file', replacementFile);
      formData.append('name', selectedImage.name);
      formData.append('alt_text', selectedImage.alt_text);
      formData.append('description', selectedImage.description || '');
      formData.append('category', selectedImage.category);
      formData.append('tags', selectedImage.tags ? selectedImage.tags.join(',') : '');
      formData.append('featured', selectedImage.featured ? 'true' : 'false');
      
      const uploadResponse = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload the replacement image");
      }
      
      // Success
      toast({
        title: "Replacement successful",
        description: "The image has been replaced successfully.",
        variant: "default"
      });
      
      // Refresh image list
      refetch();
      
      // Clear replacement state
      setSelectedImageId(null);
      setReplacementFile(null);
      setReplacementPreview(null);
      
    } catch (error) {
      toast({
        title: "Replacement failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsReplacing(false);
    }
  };
  
  const handleSyncToSection = async () => {
    if (!selectedSection) {
      toast({
        title: "No section selected",
        description: "Please select a website section to sync photos to.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Filter for images associated with the selected section
      let categoryToSync: string;
      
      switch(selectedSection) {
        case "resorts":
          categoryToSync = "resort";
          break;
        case "testimonials":
          categoryToSync = "testimonial";
          break;
        case "activities":
          categoryToSync = "activity";
          break;
        case "dining":
          categoryToSync = "restaurant";
          break;
        case "hero":
          categoryToSync = "hero";
          break;
        case "concierge":
          categoryToSync = "luxury";
          break;
        default:
          categoryToSync = selectedSection;
      }
      
      // Find all featured images in this category
      const featuredImages = images?.filter(
        img => img.category === categoryToSync && img.featured
      );
      
      if (!featuredImages || featuredImages.length === 0) {
        toast({
          title: "No images found",
          description: `No featured images found for the ${selectedSection} section. Upload and mark images as featured first.`,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Sync completed",
        description: `${featuredImages.length} images have been synced to the ${selectedSection} section.`,
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Photo Sync Manager</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Website Photos</CardTitle>
          <CardDescription>
            Upload new photos, replace existing ones, and sync them to different sections of the website.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-3 w-full">
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Photos
              </TabsTrigger>
              <TabsTrigger value="replace">
                <Replace className="mr-2 h-4 w-4" />
                Replace Photos
              </TabsTrigger>
              <TabsTrigger value="sync">
                <ImageUp className="mr-2 h-4 w-4" />
                Sync to Website
              </TabsTrigger>
            </TabsList>
            
            {/* Upload Tab */}
            <TabsContent value="upload">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Photo Category</Label>
                      <Select 
                        value={category} 
                        onValueChange={setCategory}
                        disabled={uploading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ImageCategory.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="luxury, ocean view, family"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="photo-upload">Select Photos</Label>
                    <div className="mt-1">
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  
                  {previews.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Photo Previews</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {previews.map((preview, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <img 
                              src={preview.url} 
                              alt={preview.name} 
                              className="w-full h-40 object-cover rounded mb-4"
                            />
                            
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor={`name-${index}`}>Name</Label>
                                <Input
                                  id={`name-${index}`}
                                  value={preview.name}
                                  onChange={(e) => updatePreview(index, 'name', e.target.value)}
                                  disabled={uploading}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`alt-${index}`}>Alt Text</Label>
                                <Input
                                  id={`alt-${index}`}
                                  value={preview.alt_text}
                                  onChange={(e) => updatePreview(index, 'alt_text', e.target.value)}
                                  disabled={uploading}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`desc-${index}`}>Description</Label>
                                <Textarea
                                  id={`desc-${index}`}
                                  value={preview.description}
                                  onChange={(e) => updatePreview(index, 'description', e.target.value)}
                                  disabled={uploading}
                                  rows={2}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`category-${index}`}>Category</Label>
                                <Select 
                                  value={preview.category} 
                                  onValueChange={(value) => updatePreview(index, 'category', value)}
                                  disabled={uploading}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ImageCategory.map((cat) => (
                                      <SelectItem key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor={`tags-${index}`}>Tags</Label>
                                <Input
                                  id={`tags-${index}`}
                                  value={preview.tags}
                                  onChange={(e) => updatePreview(index, 'tags', e.target.value)}
                                  placeholder="comma, separated, tags"
                                  disabled={uploading}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="mt-4">
                      <Label>Upload Progress</Label>
                      <Progress value={progress} className="h-2 mt-2" />
                      <p className="text-sm text-center mt-2">{progress}% Complete</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleUpload} 
                      disabled={uploading || previews.length === 0}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading ({progress}%)
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload {previews.length} Photos
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Replace Tab */}
            <TabsContent value="replace">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="image-select">Select Image to Replace</Label>
                    <Select 
                      value={selectedImageId?.toString() || ""} 
                      onValueChange={(value) => setSelectedImageId(parseInt(value))}
                      disabled={isReplacing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an image" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingImages ? (
                          <SelectItem value="loading" disabled>
                            Loading images...
                          </SelectItem>
                        ) : (
                          images?.map((image) => (
                            <SelectItem key={image.id} value={image.id.toString()}>
                              {image.name} ({image.category})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedImageId && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Selected Image</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          {images?.find(img => img.id === selectedImageId) && (
                            <img 
                              src={images.find(img => img.id === selectedImageId)?.image_url} 
                              alt={images.find(img => img.id === selectedImageId)?.alt_text}
                              className="w-full h-40 object-cover rounded" 
                            />
                          )}
                        </div>
                        <div>
                          <dl className="grid grid-cols-1 gap-1 text-sm">
                            <div className="grid grid-cols-3">
                              <dt className="font-medium">Name:</dt>
                              <dd className="col-span-2">{images?.find(img => img.id === selectedImageId)?.name}</dd>
                            </div>
                            <div className="grid grid-cols-3">
                              <dt className="font-medium">Category:</dt>
                              <dd className="col-span-2">{images?.find(img => img.id === selectedImageId)?.category}</dd>
                            </div>
                            <div className="grid grid-cols-3">
                              <dt className="font-medium">Created:</dt>
                              <dd className="col-span-2">
                                {images?.find(img => img.id === selectedImageId)?.created_at && 
                                  format(new Date(images.find(img => img.id === selectedImageId)!.created_at), 'MMM d, yyyy')}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="replacement-upload">Upload Replacement Photo</Label>
                    <div className="mt-1">
                      <Input
                        id="replacement-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleReplacementFileChange}
                        disabled={isReplacing || !selectedImageId}
                      />
                    </div>
                  </div>
                  
                  {replacementPreview && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Replacement Preview</h3>
                      <img 
                        src={replacementPreview} 
                        alt="Preview" 
                        className="w-full h-40 object-cover rounded" 
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleReplaceImage} 
                      disabled={isReplacing || !selectedImageId || !replacementFile}
                    >
                      {isReplacing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Replacing...
                        </>
                      ) : (
                        <>
                          <Replace className="mr-2 h-4 w-4" />
                          Replace Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Sync Tab */}
            <TabsContent value="sync">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="section-select">Select Website Section</Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {getWebsiteSections().map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          {section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedSection && (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">
                      Featured Images for {getWebsiteSections().find(s => s.value === selectedSection)?.label}
                    </h3>
                    
                    {isLoadingImages ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(() => {
                          let categoryFilter: string;
                          
                          switch(selectedSection) {
                            case "resorts": categoryFilter = "resort"; break;
                            case "testimonials": categoryFilter = "testimonial"; break;
                            case "activities": categoryFilter = "activity"; break;
                            case "dining": categoryFilter = "restaurant"; break;
                            case "hero": categoryFilter = "hero"; break;
                            case "concierge": categoryFilter = "luxury"; break;
                            default: categoryFilter = selectedSection;
                          }
                          
                          const filteredImages = images?.filter(
                            img => img.category === categoryFilter && img.featured
                          );
                          
                          if (!filteredImages || filteredImages.length === 0) {
                            return (
                              <div className="col-span-full py-8 text-center">
                                <p>No featured images found for this section.</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Upload images and mark them as featured in the "Upload" tab.
                                </p>
                              </div>
                            );
                          }
                          
                          return filteredImages.map(image => (
                            <div key={image.id} className="border rounded overflow-hidden">
                              <img 
                                src={image.image_url} 
                                alt={image.alt_text}
                                className="w-full h-32 object-cover" 
                              />
                              <div className="p-2">
                                <p className="text-sm font-medium truncate">{image.name}</p>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSyncToSection} 
                    disabled={!selectedSection}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Sync to {selectedSection ? getWebsiteSections().find(s => s.value === selectedSection)?.label : "Section"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
}