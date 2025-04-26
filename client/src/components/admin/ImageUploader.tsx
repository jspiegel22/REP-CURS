import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Upload, FileImage } from 'lucide-react';
import { ImageCategory } from '@shared/schema';

export function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>("resort");
  const [tags, setTags] = useState<string>("");
  const [featured, setFeatured] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // If single file
      if (selectedFiles.length === 1) {
        await uploadSingleFile(selectedFiles[0]);
      } else {
        // If multiple files
        await uploadMultipleFiles(selectedFiles);
      }

      // Clear form after successful upload
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during upload.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadSingleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name.split('.')[0]);
    formData.append("alt_text", `${file.name.split('.')[0]} image for ${category} category`);
    formData.append("description", `${file.name.split('.')[0]} in ${category} category`);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("featured", featured.toString());

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    return await response.json();
  };

  const uploadMultipleFiles = async (files: File[]) => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append("files", file);
    });
    
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("featured", featured.toString());

    const response = await fetch('/api/images/bulk-upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Bulk upload failed');
    }

    return await response.json();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>
          Upload images to use on the website. Images will be automatically optimized and converted to WebP format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {ImageCategory.map((cat: string) => (
                <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input 
            id="tags" 
            placeholder="beach, sunset, luxury" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="featured">Featured Image</Label>
        </div>

        <div className="mt-2">
          <Label htmlFor="file">Select Images</Label>
          <div className="mt-1 flex items-center">
            <Input
              id="file"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-1"
            />
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Selected files ({selectedFiles.length}):</h4>
            <ul className="mt-2 text-sm text-gray-500">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={uploading || selectedFiles.length === 0}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Images` : 'Images'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}