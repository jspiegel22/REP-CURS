import axios from 'axios';
import { db } from '../db';
import { villas } from '@shared/schema';

// Initialize axios instance with base configuration
const trackHsApi = axios.create({
  baseURL: 'https://cabovillas.trackhs.com/api/pms',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic M2Q5ZDFlMzM4MzE5MGRiMDdjN2JlMTk1OGExYzRiMGI6OGM5ZDE4NTMyNmEzM2Q0OTQxN2JiNzc3ODlhMzg2ZmM='
  }
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
    return Promise.reject(error);
  }
);

// Try to get API configuration first
async function checkApiConfiguration() {
  try {
    const response = await trackHsApi.get('/configuration');
    console.log('API Configuration Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get API configuration:', error);
    return null;
  }
}

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
    console.log('Starting villa fetch process...');

    // Check API configuration first
    const config = await checkApiConfiguration();
    if (!config) {
      console.log('Could not get API configuration. May need additional authentication parameters.');
    }

    // Test each potential endpoint
    const endpoints = [
      '/units',
      '/properties',
      '/listings'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
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
          dataStructure: Object.keys(response.data),
          itemCount: response.data?.data?.length || 0
        });

        // If we got a successful response with data, break the loop
        if (response.data?.data?.length > 0) {
          console.log(`Found working endpoint: ${endpoint}`);
          break;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed with endpoint ${endpoint}:`, {
            message: error.message
          });
        }
        continue; // Try next endpoint
      }
    }

    return []; // Return empty array instead of throwing
  } catch (error) {
    console.error('Villa fetch process failed:', error);
    return [];
  }
}

// Schedule villa sync
export function scheduleVillaSync(intervalMinutes = 60) {
  // Initial sync - run in background with delay
  setTimeout(() => {
    fetchVillas().catch(error => {
      console.error('Initial villa sync failed:', error);
      // Log error but don't throw to prevent app crash
    });
  }, 5000); // Delay initial sync by 5 seconds to allow app to start

  // Schedule periodic sync
  setInterval(() => {
    fetchVillas().catch(error => {
      console.error('Periodic villa sync failed:', error);
      // Log error but don't throw to prevent app crash
    });
  }, intervalMinutes * 60 * 1000);
}