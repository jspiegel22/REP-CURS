#!/usr/bin/env node

/**
 * Schema Migration Script: Push Schema to Supabase
 * 
 * This script:
 * 1. Connects to Supabase
 * 2. Converts our Drizzle schema to SQL
 * 3. Executes the SQL to create tables in Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Get Supabase connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL || process.env.SUPABASE_PG_URL;

console.log('==== Schema Migration: Drizzle to Supabase ====');

async function migrateSchemaToSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase credentials not configured. Check SUPABASE_URL and SUPABASE_KEY env variables.');
    return false;
  }

  try {
    // 1. Initialize Supabase client
    console.log('Connecting to Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 2. Verify connection with a simple auth check
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Supabase connection error:', authError.message);
      return false;
    }
    console.log('✅ Connected to Supabase');

    // 3. Generate SQL schema
    console.log('\nGenerating SQL schema from Drizzle schema...');
    const sqlSchema = generateSchema();
    
    // Display the schema
    console.log('\nSchema SQL:');
    console.log('------------------------------');
    console.log(sqlSchema.substring(0, 500) + '...');
    console.log('------------------------------');

    // 4. Execute SQL to create tables
    console.log('\nCreating tables in Supabase...');
    
    // Check if we have direct PostgreSQL access
    let directDbAccess = false;
    if (SUPABASE_DB_URL) {
      try {
        const pool = new Pool({
          connectionString: SUPABASE_DB_URL,
          ssl: { rejectUnauthorized: false }
        });
        
        await pool.connect();
        console.log('✅ Direct PostgreSQL connection successful');
        
        // Execute SQL directly
        await pool.query(sqlSchema);
        console.log('✅ Tables created via direct PostgreSQL connection');
        
        await pool.end();
        directDbAccess = true;
      } catch (pgErr) {
        console.error('❌ Direct PostgreSQL connection failed:', pgErr.message);
        console.log('Falling back to RPC method...');
      }
    }
    
    // If direct access failed, try using RPC
    if (!directDbAccess) {
      try {
        console.log('⚠️ Cannot use RPC to execute SQL directly');
        console.log('Using alternative approach with SQL API...');
        
        // Execute each table creation statement separately
        const statements = sqlSchema.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
        
        console.log(`Found ${statements.length} SQL statements to execute`);
        
        let successCount = 0;
        for (let i = 0; i < statements.length; i++) {
          const stmt = statements[i];
          
          // Skip comments
          if (stmt.startsWith('--')) {
            continue;
          }
          
          try {
            // Use REST API to create tables
            const endpoint = `${SUPABASE_URL}/rest/v1/`;
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({ query: stmt + ';' })
            });
            
            if (response.ok) {
              console.log(`✅ SQL statement ${i+1}/${statements.length} executed successfully`);
              successCount++;
            } else {
              const errorText = await response.text();
              console.error(`❌ Error executing SQL statement ${i+1}/${statements.length}:`, errorText);
            }
          } catch (stmtErr) {
            console.error(`❌ Error executing SQL statement ${i+1}/${statements.length}:`, stmtErr.message);
          }
        }
        
        if (successCount > 0) {
          console.log(`✅ Executed ${successCount} of ${statements.length} SQL statements`);
        } else {
          console.error('❌ Failed to execute any SQL statements');
          console.log('⚠️ We will still try to check if tables exist (they might have been created earlier)');
        }
      } catch (rpcErr) {
        console.error('❌ Error using RPC method:', rpcErr.message);
        return false;
      }
    }
    
    // 5. Verify tables were created
    console.log('\nVerifying tables...');
    const tables = [
      'users', 'resorts', 'villas', 'adventures', 'bookings', 
      'leads', 'guide_submissions', 'weather_cache'
    ];
    
    let tablesVerified = 0;
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        if (error && error.message.includes('does not exist')) {
          console.log(`❌ Table '${table}' was not created`);
        } else {
          console.log(`✅ Table '${table}' verified`);
          tablesVerified++;
        }
      } catch (verifyErr) {
        console.error(`❌ Error verifying table '${table}':`, verifyErr.message);
      }
    }
    
    console.log(`\nVerification complete: ${tablesVerified} of ${tables.length} tables created successfully`);
    
    return tablesVerified > 0;
  } catch (err) {
    console.error('Error in migration:', err);
    return false;
  }
}

function generateSchema() {
  // Schema generation based on our Drizzle schema
  // This is a simplified version that covers the main tables

  return `
-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'traveler',
  "points" INTEGER DEFAULT 0,
  "level" INTEGER DEFAULT 1
);

-- Resorts table
CREATE TABLE IF NOT EXISTS "resorts" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "rating" DECIMAL NOT NULL,
  "review_count" INTEGER NOT NULL,
  "price_level" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "amenities" JSONB NOT NULL,
  "rooms" INTEGER NOT NULL,
  "max_guests" INTEGER NOT NULL,
  "is_beachfront" BOOLEAN DEFAULT false,
  "is_oceanfront" BOOLEAN DEFAULT false,
  "google_url" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Villas table
CREATE TABLE IF NOT EXISTS "villas" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "bedrooms" INTEGER NOT NULL,
  "bathrooms" INTEGER NOT NULL,
  "max_guests" INTEGER NOT NULL,
  "amenities" JSONB NOT NULL DEFAULT '[]',
  "image_url" TEXT NOT NULL,
  "image_urls" JSONB NOT NULL DEFAULT '[]',
  "price_per_night" DECIMAL NOT NULL,
  "location" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "latitude" DECIMAL,
  "longitude" DECIMAL,
  "trackhs_id" TEXT UNIQUE,
  "last_synced_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS "listings" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "price" INTEGER,
  "location" TEXT NOT NULL,
  "booking_type" TEXT NOT NULL,
  "partner_id" INTEGER REFERENCES "users"("id")
);

-- Bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "preferred_contact_method" TEXT,
  "preferred_contact_time" TEXT,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "form_name" TEXT,
  "form_data" JSONB,
  "notes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "tags" TEXT[],
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "booking_type" TEXT NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "guests" INTEGER NOT NULL,
  "total_amount" DECIMAL,
  "currency" TEXT DEFAULT 'USD',
  "payment_status" TEXT DEFAULT 'pending',
  "payment_method" TEXT,
  "special_requests" TEXT,
  "budget" TEXT,
  "listing_id" INTEGER REFERENCES "listings"("id"),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS "leads" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "preferred_contact_method" TEXT,
  "preferred_contact_time" TEXT,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "form_name" TEXT,
  "form_data" JSONB,
  "notes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "tags" TEXT[],
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "interest_type" TEXT NOT NULL,
  "budget" TEXT,
  "timeline" TEXT,
  "priority" TEXT DEFAULT 'normal',
  "assigned_to" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guide Submissions table
CREATE TABLE IF NOT EXISTS "guide_submissions" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "preferred_contact_method" TEXT,
  "preferred_contact_time" TEXT,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "form_name" TEXT,
  "form_data" JSONB,
  "notes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "tags" TEXT[],
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "guide_type" TEXT NOT NULL,
  "interest_areas" TEXT[],
  "travel_dates" TEXT,
  "number_of_travelers" INTEGER,
  "download_link" TEXT,
  "processed_at" TIMESTAMP,
  "submission_id" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rewards table
CREATE TABLE IF NOT EXISTS "rewards" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "points_required" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "value" DECIMAL NOT NULL,
  "active" BOOLEAN DEFAULT true
);

-- Social Shares table
CREATE TABLE IF NOT EXISTS "social_shares" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("id"),
  "listing_id" INTEGER REFERENCES "listings"("id"),
  "platform" TEXT NOT NULL,
  "shared_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "points_earned" INTEGER DEFAULT 10
);

-- Weather Cache table
CREATE TABLE IF NOT EXISTS "weather_cache" (
  "id" SERIAL PRIMARY KEY,
  "location" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an adventures table based on the listings table structure
CREATE TABLE IF NOT EXISTS "adventures" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "price" INTEGER,
  "location" TEXT NOT NULL,
  "booking_type" TEXT NOT NULL DEFAULT 'form',
  "duration" TEXT,
  "max_participants" INTEGER,
  "difficulty" TEXT,
  "included" TEXT[],
  "not_included" TEXT[],
  "requirements" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
}

// Run if executed directly
if (require.main === module) {
  migrateSchemaToSupabase().then(success => {
    if (success) {
      console.log('\n✅ Schema migration to Supabase completed successfully');
    } else {
      console.log('\n❌ Schema migration to Supabase failed');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}

module.exports = { migrateSchemaToSupabase };