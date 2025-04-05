require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Verify environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a direct database connection for SQL operations
const pool = new Pool({
  connectionString: databaseUrl,
});

async function directMigration() {
  console.log('Starting direct Supabase migration...');
  
  try {
    const client = await pool.connect();
    console.log('✓ Connected to database directly via connection string');
    
    // List existing tables
    const { rows: existingTables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (existingTables.length > 0) {
      console.log('Existing tables in database:');
      existingTables.forEach(row => console.log(`- ${row.table_name}`));
    } else {
      console.log('No tables found in the public schema.');
    }
    
    // Create tables directly from schema.sql if it exists
    try {
      const schemaContent = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      console.log('Found schema.sql, creating tables...');
      
      // Split and execute each statement
      const statements = schemaContent
        .split(';')
        .filter(stmt => stmt.trim().length > 0);
      
      for (const statement of statements) {
        try {
          await client.query(statement);
          console.log('✓ Executed SQL statement successfully');
        } catch (error) {
          console.error('⚠️ Error executing statement:', error.message);
          console.log('Statement:', statement);
        }
      }
    } catch (fileError) {
      console.error('Could not read schema.sql:', fileError.message);
      
      // Create basic tables if schema file doesn't exist
      console.log('Creating base tables from schema.ts...');
      
      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT UNIQUE,
          password TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created users table');
      
      // Listings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS listings (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          price DECIMAL,
          image_url TEXT,
          type TEXT,
          location TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created listings table');
      
      // Resorts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS resorts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          location TEXT,
          image_url TEXT,
          rating DECIMAL,
          price_range TEXT,
          amenities JSONB,
          slug TEXT UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created resorts table');
      
      // Bookings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          listing_id INTEGER REFERENCES listings(id),
          check_in DATE NOT NULL,
          check_out DATE NOT NULL,
          guests INTEGER,
          total_price DECIMAL NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created bookings table');
      
      // Leads table
      await client.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT,
          interest_area TEXT,
          status TEXT DEFAULT 'new',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created leads table');
      
      // Guide submissions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS guide_submissions (
          id SERIAL PRIMARY KEY,
          submission_id TEXT UNIQUE,
          first_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          guide_type TEXT,
          preferred_contact_method TEXT,
          interest_areas TEXT[],
          tags TEXT[],
          source TEXT,
          form_name TEXT,
          status TEXT DEFAULT 'new',
          form_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created guide_submissions table');
      
      // Weather cache table
      await client.query(`
        CREATE TABLE IF NOT EXISTS weather_cache (
          id SERIAL PRIMARY KEY,
          location TEXT UNIQUE,
          data JSONB,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created weather_cache table');
      
      // Villas table
      await client.query(`
        CREATE TABLE IF NOT EXISTS villas (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          location TEXT,
          bedrooms INTEGER,
          bathrooms INTEGER,
          max_guests INTEGER,
          price_per_night DECIMAL,
          image_urls TEXT[],
          amenities TEXT[],
          track_hs_id TEXT UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created villas table');
      
      // Rewards table
      await client.query(`
        CREATE TABLE IF NOT EXISTS rewards (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          points_required INTEGER NOT NULL,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created rewards table');
      
      // Social shares table
      await client.query(`
        CREATE TABLE IF NOT EXISTS social_shares (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          platform TEXT NOT NULL,
          content_id TEXT,
          points_earned INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✓ Created social_shares table');
    }
    
    // List tables after migration
    const { rows: finalTables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables after migration:');
    finalTables.forEach(row => console.log(`- ${row.table_name}`));
    
    client.release();
    console.log('\n✓ Migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Execute the migration
directMigration().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});