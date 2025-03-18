import { z } from "zod";

export const villaSchema = z.object({
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

export type Villa = z.infer<typeof villaSchema>;

export const parseVillaData = (csvData: string): Villa[] => {
  const lines = csvData.split('\n')
    .slice(1) // Skip header
    .filter(line => line.trim() !== '');

  return lines.map((line, index) => {
    const [url, imageUrl, location, name, description, rating, _, bedrooms, bathrooms, maxGuests] = line.split(',');

    return {
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
  });
};