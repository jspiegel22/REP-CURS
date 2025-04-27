/**
 * This script imports remaining villas from a CSV file into the database
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db';
import { villas } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Helper function to generate a slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
    .replace(/\-\-+/g, '-')    // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
}

// Function to parse numeric values from strings like "4.5", "4+", "4"
function parseNumericValue(value: string): number {
  // Remove any '+' character
  const cleanedValue = value.replace('+', '');
  // Parse to float and handle potential NaN
  const numericValue = parseFloat(cleanedValue);
  return isNaN(numericValue) ? 0 : numericValue;
}

// Function to parse integer values (round up for non-integers)
function parseIntegerValue(value: string): number {
  const floatValue = parseNumericValue(value);
  // Round up for decimal values (e.g., 3.5 bathrooms becomes 4)
  return Math.ceil(floatValue);
}

// Function to extract bedrooms and bathrooms from the CSV data
function parseBedBathGuests(bedrooms: string, bathrooms: string, maxGuests: string): {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
} {
  // For database, we need integers for bedrooms, bathrooms, maxGuests
  return {
    bedrooms: parseIntegerValue(bedrooms),
    bathrooms: parseIntegerValue(bathrooms),
    maxGuests: parseIntegerValue(maxGuests)
  };
}

// Function to generate a random price between min and max
function generatePrice(min: number, max: number): string {
  return String(min + Math.floor(Math.random() * (max - min)));
}

// Function to determine if villa is oceanfront or beachfront
function parseLocationFlags(location: string): {
  isOceanfront: boolean;
  isBeachfront: boolean;
} {
  const locationLower = location.toLowerCase();
  return {
    isOceanfront: locationLower.includes('oceanfront'),
    isBeachfront: locationLower.includes('beachfront')
  };
}

// Function to generate amenities based on villa details
function generateAmenities(villaName: string, location: string, description: string): string[] {
  const baseAmenities = [
    "Private Pool",
    "Wi-Fi",
    "Air Conditioning",
    "Daily Housekeeping",
    "Fully Equipped Kitchen",
    "Outdoor Dining Area",
    "Parking"
  ];
  
  const additionalAmenities = [];
  
  // Location-based amenities
  const { isOceanfront, isBeachfront } = parseLocationFlags(location);
  
  if (isOceanfront) {
    additionalAmenities.push("Ocean View");
  }
  
  if (isBeachfront) {
    additionalAmenities.push("Beach Access");
    additionalAmenities.push("Beachfront");
  }
  
  // Rating-based amenities (luxury indicators)
  if (description.includes('6-Star') || description.includes('6+ -Star') || 
      description.includes('Luxury') || description.includes('Premier')) {
    additionalAmenities.push("Infinity Pool");
    additionalAmenities.push("Hot Tub");
    additionalAmenities.push("Home Theater");
    additionalAmenities.push("Wine Cellar");
  }
  
  // Feature detection from name/description
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes('golf') || location.toLowerCase().includes('golf')) {
    additionalAmenities.push("Golf Course Nearby");
  }
  
  if (descriptionLower.includes('marina') || descriptionLower.includes('bay')) {
    additionalAmenities.push("Marina View");
  }
  
  // Combine all amenities and remove duplicates
  return [...new Set([...baseAmenities, ...additionalAmenities])];
}

// Function to extract the actual villa name without the "Villa" prefix if needed
function extractVillaName(name: string): string {
  return name.trim();
}

// Function to generate a suitable description
function generateDescription(villaName: string, originalDescription: string, location: string): string {
  // Sometimes the description is cut off in the CSV, so we'll generate a new one if it's too short
  if (originalDescription && originalDescription.length > 20) {
    return originalDescription;
  }
  
  const { isOceanfront, isBeachfront } = parseLocationFlags(location);
  let locationDesc = location.replace(/,/g, ' in ').replace('OCEANFRONT', '').replace('BEACHFRONT', '').trim();
  
  if (locationDesc.endsWith('in')) {
    locationDesc = locationDesc.substring(0, locationDesc.length - 3);
  }
  
  let description = `${villaName} is a beautiful vacation villa located in ${locationDesc}. `;
  
  if (isBeachfront) {
    description += 'This stunning beachfront property offers direct access to the beach and breathtaking ocean views. ';
  } else if (isOceanfront) {
    description += 'This spectacular oceanfront property offers amazing views of the ocean. ';
  } else {
    description += 'This fantastic property offers comfort and luxury for your Cabo vacation. ';
  }
  
  description += 'Featuring modern amenities and stylish decor, this villa provides the perfect setting for your dream vacation in Los Cabos.';
  
  return description;
}

// Main function to parse CSV and extract villa data
async function extractVillasFromCSV(filePath: string, startFromIndex: number = 0) {
  try {
    console.log(`Reading CSV file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV content
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true
    });
    
    console.log(`Parsed ${records.length} records from CSV`);
    
    // Skip header row
    const dataRows = records.slice(1);
    
    // Skip previously processed villas if startFromIndex > 0
    const remainingRows = startFromIndex > 0 ? dataRows.slice(startFromIndex) : dataRows;
    
    console.log(`Processing villa records from index ${startFromIndex} (${remainingRows.length} remaining)`);
    
    // Map rows to villa objects
    const villas = remainingRows.map((row: any, index: number) => {
      // URL and image
      const url = row[0] || '';
      const imageUrl = row[1] || '';
      
      // Location and basic info
      const location = row[2] || '';
      const name = row[3] || `Villa ${index + 1}`;
      const description = row[4] || '';
      const villaRating = row[5] || '';
      
      // Bedrooms, bathrooms, guests
      const bedrooms = row[8] || '4';
      const bathrooms = row[9] || '4';
      const maxGuests = row[10] || '8';
      
      const { bedrooms: bedroomsNum, bathrooms: bathroomsNum, maxGuests: maxGuestsNum } = 
        parseBedBathGuests(bedrooms, bathrooms, maxGuests);
      
      // Generate amenities based on villa details
      const amenities = generateAmenities(name, location, description);
      
      // Generate a price based on the villa rating and features
      let basePriceMin = 800;
      let basePriceMax = 1500;
      
      if (villaRating.includes('6+ -Star') || villaRating.includes('Platinum')) {
        basePriceMin = 2500;
        basePriceMax = 5000;
      } else if (villaRating.includes('6-Star') || villaRating.includes('Premier')) {
        basePriceMin = 2000;
        basePriceMax = 3500;
      } else if (villaRating.includes('5.5-Star') || villaRating.includes('5-Star') || villaRating.includes('Luxury')) {
        basePriceMin = 1500;
        basePriceMax = 2500;
      } else if (villaRating.includes('4.5-Star') || villaRating.includes('4-Star') || villaRating.includes('Deluxe')) {
        basePriceMin = 1000;
        basePriceMax = 2000;
      }
      
      // Adjust price based on number of bedrooms
      const priceMultiplier = 1 + ((bedroomsNum - 4) * 0.1);
      basePriceMin = Math.floor(basePriceMin * priceMultiplier);
      basePriceMax = Math.floor(basePriceMax * priceMultiplier);
      
      const pricePerNight = generatePrice(basePriceMin, basePriceMax);
      
      // Generate a reasonable address based on location
      let address = location;
      if (location.includes('CABO SAN LUCAS')) {
        address = 'Cabo San Lucas, Baja California Sur, Mexico';
      } else if (location.includes('SAN JOSÉ DEL CABO')) {
        address = 'San José del Cabo, Baja California Sur, Mexico';
      } else if (location.includes('CORRIDOR')) {
        address = 'Tourist Corridor, Baja California Sur, Mexico';
      } else if (location.includes('EAST CAPE')) {
        address = 'East Cape, Baja California Sur, Mexico';
      } else if (location.includes('CABO PULMO')) {
        address = 'Cabo Pulmo, Baja California Sur, Mexico';
      } else if (location.includes('LA PAZ')) {
        address = 'La Paz, Baja California Sur, Mexico';
      }
      
      // Generate coordinates for the location (approximation)
      let latitude = '22.89';
      let longitude = '-109.91';
      
      if (address.includes('San José del Cabo')) {
        latitude = '23.06';
        longitude = '-109.70';
      } else if (address.includes('Tourist Corridor')) {
        latitude = '22.98';
        longitude = '-109.80';
      } else if (address.includes('East Cape')) {
        latitude = '23.10';
        longitude = '-109.55';
      } else if (address.includes('Cabo Pulmo')) {
        latitude = '23.44';
        longitude = '-109.42';
      } else if (address.includes('La Paz')) {
        latitude = '24.14';
        longitude = '-110.31';
      }
      
      // Add some randomness to coordinates to avoid having all villas in the same spot
      const latVariation = (Math.random() * 0.04 - 0.02).toFixed(4);
      const longVariation = (Math.random() * 0.04 - 0.02).toFixed(4);
      
      latitude = (parseFloat(latitude) + parseFloat(latVariation)).toString();
      longitude = (parseFloat(longitude) + parseFloat(longVariation)).toString();
      
      // Generate enhanced description
      const enhancedDescription = generateDescription(name, description, location);
      
      // Generate unique trackHsId based on the name and global index
      const actualIndex = startFromIndex + index;
      const trackHsId = `hs-${generateSlug(name)}-${actualIndex}`;
      
      // Create location string without the metadata (OCEANFRONT, BEACHFRONT)
      let cleanLocation = location.split(',')[0].trim();
      if (!cleanLocation || cleanLocation.length < 3) {
        if (location.includes('CABO SAN LUCAS')) {
          cleanLocation = 'Cabo San Lucas';
        } else if (location.includes('SAN JOSÉ DEL CABO')) {
          cleanLocation = 'San José del Cabo';
        } else if (location.includes('CORRIDOR')) {
          cleanLocation = 'Tourist Corridor';
        } else {
          cleanLocation = 'Los Cabos';
        }
      }
      
      // Create the villa object
      return {
        name: extractVillaName(name),
        description: enhancedDescription,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        maxGuests: maxGuestsNum,
        amenities: amenities,
        imageUrl: imageUrl,
        imageUrls: [imageUrl],
        pricePerNight: pricePerNight,
        location: cleanLocation,
        address: address,
        latitude: latitude,
        longitude: longitude,
        trackHsId: trackHsId,
        lastSyncedAt: new Date(),
      };
    });
    
    console.log(`Extracted ${villas.length} villas from CSV (starting from index ${startFromIndex})`);
    return villas;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
}

// Function to get existing villas count
async function getExistingVillasCount(): Promise<number> {
  try {
    const result = await db.select().from(villas);
    return result.length;
  } catch (error) {
    console.error('Error getting villa count:', error);
    return 0;
  }
}

// Main function to import villas
async function importRemainingVillas(batchSize: number = 20) {
  try {
    console.log('Starting remaining villa import process...');
    
    // Get the number of already imported villas
    const existingCount = await getExistingVillasCount();
    console.log(`Found ${existingCount} existing villas in the database`);
    
    // Get villas from CSV starting from the current count
    const extractedVillas = await extractVillasFromCSV('./attached_assets/cabovillas-2025-03-08.csv', existingCount);
    
    if (extractedVillas.length === 0) {
      console.log('No more villas to import!');
      return { created: 0, updated: 0, errors: 0, total: 0 };
    }
    
    console.log(`Processing ${extractedVillas.length} remaining villas...`);
    console.log(`Using batch size of ${batchSize} for performance`);
    
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    // Process villas in batches for better performance
    for (let i = 0; i < extractedVillas.length; i += batchSize) {
      const batch = extractedVillas.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(extractedVillas.length / batchSize)} (${batch.length} villas)`);
      
      // Process each villa in the batch
      for (const villa of batch) {
        try {
          // Check if villa already exists by trackHsId
          const existingVillas = await db.select().from(villas).where(eq(villas.trackHsId, villa.trackHsId));
          
          if (existingVillas && existingVillas.length > 0) {
            // Villa exists, update it
            const existingVilla = existingVillas[0];
            
            const [updatedVilla] = await db
              .update(villas)
              .set({
                name: villa.name,
                description: villa.description,
                bedrooms: villa.bedrooms,
                bathrooms: villa.bathrooms,
                maxGuests: villa.maxGuests,
                amenities: villa.amenities,
                imageUrl: villa.imageUrl,
                imageUrls: villa.imageUrls,
                pricePerNight: villa.pricePerNight,
                location: villa.location,
                address: villa.address,
                latitude: villa.latitude,
                longitude: villa.longitude,
                updatedAt: new Date()
              })
              .where(eq(villas.id, existingVilla.id))
              .returning();
            
            console.log(`Updated villa: ${updatedVilla.name} (ID: ${updatedVilla.id})`);
            updated++;
          } else {
            // Create new villa
            const [newVilla] = await db
              .insert(villas)
              .values({
                name: villa.name,
                description: villa.description,
                bedrooms: villa.bedrooms,
                bathrooms: villa.bathrooms,
                maxGuests: villa.maxGuests,
                amenities: villa.amenities,
                imageUrl: villa.imageUrl,
                imageUrls: villa.imageUrls,
                pricePerNight: villa.pricePerNight,
                location: villa.location,
                address: villa.address,
                latitude: villa.latitude,
                longitude: villa.longitude,
                trackHsId: villa.trackHsId,
                lastSyncedAt: villa.lastSyncedAt,
                createdAt: new Date(),
                updatedAt: new Date()
              })
              .returning();
            
            console.log(`Created villa: ${newVilla.name} (ID: ${newVilla.id})`);
            created++;
          }
        } catch (error) {
          console.error(`Error processing villa ${villa.name}:`, error);
          errors++;
        }
        
        // Add a small delay to avoid database contention
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Completed batch ${Math.floor(i / batchSize) + 1}:`);
      console.log(`- Created: ${created}`);
      console.log(`- Updated: ${updated}`);
      console.log(`- Errors: ${errors}`);
      
      // Add a slightly longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('Villa import completed:');
    console.log(`- Created: ${created}`);
    console.log(`- Updated: ${updated}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Total processed: ${extractedVillas.length}`);
    
    return { created, updated, errors, total: extractedVillas.length };
    
  } catch (error) {
    console.error('Error during villa import:', error);
    throw error;
  }
}

// Execute the import as an IIFE
(async function () {
  try {
    // Import the next batch of 30 villas
    const result = await importRemainingVillas(30);
    console.log('Import completed successfully:', result);
    
    // Check if we need to continue with more batches
    const totalVillas = await getExistingVillasCount();
    console.log(`Total villas in database after this batch: ${totalVillas}`);
    
    if (totalVillas < 142) {
      console.log(`Still need to import ${142 - totalVillas} more villas`);
      console.log('Run this script again to continue importing the next batch');
    } else {
      console.log('All villas have been imported successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
})();