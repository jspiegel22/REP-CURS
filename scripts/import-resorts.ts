import { db } from "../server/db";
import { resorts, type Resort } from "../shared/schema";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";

interface GoogleResortRow {
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  description: string;
  location: string;
  imageUrl: string;
  googleUrl: string;
  amenities: string[];
}

function parseGoogleCSV(filePath: string): GoogleResortRow[] {
  const fileContent = readFileSync(filePath, 'utf-8');
  // Skip header rows and parse as array
  const records = parse(fileContent, {
    columns: false,
    skip_empty_lines: true,
    from_line: 3
  }) as string[][];

  console.log(`Parsing ${records.length} rows from CSV`);

  return records
    .map(row => {
      try {
        if (row.length < 8) return null;

        // Extract name (remove numbering if present)
        const name = row[2]?.trim();
        if (!name) return null;

        // Parse rating
        const rating = parseFloat(row[3] || '0');
        if (isNaN(rating)) return null;

        // Parse review count from "(X,XXX)" format
        const reviewCountMatch = row[4]?.match(/\(([0-9,]+)\)/);
        const reviewCount = reviewCountMatch 
          ? parseInt(reviewCountMatch[1].replace(/,/g, ''))
          : 0;

        // Extract price level from MX$ amount
        const priceText = row[8] || '';
        let priceLevel = 'Unknown';
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        if (price > 20000) {
          priceLevel = '$$$$';
        } else if (price > 12000) {
          priceLevel = '$$$';
        } else if (price > 6000) {
          priceLevel = '$$';
        } else if (price > 0) {
          priceLevel = '$';
        }

        // Extract location from the first part of row[7] before "OCEANFRONT" or "BEACHFRONT"
        let location = 'Cabo San Lucas';
        const locationText = row[2];
        if (locationText) {
          const matches = locationText.match(/^([^,]+)/);
          if (matches) {
            location = matches[1].trim();
          }
        }

        // Get the description - start with hotel type description
        let description = row[5] || '';
        if (!description) {
          description = 'Experience luxury accommodations in Cabo San Lucas';
        }

        // Build amenities array checking multiple columns
        const amenities: string[] = [];
        for (let i = 8; i < Math.min(row.length, 16); i++) {
          const amenityText = row[i]?.trim() || '';
          if (amenityText === 'Pool') amenities.push('Pool');
          if (amenityText === 'Spa') amenities.push('Spa');
          if (amenityText === 'Free parking') amenities.push('Free parking');
          if (amenityText === 'Free Wi-Fi') amenities.push('Free Wi-Fi');
          if (amenityText === 'Beach access') amenities.push('Beach access');
          if (amenityText === 'Air-conditioned') amenities.push('Air-conditioned');
        }

        // Process image URL to ensure proper dimensions
        const imageUrl = row[1]?.replace(/\?width=\d+/, '?width=800') || '';

        return {
          name,
          rating,
          reviewCount,
          priceLevel,
          description,
          location,
          imageUrl,
          googleUrl: row[0] || '',
          amenities: [...new Set(amenities)] // Remove duplicates
        };
      } catch (e) {
        console.error('Error parsing row:', e);
        return null;
      }
    })
    .filter((r): r is GoogleResortRow => r !== null);
}

async function importResorts() {
  try {
    // First, delete existing resorts
    await db.delete(resorts);

    const resortData = parseGoogleCSV('attached_assets/google-2025-03-17.csv');

    console.log(`Found ${resortData.length} resorts to import`);

    // Insert resorts into database
    for (const resort of resortData) {
      try {
        await db.insert(resorts).values({
          name: resort.name,
          rating: resort.rating,
          reviewCount: resort.reviewCount,
          priceLevel: resort.priceLevel,
          description: resort.description || 'Experience luxury accommodations in Cabo San Lucas',
          location: resort.location,
          imageUrl: resort.imageUrl,
          googleUrl: resort.googleUrl,
          amenities: resort.amenities,
          bookingsToday: 0
        });
      } catch (e) {
        console.error(`Failed to insert resort ${resort.name}:`, e);
      }
    }

    console.log('Resort import completed successfully');
  } catch (error) {
    console.error('Error importing resorts:', error);
    throw error;
  }
}

importResorts().catch(console.error);