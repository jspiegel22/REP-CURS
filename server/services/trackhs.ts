import axios from 'axios';
import { db } from '../db';
import { villas } from '@shared/schema';

const TRACKHS_API_BASE_URL = 'https://api.trackhs.com/channel/v1';

// Initialize axios instance with base configuration
const trackHsApi = axios.create({
  baseURL: TRACKHS_API_BASE_URL,
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

    // Fetch villa data from TrackHS
    const response = await trackHsApi.get('/units');
    const villasData: TrackHSVilla[] = response.data.units;

    console.log(`Retrieved ${villasData.length} villas from TrackHS`);

    // Process and store each villa
    for (const villaData of villasData) {
      try {
        // Transform TrackHS villa data to match our schema
        const villaRecord = {
          name: villaData.name,
          description: villaData.description,
          bedrooms: villaData.bedrooms,
          bathrooms: villaData.bathrooms,
          maxGuests: villaData.maxOccupancy,
          amenities: villaData.amenities,
          imageUrl: villaData.images[0]?.url || '',
          imageUrls: villaData.images.map(img => img.url),
          pricePerNight: String(villaData.rates.defaultNightly), // Convert to string for decimal type
          location: villaData.location.city,
          address: villaData.location.address,
          latitude: String(villaData.location.latitude), // Convert to string for decimal type
          longitude: String(villaData.location.longitude), // Convert to string for decimal type
          trackHsId: villaData.id,
          lastSyncedAt: new Date(),
        };

        // Upsert villa data - create if doesn't exist, update if exists
        await db
          .insert(villas)
          .values(villaRecord)
          .onConflictDoUpdate({
            target: villas.trackHsId,
            set: villaRecord,
          });

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

// Schedule villa data sync
export function scheduleVillaSync(intervalMinutes = 60) {
  // Initial sync
  fetchVillas().catch(console.error);

  // Schedule periodic sync
  setInterval(() => {
    fetchVillas().catch(console.error);
  }, intervalMinutes * 60 * 1000);
}