import axios from 'axios';
import { db } from '../db';
import { villas } from '@shared/schema';

// Initialize axios instance with base configuration
const trackHsApi = axios.create({
  baseURL: 'https://api.trackhs.com/api/v3',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.TRACKHS_API_KEY,
    'X-API-SECRET': process.env.TRACKHS_API_SECRET,
  },
});

export interface TrackHSVilla {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxOccupancy: number;
  amenities: string[];
  images: { url: string; caption: string }[];
  rates: {
    defaultNightly: number;
    currency: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export async function fetchVillas() {
  try {
    console.log('Fetching villas from TrackHS API...');
    const allVillas: TrackHSVilla[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        console.log(`Fetching page ${page}...`);
        // Fetch villa data from TrackHS with pagination
        const response = await trackHsApi.get('/properties', {
          params: {
            page,
            limit: 100, // Get maximum number of items per page
            type: 'villa'
          }
        });

        console.log('API Response:', response.data);

        const villasData = response.data.properties || [];
        console.log(`Retrieved ${villasData.length} villas from page ${page}`);

        if (villasData.length === 0) {
          hasMore = false;
          break;
        }

        allVillas.push(...villasData);
        page++;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        hasMore = false;
        break;
      }
    }

    console.log(`Total villas fetched: ${allVillas.length}`);

    // Process and store each villa
    for (const villaData of allVillas) {
      try {
        // Transform TrackHS villa data to match our schema
        const villaRecord = {
          name: villaData.name,
          description: villaData.description || "Luxury villa in Cabo San Lucas",
          bedrooms: villaData.bedrooms,
          bathrooms: villaData.bathrooms,
          maxGuests: villaData.maxOccupancy,
          amenities: villaData.amenities || [],
          imageUrl: villaData.images[0]?.url || '',
          imageUrls: villaData.images.map(img => img.url),
          pricePerNight: String(villaData.rates?.defaultNightly || 1000), // Convert to string for decimal type
          location: villaData.location?.city || "Cabo San Lucas",
          address: villaData.location?.address || "",
          latitude: String(villaData.location?.latitude || 0), // Convert to string for decimal type
          longitude: String(villaData.location?.longitude || 0), // Convert to string for decimal type
          trackHsId: villaData.id,
          lastSyncedAt: new Date(),
        };

        // Upsert villa data
        await db
          .insert(villas)
          .values(villaRecord)
          .onConflictDoUpdate({
            target: villas.trackHsId,
            set: villaRecord,
          });

        console.log(`Successfully processed villa: ${villaData.id}`);

      } catch (error) {
        console.error(`Error processing villa ${villaData.id}:`, error);
      }
    }

    console.log('Villa sync completed successfully');
    return true;
  } catch (error) {
    console.error('Error fetching villas from TrackHS:', error);
    throw error;
  }
}

// Schedule villa sync
export function scheduleVillaSync(intervalMinutes = 60) {
  // Initial sync
  fetchVillas().catch(console.error);

  // Schedule periodic sync
  setInterval(() => {
    fetchVillas().catch(console.error);
  }, intervalMinutes * 60 * 1000);
}