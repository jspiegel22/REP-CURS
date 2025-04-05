require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load shared schema from your project
const sharedSchemaPath = path.join(__dirname, 'shared', 'schema.ts');
let sharedSchema;

try {
  if (fs.existsSync(sharedSchemaPath)) {
    console.log('Reading schema from shared/schema.ts');
    sharedSchema = fs.readFileSync(sharedSchemaPath, 'utf8');
  } else {
    console.log('shared/schema.ts not found, will use hardcoded schema');
  }
} catch (error) {
  console.error('Error reading shared schema:', error.message);
}

async function createSupabaseSchema() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }

  console.log('Creating schema in Supabase database...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test Supabase connection
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
  
  // Create tables with JS client
  // Note: Supabase JS client doesn't support direct CREATE TABLE statements
  // We'll create each table using their API

  // Let's try to create tables using Supabase Storage
  const tablesCreated = await createTablesViaStorage(supabase);
  
  if (tablesCreated) {
    console.log('✅ Tables created successfully using Supabase Storage');
  } else {
    console.log('❌ Failed to create tables using Supabase Storage');
  }
  
  // Additional check by trying to read from tables
  console.log('Verifying table access...');
  
  const tables = [
    'users', 'listings', 'resorts', 'bookings', 'leads', 'guide_submissions',
    'rewards', 'social_shares', 'weather_cache', 'villas', 'adventures'
  ];
  
  let accessibleTables = 0;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`✅ Table '${table}' accessible - found ${data.length} rows`);
        accessibleTables++;
      } else {
        console.log(`❌ Table '${table}' not accessible: ${error.message}`);
      }
    } catch (error) {
      console.log(`❌ Table '${table}' error: ${error.message}`);
    }
  }
  
  console.log(`\nAccess verification: ${accessibleTables}/${tables.length} tables accessible`);
  
  if (accessibleTables === 0) {
    console.log('⚠️ No tables are accessible. Schema creation may have failed.');
    return false;
  }
  
  return true;
}

async function createTablesViaStorage(supabase) {
  try {
    console.log('Attempting to create tables via Supabase Storage...');
    
    // Create a bucket for table definitions if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('schema-migration', { public: false });
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating bucket:', bucketError.message);
      return false;
    }
    
    // Create a SQL file with our schema
    const schemaSQL = generateSchemaSQL();
    
    // Upload schema file to bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('schema-migration')
      .upload('schema.sql', Buffer.from(schemaSQL), {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading schema file:', uploadError.message);
      return false;
    }
    
    console.log('Schema file uploaded to Supabase Storage');
    
    // Create a publicly accessible URL for the file
    const { data: urlData } = await supabase.storage
      .from('schema-migration')
      .getPublicUrl('schema.sql');
    
    if (!urlData?.publicUrl) {
      console.error('Failed to get public URL for schema file');
      return false;
    }
    
    console.log('Schema file public URL:', urlData.publicUrl);
    
    // Unfortunately, we still can't execute SQL directly from here
    // Let the user know they need to go to SQL Editor in Supabase dashboard
    console.log('\n⚠️ IMPORTANT MANUAL STEP REQUIRED:');
    console.log('1. Please log in to your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Download the file at:', urlData.publicUrl);
    console.log('4. Paste the SQL into the editor and run it');
    console.log('5. Come back here once you have executed the SQL');
    
    // Let the user know we can't automate this step
    return false;
  } catch (error) {
    console.error('Error in createTablesViaStorage:', error.message);
    return false;
  }
}

function generateSchemaSQL() {
  // Generate a SQL schema based on either our shared schema or fallback
  const schema = `
-- Schema for Cabo San Lucas Travel Platform

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table (general listings)
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

-- Resorts table
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

-- Bookings table
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

-- Leads table (for lead generation)
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

-- Guide submissions table
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

-- Rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id),
  points INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'bronze',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social shares table
CREATE TABLE IF NOT EXISTS public.social_shares (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id),
  content_id INTEGER,
  platform VARCHAR(50),
  share_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather cache table
CREATE TABLE IF NOT EXISTS public.weather_cache (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(location, date)
);

-- Villas table
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

-- Adventures table
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

-- Session table for express-session
CREATE TABLE IF NOT EXISTS public.session (
  sid VARCHAR(255) NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON public.session ("expire");
  `;
  
  return schema;
}

// Run if called directly
if (require.main === module) {
  createSupabaseSchema()
    .then(success => {
      if (success) {
        console.log('Schema creation process completed!');
        process.exit(0);
      } else {
        console.error('Schema creation process failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createSupabaseSchema };