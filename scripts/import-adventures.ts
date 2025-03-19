import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { db } from "../server/db";
import { adventures as adventuresTable, type InsertAdventure } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSVFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/(\d+[-\s]hour\s+|\d+[-\s]min\s+|cabo\s+)/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .split('-')
    .slice(0, 3)
    .join('-');
}

async function importCaboAdventures() {
  try {
    const filePath = path.join(__dirname, "../attached_assets/cabo-adventures-2025-03-08.csv");
    const data = await parseCSVFile(filePath);

    console.log("Parsing Cabo Adventures data...");

    const adventures: InsertAdventure[] = data.filter(row => row["ais-Highlight-nonHighlighted"]).map((row) => {
      const title = row["ais-Highlight-nonHighlighted"];
      console.log("Processing adventure:", title);

      return {
        title,
        slug: generateSlug(title),
        imageUrl: row["h-full src"],
        provider: "Cabo Adventures",
        duration: row["font-sans"],
        currentPrice: row["text-base"],
        originalPrice: row["text-xs-4"],
        minAge: row["font-sans (2)"],
        bookingType: "form",
        category: determineCategory(title),
        rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5 and 4.9
        included: ["Equipment", "Transportation", "Professional Guide"],
        requirements: ["Comfortable clothing", "Sunscreen", "Water bottle"],
      };
    });

    console.log(`Found ${adventures.length} Cabo Adventures to import`);

    for (const adventure of adventures) {
      await db.insert(adventuresTable).values(adventure);
      console.log(`Imported: ${adventure.title}`);
    }

    console.log("Successfully imported Cabo Adventures");
  } catch (error) {
    console.error("Error importing Cabo Adventures:", error);
    throw error;
  }
}

async function importPapillonYachts() {
  try {
    const filePath = path.join(__dirname, "../attached_assets/papillonyachts-2025-03-08.csv");
    const data = await parseCSVFile(filePath);

    console.log("Parsing Papillon Yachts data...");

    // Filter only actual yacht entries by looking for specific yacht identifiers
    const yachtIdentifiers = ['YACHT', 'BOAT', 'PAPILLON'];
    const adventures: InsertAdventure[] = data
      .filter(row => {
        const title = row["wixui-rich-text__text"];
        return (
          title && 
          yachtIdentifiers.some(id => title.toUpperCase().includes(id)) &&
          !title.includes('@') &&
          !title.includes('VIDEO') &&
          !title.includes('INCLUDED') &&
          !title.includes('Important information')
        );
      })
      .map((row) => {
        const title = row["wixui-rich-text__text"].split('\n')[0].trim(); // Take only the first line
        console.log("Processing yacht:", title);

        return {
          title,
          slug: generateSlug(title),
          imageUrl: row["HlRz5e src"] || "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          provider: "Papillon Yachts",
          duration: "4 Hours",
          currentPrice: row["color_11"] || "$700 USD",
          bookingType: "form",
          category: "luxury",
          rating: 4.5 + Math.random() * 0.4,
          included: [
            "Professional & Certified Staff",
            "Friendly and bilingual crew",
            "Unlimited Open Bar",
            "Food Menu",
            "Water Toys"
          ],
          requirements: [
            "Comfortable clothing",
            "Sunscreen",
            "Valid ID"
          ],
        };
      });

    console.log(`Found ${adventures.length} Papillon Yachts to import`);

    for (const adventure of adventures) {
      await db.insert(adventuresTable).values(adventure);
      console.log(`Imported: ${adventure.title}`);
    }

    console.log("Successfully imported Papillon Yachts");
  } catch (error) {
    console.error("Error importing Papillon Yachts:", error);
    throw error;
  }
}

function determineCategory(title: string): "water" | "land" | "luxury" | "family" {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("luxury") || titleLower.includes("private")) {
    return "luxury";
  } else if (titleLower.includes("snorkel") || titleLower.includes("whale") || titleLower.includes("sailing")) {
    return "water";
  } else if (titleLower.includes("camel") || titleLower.includes("atv") || titleLower.includes("outdoor")) {
    return "land";
  } else {
    return "family";
  }
}

async function main() {
  try {
    // First clean up existing data
    await db.delete(adventuresTable);
    console.log("Cleaned up existing adventures");

    await importCaboAdventures();
    await importPapillonYachts();
  } catch (error) {
    console.error("Error importing adventures:", error);
    process.exit(1);
  }
}

main();