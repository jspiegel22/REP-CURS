require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function createSupabaseTables() {
  console.log('Creating tables in Supabase via API...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        db: { schema: 'public' }
      }
    );
    
    console.log('Connected to Supabase...');
    
    // Define tables to create
    const tables = [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'gen_random_uuid()' },
          { name: 'username', type: 'text', notNull: true, unique: true },
          { name: 'password', type: 'text', notNull: true },
          { name: 'role', type: 'text', defaultValue: "'traveler'" },
          { name: 'points', type: 'integer', defaultValue: 0 },
          { name: 'level', type: 'integer', defaultValue: 1 }
        ]
      },
      {
        name: 'guide_submissions',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'gen_random_uuid()' },
          { name: 'first_name', type: 'text', notNull: true },
          { name: 'last_name', type: 'text' },
          { name: 'email', type: 'text', notNull: true },
          { name: 'phone', type: 'text' },
          { name: 'guide_type', type: 'text', notNull: true },
          { name: 'source', type: 'text', defaultValue: "'website'" },
          { name: 'status', type: 'text', defaultValue: "'pending'" },
          { name: 'form_name', type: 'text', defaultValue: "'guide-download'" },
          { name: 'submission_id', type: 'text', notNull: true },
          { name: 'form_data', type: 'jsonb' },
          { name: 'interest_areas', type: 'text[]' },
          { name: 'created_at', type: 'timestamp', defaultValue: 'now()' }
        ]
      },
      {
        name: 'resorts',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'gen_random_uuid()' },
          { name: 'name', type: 'text', notNull: true },
          { name: 'rating', type: 'decimal', notNull: true },
          { name: 'review_count', type: 'integer', notNull: true },
          { name: 'price_level', type: 'text', notNull: true },
          { name: 'location', type: 'text', notNull: true },
          { name: 'description', type: 'text', notNull: true },
          { name: 'image_url', type: 'text', notNull: true },
          { name: 'amenities', type: 'jsonb', defaultValue: "'[]'::jsonb" },
          { name: 'google_url', type: 'text' },
          { name: 'created_at', type: 'timestamp', defaultValue: 'now()' }
        ]
      },
      {
        name: 'villas',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'gen_random_uuid()' },
          { name: 'name', type: 'text', notNull: true },
          { name: 'description', type: 'text', notNull: true },
          { name: 'bedrooms', type: 'integer', notNull: true },
          { name: 'bathrooms', type: 'integer', notNull: true },
          { name: 'max_guests', type: 'integer', notNull: true },
          { name: 'amenities', type: 'jsonb', defaultValue: "'[]'::jsonb" },
          { name: 'image_url', type: 'text', notNull: true },
          { name: 'image_urls', type: 'jsonb', defaultValue: "'[]'::jsonb" },
          { name: 'price_per_night', type: 'decimal', notNull: true },
          { name: 'location', type: 'text', notNull: true },
          { name: 'address', type: 'text', notNull: true },
          { name: 'latitude', type: 'decimal' },
          { name: 'longitude', type: 'decimal' },
          { name: 'trackhs_id', type: 'text', unique: true },
          { name: 'last_synced_at', type: 'timestamp' },
          { name: 'created_at', type: 'timestamp', defaultValue: 'now()' }
        ]
      }
    ];
    
    // Try different approach - create tables using direct API calls
    const createdTables = [];
    
    for (const table of tables) {
      console.log(`Creating table ${table.name}...`);
      
      try {
        // First check if table exists
        const { error: checkError } = await supabase
          .from(table.name)
          .select('*')
          .limit(1);
          
        if (!checkError) {
          console.log(`Table ${table.name} already exists, skipping.`);
          createdTables.push(table.name);
          continue;
        }
        
        // Create table using SQL (requires permissions)
        // Try to create using plain HTTP request to Supabase API
        const fetch = (await import('node-fetch')).default;
        
        const { data, error } = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              type: 'create_table',
              name: table.name,
              schema: 'public',
              columns: table.columns.map(col => ({
                name: col.name,
                type: col.type,
                primaryKey: col.primaryKey || false,
                unique: col.unique || false,
                notNull: col.notNull || false,
                defaultValue: col.defaultValue
              }))
            })
          }
        ).then(res => res.json());
        
        if (error) {
          console.error(`Error creating table ${table.name}:`, error);
          
          // Fallback to using PostgreSQL direct connection
          console.log(`Attempting to create ${table.name} via direct PostgreSQL connection...`);
          
          const { Pool } = require('pg');
          const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnonauthorized: false }
          });
          
          const client = await pool.connect();
          
          // Construct the SQL CREATE TABLE statement
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${table.name} (
              ${table.columns.map(col => {
                let definition = `${col.name} ${col.type}`;
                if (col.primaryKey) definition += ' PRIMARY KEY';
                if (col.unique) definition += ' UNIQUE';
                if (col.notNull) definition += ' NOT NULL';
                if (col.defaultValue) definition += ` DEFAULT ${col.defaultValue}`;
                return definition;
              }).join(',\n              ')}
            );
          `;
          
          console.log(`Executing SQL: ${createTableSQL}`);
          await client.query(createTableSQL);
          
          client.release();
          await pool.end();
          
          console.log(`Table ${table.name} created via direct PostgreSQL connection.`);
          createdTables.push(table.name);
        } else {
          console.log(`Table ${table.name} created successfully via API.`);
          createdTables.push(table.name);
        }
      } catch (tableError) {
        console.error(`Error processing table ${table.name}:`, tableError.message);
      }
    }
    
    console.log(`Tables created: ${createdTables.join(', ')}`);
    return createdTables.length > 0;
  } catch (error) {
    console.error('Error creating tables in Supabase:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  createSupabaseTables()
    .then(success => {
      if (success) {
        console.log('✅ Tables created successfully in Supabase!');
        process.exit(0);
      } else {
        console.error('❌ Failed to create tables in Supabase.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createSupabaseTables };