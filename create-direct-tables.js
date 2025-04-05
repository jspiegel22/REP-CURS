require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

async function createTables() {
  console.log('Creating tables directly via PostgreSQL...');
  
  // Read SUPABASE_DB_URL from .env file since it might not be loaded into process.env yet
  let supabaseDbUrl;
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/SUPABASE_DB_URL=(.*)/);
    if (match && match[1]) {
      supabaseDbUrl = match[1];
    }
  } catch (err) {
    console.error('Could not read .env file:', err.message);
  }
  
  if (!supabaseDbUrl) {
    console.error('Missing SUPABASE_DB_URL environment variable');
    return false;
  }
  
  console.log(`Using Supabase PostgreSQL URL: ${supabaseDbUrl.substring(0, 35)}...`);
  
  try {
    const pool = new Pool({
      connectionString: supabaseDbUrl,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('Connected to PostgreSQL, creating tables...');
    
    const client = await pool.connect();
    
    // Create key tables
    const createTablesSQL = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'traveler',
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1
      );`,
      
      // Guide submissions table
      `CREATE TABLE IF NOT EXISTS guide_submissions (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        email TEXT NOT NULL,
        guide_type TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'website',
        status TEXT NOT NULL DEFAULT 'pending',
        form_name TEXT NOT NULL DEFAULT 'guide-download',
        submission_id TEXT NOT NULL,
        phone TEXT,
        last_name TEXT,
        form_data JSONB,
        interest_areas TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      // Resorts table
      `CREATE TABLE IF NOT EXISTS resorts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        rating DECIMAL NOT NULL,
        review_count INTEGER NOT NULL,
        price_level TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        amenities JSONB NOT NULL DEFAULT '[]',
        google_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      // Villas table
      `CREATE TABLE IF NOT EXISTS villas (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      // Session table for express-session
      `CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);`
    ];
    
    // Execute each SQL statement
    for (const sql of createTablesSQL) {
      console.log(`Executing: ${sql.substring(0, 50)}...`);
      await client.query(sql);
      console.log('✅ Table created successfully!');
    }
    
    client.release();
    await pool.end();
    
    console.log('All tables created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  createTables()
    .then(success => {
      if (success) {
        console.log('✅ Tables created successfully in PostgreSQL.');
        process.exit(0);
      } else {
        console.error('❌ Failed to create tables in PostgreSQL.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createTables };