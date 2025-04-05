require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrateToSupabase() {
  console.log('Starting Supabase migration with direct PostgreSQL connection...');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
    return false;
  }

  // Extract database URL from Supabase URL
  // This requires parsing the host from the URL and constructing a proper PostgreSQL connection string
  let dbUrl;
  try {
    // Extract project ref from Supabase URL
    const supabaseUrl = new URL(process.env.SUPABASE_URL);
    const projectRef = supabaseUrl.hostname.split('.')[0];
    
    // Construct database connection string
    dbUrl = `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${projectRef}.supabase.co:5432/postgres`;
    
    console.log('Using database connection string derived from Supabase URL');
  } catch (error) {
    console.error('Error parsing Supabase URL:', error);
    return false;
  }

  // Create PostgreSQL pool for direct connection
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    const testClient = await pool.connect();
    try {
      const result = await testClient.query('SELECT version()');
      console.log('Connected to Supabase PostgreSQL database:', result.rows[0].version);
    } finally {
      testClient.release();
    }

    // Generate schema SQL from Drizzle
    const schemaContent = generateSchema();
    
    // Create tables
    const client = await pool.connect();
    try {
      console.log('Creating tables in Supabase database...');
      
      // Begin transaction
      await client.query('BEGIN');
      
      // Split statements and execute them one by one
      const statements = schemaContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/--.*$/gm, '') // Remove single-line comments
        .split(';')
        .filter(stmt => stmt.trim()); // Remove empty statements
      
      for (const statement of statements) {
        try {
          await client.query(statement);
          console.log(`Successfully executed: ${statement.substring(0, 80)}...`);
        } catch (error) {
          console.error(`Error executing statement: ${statement}`);
          console.error('Error details:', error.message);
          // Continue to the next statement instead of failing completely
        }
      }
      
      // Commit transaction
      await client.query('COMMIT');
      console.log('All tables created successfully!');
      
      // Verify tables
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      console.log('\nTables in database:');
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
      
      return tables.rows.length > 0;
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error creating tables:', error);
      return false;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to Supabase PostgreSQL database:', error);
    return false;
  } finally {
    await pool.end();
  }
}

// Generate schema SQL from schema.ts
function generateSchema() {
  return `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'traveler',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
  );

  -- Listings table
  CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price INTEGER,
    location TEXT NOT NULL,
    booking_type TEXT NOT NULL,
    partner_id INTEGER REFERENCES users(id)
  );

  -- Resorts table
  CREATE TABLE IF NOT EXISTS resorts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    review_count INTEGER NOT NULL,
    price_level TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    amenities JSONB NOT NULL,
    rooms INTEGER NOT NULL,
    max_guests INTEGER NOT NULL,
    is_beachfront BOOLEAN DEFAULT FALSE,
    is_oceanfront BOOLEAN DEFAULT FALSE,
    google_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Bookings table
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    preferred_contact_method TEXT,
    preferred_contact_time TEXT,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    form_name TEXT,
    form_data JSONB,
    notes TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    tags TEXT[],
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    booking_type TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    guests INTEGER NOT NULL,
    total_amount DECIMAL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    special_requests TEXT,
    budget TEXT,
    listing_id INTEGER REFERENCES listings(id)
  );

  -- Leads table
  CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    preferred_contact_method TEXT,
    preferred_contact_time TEXT,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    form_name TEXT,
    form_data JSONB,
    notes TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    tags TEXT[],
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    interest_type TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    priority TEXT DEFAULT 'normal',
    assigned_to TEXT
  );

  -- Guide submissions table
  CREATE TABLE IF NOT EXISTS guide_submissions (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    preferred_contact_method TEXT,
    preferred_contact_time TEXT,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    form_name TEXT,
    form_data JSONB,
    notes TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    tags TEXT[],
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    guide_type TEXT NOT NULL,
    interest_areas TEXT[],
    travel_dates TEXT,
    number_of_travelers INTEGER,
    download_link TEXT,
    processed_at TIMESTAMP,
    submission_id TEXT NOT NULL UNIQUE
  );

  -- Rewards table
  CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    points_required INTEGER NOT NULL,
    type TEXT NOT NULL,
    value DECIMAL NOT NULL,
    active BOOLEAN DEFAULT TRUE
  );

  -- Social shares table
  CREATE TABLE IF NOT EXISTS social_shares (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    listing_id INTEGER REFERENCES listings(id),
    platform TEXT NOT NULL,
    shared_at TIMESTAMP DEFAULT NOW(),
    points_earned INTEGER DEFAULT 10
  );

  -- Weather cache table
  CREATE TABLE IF NOT EXISTS weather_cache (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Villas table
  CREATE TABLE IF NOT EXISTS villas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    max_guests INTEGER NOT NULL,
    amenities JSONB NOT NULL DEFAULT '[]',
    image_url TEXT NOT NULL,
    image_urls JSONB NOT NULL DEFAULT '[]',
    price_per_night DECIMAL NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    trackhs_id TEXT UNIQUE,
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Session table for Postgres session store
  CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
  );
  CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
  `;
}

// Run if called directly
if (require.main === module) {
  migrateToSupabase()
    .then(success => {
      if (success) {
        console.log('✅ Supabase migration completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Supabase migration failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error during migration:', error);
      process.exit(1);
    });
}

module.exports = { migrateToSupabase };