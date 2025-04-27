import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Trash2, 
  Edit, 
  RefreshCw, 
  Search, 
  Upload, 
  Image,
  Tag,
  Plus,
  Copy,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface ImageType {
  id: number;
  name: string;
  image_url: string;
  alt_text: string;
  description: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedImageUrl, setCopiedImageUrl] = useState<number | null>(null);
  const { toast } = useToast();

  // Form states for upload
  const [uploadForm, setUploadForm] = useState({
    name: '',
    alt_text: '',
    description: '',
    category: 'uncategorized',
    tags: '',
    file: null as File | null,
  });

  // Form states for edit
  const [editForm, setEditForm] = useState({
    name: '',
    alt_text: '',
    description: '',
    category: '',
    tags: [] as string[],
  });

  useEffect(() => {
    fetchImages();
  }, [category, searchTerm]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/images', window.location.origin);
      if (category !== 'all') {
        url.searchParams.append('category', category);
      }
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchImages();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0],
      });
    }
  };

  const handleUploadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value,
    });
  };

  const handleUploadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    if (!uploadForm.name || !uploadForm.alt_text) {
      toast({
        title: 'Error',
        description: 'Name and alt text are required',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('name', uploadForm.name);
    formData.append('alt_text', uploadForm.alt_text);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('tags', uploadForm.tags);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newImage = await response.json();
        setImages(prev => [newImage, ...prev]);
        setIsUploadDialogOpen(false);
        resetUploadForm();
        
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      name: '',
      alt_text: '',
      description: '',
      category: 'uncategorized',
      tags: '',
      file: null,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditImage = (image: ImageType) => {
    setSelectedImage(image);
    setEditForm({
      name: image.name,
      alt_text: image.alt_text,
      description: image.description || '',
      category: image.category,
      tags: image.tags || [],
    });
    setSelectedTags(new Set(image.tags || []));
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      const newTags = new Set(selectedTags);
      newTags.add(tagInput.trim());
      setSelectedTags(newTags);
      setEditForm({
        ...editForm,
        tags: Array.from(newTags),
      });
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    const newTags = new Set(selectedTags);
    newTags.delete(tag);
    setSelectedTags(newTags);
    setEditForm({
      ...editForm,
      tags: Array.from(newTags),
    });
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/images/${selectedImage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          alt_text: editForm.alt_text,
          description: editForm.description,
          category: editForm.category,
          tags: editForm.tags,
        }),
      });

      if (response.ok) {
        const updatedImage = await response.json();
        setImages(prev => prev.map(img => img.id === updatedImage.id ? updatedImage : img));
        setIsEditDialogOpen(false);
        
        toast({
          title: 'Success',
          description: 'Image updated successfully',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update image',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        
        toast({
          title: 'Success',
          description: 'Image deleted successfully',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Image Management</CardTitle>
          <CardDescription>
            Manage all website images in one place. Upload, edit metadata, and organize images for SEO.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div className="flex space-x-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="yacht">Yacht</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => fetchImages()} 
                variant="outline" 
                size="icon"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Image className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No images found. Upload an image to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Alt Text</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell className="font-medium">{image.id}</TableCell>
                      <TableCell>
                        <img 
                          src={image.image_url.startsWith('http') ? image.image_url : image.image_url} 
                          alt={image.alt_text} 
                          className="h-10 w-10 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{image.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{image.alt_text}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{image.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {image.width}x{image.height} | {formatBytes(image.file_size || 0)}
                      </TableCell>
                      <TableCell>{formatDate(image.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(image.image_url);
                              setCopiedImageUrl(image.id);
                              toast({
                                title: "URL Copied",
                                description: "Image URL copied to clipboard",
                                duration: 2000,
                              });
                              
                              // Reset the copied status after 2 seconds
                              setTimeout(() => {
                                setCopiedImageUrl(null);
                              }, 2000);
                            }}
                            title="Copy Image URL"
                          >
                            {copiedImageUrl === image.id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditImage(image)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{image.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteImage(image.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {images.length} images
          </div>
        </CardFooter>
      </Card>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
            <DialogDescription>
              Upload a new image and add all the relevant metadata.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadFormSubmit} className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="upload-file">Image File</Label>
              <Input
                id="upload-file"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upload-name">Image Name</Label>
                <Input
                  id="upload-name"
                  name="name"
                  value={uploadForm.name}
                  onChange={handleUploadFormChange}
                  placeholder="e.g., Cabo Villa Sunset"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="upload-category">Category</Label>
                <Select 
                  value={uploadForm.category} 
                  onValueChange={(value) => setUploadForm({...uploadForm, category: value})}
                >
                  <SelectTrigger id="upload-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="yacht">Yacht</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-alt">Alt Text</Label>
              <Input
                id="upload-alt"
                name="alt_text"
                value={uploadForm.alt_text}
                onChange={handleUploadFormChange}
                placeholder="Descriptive text for screen readers and SEO"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-description">Description</Label>
              <Textarea
                id="upload-description"
                name="description"
                value={uploadForm.description}
                onChange={handleUploadFormChange}
                placeholder="Longer description of the image"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-tags">Tags (comma separated)</Label>
              <Input
                id="upload-tags"
                name="tags"
                value={uploadForm.tags}
                onChange={handleUploadFormChange}
                placeholder="e.g., sunset, beach, luxury"
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  resetUploadForm();
                  setIsUploadDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Upload Image</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
            <DialogDescription>
              Update the metadata for this image.
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <form onSubmit={handleEditFormSubmit} className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.alt_text} 
                  className="max-h-[150px] rounded-md object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Image Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editForm.category} 
                    onValueChange={(value) => setEditForm({...editForm, category: value})}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="yacht">Yacht</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-alt">Alt Text</Label>
                <Input
                  id="edit-alt"
                  name="alt_text"
                  value={editForm.alt_text}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    id="edit-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="secondary"
                    onClick={handleTagAdd}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {editForm.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 rounded-full hover:bg-secondary-foreground/10 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}