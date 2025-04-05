const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function createSchema() {
  console.log("Creating schema in Supabase...");
  
  try {
    // Create a simple schema with just a few essential tables first
    // This is a simplified version to test
    const schemaSQL = `
    -- Create users table
    CREATE TABLE IF NOT EXISTS public.users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create guide_submissions table
    CREATE TABLE IF NOT EXISTS public.guide_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      travel_date TEXT,
      destination TEXT,
      party_size INTEGER,
      comments TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create listings table
    CREATE TABLE IF NOT EXISTS public.listings (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      image_url TEXT,
      price NUMERIC,
      location TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create session table for authentication
    CREATE TABLE IF NOT EXISTS public.session (
      sid TEXT PRIMARY KEY,
      sess JSON NOT NULL,
      expire TIMESTAMP WITH TIME ZONE NOT NULL
    );

    -- Create index on session expiration
    CREATE INDEX IF NOT EXISTS session_expire_idx ON public.session (expire);
    `;

    // Use the SQL API directly
    const apiUrl = `${supabaseUrl}/rest/v1/sql`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: schemaSQL })
    });
    
    const result = await response.json();
    if (result.error) {
      console.error("SQL API error:", result.error);
      throw new Error(`SQL API error: ${result.error.message || result.error}`);
    }
    
    console.log("Schema created successfully via SQL API");
    return true;
  } catch (error) {
    console.error("Error creating schema:", error);
    return false;
  }
}

// Run the schema creation
createSchema()
  .then(success => {
    if (success) {
      console.log("✅ Schema created successfully");
      process.exit(0);
    } else {
      console.error("❌ Schema creation failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Schema creation error:", error);
    process.exit(1);
  });
