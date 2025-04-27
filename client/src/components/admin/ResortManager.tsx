import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Plus, Edit, Trash2, Save, Upload, X, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";

interface Resort {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  imageUrl: string;
  category: string;
  amenities: string[];
  featured: boolean;
}

export default function ResortManager() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [filteredResorts, setFilteredResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [editForm, setEditForm] = useState<Partial<Resort>>({});
  const [createForm, setCreateForm] = useState<Partial<Resort>>({
    name: '',
    description: '',
    location: '',
    rating: 4.5,
    reviewCount: 0,
    priceLevel: '$$$',
    category: 'hotel',
    amenities: [],
    featured: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all resorts
  useEffect(() => {
    fetchResorts();
  }, []);

  // Filter resorts based on search term and category
  useEffect(() => {
    if (!resorts.length) return;
    
    let filtered = [...resorts];
    
    if (searchTerm) {
      filtered = filtered.filter(resort => 
        resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resort.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resort.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(resort => resort.category === categoryFilter);
    }
    
    setFilteredResorts(filtered);
  }, [resorts, searchTerm, categoryFilter]);

  async function fetchResorts() {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      // This would be: const response = await apiRequest('GET', '/api/resorts');
      
      const mockResorts: Resort[] = [
        {
          id: 1,
          name: "Four Seasons Resort Los Cabos",
          description: "Luxury beachfront resort with stunning ocean views",
          location: "Los Cabos, Baja California Sur, Mexico",
          rating: 4.9,
          reviewCount: 356,
          priceLevel: "$$$$",
          imageUrl: "/uploads/four-seasons-los-cabos.jpg",
          category: "luxury",
          amenities: ["Beach Access", "Spa", "Pool", "Fine Dining", "Golf"],
          featured: true
        },
        {
          id: 2,
          name: "Grand Velas Los Cabos",
          description: "All-inclusive resort with world-class amenities",
          location: "Cabo San Lucas, Mexico",
          rating: 4.8,
          reviewCount: 289,
          priceLevel: "$$$",
          imageUrl: "/uploads/grand-velas-los-cabos.jpg",
          category: "all-inclusive",
          amenities: ["All-Inclusive", "Spa", "Pool", "Kids Club", "Restaurants"],
          featured: true
        }
      ];
      
      setResorts(mockResorts);
      setFilteredResorts(mockResorts);
    } catch (error) {
      toast({
        title: "Error fetching resorts",
        description: "Could not load resorts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditResort(resort: Resort) {
    setSelectedResort(resort);
    setEditForm({...resort});
    setIsEditDialogOpen(true);
  }

  function handleCreateResort() {
    setCreateForm({
      name: '',
      description: '',
      location: '',
      rating: 4.5,
      reviewCount: 0,
      priceLevel: '$$$',
      category: 'hotel',
      amenities: [],
      featured: false,
    });
    setIsCreateDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (!selectedResort) return;
    
    try {
      // Call the API endpoint to update the resort
      const response = await apiRequest('PUT', `/api/resorts/${selectedResort.id}`, editForm);
      
      if (!response.ok) {
        throw new Error(`Failed to update resort: ${response.statusText}`);
      }
      
      const updatedResort = await response.json();
      
      // Update local state with the response from the server
      const updatedResorts = resorts.map(resort => 
        resort.id === selectedResort.id ? updatedResort : resort
      );
      
      setResorts(updatedResorts);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Resort updated",
        description: "The resort has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating resort:", error);
      toast({
        title: "Error updating resort",
        description: "Could not update the resort. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleCreateSubmit() {
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: const response = await apiRequest('POST', '/api/resorts', createForm);
      
      const newResort: Resort = {
        id: Math.max(0, ...resorts.map(r => r.id)) + 1,
        name: createForm.name || '',
        description: createForm.description || '',
        location: createForm.location || '',
        rating: createForm.rating || 4.5,
        reviewCount: createForm.reviewCount || 0,
        priceLevel: createForm.priceLevel || '$$$',
        imageUrl: createForm.imageUrl || '/placeholder-resort.jpg',
        category: createForm.category || 'hotel',
        amenities: createForm.amenities || [],
        featured: createForm.featured || false,
      };
      
      setResorts([...resorts, newResort]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Resort created",
        description: "The new resort has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error creating resort",
        description: "Could not create the resort. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleDeleteResort(id: number) {
    if (!confirm("Are you sure you want to delete this resort? This action cannot be undone.")) {
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: await apiRequest('DELETE', `/api/resorts/${id}`);
      
      const updatedResorts = resorts.filter(resort => resort.id !== id);
      setResorts(updatedResorts);
      
      toast({
        title: "Resort deleted",
        description: "The resort has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting resort",
        description: "Could not delete the resort. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, isCreate: boolean) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('image', file);
      
      // First, show a temporary preview
      const temporaryUrl = URL.createObjectURL(file);
      
      if (isCreate) {
        setCreateForm(prev => ({...prev, imageUrl: temporaryUrl}));
      } else {
        setEditForm(prev => ({...prev, imageUrl: temporaryUrl}));
      }
      
      // Upload the image to the server
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
      
      // Get the permanent image URL from the server response
      const result = await response.json();
      const imageUrl = result.file_path || result.url || result.image_url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }
      
      // Update form with permanent URL
      if (isCreate) {
        setCreateForm(prev => ({...prev, imageUrl}));
      } else {
        setEditForm(prev => ({...prev, imageUrl}));
      }
      
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded and will be saved with your changes.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Image upload failed",
        description: String(error) || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  }

  const amenitiesList = [
    "Beach Access", "Pool", "Spa", "Gym", "Restaurant", "Bar", 
    "Room Service", "Free WiFi", "Airport Shuttle", "Concierge", 
    "Kids Club", "Golf", "Tennis", "Water Sports", "All-Inclusive"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resort Management</CardTitle>
          <CardDescription>
            Manage all hotels and resorts. Add, edit, or remove resorts from the website.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setCategoryFilter('all')}>All</TabsTrigger>
                <TabsTrigger value="luxury" onClick={() => setCategoryFilter('luxury')}>Luxury</TabsTrigger>
                <TabsTrigger value="all-inclusive" onClick={() => setCategoryFilter('all-inclusive')}>All-Inclusive</TabsTrigger>
                <TabsTrigger value="boutique" onClick={() => setCategoryFilter('boutique')}>Boutique</TabsTrigger>
                <TabsTrigger value="hotel" onClick={() => setCategoryFilter('hotel')}>Hotel</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resorts..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleCreateResort} className="bg-green-800 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Resort
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResorts.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No resorts found matching your criteria</p>
                </div>
              ) : (
                filteredResorts.map((resort) => (
                  <Card key={resort.id} className={`overflow-hidden ${resort.featured ? 'border-primary' : ''}`}>
                    <div className="aspect-video relative">
                      <img 
                        src={resort.imageUrl}
                        alt={resort.name}
                        className="w-full h-full object-fill"
                      />
                      {resort.featured && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold line-clamp-2">{resort.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{resort.rating} ({resort.reviewCount})</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <div>{resort.location}</div>
                        <div>Price: {resort.priceLevel}</div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm line-clamp-2">{resort.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resort.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {resort.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resort.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-500 text-white"
                          size="sm"
                          onClick={() => handleEditResort(resort)}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteResort(resort.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Resort</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Resort Name</Label>
                <Input 
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input 
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editForm.rating || ''}
                    onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input 
                    id="reviewCount"
                    type="number"
                    min="0"
                    value={editForm.reviewCount || ''}
                    onChange={(e) => setEditForm({...editForm, reviewCount: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="priceLevel">Price Level</Label>
                  <Select
                    value={editForm.priceLevel || ''}
                    onValueChange={(value) => setEditForm({...editForm, priceLevel: value})}
                  >
                    <SelectTrigger id="priceLevel">
                      <SelectValue placeholder="Select price level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ (Budget)</SelectItem>
                      <SelectItem value="$$">$$ (Moderate)</SelectItem>
                      <SelectItem value="$$$">$$$ (Upscale)</SelectItem>
                      <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editForm.category || ''}
                    onValueChange={(value) => setEditForm({...editForm, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="all-inclusive">All-Inclusive</SelectItem>
                      <SelectItem value="boutique">Boutique</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editForm.featured || false}
                  onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured">Featured Resort</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  className="h-20"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Resort Image</Label>
                <div className="mt-2">
                  {editForm.imageUrl ? (
                    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={editForm.imageUrl}
                        alt="Resort"
                        className="w-full h-full object-fill"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        onClick={() => setEditForm({...editForm, imageUrl: ''})}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUpload(e, false)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Amenities</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={(editForm.amenities || []).includes(amenity)}
                        onChange={(e) => {
                          const currentAmenities = editForm.amenities || [];
                          const newAmenities = e.target.checked
                            ? [...currentAmenities, amenity]
                            : currentAmenities.filter(a => a !== amenity);
                          
                          setEditForm({...editForm, amenities: newAmenities});
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Resort</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">Resort Name</Label>
                <Input 
                  id="create-name"
                  value={createForm.name || ''}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="create-location">Location</Label>
                <Input 
                  id="create-location"
                  value={createForm.location || ''}
                  onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="create-rating">Rating (1-5)</Label>
                  <Input 
                    id="create-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={createForm.rating || ''}
                    onChange={(e) => setCreateForm({...createForm, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-reviewCount">Review Count</Label>
                  <Input 
                    id="create-reviewCount"
                    type="number"
                    min="0"
                    value={createForm.reviewCount || ''}
                    onChange={(e) => setCreateForm({...createForm, reviewCount: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="create-priceLevel">Price Level</Label>
                  <Select
                    value={createForm.priceLevel || ''}
                    onValueChange={(value) => setCreateForm({...createForm, priceLevel: value})}
                  >
                    <SelectTrigger id="create-priceLevel">
                      <SelectValue placeholder="Select price level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ (Budget)</SelectItem>
                      <SelectItem value="$$">$$ (Moderate)</SelectItem>
                      <SelectItem value="$$$">$$$ (Upscale)</SelectItem>
                      <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-category">Category</Label>
                  <Select
                    value={createForm.category || ''}
                    onValueChange={(value) => setCreateForm({...createForm, category: value})}
                  >
                    <SelectTrigger id="create-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="all-inclusive">All-Inclusive</SelectItem>
                      <SelectItem value="boutique">Boutique</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-featured"
                  checked={createForm.featured || false}
                  onChange={(e) => setCreateForm({...createForm, featured: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="create-featured">Featured Resort</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-description">Description</Label>
                <Textarea 
                  id="create-description"
                  className="h-20"
                  value={createForm.description || ''}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Resort Image</Label>
                <div className="mt-2">
                  {createForm.imageUrl ? (
                    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={createForm.imageUrl}
                        alt="Resort"
                        className="w-full h-full object-fill"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        onClick={() => setCreateForm({...createForm, imageUrl: ''})}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={createFileInputRef}
                        onChange={(e) => handleImageUpload(e, true)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => createFileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Amenities</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`create-amenity-${amenity}`}
                        checked={(createForm.amenities || []).includes(amenity)}
                        onChange={(e) => {
                          const currentAmenities = createForm.amenities || [];
                          const newAmenities = e.target.checked
                            ? [...currentAmenities, amenity]
                            : currentAmenities.filter(a => a !== amenity);
                          
                          setCreateForm({...createForm, amenities: newAmenities});
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`create-amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>
              <Plus className="mr-2 h-4 w-4" />
              Create Resort
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}