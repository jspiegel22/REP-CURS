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

interface Adventure {
  id: number;
  title: string;
  slug: string;
  currentPrice: string;
  originalPrice: string | null;
  discount: string | null;
  duration: string;
  imageUrl: string;
  minAge: string | null;
  provider: string;
  category: "water" | "land" | "luxury" | "family" | "yacht";
  keyFeatures: string[];
  thingsToBring: string[];
  topRecommended: boolean;
  rating: number | null;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdventureManager() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [filteredAdventures, setFilteredAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [editForm, setEditForm] = useState<Partial<Adventure>>({});
  const [createForm, setCreateForm] = useState<Partial<Adventure>>({
    title: '',
    currentPrice: '',
    originalPrice: '',
    discount: '',
    duration: '',
    minAge: '',
    provider: 'Cabo Adventures',
    category: 'water',
    rating: 4.5,
    keyFeatures: [],
    thingsToBring: [],
    topRecommended: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all adventures
  useEffect(() => {
    fetchAdventures();
  }, []);

  // Filter adventures based on search term and category
  useEffect(() => {
    if (!adventures.length) return;
    
    let filtered = [...adventures];
    
    if (searchTerm) {
      filtered = filtered.filter(adventure => 
        adventure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adventure.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adventure.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(adventure => adventure.category === categoryFilter);
    }
    
    setFilteredAdventures(filtered);
  }, [adventures, searchTerm, categoryFilter]);

  async function fetchAdventures() {
    setLoading(true);
    try {
      // Fetch adventures from the API
      const response = await apiRequest('GET', '/api/adventures');
      const data = await response.json();
      
      console.log("Fetched adventures:", data);
      
      setAdventures(data);
      setFilteredAdventures(data);
    } catch (error) {
      toast({
        title: "Error fetching adventures",
        description: "Could not load adventures. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditAdventure(adventure: Adventure) {
    setSelectedAdventure(adventure);
    setEditForm({...adventure});
    setIsEditDialogOpen(true);
  }

  function handleCreateAdventure() {
    setCreateForm({
      title: '',
      currentPrice: '',
      originalPrice: '',
      discount: '',
      duration: '',
      minAge: '',
      provider: 'Cabo Adventures',
      category: 'water',
      rating: 4.5,
      keyFeatures: [],
      thingsToBring: [],
      topRecommended: false,
    });
    setIsCreateDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (!selectedAdventure) return;
    
    try {
      // Make PUT request to update the adventure
      const response = await apiRequest('PUT', `/api/adventures/${selectedAdventure.id}`, editForm);
      
      if (!response.ok) {
        throw new Error(`Error updating adventure: ${response.statusText}`);
      }
      
      const updatedAdventure = await response.json();
      
      const updatedAdventures = adventures.map(adv => 
        adv.id === selectedAdventure.id ? updatedAdventure : adv
      );
      
      setAdventures(updatedAdventures);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Adventure updated",
        description: "The adventure has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating adventure:", error);
      toast({
        title: "Error updating adventure",
        description: "Could not update the adventure. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleCreateSubmit() {
    try {
      // Create a new adventure via API
      const adventureData = {
        title: createForm.title || '',
        slug: createForm.title?.toLowerCase().replace(/\s+/g, '-') || '',
        currentPrice: createForm.currentPrice || '',
        originalPrice: createForm.originalPrice || null,
        discount: createForm.discount || null,
        duration: createForm.duration || '',
        imageUrl: createForm.imageUrl || '/placeholder-adventure.jpg',
        minAge: createForm.minAge || null,
        provider: createForm.provider || 'Cabo Adventures',
        category: createForm.category || 'water',
        keyFeatures: createForm.keyFeatures || [],
        thingsToBring: createForm.thingsToBring || [],
        topRecommended: createForm.topRecommended || false,
        rating: createForm.rating || null,
        description: createForm.description || '',
        featured: createForm.featured || false
      };
      
      const response = await apiRequest('POST', '/api/adventures', adventureData);
      
      if (!response.ok) {
        throw new Error(`Error creating adventure: ${response.statusText}`);
      }
      
      const newAdventure = await response.json();
      
      // Add the new adventure to the local state
      setAdventures([...adventures, newAdventure]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Adventure created",
        description: "The new adventure has been successfully created.",
      });
      
      // Refresh the adventures list
      fetchAdventures();
    } catch (error) {
      console.error("Error creating adventure:", error);
      toast({
        title: "Error creating adventure",
        description: "Could not create the adventure. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleDeleteAdventure(id: number) {
    if (!confirm("Are you sure you want to delete this adventure? This action cannot be undone.")) {
      return;
    }
    
    try {
      // Delete the adventure via API
      const response = await apiRequest('DELETE', `/api/adventures/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error deleting adventure: ${response.statusText}`);
      }
      
      // Remove the adventure from the local state
      const updatedAdventures = adventures.filter(adv => adv.id !== id);
      setAdventures(updatedAdventures);
      
      toast({
        title: "Adventure deleted",
        description: "The adventure has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting adventure:", error);
      toast({
        title: "Error deleting adventure",
        description: "Could not delete the adventure. Please try again.",
        variant: "destructive"
      });
    }
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, isCreate: boolean) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // In a real app, you would upload this file to your server or cloud storage
    // For demonstration, we'll create a temporary URL
    const imageUrl = URL.createObjectURL(file);
    
    if (isCreate) {
      setCreateForm(prev => ({...prev, imageUrl}));
    } else {
      setEditForm(prev => ({...prev, imageUrl}));
    }
    
    // In a real app, you would handle the actual file upload here
    toast({
      title: "Image selected",
      description: "The image has been selected. It will be uploaded when you save.",
    });
  }

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
          <CardTitle className="text-2xl">Adventure Management</CardTitle>
          <CardDescription>
            Manage all adventure tours and activities. Add, edit, or remove adventures from the website.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setCategoryFilter('all')}>All</TabsTrigger>
                <TabsTrigger value="water" onClick={() => setCategoryFilter('water')}>Water</TabsTrigger>
                <TabsTrigger value="land" onClick={() => setCategoryFilter('land')}>Land</TabsTrigger>
                <TabsTrigger value="luxury" onClick={() => setCategoryFilter('luxury')}>Luxury</TabsTrigger>
                <TabsTrigger value="family" onClick={() => setCategoryFilter('family')}>Family</TabsTrigger>
                <TabsTrigger value="yacht" onClick={() => setCategoryFilter('yacht')}>Yacht</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search adventures..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleCreateAdventure}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Adventure
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAdventures.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No adventures found matching your criteria</p>
                </div>
              ) : (
                filteredAdventures.map((adventure) => (
                  <Card key={adventure.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={adventure.imageUrl}
                        alt={adventure.title}
                        className="w-full h-full object-fill"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                        {adventure.category && (
                          <Badge className="capitalize">
                            {adventure.category}
                          </Badge>
                        )}
                        {adventure.topRecommended && (
                          <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">
                            Top Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold line-clamp-2">{adventure.title}</h3>
                        <div className="flex items-center">
                          {adventure.rating && (
                            <span className="text-yellow-400">★</span>
                          )}
                          <span className="text-sm ml-1">{adventure.rating}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        <div>{adventure.duration} • {adventure.minAge}</div>
                        <div>
                          <span className="font-medium">{adventure.currentPrice}</span>
                          {adventure.originalPrice && adventure.originalPrice !== adventure.currentPrice && (
                            <span className="line-through ml-2">{adventure.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAdventure(adventure)}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteAdventure(adventure.id)}
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
            <DialogTitle>Edit Adventure</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="currentPrice">Current Price</Label>
                  <Input 
                    id="currentPrice"
                    value={editForm.currentPrice || ''}
                    onChange={(e) => setEditForm({...editForm, currentPrice: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input 
                    id="originalPrice"
                    value={editForm.originalPrice || ''}
                    onChange={(e) => setEditForm({...editForm, originalPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="discount">Discount</Label>
                  <Input 
                    id="discount"
                    value={editForm.discount || ''}
                    onChange={(e) => setEditForm({...editForm, discount: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="minAge">Minimum Age</Label>
                  <Input 
                    id="minAge"
                    value={editForm.minAge || ''}
                    onChange={(e) => setEditForm({...editForm, minAge: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editForm.category as "water" | "land" | "luxury" | "family" | "yacht" | undefined}
                    onValueChange={(value: string) => setEditForm({...editForm, category: value as "water" | "land" | "luxury" | "family" | "yacht"})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="yacht">Yacht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input 
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={editForm.rating || ''}
                  onChange={(e) => setEditForm({...editForm, rating: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="topRecommended" 
                  checked={editForm.topRecommended || false}
                  onCheckedChange={(checked) => setEditForm({...editForm, topRecommended: Boolean(checked)})}
                />
                <Label htmlFor="topRecommended" className="cursor-pointer">Top Recommended Adventure</Label>
              </div>
              
              <div>
                <Label htmlFor="keyFeatures">Key Features (one per line)</Label>
                <Textarea 
                  id="keyFeatures"
                  className="h-20"
                  value={Array.isArray(editForm.keyFeatures) ? editForm.keyFeatures.join('\n') : ''}
                  onChange={(e) => {
                    const features = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setEditForm({...editForm, keyFeatures: features});
                  }}
                  placeholder="Transportation included&#10;Food & drinks&#10;Wifi available"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="thingsToBring">Things to Bring (one per line)</Label>
                <Textarea 
                  id="thingsToBring"
                  className="h-20"
                  value={Array.isArray(editForm.thingsToBring) ? editForm.thingsToBring.join('\n') : ''}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setEditForm({...editForm, thingsToBring: items});
                  }}
                  placeholder="Swimwear&#10;Sunscreen&#10;Camera"
                />
              </div>
            
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
                <Label htmlFor="provider">Provider</Label>
                <Input 
                  id="provider"
                  value={editForm.provider || ''}
                  onChange={(e) => setEditForm({...editForm, provider: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Adventure Image</Label>
                <div className="mt-2">
                  {editForm.imageUrl ? (
                    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={editForm.imageUrl}
                        alt="Adventure"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Adventure</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-title">Title</Label>
                <Input 
                  id="create-title"
                  value={createForm.title || ''}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="create-currentPrice">Current Price</Label>
                  <Input 
                    id="create-currentPrice"
                    value={createForm.currentPrice || ''}
                    onChange={(e) => setCreateForm({...createForm, currentPrice: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-originalPrice">Original Price</Label>
                  <Input 
                    id="create-originalPrice"
                    value={createForm.originalPrice || ''}
                    onChange={(e) => setCreateForm({...createForm, originalPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="create-discount">Discount</Label>
                  <Input 
                    id="create-discount"
                    value={createForm.discount || ''}
                    onChange={(e) => setCreateForm({...createForm, discount: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-duration">Duration</Label>
                  <Input 
                    id="create-duration"
                    value={createForm.duration || ''}
                    onChange={(e) => setCreateForm({...createForm, duration: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="create-minAge">Minimum Age</Label>
                  <Input 
                    id="create-minAge"
                    value={createForm.minAge || ''}
                    onChange={(e) => setCreateForm({...createForm, minAge: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-category">Category</Label>
                  <Select
                    value={createForm.category as "water" | "land" | "luxury" | "family" | "yacht" | undefined}
                    onValueChange={(value: string) => setCreateForm({...createForm, category: value as "water" | "land" | "luxury" | "family" | "yacht"})}
                  >
                    <SelectTrigger id="create-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="yacht">Yacht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="create-rating">Rating (1-5)</Label>
                <Input 
                  id="create-rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={createForm.rating || ''}
                  onChange={(e) => setCreateForm({...createForm, rating: e.target.value ? parseFloat(e.target.value) : null})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="create-topRecommended" 
                  checked={createForm.topRecommended || false}
                  onCheckedChange={(checked) => setCreateForm({...createForm, topRecommended: Boolean(checked)})}
                />
                <Label htmlFor="create-topRecommended" className="cursor-pointer">Top Recommended Adventure</Label>
              </div>
              
              <div>
                <Label htmlFor="create-keyFeatures">Key Features (one per line)</Label>
                <Textarea 
                  id="create-keyFeatures"
                  className="h-20"
                  value={Array.isArray(createForm.keyFeatures) ? createForm.keyFeatures.join('\n') : ''}
                  onChange={(e) => {
                    const features = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setCreateForm({...createForm, keyFeatures: features});
                  }}
                  placeholder="Transportation included&#10;Food & drinks&#10;Wifi available"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-thingsToBring">Things to Bring (one per line)</Label>
                <Textarea 
                  id="create-thingsToBring"
                  className="h-20"
                  value={Array.isArray(createForm.thingsToBring) ? createForm.thingsToBring.join('\n') : ''}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setCreateForm({...createForm, thingsToBring: items});
                  }}
                  placeholder="Swimwear&#10;Sunscreen&#10;Camera"
                />
              </div>
            
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
                <Label htmlFor="create-provider">Provider</Label>
                <Input 
                  id="create-provider"
                  value={createForm.provider || ''}
                  onChange={(e) => setCreateForm({...createForm, provider: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Adventure Image</Label>
                <div className="mt-2">
                  {createForm.imageUrl ? (
                    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={createForm.imageUrl}
                        alt="Adventure"
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
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>
              <Plus className="mr-2 h-4 w-4" />
              Create Adventure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}