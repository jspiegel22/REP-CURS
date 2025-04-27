import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

const JsonAdventureImporter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    created: number;
    updated: number;
    errors: number;
    totalProcessed: number;
    errorItems: string[];
  } | null>(null);
  const { toast } = useToast();

  const importAdventures = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      // Fetch the JSON file containing adventures
      const response = await fetch('/adventures_output.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch adventures JSON: ${response.status}`);
      }

      const adventures = await response.json();
      console.log(`Loaded ${adventures.length} adventures from JSON file`);
      
      toast({
        title: "Import Started",
        description: `Starting import of ${adventures.length} adventures from JSON data.`,
      });

      // Process each adventure
      let created = 0;
      let updated = 0;
      let errors = 0;
      let errorItems: string[] = [];
      
      for (const adventure of adventures) {
        try {
          // Validate required fields
          if (!adventure.title || !adventure.slug || !adventure.currentPrice || !adventure.imageUrl || !adventure.duration) {
            const missingFields = [];
            if (!adventure.title) missingFields.push('title');
            if (!adventure.slug) missingFields.push('slug');
            if (!adventure.currentPrice) missingFields.push('currentPrice');
            if (!adventure.imageUrl) missingFields.push('imageUrl');
            if (!adventure.duration) missingFields.push('duration');
            
            const errorMsg = `Missing required fields: ${missingFields.join(', ')} for adventure${adventure.title ? `: ${adventure.title}` : ''}`;
            errorItems.push(errorMsg);
            errors++;
            console.error(errorMsg);
            continue;
          }
          
          // Prepare the adventure data with appropriate defaults
          const adventureData = {
            ...adventure,
            // Format rating to one decimal place
            rating: adventure.rating ? Number(Number(adventure.rating).toFixed(1)) : 4.5,
            // Make sure boolean fields are properly set
            topRecommended: Boolean(adventure.topRecommended),
            featured: Boolean(adventure.featured),
            // Ensure arrays are properly formatted and handle string conversion
            keyFeatures: Array.isArray(adventure.keyFeatures) 
              ? adventure.keyFeatures 
              : typeof adventure.keyFeatures === 'string'
                ? adventure.keyFeatures.split(',').map(f => f.trim())
                : [],
            thingsToBring: Array.isArray(adventure.thingsToBring) 
              ? adventure.thingsToBring 
              : typeof adventure.thingsToBring === 'string'
                ? adventure.thingsToBring.split(',').map(f => f.trim())
                : [],
            // Ensure category is a valid value
            category: ['water', 'land', 'luxury', 'family', 'yacht'].includes(adventure.category) 
              ? adventure.category 
              : 'water',
            // Make sure we have a description
            description: adventure.description || `Enjoy this amazing ${adventure.title} adventure in Cabo San Lucas.`,
          };
          
          console.log(`Processing adventure: ${adventure.title}`);
          
          // Check if adventure already exists by slug
          const checkResponse = await apiRequest('GET', `/api/adventures?slug=${adventure.slug}`);
          const existingAdventures = await checkResponse.json();
          
          if (existingAdventures && existingAdventures.length > 0) {
            // Adventure exists, update it
            const existingAdventure = existingAdventures[0];
            const updateResponse = await apiRequest(
              'PUT', 
              `/api/adventures/${existingAdventure.id}`, 
              adventureData
            );
            
            if (updateResponse.ok) {
              updated++;
              console.log(`Updated adventure: ${adventure.title}`);
            } else {
              errors++;
              // Get more detailed error information
              try {
                const errorData = await updateResponse.json();
                const errorMsg = `Error processing adventure ${adventure.title}: ${updateResponse.status}: ${JSON.stringify(errorData)}`;
                errorItems.push(errorMsg);
                console.error(errorMsg);
              } catch (e) {
                const errorMsg = `Failed to update adventure: ${adventure.title} - Status: ${updateResponse.status}`;
                errorItems.push(errorMsg);
                console.error(errorMsg);
                console.error('Could not parse error details:', e);
              }
            }
          } else {
            // Adventure doesn't exist, create it
            const createResponse = await apiRequest('POST', '/api/adventures', adventureData);
            
            if (createResponse.ok) {
              created++;
              console.log(`Created adventure: ${adventure.title}`);
            } else {
              errors++;
              // Get more detailed error information
              try {
                const errorData = await createResponse.json();
                const errorMsg = `Error processing adventure ${adventure.title}: ${createResponse.status}: ${JSON.stringify(errorData)}`;
                errorItems.push(errorMsg);
                console.error(errorMsg);
              } catch (e) {
                try {
                  const errorText = await createResponse.text();
                  const errorMsg = `Failed to create adventure: ${adventure.title} - Status: ${createResponse.status} - ${errorText}`;
                  errorItems.push(errorMsg);
                  console.error(errorMsg);
                } catch (textError) {
                  const errorMsg = `Failed to create adventure: ${adventure.title} - Status: ${createResponse.status}`;
                  errorItems.push(errorMsg);
                  console.error(errorMsg, 'Could not read error details');
                }
              }
            }
          }
        } catch (err) {
          errors++;
          const errorMsg = `Error processing adventure ${adventure.title}: ${err instanceof Error ? err.message : 'Unknown error'}`;
          errorItems.push(errorMsg);
          console.error(errorMsg);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Refresh adventures data
      queryClient.invalidateQueries({ queryKey: ['/api/adventures'] });
      
      // Set final results
      setResults({
        created,
        updated,
        errors,
        totalProcessed: adventures.length,
        errorItems
      });
      
      toast({
        title: "Import Complete",
        description: `Created ${created}, Updated ${updated}, Errors ${errors}`,
        variant: errors > 0 ? "destructive" : "default"
      });
      
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-card rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Import Adventures from JSON</h3>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          This will import adventures from the JSON file created by the CSV import script.
        </p>
        <Button 
          onClick={importAdventures} 
          disabled={isLoading}
          className="w-full"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            "Import from JSON"
          )}
        </Button>
      </div>
      
      {results && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Import Results</h4>
          <ul className="text-sm space-y-1">
            <li>Total Processed: <span className="font-medium">{results.totalProcessed}</span></li>
            <li>Created: <span className="font-medium text-green-600">{results.created}</span></li>
            <li>Updated: <span className="font-medium text-blue-600">{results.updated}</span></li>
            <li>Errors: <span className={`font-medium ${results.errors > 0 ? 'text-red-600' : 'text-gray-600'}`}>{results.errors}</span></li>
          </ul>
          
          {results.errors > 0 && results.errorItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <h5 className="text-sm font-medium mb-1 text-red-600">Error Details</h5>
              <div className="max-h-40 overflow-y-auto text-xs">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {results.errorItems.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JsonAdventureImporter;