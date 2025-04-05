require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// SQL schema based on our schema.ts file
const schemaSQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'traveler',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  email VARCHAR(255)
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL NULL,
  location VARCHAR(255) NOT NULL,
  booking_type VARCHAR(50) NOT NULL,
  partner_id INTEGER REFERENCES users(id)
);

-- Create resorts table
CREATE TABLE IF NOT EXISTS resorts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL NOT NULL,
  review_count INTEGER NOT NULL,
  price_level VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  amenities JSONB NOT NULL,
  rooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  is_beachfront BOOLEAN,
  is_oceanfront BOOLEAN,
  google_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Create villas table
CREATE TABLE IF NOT EXISTS villas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  amenities JSONB NOT NULL,
  image_url TEXT NOT NULL,
  image_urls JSONB NOT NULL,
  price_per_night DECIMAL NOT NULL,
  location VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  trackhs_id VARCHAR(255),
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  preferred_contact_method VARCHAR(50),
  preferred_contact_time VARCHAR(50),
  source VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  form_name VARCHAR(255),
  form_data JSONB,
  notes TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer TEXT,
  tags TEXT[],
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  booking_type VARCHAR(50) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  guests INTEGER NOT NULL,
  total_amount DECIMAL,
  currency VARCHAR(3),
  payment_status VARCHAR(50),
  payment_method VARCHAR(50),
  special_requests TEXT,
  budget VARCHAR(50),
  listing_id INTEGER REFERENCES listings(id),
  confirmation_code VARCHAR(255)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  preferred_contact_method VARCHAR(50),
  preferred_contact_time VARCHAR(50),
  source VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  form_name VARCHAR(255),
  form_data JSONB,
  notes TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer TEXT,
  tags TEXT[],
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  interest_type VARCHAR(50) NOT NULL,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  priority VARCHAR(50),
  assigned_to VARCHAR(255),
  tracking_id VARCHAR(255)
);

-- Create guide_submissions table
CREATE TABLE IF NOT EXISTS guide_submissions (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  preferred_contact_method VARCHAR(50),
  preferred_contact_time VARCHAR(50),
  source VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  form_name VARCHAR(255),
  form_data JSONB,
  notes TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer TEXT,
  tags TEXT[],
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  guide_type VARCHAR(50) NOT NULL,
  interest_areas TEXT[],
  travel_dates VARCHAR(255),
  number_of_travelers INTEGER,
  download_link TEXT,
  processed_at TIMESTAMP,
  submission_id VARCHAR(255) NOT NULL
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  value DECIMAL NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- Create social_shares table
CREATE TABLE IF NOT EXISTS social_shares (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  listing_id INTEGER REFERENCES listings(id),
  platform VARCHAR(50) NOT NULL,
  shared_at TIMESTAMP,
  points_earned INTEGER
);

-- Create weather_cache table
CREATE TABLE IF NOT EXISTS weather_cache (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL
);

-- Create session table for connect-pg-simple
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
`;

async function migrateSchemaToSupabase() {
  try {
    console.log('Starting Supabase migration...');

    // Simple approach - execute entire schema as one transaction
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL });

    if (error) {
      console.error('Error with RPC method:', error);
      console.log('Trying alternative approach with REST API...');
      
      try {
        // If RPC fails, use REST API, but we need to use SQL injection protection
        // Splitting into individual table creation queries
        const queries = schemaSQL.split(';')
          .map(query => query.trim())
          .filter(query => query.length > 0);
          
        console.log(`Found ${queries.length} SQL statements to execute.`);
          
        // Execute each table creation query
        for (let i = 0; i < queries.length; i++) {
          const query = queries[i];
          console.log(`Executing statement ${i+1}/${queries.length}: ${query.substring(0, 60)}...`);
          
          try {
            // Use a basic HTTP fetch to execute SQL if needed
            // This is a fallback only if the RPC method doesn't work
            console.log('SQL statement length:', query.length);
            
            // Alternatively, write SQL to file for manual execution
            fs.appendFileSync('schema-to-execute.sql', query + ';\n\n');
          } catch (execError) {
            console.error(`Error executing statement ${i+1}:`, execError);
          }
        }
        
        console.log('SQL statements have been written to schema-to-execute.sql');
        console.log('Please execute this SQL in the Supabase SQL Editor manually.');
      } catch (alternativeError) {
        console.error('Error with alternative approach:', alternativeError);
      }
      
      return;
    }

    console.log('Migration completed successfully!');
    // Verify migration
    await verifyTables();
  } catch (error) {
    console.error('Migration error:', error);
  }
}

async function verifyTables() {
  const tables = [
    'users', 
    'listings', 
    'bookings', 
    'leads', 
    'guide_submissions',
    'resorts', 
    'villas',
    'rewards',
    'social_shares',
    'weather_cache',
    'session'
  ];

  console.log('\nVerifying tables...');

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ Table '${table}' error:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (error) {
      console.log(`❌ Error querying table '${table}':`, error.message);
    }
  }
}

migrateSchemaToSupabase();