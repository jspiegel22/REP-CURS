import axios from 'axios';
import { db } from '../db';
import { villas } from '@shared/schema';

if (!process.env.TRACKHS_API_KEY || !process.env.TRACKHS_API_SECRET) {
  throw new Error('Missing required TrackHS API credentials');
}

// Initialize axios instance with base configuration
const trackHsApi = axios.create({
  baseURL: 'https://api.trackhs.com/v3',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.TRACKHS_API_KEY,
    'X-API-SECRET': process.env.TRACKHS_API_SECRET,
    'Authorization': `Bearer ${process.env.TRACKHS_API_KEY}`,
    'X-Channel-ID': process.env.TRACKHS_CHANNEL_ID || '1', // Add channel ID
    'X-PMS-ID': process.env.TRACKHS_PMS_ID || '1' // Add PMS ID
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
    throw error;
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

export interface Villa extends TrackHSVilla{}

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

    const allVillas: Villa[] = [];
    let page = 1;
    let hasMore = true;

    // Test each potential endpoint
    const endpoints = [
      '/properties',
      '/rentals',
      '/units',
      '/listings',
      '/channel/properties', // Try with channel prefix
      '/channel/units'
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
      } catch (error) {
        console.error(`Failed with endpoint ${endpoint}:`, {
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });
      }
    }

    if (allVillas.length === 0) {
      throw new Error(
        'Could not fetch villas. Possible reasons:\n' +
        '1. Need Channel ID or PMS ID in request\n' +
        '2. Incorrect endpoint structure\n' +
        '3. Additional authentication required\n' +
        'Please verify API requirements with provider.'
      );
    }

    return allVillas;
  } catch (error) {
    console.error('Villa fetch process failed:', error);
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