import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Plus, Edit, Trash2, Save, Upload, X, Home, Users, Bed } from "lucide-react";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

interface Villa {
  id: number;
  name: string;
  address: string;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  sleeps: number;
  price_per_night: number;
  discount_percent?: number;
  amenities: string[];
  images: string[];
  featured: boolean;
  rating?: number;
  reviews?: number;
}

export default function VillaManager() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [filteredVillas, setFilteredVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bedroomFilter, setBedroomFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
  const [editForm, setEditForm] = useState<Partial<Villa>>({});
  const [createForm, setCreateForm] = useState<Partial<Villa>>({
    name: '',
    address: '',
    location: 'Cabo San Lucas',
    description: '',
    bedrooms: 3,
    bathrooms: 3,
    sleeps: 6,
    price_per_night: 0,
    amenities: [],
    images: [],
    featured: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all villas
  useEffect(() => {
    fetchVillas();
  }, []);

  // Filter villas based on search term and filters
  useEffect(() => {
    if (!villas.length) return;
    
    let filtered = [...villas];
    
    if (searchTerm) {
      filtered = filtered.filter(villa => 
        villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        villa.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        villa.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (bedroomFilter !== 'all') {
      filtered = filtered.filter(villa => {
        if (bedroomFilter === '1-3') return villa.bedrooms >= 1 && villa.bedrooms <= 3;
        if (bedroomFilter === '4-6') return villa.bedrooms >= 4 && villa.bedrooms <= 6;
        if (bedroomFilter === '7+') return villa.bedrooms >= 7;
        return true;
      });
    }
    
    setFilteredVillas(filtered);
  }, [villas, searchTerm, bedroomFilter]);

  async function fetchVillas() {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      // This would be: const response = await apiRequest('GET', '/api/villas');
      
      const mockVillas: Villa[] = [
        {
          id: 1,
          name: "Villa Chavez",
          address: "123 Ocean Drive",
          location: "Cabo San Lucas",
          description: "Luxurious beachfront villa with stunning ocean views and private infinity pool.",
          bedrooms: 5,
          bathrooms: 5.5,
          sleeps: 12,
          price_per_night: 1500,
          discount_percent: 10,
          amenities: ["Private Pool", "Ocean View", "Chef's Kitchen", "Beachfront", "Wi-Fi", "Air Conditioning"],
          images: ["/uploads/Villa_Chavez-2.jpg"],
          featured: true,
          rating: 4.9,
          reviews: 36
        },
        {
          id: 2,
          name: "Casa del Mar",
          address: "456 Playa Boulevard",
          location: "San José del Cabo",
          description: "Elegant villa in a gated community with sweeping views of the Sea of Cortez.",
          bedrooms: 4,
          bathrooms: 4,
          sleeps: 8,
          price_per_night: 950,
          amenities: ["Pool", "Hot Tub", "Gated Community", "Mountain View", "Wi-Fi", "Air Conditioning"],
          images: ["/uploads/dream-vacation-cabo.JPG"],
          featured: true,
          rating: 4.8,
          reviews: 24
        }
      ];
      
      setVillas(mockVillas);
      setFilteredVillas(mockVillas);
    } catch (error) {
      toast({
        title: "Error fetching villas",
        description: "Could not load villas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditVilla(villa: Villa) {
    setSelectedVilla(villa);
    setEditForm({...villa});
    setIsEditDialogOpen(true);
  }

  function handleCreateVilla() {
    setCreateForm({
      name: '',
      address: '',
      location: 'Cabo San Lucas',
      description: '',
      bedrooms: 3,
      bathrooms: 3,
      sleeps: 6,
      price_per_night: 0,
      amenities: [],
      images: [],
      featured: false,
    });
    setIsCreateDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (!selectedVilla) return;
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: await apiRequest('PATCH', `/api/villas/${selectedVilla.id}`, editForm);
      
      const updatedVillas = villas.map(villa => 
        villa.id === selectedVilla.id ? {...villa, ...editForm} : villa
      );
      
      setVillas(updatedVillas);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Villa updated",
        description: "The villa has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating villa",
        description: "Could not update the villa. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleCreateSubmit() {
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: const response = await apiRequest('POST', '/api/villas', createForm);
      
      const newVilla: Villa = {
        id: Math.max(0, ...villas.map(v => v.id)) + 1,
        name: createForm.name || '',
        address: createForm.address || '',
        location: createForm.location || 'Cabo San Lucas',
        description: createForm.description || '',
        bedrooms: createForm.bedrooms || 3,
        bathrooms: createForm.bathrooms || 3,
        sleeps: createForm.sleeps || 6,
        price_per_night: createForm.price_per_night || 0,
        discount_percent: createForm.discount_percent,
        amenities: createForm.amenities || [],
        images: createForm.images || [],
        featured: createForm.featured || false,
      };
      
      setVillas([...villas, newVilla]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Villa created",
        description: "The new villa has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error creating villa",
        description: "Could not create the villa. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleDeleteVilla(id: number) {
    if (!confirm("Are you sure you want to delete this villa? This action cannot be undone.")) {
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: await apiRequest('DELETE', `/api/villas/${id}`);
      
      const updatedVillas = villas.filter(villa => villa.id !== id);
      setVillas(updatedVillas);
      
      toast({
        title: "Villa deleted",
        description: "The villa has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting villa",
        description: "Could not delete the villa. Please try again.",
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
      setCreateForm(prev => ({...prev, images: [...(prev.images || []), imageUrl]}));
    } else {
      setEditForm(prev => ({...prev, images: [...(prev.images || []), imageUrl]}));
    }
    
    // In a real app, you would handle the actual file upload here
    toast({
      title: "Image selected",
      description: "The image has been selected. It will be uploaded when you save.",
    });
  }

  function removeImage(index: number, isCreate: boolean) {
    if (isCreate) {
      const newImages = [...(createForm.images || [])];
      newImages.splice(index, 1);
      setCreateForm(prev => ({...prev, images: newImages}));
    } else {
      const newImages = [...(editForm.images || [])];
      newImages.splice(index, 1);
      setEditForm(prev => ({...prev, images: newImages}));
    }
  }

  const amenitiesList = [
    "Private Pool", "Ocean View", "Mountain View", "Beachfront", "Chef's Kitchen", 
    "Hot Tub", "Gated Community", "Wi-Fi", "Air Conditioning", "Fitness Room",
    "Game Room", "BBQ Area", "Fire Pit", "Outdoor Kitchen", "Staff"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Villa Management</CardTitle>
          <CardDescription>
            Manage all private vacation rentals. Add, edit, or remove villas from the website.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setBedroomFilter('all')}>All</TabsTrigger>
                <TabsTrigger value="1-3" onClick={() => setBedroomFilter('1-3')}>1-3 Bedrooms</TabsTrigger>
                <TabsTrigger value="4-6" onClick={() => setBedroomFilter('4-6')}>4-6 Bedrooms</TabsTrigger>
                <TabsTrigger value="7+" onClick={() => setBedroomFilter('7+')}>7+ Bedrooms</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search villas..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleCreateVilla}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Villa
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVillas.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No villas found matching your criteria</p>
                </div>
              ) : (
                filteredVillas.map((villa) => (
                  <Card key={villa.id} className={`overflow-hidden ${villa.featured ? 'border-primary' : ''}`}>
                    <div className="aspect-video relative">
                      <img 
                        src={villa.images[0] || '/placeholder-villa.jpg'}
                        alt={villa.name}
                        className="w-full h-full object-fill"
                      />
                      {villa.featured && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          Featured
                        </Badge>
                      )}
                      {villa.discount_percent && (
                        <Badge className="absolute top-2 left-2 bg-red-600" variant="default">
                          {villa.discount_percent}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{villa.name}</h3>
                        <div className="text-lg font-semibold">
                          {formatCurrency(villa.price_per_night)}<span className="text-xs text-muted-foreground">/night</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {villa.location}
                      </div>
                      <div className="flex items-center gap-6 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{villa.bedrooms} BR</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{villa.bathrooms} BA</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Sleeps {villa.sleeps}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm line-clamp-2">{villa.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {villa.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {villa.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{villa.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditVilla(villa)}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteVilla(villa.id)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Villa</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Villa Name</Label>
                <Input 
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
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
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input 
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={editForm.bedrooms || ''}
                    onChange={(e) => setEditForm({...editForm, bedrooms: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input 
                    id="bathrooms"
                    type="number"
                    min="1"
                    step="0.5"
                    value={editForm.bathrooms || ''}
                    onChange={(e) => setEditForm({...editForm, bathrooms: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="sleeps">Sleeps</Label>
                  <Input 
                    id="sleeps"
                    type="number"
                    min="1"
                    value={editForm.sleeps || ''}
                    onChange={(e) => setEditForm({...editForm, sleeps: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_per_night">Price Per Night (USD)</Label>
                  <Input 
                    id="price_per_night"
                    type="number"
                    min="0"
                    value={editForm.price_per_night || ''}
                    onChange={(e) => setEditForm({...editForm, price_per_night: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="discount_percent">Discount Percent</Label>
                  <Input 
                    id="discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.discount_percent || ''}
                    onChange={(e) => setEditForm({...editForm, discount_percent: parseInt(e.target.value)})}
                  />
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
                <Label htmlFor="featured">Featured Villa</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  className="h-32"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                />
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
              
              <div>
                <Label className="mb-2 block">Villa Images</Label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(editForm.images || []).map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden aspect-video">
                      <img
                        src={image}
                        alt={`Villa ${index + 1}`}
                        className="w-full h-full object-fill"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        onClick={() => removeImage(index, false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
                    Add Image
                  </Button>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Villa</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">Villa Name</Label>
                <Input 
                  id="create-name"
                  value={createForm.name || ''}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="create-address">Address</Label>
                <Input 
                  id="create-address"
                  value={createForm.address || ''}
                  onChange={(e) => setCreateForm({...createForm, address: e.target.value})}
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
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="create-bedrooms">Bedrooms</Label>
                  <Input 
                    id="create-bedrooms"
                    type="number"
                    min="1"
                    value={createForm.bedrooms || ''}
                    onChange={(e) => setCreateForm({...createForm, bedrooms: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="create-bathrooms">Bathrooms</Label>
                  <Input 
                    id="create-bathrooms"
                    type="number"
                    min="1"
                    step="0.5"
                    value={createForm.bathrooms || ''}
                    onChange={(e) => setCreateForm({...createForm, bathrooms: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="create-sleeps">Sleeps</Label>
                  <Input 
                    id="create-sleeps"
                    type="number"
                    min="1"
                    value={createForm.sleeps || ''}
                    onChange={(e) => setCreateForm({...createForm, sleeps: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-price_per_night">Price Per Night (USD)</Label>
                  <Input 
                    id="create-price_per_night"
                    type="number"
                    min="0"
                    value={createForm.price_per_night || ''}
                    onChange={(e) => setCreateForm({...createForm, price_per_night: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="create-discount_percent">Discount Percent</Label>
                  <Input 
                    id="create-discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={createForm.discount_percent || ''}
                    onChange={(e) => setCreateForm({...createForm, discount_percent: parseInt(e.target.value)})}
                  />
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
                <Label htmlFor="create-featured">Featured Villa</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-description">Description</Label>
                <Textarea 
                  id="create-description"
                  className="h-32"
                  value={createForm.description || ''}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                />
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
              
              <div>
                <Label className="mb-2 block">Villa Images</Label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(createForm.images || []).map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden aspect-video">
                      <img
                        src={image}
                        alt={`Villa ${index + 1}`}
                        className="w-full h-full object-fill"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        onClick={() => removeImage(index, true)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
                    Add Image
                  </Button>
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
              Create Villa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}