import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Plus, Edit, Trash2, Save, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

// Define the Restaurant interface based on schema
interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  cuisine: string;
  priceLevel: string;
  rating: number;
  reviewCount: number;
  openTable?: string;
  website?: string;
  phone?: string;
  openHours?: Record<string, string>;
  menuUrl?: string;
  imageUrl: string;
  imageUrls: string[];
  featured: boolean;
  category: "seafood" | "mexican" | "italian" | "steakhouse" | "fusion" | "american" | "japanese" | "vegan" | "international";
  tags: string[];
  features: string[];
  reviews: Array<{name: string, rating: number, comment: string, date: string}>;
  createdAt: string;
  updatedAt: string;
}

// Create a component for managing restaurants (CRUD operations)
export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [editForm, setEditForm] = useState<Partial<Restaurant>>({});
  const [createForm, setCreateForm] = useState<Partial<Restaurant>>({
    name: '',
    description: '',
    location: 'Cabo San Lucas',
    cuisine: '',
    priceLevel: '$$',
    rating: 4.5,
    reviewCount: 0,
    category: 'mexican',
    features: [],
    tags: [],
    reviews: [],
    featured: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all restaurants
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Filter restaurants based on search term and category
  useEffect(() => {
    if (!restaurants.length) return;
    
    let filtered = [...restaurants];
    
    if (searchTerm) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.category === categoryFilter);
    }
    
    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, categoryFilter]);

  async function fetchRestaurants() {
    setLoading(true);
    try {
      // Fetch restaurants from the API
      const response = await apiRequest('GET', '/api/restaurants');
      const data = await response.json();
      
      console.log("Fetched restaurants:", data);
      
      // Set the restaurants in state
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        title: "Error",
        description: "Failed to load restaurants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCreateChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string, value: any }) {
    const { name, value } = 'target' in e ? e.target : e;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string, value: any }) {
    const { name, value } = 'target' in e ? e.target : e;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  function handleAddFeature(formType: 'create' | 'edit') {
    const inputElement = document.getElementById(
      formType === 'create' ? 'new-feature-input' : 'edit-feature-input'
    ) as HTMLInputElement;

    if (inputElement && inputElement.value.trim()) {
      const newFeature = inputElement.value.trim();
      if (formType === 'create') {
        setCreateForm(prev => ({
          ...prev,
          features: [...(prev.features || []), newFeature]
        }));
      } else {
        setEditForm(prev => ({
          ...prev,
          features: [...(prev.features || []), newFeature]
        }));
      }
      inputElement.value = '';
    }
  }

  function handleRemoveFeature(formType: 'create' | 'edit', index: number) {
    if (formType === 'create') {
      setCreateForm(prev => ({
        ...prev,
        features: (prev.features || []).filter((_, i) => i !== index)
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        features: (prev.features || []).filter((_, i) => i !== index)
      }));
    }
  }

  function handleAddTag(formType: 'create' | 'edit') {
    const inputElement = document.getElementById(
      formType === 'create' ? 'new-tag-input' : 'edit-tag-input'
    ) as HTMLInputElement;

    if (inputElement && inputElement.value.trim()) {
      const newTag = inputElement.value.trim();
      if (formType === 'create') {
        setCreateForm(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      } else {
        setEditForm(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      }
      inputElement.value = '';
    }
  }

  function handleRemoveTag(formType: 'create' | 'edit', index: number) {
    if (formType === 'create') {
      setCreateForm(prev => ({
        ...prev,
        tags: (prev.tags || []).filter((_, i) => i !== index)
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        tags: (prev.tags || []).filter((_, i) => i !== index)
      }));
    }
  }

  async function handleCreateRestaurant() {
    try {
      const response = await apiRequest('POST', '/api/restaurants', createForm);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create restaurant');
      }
      
      const newRestaurant = await response.json();
      
      setRestaurants(prev => [...prev, newRestaurant]);
      setIsCreateDialogOpen(false);
      
      // Reset form
      setCreateForm({
        name: '',
        description: '',
        location: 'Cabo San Lucas',
        cuisine: '',
        priceLevel: '$$',
        rating: 4.5,
        reviewCount: 0,
        category: 'mexican',
        features: [],
        tags: [],
        reviews: [],
        featured: false,
      });
      
      toast({
        title: "Success",
        description: "Restaurant created successfully",
      });
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create restaurant",
        variant: "destructive"
      });
    }
  }

  async function handleUpdateRestaurant() {
    if (!selectedRestaurant) return;
    
    try {
      const response = await apiRequest('PUT', `/api/restaurants/${selectedRestaurant.id}`, editForm);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update restaurant');
      }
      
      const updatedRestaurant = await response.json();
      
      setRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
        )
      );
      
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Restaurant updated successfully",
      });
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update restaurant",
        variant: "destructive"
      });
    }
  }

  async function handleDeleteRestaurant(id: number) {
    if (!confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await apiRequest('DELETE', `/api/restaurants/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete restaurant');
      }
      
      setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
      
      toast({
        title: "Success",
        description: "Restaurant deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete restaurant",
        variant: "destructive"
      });
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, restaurantId?: number) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('category', 'restaurant');
    
    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      if (restaurantId) {
        // Update existing restaurant with new image
        const currentRestaurant = restaurants.find(r => r.id === restaurantId);
        if (currentRestaurant) {
          const imageUrls = [...(currentRestaurant.imageUrls || []), data.url];
          const updatedData = { 
            imageUrl: imageUrls[0] || data.url, // Set primary image if none exists
            imageUrls 
          };
          
          const updateResponse = await apiRequest('PUT', `/api/restaurants/${restaurantId}`, updatedData);
          
          if (updateResponse.ok) {
            const updatedRestaurant = await updateResponse.json();
            setRestaurants(prev => 
              prev.map(restaurant => 
                restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
              )
            );
            
            setEditForm(prev => ({
              ...prev,
              imageUrl: updatedRestaurant.imageUrl,
              imageUrls: updatedRestaurant.imageUrls
            }));
          }
        }
      } else {
        // For new restaurant
        setCreateForm(prev => {
          const imageUrls = [...(prev.imageUrls || []), data.url];
          return {
            ...prev,
            imageUrl: imageUrls[0] || data.url,
            imageUrls
          };
        });
      }
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    }
  }

  function handleRemoveImage(formType: 'create' | 'edit', index: number) {
    if (formType === 'create') {
      setCreateForm(prev => {
        const newImageUrls = (prev.imageUrls || []).filter((_, i) => i !== index);
        return {
          ...prev,
          imageUrls: newImageUrls,
          imageUrl: newImageUrls[0] || '' // Update primary image if needed
        };
      });
    } else {
      setEditForm(prev => {
        const newImageUrls = (prev.imageUrls || []).filter((_, i) => i !== index);
        return {
          ...prev,
          imageUrls: newImageUrls,
          imageUrl: newImageUrls[0] || prev.imageUrl || '' // Keep current primary if available
        };
      });
    }
  }

  function handleOpenEditDialog(restaurant: Restaurant) {
    setSelectedRestaurant(restaurant);
    setEditForm({
      ...restaurant,
      // Convert any missing arrays to empty arrays for editing
      features: restaurant.features || [],
      tags: restaurant.tags || [],
      imageUrls: restaurant.imageUrls || [],
      reviews: restaurant.reviews || []
    });
    setIsEditDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="seafood">Seafood</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="steakhouse">Steakhouse</SelectItem>
              <SelectItem value="fusion">Fusion</SelectItem>
              <SelectItem value="american">American</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> New Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Restaurant</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-right">
                  Restaurant Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="El Pescador"
                  value={createForm.name || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A beautiful oceanfront restaurant..."
                  value={createForm.description || ''}
                  onChange={handleCreateChange}
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  name="category"
                  value={createForm.category as string || 'mexican'}
                  onValueChange={(value) => handleCreateChange({ name: 'category', value })}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seafood">Seafood</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="steakhouse">Steakhouse</SelectItem>
                    <SelectItem value="fusion">Fusion</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cuisine" className="text-right">
                  Cuisine Type
                </Label>
                <Input
                  id="cuisine"
                  name="cuisine"
                  placeholder="Traditional Mexican"
                  value={createForm.cuisine || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="priceLevel" className="text-right">
                  Price Level
                </Label>
                <Select
                  name="priceLevel"
                  value={createForm.priceLevel || '$$'}
                  onValueChange={(value) => handleCreateChange({ name: 'priceLevel', value })}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select price level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ (Budget)</SelectItem>
                    <SelectItem value="$$">$$ (Moderate)</SelectItem>
                    <SelectItem value="$$$">$$$ (Upscale)</SelectItem>
                    <SelectItem value="$$$$">$$$$ (Fine Dining)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Cabo San Lucas"
                  value={createForm.location || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-right">
                  Full Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Beach Road, Cabo San Lucas"
                  value={createForm.address || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+52 624 123 4567"
                  value={createForm.phone || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="website" className="text-right">
                  Website URL
                </Label>
                <Input
                  id="website"
                  name="website"
                  placeholder="https://www.restaurant-website.com"
                  value={createForm.website || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="openTable" className="text-right">
                  OpenTable URL
                </Label>
                <Input
                  id="openTable"
                  name="openTable"
                  placeholder="https://www.opentable.com/r/restaurant"
                  value={createForm.openTable || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="menuUrl" className="text-right">
                  Menu URL
                </Label>
                <Input
                  id="menuUrl"
                  name="menuUrl"
                  placeholder="https://www.restaurant-website.com/menu"
                  value={createForm.menuUrl || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="rating" className="text-right">
                  Rating (1-5)
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                  value={createForm.rating || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="reviewCount" className="text-right">
                  Number of Reviews
                </Label>
                <Input
                  id="reviewCount"
                  name="reviewCount"
                  type="number"
                  min="0"
                  placeholder="42"
                  value={createForm.reviewCount || ''}
                  onChange={handleCreateChange}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="featured"
                    checked={createForm.featured || false}
                    onCheckedChange={(checked) => 
                      handleCreateChange({ name: 'featured', value: checked })
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured Restaurant (highlight on homepage)
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-right block mb-2">
                  Restaurant Images
                </Label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                  {(createForm.imageUrls || []).map((url, index) => (
                    <div key={index} className="relative group border rounded-md h-24 overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Restaurant image ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage('create', index)}
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div 
                    className="border rounded-md flex items-center justify-center h-24 cursor-pointer hover:bg-muted"
                    onClick={() => createFileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={createFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                    />
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-right block mb-2">
                  Key Features
                </Label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {(createForm.features || []).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="group flex items-center gap-1">
                      {feature}
                      <button 
                        onClick={() => handleRemoveFeature('create', index)}
                        className="text-xs hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    id="new-feature-input"
                    placeholder="Add a feature (e.g., 'Ocean View')"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddFeature('create')}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-right block mb-2">
                  Tags
                </Label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {(createForm.tags || []).map((tag, index) => (
                    <Badge key={index} className="group flex items-center gap-1">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag('create', index)}
                        className="text-xs hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    id="new-tag-input"
                    placeholder="Add a tag (e.g., 'family-friendly')"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddTag('create')}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRestaurant}>
                Create Restaurant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter !== 'all' 
              ? "Try adjusting your search or filter" 
              : "Add your first restaurant to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={restaurant.imageUrl} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                {restaurant.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500">Featured</Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                  <Badge variant="outline">{restaurant.priceLevel}</Badge>
                </div>
                <CardDescription className="flex items-center">
                  <span className="flex items-center mr-2">
                    ⭐ {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium">
                    {restaurant.location}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary">{restaurant.category}</Badge>
                  <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  {restaurant.tags?.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                  {(restaurant.tags?.length || 0) > 2 && (
                    <Badge variant="outline">+{(restaurant.tags?.length || 0) - 2} more</Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center"
                      onClick={() => handleOpenEditDialog(restaurant)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex items-center"
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Restaurant: {selectedRestaurant?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2">
              <Label htmlFor="edit-name" className="text-right">
                Restaurant Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={editForm.name || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={editForm.description || ''}
                onChange={handleEditChange}
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Select
                name="category"
                value={editForm.category as string || 'mexican'}
                onValueChange={(value) => handleEditChange({ name: 'category', value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seafood">Seafood</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="steakhouse">Steakhouse</SelectItem>
                  <SelectItem value="fusion">Fusion</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-cuisine" className="text-right">
                Cuisine Type
              </Label>
              <Input
                id="edit-cuisine"
                name="cuisine"
                value={editForm.cuisine || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-priceLevel" className="text-right">
                Price Level
              </Label>
              <Select
                name="priceLevel"
                value={editForm.priceLevel || '$$'}
                onValueChange={(value) => handleEditChange({ name: 'priceLevel', value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select price level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ (Budget)</SelectItem>
                  <SelectItem value="$$">$$ (Moderate)</SelectItem>
                  <SelectItem value="$$$">$$$ (Upscale)</SelectItem>
                  <SelectItem value="$$$$">$$$$ (Fine Dining)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Input
                id="edit-location"
                name="location"
                value={editForm.location || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-address" className="text-right">
                Full Address
              </Label>
              <Input
                id="edit-address"
                name="address"
                value={editForm.address || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone" className="text-right">
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                name="phone"
                value={editForm.phone || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-website" className="text-right">
                Website URL
              </Label>
              <Input
                id="edit-website"
                name="website"
                value={editForm.website || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-openTable" className="text-right">
                OpenTable URL
              </Label>
              <Input
                id="edit-openTable"
                name="openTable"
                value={editForm.openTable || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-menuUrl" className="text-right">
                Menu URL
              </Label>
              <Input
                id="edit-menuUrl"
                name="menuUrl"
                value={editForm.menuUrl || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-rating" className="text-right">
                Rating (1-5)
              </Label>
              <Input
                id="edit-rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={editForm.rating || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-reviewCount" className="text-right">
                Number of Reviews
              </Label>
              <Input
                id="edit-reviewCount"
                name="reviewCount"
                type="number"
                min="0"
                value={editForm.reviewCount || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="edit-featured"
                  checked={editForm.featured || false}
                  onCheckedChange={(checked) => 
                    handleEditChange({ name: 'featured', value: checked })
                  }
                />
                <label
                  htmlFor="edit-featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Featured Restaurant (highlight on homepage)
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-right block mb-2">
                Restaurant Images
              </Label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                {(editForm.imageUrls || []).map((url, index) => (
                  <div key={index} className="relative group border rounded-md h-24 overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Restaurant image ${index}`} 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage('edit', index)}
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div 
                  className="border rounded-md flex items-center justify-center h-24 cursor-pointer hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, selectedRestaurant?.id)}
                  />
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-right block mb-2">
                Key Features
              </Label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {(editForm.features || []).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="group flex items-center gap-1">
                    {feature}
                    <button 
                      onClick={() => handleRemoveFeature('edit', index)}
                      className="text-xs hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  id="edit-feature-input"
                  placeholder="Add a feature (e.g., 'Ocean View')"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => handleAddFeature('edit')}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-right block mb-2">
                Tags
              </Label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {(editForm.tags || []).map((tag, index) => (
                  <Badge key={index} className="group flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag('edit', index)}
                      className="text-xs hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  id="edit-tag-input"
                  placeholder="Add a tag (e.g., 'family-friendly')"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => handleAddTag('edit')}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRestaurant}>
              Update Restaurant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}