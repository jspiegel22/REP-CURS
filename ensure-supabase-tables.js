require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');

// Verify environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Also try direct database connection
let pool = null;
if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
  });
}

async function ensureSupabaseTables() {
  console.log('Checking Supabase tables...');
  
  try {
    // Method 1: Use Supabase JS client
    const { data: testUsers, error: testError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (testError && testError.code === 'PGRST116') {
      console.log('❌ "users" table not found in Supabase');
    } else if (testError) {
      console.error('Error checking users table:', testError);
    } else {
      console.log('✓ "users" table exists in Supabase, found:');
      console.log(testUsers);
      return; // Tables already exist, no need to create them
    }
    
    // Method 2: Try direct PostgreSQL connection
    if (pool) {
      console.log('Attempting direct PostgreSQL connection...');
      const client = await pool.connect();
      
      try {
        // Check tables in current schema
        const { rows } = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        
        if (rows.length > 0) {
          console.log('Existing tables in database:');
          rows.forEach(row => console.log(`- ${row.table_name}`));
        } else {
          console.log('No tables found in the public schema.');
        }
        
        // Create basic tables
        console.log('Creating basic tables in Supabase...');
        
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
        
        // Insert a test user
        await client.query(`
          INSERT INTO users (username, email, password, first_name, last_name)
          VALUES ('testuser', 'test@example.com', 'passwordhash', 'Test', 'User')
          ON CONFLICT (username) DO NOTHING;
        `);
        console.log('✓ Added test user');
        
        // Verify tables were created
        const { rows: finalTables } = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        
        console.log('\nTables after creation:');
        finalTables.forEach(row => console.log(`- ${row.table_name}`));
        
      } finally {
        client.release();
      }
    } else {
      console.log('No DATABASE_URL provided for direct connection.');
    }
    
  } catch (error) {
    console.error('Error ensuring Supabase tables:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the function
ensureSupabaseTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});