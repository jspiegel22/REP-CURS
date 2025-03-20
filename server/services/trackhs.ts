import axios from 'axios';
import { db } from '../db';
import { villas } from '@shared/schema';

// Initialize axios instance with base configuration
const trackHsApi = axios.create({
  baseURL: 'https://api.trackhs.com/v3', // Base URL for API v3
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.TRACKHS_API_KEY,
    'X-API-SECRET': process.env.TRACKHS_API_SECRET,
    'Authorization': `Bearer ${process.env.TRACKHS_API_KEY}`
  },
});

// Add response interceptor for better error logging
trackHsApi.interceptors.response.use(
  response => response,
  error => {
    console.error('TrackHS API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      headers: error.config?.headers,
      requestData: error.config?.data
    });
    throw error;
  }
);

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

    // First try to get API configuration/status
    try {
      const configResponse = await trackHsApi.get('/configuration');
      console.log('API Configuration:', configResponse.data);
    } catch (error) {
      console.error('Error fetching API configuration:', error);
    }

    const allVillas: TrackHSVilla[] = [];
    let page = 1;
    let hasMore = true;

    // Try different endpoint patterns to determine the correct one
    const endpoints = [
      '/properties',
      '/rentals',
      '/units',
      '/listings'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch villas from ${endpoint}...`);

        const response = await trackHsApi.get(endpoint, {
          params: {
            page: 1,
            limit: 100,
            status: 'active',
            include: 'amenities,images,rates,location'
          }
        });

        console.log(`Response from ${endpoint}:`, {
          status: response.status,
          dataKeys: Object.keys(response.data),
          itemCount: response.data?.data?.length || response.data?.properties?.length || response.data?.listings?.length
        });

        if (response.data && (response.data.data || response.data.properties || response.data.listings)) {
          // We found a working endpoint, now paginate through all results
          while (hasMore) {
            console.log(`Fetching page ${page} from ${endpoint}...`);

            const pageResponse = await trackHsApi.get(endpoint, {
              params: {
                page,
                limit: 100,
                status: 'active',
                include: 'amenities,images,rates,location'
              }
            });

            const villasData = pageResponse.data.data || pageResponse.data.properties || pageResponse.data.listings || [];

            if (villasData.length === 0) {
              hasMore = false;
              break;
            }

            console.log(`Retrieved ${villasData.length} villas from page ${page}`);
            allVillas.push(...villasData);
            page++;
          }

          // If we successfully got villas, no need to try other endpoints
          if (allVillas.length > 0) {
            break;
          }
        }
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        continue; // Try next endpoint
      }
    }

    console.log(`Total villas fetched: ${allVillas.length}`);

    if (allVillas.length === 0) {
      throw new Error('No villas could be fetched from any endpoint. Additional configuration may be required.');
    }

    // Process and store each villa
    for (const villaData of allVillas) {
      try {
        // Transform TrackHS villa data to match our schema
        const villaRecord = {
          trackHsId: villaData.id,
          name: villaData.name,
          description: villaData.description || "Luxury villa in Cabo San Lucas",
          bedrooms: villaData.bedrooms,
          bathrooms: villaData.bathrooms,
          maxGuests: villaData.maxOccupancy,
          amenities: villaData.amenities || [],
          imageUrl: villaData.images[0]?.url || '',
          imageUrls: villaData.images.map(img => img.url),
          pricePerNight: String(villaData.rates?.defaultNightly || 0),
          location: villaData.location?.city || "Cabo San Lucas",
          address: villaData.location?.address || "",
          latitude: String(villaData.location?.latitude || 0),
          longitude: String(villaData.location?.longitude || 0),
          lastSyncedAt: new Date(),
        };

        console.log(`Processing villa ${villaData.id}:`, villaRecord);

        // Upsert villa data
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

// Schedule villa sync
export function scheduleVillaSync(intervalMinutes = 60) {
  // Initial sync
  fetchVillas().catch(console.error);

  // Schedule periodic sync
  setInterval(() => {
    fetchVillas().catch(console.error);
  }, intervalMinutes * 60 * 1000);
}