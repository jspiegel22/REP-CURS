import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Plus, Edit, Trash2, Save, Upload, X, AlignLeft, Calendar, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { format } from 'date-fns';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  tags: string[];
  author: string;
  published_at: string;
  status: 'draft' | 'published';
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editForm, setEditForm] = useState<Partial<BlogPost>>({});
  const [createForm, setCreateForm] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'travel',
    tags: [],
    author: 'Admin',
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on search term and filters
  useEffect(() => {
    if (!posts.length) return;
    
    let filtered = [...posts];
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchTerm, categoryFilter, statusFilter]);

  async function fetchPosts() {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      // This would be: const response = await apiRequest('GET', '/api/blog/posts');
      
      const mockPosts: BlogPost[] = [
        {
          id: 1,
          title: "Top 10 Attractions in Cabo San Lucas",
          slug: "top-10-attractions-cabo-san-lucas",
          excerpt: "Discover the must-visit attractions in Cabo San Lucas for an unforgettable vacation experience.",
          content: "# Top 10 Attractions in Cabo San Lucas\n\nCabo San Lucas, located at the southern tip of Mexico's Baja California Peninsula, is a paradise for travelers seeking sun, sea, and adventure.\n\n## 1. El Arco (The Arch)\n\nThis distinctive rock formation is the iconic landmark of Cabo...",
          image_url: "/uploads/beach-sunset-cabo.jpg",
          category: "travel",
          tags: ["attractions", "travel guide", "beaches"],
          author: "Maria Rodriguez",
          published_at: "2025-01-15T12:00:00Z",
          status: "published"
        },
        {
          id: 2,
          title: "Ultimate Guide to Cabo Dining",
          slug: "ultimate-guide-cabo-dining",
          excerpt: "From street tacos to fine dining, explore the culinary delights that Cabo San Lucas has to offer.",
          content: "# Ultimate Guide to Cabo Dining\n\nThe culinary scene in Cabo San Lucas is a vibrant mix of traditional Mexican flavors and international cuisine, with fresh seafood being a star attraction...",
          image_url: "/uploads/cabo-dining.jpg",
          category: "dining",
          tags: ["food", "restaurants", "mexican cuisine"],
          author: "Chef Carlos Mendez",
          published_at: "2025-02-20T15:30:00Z",
          status: "published"
        },
        {
          id: 3,
          title: "Planning Your Destination Wedding in Cabo",
          slug: "planning-destination-wedding-cabo",
          excerpt: "Everything you need to know about planning a stunning destination wedding in Cabo San Lucas.",
          content: "# Planning Your Destination Wedding in Cabo\n\nCabo San Lucas provides a romantic backdrop for destination weddings with its stunning beaches, luxurious resorts, and breathtaking sunsets...",
          image_url: "/uploads/cabo-wedding.jpg",
          category: "weddings",
          tags: ["wedding planning", "destination wedding", "beaches"],
          author: "Isabella Garcia",
          published_at: "",
          status: "draft"
        }
      ];
      
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
    } catch (error) {
      toast({
        title: "Error fetching blog posts",
        description: "Could not load blog posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditPost(post: BlogPost) {
    setSelectedPost(post);
    setEditForm({...post});
    setIsEditDialogOpen(true);
  }

  function handleCreatePost() {
    setCreateForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'travel',
      tags: [],
      author: 'Admin',
      status: 'draft',
    });
    setIsCreateDialogOpen(true);
  }

  function handleTagInput(e: React.KeyboardEvent<HTMLInputElement>, isCreate: boolean) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      if (isCreate) {
        const currentTags = createForm.tags || [];
        if (!currentTags.includes(tagInput.trim())) {
          setCreateForm({...createForm, tags: [...currentTags, tagInput.trim()]});
        }
      } else {
        const currentTags = editForm.tags || [];
        if (!currentTags.includes(tagInput.trim())) {
          setEditForm({...editForm, tags: [...currentTags, tagInput.trim()]});
        }
      }
      
      setTagInput('');
    }
  }

  function removeTag(tag: string, isCreate: boolean) {
    if (isCreate) {
      const currentTags = createForm.tags || [];
      setCreateForm({...createForm, tags: currentTags.filter(t => t !== tag)});
    } else {
      const currentTags = editForm.tags || [];
      setEditForm({...editForm, tags: currentTags.filter(t => t !== tag)});
    }
  }

  async function handleSaveEdit() {
    if (!selectedPost) return;
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: await apiRequest('PATCH', `/api/blog/posts/${selectedPost.id}`, editForm);
      
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id ? {...post, ...editForm} : post
      );
      
      setPosts(updatedPosts);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Blog post updated",
        description: "The blog post has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating blog post",
        description: "Could not update the blog post. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleCreateSubmit() {
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: const response = await apiRequest('POST', '/api/blog/posts', createForm);
      
      const slug = createForm.title
        ? createForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : '';
      
      const newPost: BlogPost = {
        id: Math.max(0, ...posts.map(p => p.id)) + 1,
        title: createForm.title || '',
        slug,
        excerpt: createForm.excerpt || '',
        content: createForm.content || '',
        image_url: createForm.image_url || '/placeholder-blog.jpg',
        category: createForm.category || 'travel',
        tags: createForm.tags || [],
        author: createForm.author || 'Admin',
        published_at: createForm.status === 'published' ? new Date().toISOString() : '',
        status: createForm.status as 'draft' | 'published',
      };
      
      setPosts([...posts, newPost]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Blog post created",
        description: "The new blog post has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error creating blog post",
        description: "Could not create the blog post. Please try again.",
        variant: "destructive"
      });
    }
  }

  async function handleDeletePost(id: number) {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: await apiRequest('DELETE', `/api/blog/posts/${id}`);
      
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting blog post",
        description: "Could not delete the blog post. Please try again.",
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
      setCreateForm(prev => ({...prev, image_url: imageUrl}));
    } else {
      setEditForm(prev => ({...prev, image_url: imageUrl}));
    }
    
    // In a real app, you would handle the actual file upload here
    toast({
      title: "Image selected",
      description: "The image has been selected. It will be uploaded when you save.",
    });
  }

  async function handlePublishDraft(id: number) {
    try {
      // In a real app, this would be an API call
      // For demonstration, we're just updating the local state
      // This would be: await apiRequest('PATCH', `/api/blog/posts/${id}/publish`, {});
      
      const updatedPosts = posts.map(post => 
        post.id === id 
          ? {...post, status: 'published' as const, published_at: new Date().toISOString()} 
          : post
      );
      
      setPosts(updatedPosts);
      
      toast({
        title: "Blog post published",
        description: "The blog post has been successfully published.",
      });
    } catch (error) {
      toast({
        title: "Error publishing blog post",
        description: "Could not publish the blog post. Please try again.",
        variant: "destructive"
      });
    }
  }

  const categories = [
    { value: 'travel', label: 'Travel' },
    { value: 'dining', label: 'Dining' },
    { value: 'activities', label: 'Activities' },
    { value: 'weddings', label: 'Weddings' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'tips', label: 'Tips & Advice' },
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
          <CardTitle className="text-2xl">Blog Management</CardTitle>
          <CardDescription>
            Manage your blog content. Create, edit, and publish articles to engage your audience.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => { setCategoryFilter('all'); setStatusFilter('all'); }}>
                    All Posts
                  </TabsTrigger>
                  <TabsTrigger value="published" onClick={() => { setStatusFilter('published'); setCategoryFilter('all'); }}>
                    Published
                  </TabsTrigger>
                  <TabsTrigger value="draft" onClick={() => { setStatusFilter('draft'); setCategoryFilter('all'); }}>
                    Drafts
                  </TabsTrigger>
                </TabsList>
                
                <Select
                  value={categoryFilter === 'all' ? 'all' : categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search posts..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleCreatePost}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </div>
            </div>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video relative">
                      <img 
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-fill"
                      />
                      <Badge className={`absolute top-2 right-2 ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge className="absolute top-2 left-2 capitalize">
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2 flex items-center">
                        <User className="h-3 w-3 mr-1" /> {post.author}
                        {post.published_at && (
                          <>
                            <span className="mx-2">•</span>
                            <Calendar className="h-3 w-3 mr-1" /> 
                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                          </>
                        )}
                      </div>
                      <p className="text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <div className="flex gap-2">
                        {post.status === 'draft' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handlePublishDraft(post.id)}
                          >
                            Publish
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt"
                  rows={3}
                  value={editForm.excerpt || ''}
                  onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                  placeholder="Brief summary of the article..."
                />
              </div>
              
              <div>
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author"
                  value={editForm.author || ''}
                  onChange={(e) => setEditForm({...editForm, author: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editForm.category || 'travel'}
                    onValueChange={(value) => setEditForm({...editForm, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editForm.status || 'draft'}
                    onValueChange={(value: 'draft' | 'published') => setEditForm({
                      ...editForm, 
                      status: value,
                      published_at: value === 'published' && !editForm.published_at ? new Date().toISOString() : editForm.published_at
                    })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center">
                  <Input 
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleTagInput(e, false)}
                    placeholder="Add tag and press Enter..."
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(editForm.tags || []).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag, false)}
                        className="rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Featured Image</Label>
                <div className="mt-2">
                  {editForm.image_url ? (
                    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={editForm.image_url}
                        alt="Blog featured image"
                        className="w-full h-full object-fill"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        onClick={() => setEditForm({...editForm, image_url: ''})}
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
            
            <div className="space-y-4">
              <div className="flex-1">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea 
                  id="content"
                  value={editForm.content || ''}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  placeholder="Write your blog post content here using Markdown..."
                  className="h-[500px] font-mono text-sm"
                />
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
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-title">Title</Label>
                <Input 
                  id="create-title"
                  value={createForm.title || ''}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="create-excerpt">Excerpt</Label>
                <Textarea 
                  id="create-excerpt"
                  rows={3}
                  value={createForm.excerpt || ''}
                  onChange={(e) => setCreateForm({...createForm, excerpt: e.target.value})}
                  placeholder="Brief summary of the article..."
                />
              </div>
              
              <div>
                <Label htmlFor="create-author">Author</Label>
                <Input 
                  id="create-author"
                  value={createForm.author || ''}
                  onChange={(e) => setCreateForm({...createForm, author: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="create-category">Category</Label>
                  <Select
                    value={createForm.category || 'travel'}
                    onValueChange={(value) => setCreateForm({...createForm, category: value})}
                  >
                    <SelectTrigger id="create-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-status">Status</Label>
                  <Select
                    value={createForm.status || 'draft'}
                    onValueChange={(value: 'draft' | 'published') => setCreateForm({
                      ...createForm, 
                      status: value,
                    })}
                  >
                    <SelectTrigger id="create-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="create-tags">Tags</Label>
                <div className="flex items-center">
                  <Input 
                    id="create-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleTagInput(e, true)}
                    placeholder="Add tag and press Enter..."
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(createForm.tags || []).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag, true)}
                        className="rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Featured Image</Label>
                <div className="mt-2">
                  {createForm.image_url ? (
                    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
                      <img 
                        src={createForm.image_url}
                        alt="Blog featured image"
                        className="w-full h-full object-fill"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                        onClick={() => setCreateForm({...createForm, image_url: ''})}
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
            
            <div className="space-y-4">
              <div className="flex-1">
                <Label htmlFor="create-content">Content (Markdown)</Label>
                <Textarea 
                  id="create-content"
                  value={createForm.content || ''}
                  onChange={(e) => setCreateForm({...createForm, content: e.target.value})}
                  placeholder="Write your blog post content here using Markdown..."
                  className="h-[500px] font-mono text-sm"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}