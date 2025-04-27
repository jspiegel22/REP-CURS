import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Edit, Loader2, MapPin, Plus, Search, Star, Trash2, X } from "lucide-react";

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

export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [importing, setImporting] = useState(false);
  
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  const [createForm, setCreateForm] = useState<Partial<Restaurant>>({
    name: '',
    description: '',
    location: 'Cabo San Lucas',
    cuisine: '',
    category: 'mexican',
    priceLevel: '$$',
    rating: 4.5,
    reviewCount: 0,
    imageUrl: '',
    imageUrls: [],
    features: [],
    tags: [],
    reviews: [],
    featured: false,
  });
  
  const [editForm, setEditForm] = useState<Partial<Restaurant>>({});
  const [newFeature, setNewFeature] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [newEditFeature, setNewEditFeature] = useState<string>('');
  const [newEditTag, setNewEditTag] = useState<string>('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  async function fetchRestaurants() {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants');
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
    const feature = formType === 'create' ? newFeature : newEditFeature;
    if (!feature.trim()) return;
    
    if (formType === 'create') {
      setCreateForm(prev => ({
        ...prev,
        features: [...(prev.features || []), feature]
      }));
      setNewFeature('');
    } else {
      setEditForm(prev => ({
        ...prev,
        features: [...(prev.features || []), feature]
      }));
      setNewEditFeature('');
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
    const tag = formType === 'create' ? newTag : newEditTag;
    if (!tag.trim()) return;
    
    if (formType === 'create') {
      setCreateForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setNewTag('');
    } else {
      setEditForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setNewEditTag('');
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
      if (!createForm.name || !createForm.description || !createForm.location || !createForm.cuisine) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (!createForm.imageUrl && (!createForm.imageUrls || createForm.imageUrls.length === 0)) {
        toast({
          title: "Missing images",
          description: "Please add at least one image.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create restaurant');
      }
      
      const newRestaurant = await response.json();
      setRestaurants(prev => [...prev, newRestaurant]);
      setCreateForm({
        name: '',
        description: '',
        location: 'Cabo San Lucas',
        cuisine: '',
        category: 'mexican',
        priceLevel: '$$',
        rating: 4.5,
        reviewCount: 0,
        imageUrl: '',
        imageUrls: [],
        features: [],
        tags: [],
        reviews: [],
        featured: false,
      });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Restaurant created",
        description: "The restaurant has been successfully added.",
      });
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to create restaurant. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  async function handleUpdateRestaurant() {
    try {
      if (!selectedRestaurant) return;
      
      if (!editForm.name || !editForm.description || !editForm.location || !editForm.cuisine) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (!editForm.imageUrl && (!editForm.imageUrls || editForm.imageUrls.length === 0)) {
        toast({
          title: "Missing images",
          description: "Please add at least one image.",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(`/api/restaurants/${selectedRestaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }
      
      const updatedRestaurant = await response.json();
      setRestaurants(prev => 
        prev.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r)
      );
      setIsEditDialogOpen(false);
      
      toast({
        title: "Restaurant updated",
        description: "The restaurant has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to update restaurant. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  async function handleDeleteRestaurant(id: number) {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;
    
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }
      
      setRestaurants(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: "Restaurant deleted",
        description: "The restaurant has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to delete restaurant. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, restaurantId?: number) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const { url } = await response.json();
      
      if (restaurantId) {
        // Update for edit form
        setEditForm(prev => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), url],
          imageUrl: prev.imageUrl || url // Set as main image if it's the first one
        }));
      } else {
        // Update for create form
        setCreateForm(prev => {
          const updatedImageUrls = [...(prev.imageUrls || []), url];
          return {
            ...prev,
            imageUrls: updatedImageUrls,
            imageUrl: prev.imageUrl || url // Set as main image if it's the first one
          };
        });
      }
      
      // Clear the file input
      event.target.value = '';
      
      toast({
        title: "Image uploaded",
        description: "The image has been successfully uploaded.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  function handleRemoveImage(formType: 'create' | 'edit', index: number) {
    if (formType === 'create') {
      const updatedUrls = [...(createForm.imageUrls || [])];
      updatedUrls.splice(index, 1);
      
      setCreateForm(prev => ({
        ...prev,
        imageUrls: updatedUrls,
        imageUrl: updatedUrls.length > 0 ? updatedUrls[0] : ''
      }));
    } else {
      const updatedUrls = [...(editForm.imageUrls || [])];
      updatedUrls.splice(index, 1);
      
      setEditForm(prev => ({
        ...prev,
        imageUrls: updatedUrls,
        imageUrl: updatedUrls.length > 0 ? updatedUrls[0] : ''
      }));
    }
  }
  
  function handleOpenEditDialog(restaurant: Restaurant) {
    setSelectedRestaurant(restaurant);
    setEditForm({
      ...restaurant,
      // Ensure arrays are properly initialized
      features: restaurant.features || [],
      tags: restaurant.tags || [],
      imageUrls: restaurant.imageUrls || [],
    });
    setIsEditDialogOpen(true);
  }
  
  async function handleImportRestaurants() {
    try {
      setImporting(true);
      
      const response = await fetch('/api/restaurants/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Adding timeout and credentials for better reliability
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Import error response:', errorText);
        throw new Error(`Failed to import restaurants: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const created = data.created || 0;
      const updated = data.updated || 0;
      const total = data.total || created + updated;
      
      toast({
        title: "Restaurants imported",
        description: `Successfully imported ${total} restaurants (${created} new, ${updated} updated).`,
      });
      
      // Refresh the restaurant list
      await fetchRestaurants();
    } catch (error) {
      console.error('Error importing restaurants:', error);
      toast({
        title: "Import failed",
        description: error.message || "Failed to import restaurants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  }
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = categoryFilter === 'all' || restaurant.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search restaurants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
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
        
        <div className="flex gap-2">
          <Button 
            className="bg-blue-600 text-white hover:bg-blue-700" 
            onClick={handleImportRestaurants} 
            disabled={importing}
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Import Data
              </>
            )}
          </Button>
          
          <Button className="bg-primary text-white" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Restaurant
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={fetchRestaurants}>Try Again</Button>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No restaurants found</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Add Your First Restaurant</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRestaurants.map(restaurant => (
            <Card key={restaurant.id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={restaurant.imageUrl} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                />
                {restaurant.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary text-white">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {restaurant.priceLevel}
                </Badge>
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({restaurant.reviewCount})</span>
                  </div>
                </div>
                <p className="text-sm line-clamp-2 mb-4">{restaurant.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {restaurant.features && restaurant.features.slice(0, 3).map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {restaurant.features && restaurant.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{restaurant.features.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    <MapPin className="h-3.5 w-3.5 inline mr-1 opacity-70" />
                    {restaurant.location}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 bg-blue-100 hover:bg-blue-200 border-blue-300" 
                      onClick={() => handleOpenEditDialog(restaurant)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 bg-red-100 hover:bg-red-200 border-red-300" 
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Restaurant Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Ocean view, Live music, etc."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature('create');
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddFeature('create')}>
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
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="romantic, family-friendly, etc."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag('create');
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddTag('create')}>
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
      
      {/* Edit Restaurant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Restaurant: {selectedRestaurant?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2">
              <Label htmlFor="name-edit" className="text-right">
                Restaurant Name
              </Label>
              <Input
                id="name-edit"
                name="name"
                placeholder="El Pescador"
                value={editForm.name || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description-edit" className="text-right">
                Description
              </Label>
              <Textarea
                id="description-edit"
                name="description"
                placeholder="A beautiful oceanfront restaurant..."
                value={editForm.description || ''}
                onChange={handleEditChange}
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="category-edit" className="text-right">
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
              <Label htmlFor="cuisine-edit" className="text-right">
                Cuisine Type
              </Label>
              <Input
                id="cuisine-edit"
                name="cuisine"
                placeholder="Traditional Mexican"
                value={editForm.cuisine || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="priceLevel-edit" className="text-right">
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
              <Label htmlFor="location-edit" className="text-right">
                Location
              </Label>
              <Input
                id="location-edit"
                name="location"
                placeholder="Cabo San Lucas"
                value={editForm.location || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address-edit" className="text-right">
                Full Address
              </Label>
              <Input
                id="address-edit"
                name="address"
                placeholder="123 Beach Road, Cabo San Lucas"
                value={editForm.address || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone-edit" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phone-edit"
                name="phone"
                placeholder="+52 624 123 4567"
                value={editForm.phone || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="website-edit" className="text-right">
                Website URL
              </Label>
              <Input
                id="website-edit"
                name="website"
                placeholder="https://www.restaurant-website.com"
                value={editForm.website || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="openTable-edit" className="text-right">
                OpenTable URL
              </Label>
              <Input
                id="openTable-edit"
                name="openTable"
                placeholder="https://www.opentable.com/r/restaurant"
                value={editForm.openTable || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="menuUrl-edit" className="text-right">
                Menu URL
              </Label>
              <Input
                id="menuUrl-edit"
                name="menuUrl"
                placeholder="https://www.restaurant-website.com/menu"
                value={editForm.menuUrl || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="rating-edit" className="text-right">
                Rating (1-5)
              </Label>
              <Input
                id="rating-edit"
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="4.5"
                value={editForm.rating || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="reviewCount-edit" className="text-right">
                Number of Reviews
              </Label>
              <Input
                id="reviewCount-edit"
                name="reviewCount"
                type="number"
                min="0"
                placeholder="42"
                value={editForm.reviewCount || ''}
                onChange={handleEditChange}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="featured-edit"
                  checked={editForm.featured || false}
                  onCheckedChange={(checked) => 
                    handleEditChange({ name: 'featured', value: checked })
                  }
                />
                <label
                  htmlFor="featured-edit"
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
                  onClick={() => editFileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={editFileInputRef}
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
                  id="new-feature-edit-input"
                  value={newEditFeature}
                  onChange={(e) => setNewEditFeature(e.target.value)}
                  placeholder="Ocean view, Live music, etc."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature('edit');
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddFeature('edit')}>
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
                  id="new-tag-edit-input"
                  value={newEditTag}
                  onChange={(e) => setNewEditTag(e.target.value)}
                  placeholder="romantic, family-friendly, etc."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag('edit');
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddTag('edit')}>
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