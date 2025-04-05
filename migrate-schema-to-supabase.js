require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function migrateSchemaToSupabase() {
  console.log('Starting schema migration to Supabase...');

  // Check for required environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    return false;
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('Supabase client initialized');

    // Create the exec_sql function if it doesn't exist
    const createFuncSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT) 
    RETURNS VOID AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // Create the function using RPC
    console.log('Creating exec_sql function...');
    const { error: funcError } = await supabase.rpc('exec_sql', {
      sql_query: createFuncSQL
    });

    if (funcError) {
      console.log('Error creating exec_sql function. Function may already exist or trying alternative...');
      
      // Try to execute the function directly (it might already exist)
      const { error: directError } = await supabase.from('_temp_exec').select(`*`).limit(1);
      
      if (directError) {
        console.error('Could not create or use exec_sql function:', directError.message);
        return false;
      }
    } else {
      console.log('exec_sql function created successfully');
    }

    // Generate schema from our drizzle schema
    const schema = generateSchema();
    console.log('Schema generated');

    // Split schema into individual statements (each CREATE TABLE...)
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && stmt.toUpperCase().includes('CREATE TABLE'));

    console.log(`Found ${statements.length} table creation statements`);

    // Create each table via RPC
    let successCount = 0;
    for (const statement of statements) {
      // Extract table name for logging
      const tableName = statement.match(/CREATE TABLE.*?(\w+)/i)?.[1] || 'unknown';
      console.log(`Creating table: ${tableName}`);

      // Execute the statement
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        console.error(`Error creating table ${tableName}:`, error.message);
        
        // Try direct fetch approach as a fallback
        console.log(`Trying alternative approach for ${tableName}...`);
        
        try {
          // Alternative: Use fetch directly to POST the SQL
          const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              sql_query: statement
            })
          });
          
          if (!response.ok) {
            console.error(`Failed to create table ${tableName} using fetch approach:`, await response.text());
          } else {
            console.log(`✅ Table ${tableName} created successfully via fetch`);
            successCount++;
          }
        } catch (fetchError) {
          console.error(`Fetch approach failed for ${tableName}:`, fetchError.message);
        }
      } else {
        console.log(`✅ Table ${tableName} created successfully`);
        successCount++;
      }
    }

    console.log(`Created ${successCount}/${statements.length} tables`);
    
    // Verify tables exist by checking their existence
    console.log('\nVerifying tables in Supabase...');
    const { data: tables, error: listError } = await supabase
      .from('_table_info')
      .select('table_name')
      .eq('schema', 'public');
    
    if (listError) {
      console.error('Error listing tables:', listError.message);
      // Try an alternative approach - query information_schema
      const { data: infoSchemaTables, error: infoSchemaError } = await supabase.rpc('exec_sql', {
        sql_query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      });
      
      if (infoSchemaError) {
        console.error('Could not list tables from information_schema:', infoSchemaError.message);
      } else if (infoSchemaTables && infoSchemaTables.length > 0) {
        console.log('Tables in database:');
        infoSchemaTables.forEach((row, i) => {
          console.log(`- ${row.table_name || `Table ${i+1}`}`);
        });
        return true;
      }
    } else if (tables && tables.length > 0) {
      console.log('Tables in database:');
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
      return true;
    }

    return successCount > 0;
  } catch (error) {
    console.error('Unexpected error during migration:', error.message);
    return false;
  }
}

// Generate schema from our schema.ts file
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
  `;
}

// Run if called directly
if (require.main === module) {
  migrateSchemaToSupabase()
    .then(success => {
      if (success) {
        console.log('✅ Schema migration to Supabase completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Schema migration to Supabase failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { migrateSchemaToSupabase };