import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Upload, Check, AlertTriangle, FileJson } from 'lucide-react';

export default function JsonVillaImporter() {
  const [jsonContent, setJsonContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonContent(e.target.value);
    setError(null);
    setIsSuccess(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setJsonContent(text);
      setError(null);
      setIsSuccess(false);
      
      toast({
        title: "File loaded",
        description: `Successfully loaded ${file.name}`,
      });
    } catch (err) {
      setError('Failed to read the file. Please try again.');
      toast({
        title: "Error loading file",
        description: "Could not read the JSON file.",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    
    let jsonData;
    
    try {
      jsonData = JSON.parse(jsonContent);
      
      if (!Array.isArray(jsonData)) {
        throw new Error('The JSON data must be an array of villas.');
      }
      
      const response = await apiRequest('POST', '/api/villas/import', { villas: jsonData });
      const result = await response.json();
      
      setImportedCount(result.importedCount || jsonData.length);
      setIsSuccess(true);
      setJsonContent('');
      
      // Invalidate the villas query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/villas'] });
      
      toast({
        title: "Villas imported",
        description: `Successfully imported ${result.importedCount || jsonData.length} villas.`,
      });
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import villas. Please check your JSON data.');
      
      toast({
        title: "Import failed",
        description: err instanceof Error ? err.message : 'Failed to import villas. Please check your JSON data.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const getPlaceholderJson = () => {
    return JSON.stringify([
      {
        "name": "Example Villa",
        "address": "123 Main Street",
        "location": "Cabo San Lucas",
        "description": "Beautiful villa with ocean views",
        "bedrooms": 4,
        "bathrooms": 3.5,
        "maxGuests": 8,
        "pricePerNight": 750,
        "amenities": ["Private Pool", "Ocean View", "Chef's Kitchen"],
        "imageUrls": ["https://example.com/villa1.jpg"],
        "featured": true
      }
    ], null, 2);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Import Villas from JSON
        </CardTitle>
        <CardDescription>
          This will import villas from the JSON file created by the CSV import script.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button 
            onClick={handleClickUpload}
            className="w-full bg-green-700 hover:bg-green-800 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload JSON File
          </Button>
        </div>
        
        {jsonContent && (
          <div>
            <Textarea
              value={jsonContent}
              onChange={handleJsonChange}
              placeholder={`Paste villa JSON data here...\n\nExample format:\n${getPlaceholderJson()}`}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isSuccess && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Successfully imported {importedCount} villas.
            </AlertDescription>
          </Alert>
        )}
        
        {jsonContent && (
          <Button 
            onClick={handleImport} 
            disabled={!jsonContent || isLoading}
            className="w-full"
          >
            {isLoading ? 'Importing...' : 'Import from JSON'}
          </Button>
        )}
        
        {!jsonContent && !isSuccess && (
          <div className="text-sm text-muted-foreground">
            <p>
              Upload a JSON file to import villa data. The file should contain an array of villa objects with the required fields: name, bedrooms, bathrooms, maxGuests, and pricePerNight.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}