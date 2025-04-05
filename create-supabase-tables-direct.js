require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function createSupabaseTables() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }

  console.log('Initiating direct Supabase table creation...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test connection
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    console.log('Supabase connection successful!');
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
    return false;
  }
  
  // Directly execute CREATE TABLE statements
  const tableSchemas = {
    users: `
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    listings: `
      CREATE TABLE IF NOT EXISTS public.listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        location VARCHAR(255),
        category VARCHAR(50),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    resorts: `
      CREATE TABLE IF NOT EXISTS public.resorts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        price_range VARCHAR(50),
        amenities TEXT[],
        rating DECIMAL(3, 2),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    bookings: `
      CREATE TABLE IF NOT EXISTS public.bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(id),
        listing_id INTEGER REFERENCES public.listings(id),
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER,
        total_price DECIMAL(10, 2),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    leads: `
      CREATE TABLE IF NOT EXISTS public.leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        interest VARCHAR(100),
        message TEXT,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    guide_submissions: `
      CREATE TABLE IF NOT EXISTS public.guide_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        travel_date DATE,
        interests TEXT[],
        guide_id VARCHAR(255),
        downloaded BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    rewards: `
      CREATE TABLE IF NOT EXISTS public.rewards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(id),
        points INTEGER DEFAULT 0,
        tier VARCHAR(50) DEFAULT 'bronze',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    social_shares: `
      CREATE TABLE IF NOT EXISTS public.social_shares (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(id),
        content_id INTEGER,
        platform VARCHAR(50),
        share_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    weather_cache: `
      CREATE TABLE IF NOT EXISTS public.weather_cache (
        id SERIAL PRIMARY KEY,
        location VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(location, date)
      );
    `,
    villas: `
      CREATE TABLE IF NOT EXISTS public.villas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        bedrooms INTEGER,
        bathrooms INTEGER,
        capacity INTEGER,
        price_per_night DECIMAL(10, 2),
        amenities TEXT[],
        images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    adventures: `
      CREATE TABLE IF NOT EXISTS public.adventures (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(50),
        price DECIMAL(10, 2),
        location VARCHAR(255),
        difficulty VARCHAR(50),
        category VARCHAR(50),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    session: `
      CREATE TABLE IF NOT EXISTS public.session (
        sid VARCHAR(255) NOT NULL PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON public.session ("expire");
    `
  };
  
  // Execute each statement directly via fetch API
  for (const [tableName, sql] of Object.entries(tableSchemas)) {
    console.log(`Creating table: ${tableName}`);
    
    try {
      // Use the Supabase REST API
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: sql
      });
      
      if (response.ok) {
        console.log(`✅ Successfully created table: ${tableName}`);
      } else {
        const responseText = await response.text();
        console.error(`❌ Error creating table ${tableName}: ${responseText}`);
        
        // Try alternative approach - use Supabase SQL API if available
        console.log(`Trying alternative approach for ${tableName}...`);
        try {
          // If we have DATABASE_URL, try direct connection
          if (process.env.DATABASE_URL) {
            const { Pool } = require('pg');
            const pool = new Pool({
              connectionString: process.env.DATABASE_URL,
              ssl: { rejectUnauthorized: false }
            });
            
            try {
              const client = await pool.connect();
              await client.query(sql);
              client.release();
              console.log(`✅ Successfully created table ${tableName} via direct connection`);
            } catch (pgError) {
              console.error(`❌ Error creating table ${tableName} via direct connection: ${pgError.message}`);
            } finally {
              await pool.end();
            }
          }
        } catch (altError) {
          console.error(`Alternative approach failed for ${tableName}: ${altError.message}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error creating table ${tableName}: ${error.message}`);
    }
  }
  
  console.log('Direct table creation completed');
  
  // Verify tables
  console.log('Verifying tables...');
  
  for (const tableName of Object.keys(tableSchemas)) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${tableName}' verification failed: ${error.message}`);
      } else {
        console.log(`✅ Table '${tableName}' exists and is accessible`);
      }
    } catch (error) {
      console.log(`❌ Table '${tableName}' verification failed: ${error.message}`);
    }
  }
  
  return true;
}

// Run if called directly
if (require.main === module) {
  createSupabaseTables()
    .then(success => {
      if (success) {
        console.log('Table creation process completed!');
        process.exit(0);
      } else {
        console.error('Table creation process failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createSupabaseTables };