import { z } from "zod";
import { Villa as DBVilla } from "@shared/schema";

// This is the schema for local villa data parsed from CSV
export const localVillaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  rating: z.string(),
  imageUrl: z.string().url(),
  url: z.string().url(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  maxGuests: z.number(),
  isBeachfront: z.boolean(),
  isOceanfront: z.boolean()
});

export type LocalVilla = z.infer<typeof localVillaSchema>;

// This creates a villa adapter that makes our local data compatible with the database schema
export function adaptLocalVillaToDBVilla(localVilla: LocalVilla): Partial<DBVilla> {
  return {
    id: parseInt(localVilla.id.replace('villa-', '')) || 0,
    name: localVilla.name,
    description: localVilla.description,
    bedrooms: localVilla.bedrooms,
    bathrooms: localVilla.bathrooms,
    maxGuests: localVilla.maxGuests,
    amenities: [],
    imageUrl: localVilla.imageUrl,
    imageUrls: [],
    pricePerNight: "500",
    location: localVilla.location,
    address: localVilla.location,
    latitude: null,
    longitude: null,
    trackHsId: null,
    lastSyncedAt: null,
    createdAt: new Date(),
    updatedAt: null
  };
}

// For convenience, we re-export DBVilla type as Villa
export type Villa = DBVilla;

export const parseVillaData = (csvData: string): Partial<Villa>[] => {
  const lines = csvData.split('\n')
    .slice(1) // Skip header
    .filter(line => line.trim() !== '');

  return lines.map((line, index) => {
    const [url, imageUrl, location, name, description, rating, _, bedrooms, bathrooms, maxGuests] = line.split(',');

    const localVilla: LocalVilla = {
      id: `villa-${index + 1}`,
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      rating: rating.trim(),
      imageUrl: imageUrl.trim(),
      url: url.trim(),
      bedrooms: parseInt(bedrooms) || 4,
      bathrooms: parseFloat(bathrooms.replace('+', '')) || 4,
      maxGuests: parseInt(maxGuests) || 10,
      isBeachfront: location.toLowerCase().includes('beachfront'),
      isOceanfront: location.toLowerCase().includes('oceanfront')
    };

    return adaptLocalVillaToDBVilla(localVilla);
  });
};