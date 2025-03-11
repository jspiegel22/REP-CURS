import { z } from "zod";

export const adventureSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  imageUrl: z.string().url(),
  title: z.string(),
  currentPrice: z.string(),
  originalPrice: z.string(),
  discount: z.string(),
  duration: z.string(),
  minAge: z.string(),
  provider: z.literal("Cabo Adventures"),
  category: z.enum(["water", "land", "luxury", "family"]).optional(),
});

export type Adventure = z.infer<typeof adventureSchema>;

// Parse CSV data into Adventure objects
export function parseAdventureData(csvData: string): Adventure[] {
  const lines = csvData.split('\n').slice(1); // Skip header row
  return lines
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      const [url, imageUrl, title, currentPrice, originalPrice, discount, duration, _, minAge] = line.split(',');
      
      // Determine category based on title/description
      let category: "water" | "land" | "luxury" | "family" | undefined;
      const titleLower = title.toLowerCase();
      if (titleLower.includes("luxury") || titleLower.includes("private")) {
        category = "luxury";
      } else if (titleLower.includes("snorkel") || titleLower.includes("whale") || titleLower.includes("sailing")) {
        category = "water";
      } else if (titleLower.includes("camel") || titleLower.includes("atv") || titleLower.includes("outdoor")) {
        category = "land";
      } else if (titleLower.includes("family") || titleLower.includes("kids")) {
        category = "family";
      }

      return {
        id: `adv-${index + 1}`,
        url: url.trim(),
        imageUrl: imageUrl.trim(),
        title: title.trim(),
        currentPrice: currentPrice.trim(),
        originalPrice: originalPrice.trim() || currentPrice.trim(), // Use current price if original not provided
        discount: discount.trim(),
        duration: duration.trim(),
        minAge: minAge.trim(),
        provider: "Cabo Adventures" as const,
        category
      };
    });
}
