import { z } from "zod";

export const villaSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  imageUrl: z.string().url(),
  location: z.string(),
  name: z.string(),
  description: z.string(),
  rating: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  maxOccupancy: z.number(),
  isBeachfront: z.boolean().optional(),
  isOceanfront: z.boolean().optional(),
});

export type Villa = z.infer<typeof villaSchema>;

// Parse CSV data into Villa objects
export function parseVillaData(csvData: string): Villa[] {
  const lines = csvData.split('\n').slice(1); // Skip header row
  return lines
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      const [url, imageUrl, location, name, description, rating, _, bedrooms, bathrooms, maxOccupancy] = line.split(',');
      
      return {
        id: `villa-${index + 1}`,
        url: url.trim(),
        imageUrl: imageUrl.trim(),
        location: location.trim(),
        name: name.trim(),
        description: description.trim(),
        rating: rating.trim(),
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        maxOccupancy: Number(maxOccupancy) || 0,
        isBeachfront: location.toLowerCase().includes('beachfront'),
        isOceanfront: location.toLowerCase().includes('oceanfront'),
      };
    });
}
