require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseKey);

// Essential tables we need to create
const tableDefinitions = [
  {
    name: 'users',
    query: `
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_admin BOOLEAN DEFAULT FALSE
      );
    `
  },
  {
    name: 'villas',
    query: `
      CREATE TABLE IF NOT EXISTS public.villas (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT,
        bedrooms INTEGER,
        bathrooms INTEGER,
        rate_per_night DECIMAL(10,2),
        slug TEXT UNIQUE,
        features JSONB,
        images TEXT[],
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'adventures',
    query: `
      CREATE TABLE IF NOT EXISTS public.adventures (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price_per_person DECIMAL(10,2),
        duration INTEGER,
        location TEXT,
        slug TEXT UNIQUE,
        images TEXT[],
        features JSONB,
        active BOOLEAN DEFAULT TRUE,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'bookings',
    query: `
      CREATE TABLE IF NOT EXISTS public.bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(id),
        booking_type TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        guests INTEGER,
        total_price DECIMAL(10,2),
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'guide_requests',
    query: `
      CREATE TABLE IF NOT EXISTS public.guide_requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        interests TEXT[],
        message TEXT,
        guide_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  }
];

async function createTables() {
  console.log('Starting table creation...');

  // Begin with a retry attempt for the users table (to handle potential race conditions)
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (!error) {
      console.log('Users table already exists, checking other tables...');
    } else {
      console.log('Users table does not exist, creating tables...');
    }
  } catch (err) {
    console.log('Error checking users table:', err.message);
  }

  // Attempt to create each table in order
  for (const table of tableDefinitions) {
    try {
      console.log(`Creating table: ${table.name}`);
      
      // Try to use Supabase's SQL feature if available
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: table.query
        })
      });
      
      if (response.ok) {
        console.log(`Created table: ${table.name}`);
      } else {
        const errorText = await response.text();
        console.error(`Error creating table ${table.name}:`, errorText);
      }
    } catch (err) {
      console.error(`Error creating table ${table.name}:`, err.message);
    }
  }
}

// Create tables one by one
createTables().then(() => {
  console.log('Table creation process completed');
}).catch(err => {
  console.error('Fatal error during table creation:', err);
});