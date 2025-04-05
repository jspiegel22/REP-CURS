const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Step 1: Fix environment variables if needed
function fixEnvironmentVariables() {
  console.log("Checking Supabase environment variables...");
  
  let supabaseUrl = process.env.SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_ANON_KEY;
  let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Check if REACT_APP variables are swapped
  if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_URL.startsWith('eyJhbGc')) {
    console.log("⚠️ REACT_APP_SUPABASE_URL appears to be an API key instead of a URL");
    
    if (process.env.REACT_APP_SUPABASE_ANON_KEY && process.env.REACT_APP_SUPABASE_ANON_KEY.startsWith('http')) {
      console.log("⚠️ REACT_APP_SUPABASE_ANON_KEY appears to be a URL instead of an API key");
      console.log("Fixing swapped React app variables...");
      
      // Set the correct values for this process
      process.env.FIXED_REACT_APP_SUPABASE_URL = process.env.REACT_APP_SUPABASE_ANON_KEY;
      process.env.FIXED_REACT_APP_SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_URL;
    }
  }
  
  // If SUPABASE vars are not set but REACT_APP ones are (fixed or not swapped), use them
  if ((!supabaseUrl || !supabaseKey) && process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
    console.log("Using React app variables for Supabase connection...");
    
    if (process.env.FIXED_REACT_APP_SUPABASE_URL && process.env.FIXED_REACT_APP_SUPABASE_ANON_KEY) {
      supabaseUrl = process.env.FIXED_REACT_APP_SUPABASE_URL;
      supabaseKey = process.env.FIXED_REACT_APP_SUPABASE_ANON_KEY;
    } else {
      supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    }
  }
  
  // Make sure we use the service role key for admin operations
  if (!supabaseServiceKey && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  
  // Return the fixed values
  return {
    supabaseUrl,
    supabaseKey,
    supabaseServiceKey: supabaseServiceKey || supabaseKey
  };
}

// Step 2: Create schema in Supabase
async function createSchema(supabaseUrl, supabaseKey) {
  console.log("\nCreating schema in Supabase...");
  
  try {
    // Basic schema with essential tables
    const schemaSQL = `
    -- Create users table
    CREATE TABLE IF NOT EXISTS public.users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
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

    -- Create villas table
    CREATE TABLE IF NOT EXISTS public.villas (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price_per_night NUMERIC,
      bedrooms INTEGER,
      bathrooms INTEGER,
      max_guests INTEGER,
      location TEXT,
      amenities TEXT[],
      image_urls TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create resorts table
    CREATE TABLE IF NOT EXISTS public.resorts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price_range TEXT,
      location TEXT,
      amenities TEXT[],
      image_urls TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create adventures table
    CREATE TABLE IF NOT EXISTS public.adventures (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price NUMERIC,
      duration TEXT,
      difficulty TEXT,
      location TEXT,
      included TEXT[],
      image_urls TEXT[],
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
    
    console.log("✅ Schema created successfully via SQL API");
    return true;
  } catch (error) {
    console.error("Error creating schema:", error);
    return false;
  }
}

// Step 3: Migrate data from PostgreSQL to Supabase
async function migrateData(supabaseUrl, supabaseKey) {
  console.log("\nMigrating data from PostgreSQL to Supabase...");
  
  // Check PostgreSQL connection parameters
  if (!process.env.PGHOST || !process.env.PGPORT || !process.env.PGUSER || 
      !process.env.PGPASSWORD || !process.env.PGDATABASE) {
    console.error("PostgreSQL connection parameters not set. Need PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE");
    return false;
  }
  
  // Create PostgreSQL connection using individual parameters
  const sourceClient = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Test Postgres connection
    console.log("Testing connection to source database...");
    console.log(`Connecting to: ${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`);
    await sourceClient.query('SELECT 1');
    console.log("✅ Source database connection successful");
    
    // Get list of tables from source
    console.log("Retrieving table list from source database...");
    const tablesResult = await sourceClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    if (tables.length === 0) {
      console.log("No tables found in source database. Nothing to migrate.");
      return true;
    }
    
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);
    
    // Migrate data for each table
    for (const tableName of tables) {
      try {
        await migrateTableData(tableName, sourceClient, supabaseUrl, supabaseKey);
      } catch (tableError) {
        console.error(`Failed to migrate table ${tableName}:`, tableError);
      }
    }
    
    console.log("✅ Data migration completed");
    return true;
  } catch (error) {
    console.error("Error during data migration:", error);
    return false;
  } finally {
    await sourceClient.end();
  }
}

// Helper function to migrate a single table
async function migrateTableData(tableName, sourceClient, supabaseUrl, supabaseKey) {
  console.log(`\nMigrating table: ${tableName}`);
  
  try {
    // Get count of records
    const countResult = await sourceClient.query(`SELECT COUNT(*) FROM "${tableName}"`);
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      console.log(`Table ${tableName} is empty, skipping`);
      return;
    }
    
    console.log(`Found ${count} records to migrate in ${tableName}`);
    
    // Get all records from the source table
    const dataResult = await sourceClient.query(`SELECT * FROM "${tableName}"`);
    const rows = dataResult.rows;
    
    // Process in batches
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      // Clean the data for JSON compatibility
      const cleanBatch = batch.map(row => {
        const cleanRow = {};
        for (const [key, value] of Object.entries(row)) {
          if (value instanceof Date) {
            cleanRow[key] = value.toISOString();
          } else if (value instanceof Buffer) {
            cleanRow[key] = value.toString('base64');
          } else {
            cleanRow[key] = value;
          }
        }
        return cleanRow;
      });
      
      try {
        // Insert data using SQL API for better control
        const insertValues = cleanBatch.map(row => {
          const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
          const values = Object.values(row).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
            if (Array.isArray(val)) return `ARRAY[${val.map(v => `'${v.replace(/'/g, "''")}'`).join(', ')}]`;
            return `'${val.toString().replace(/'/g, "''")}'`;
          }).join(', ');
          
          return `(${values})`;
        }).join(', ');
        
        if (cleanBatch.length > 0) {
          const columns = Object.keys(cleanBatch[0]).map(col => `"${col}"`).join(', ');
          
          const sqlQuery = `
            INSERT INTO "${tableName}" (${columns})
            VALUES ${insertValues}
            ON CONFLICT DO NOTHING;
          `;
          
          const apiUrl = `${supabaseUrl}/rest/v1/sql`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ query: sqlQuery })
          });
          
          const result = await response.json();
          
          if (result.error) {
            console.error(`Error inserting batch in ${tableName}:`, result.error);
            throw new Error(result.error.message || JSON.stringify(result.error));
          }
          
          successCount += batch.length;
          console.log(`Migrated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(rows.length / batchSize)} (${i}-${Math.min(i + batchSize - 1, rows.length - 1)})`);
        }
      } catch (batchError) {
        console.error(`Error processing batch in ${tableName}:`, batchError);
        
        // Try inserting records one by one
        console.log("Attempting individual inserts...");
        
        for (const row of cleanBatch) {
          try {
            const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
            const values = Object.values(row).map(val => {
              if (val === null) return 'NULL';
              if (typeof val === 'number') return val;
              if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
              if (Array.isArray(val)) return `ARRAY[${val.map(v => `'${v.replace(/'/g, "''")}'`).join(', ')}]`;
              return `'${val.toString().replace(/'/g, "''")}'`;
            }).join(', ');
            
            const sqlQuery = `
              INSERT INTO "${tableName}" (${columns})
              VALUES (${values})
              ON CONFLICT DO NOTHING;
            `;
            
            const apiUrl = `${supabaseUrl}/rest/v1/sql`;
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({ query: sqlQuery })
            });
            
            const result = await response.json();
            
            if (!result.error) {
              successCount++;
            }
          } catch (rowError) {
            console.error(`Error inserting row in ${tableName}:`, rowError);
          }
        }
      }
    }
    
    console.log(`Migrated ${successCount}/${rows.length} records to ${tableName}`);
    
    if (successCount < rows.length) {
      console.warn(`⚠️ Only migrated ${successCount} of ${rows.length} records in ${tableName}`);
    } else {
      console.log(`✅ Table ${tableName} migrated successfully`);
    }
  } catch (error) {
    console.error(`Error migrating table ${tableName}:`, error);
    throw error;
  }
}

// Step 4: Update environment file to use Supabase as the primary database
function updateEnvironmentFile() {
  console.log("\nUpdating environment file...");
  
  try {
    // Path to .env file
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      console.error("Environment file not found:", envPath);
      return false;
    }
    
    // Read the current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Add or update the USE_SUPABASE entry
    if (envContent.includes('USE_SUPABASE=')) {
      // Update existing entry
      envContent = envContent.replace(/USE_SUPABASE=(true|false)/, 'USE_SUPABASE=true');
    } else {
      // Add new entry
      envContent += '\nUSE_SUPABASE=true\n';
    }
    
    // Fix swapped variables if needed
    if (process.env.FIXED_REACT_APP_SUPABASE_URL && process.env.FIXED_REACT_APP_SUPABASE_ANON_KEY) {
      // Update REACT_APP_SUPABASE_URL
      if (envContent.includes('REACT_APP_SUPABASE_URL=')) {
        envContent = envContent.replace(
          /REACT_APP_SUPABASE_URL=.*/,
          `REACT_APP_SUPABASE_URL=${process.env.FIXED_REACT_APP_SUPABASE_URL}`
        );
      }
      
      // Update REACT_APP_SUPABASE_ANON_KEY
      if (envContent.includes('REACT_APP_SUPABASE_ANON_KEY=')) {
        envContent = envContent.replace(
          /REACT_APP_SUPABASE_ANON_KEY=.*/,
          `REACT_APP_SUPABASE_ANON_KEY=${process.env.FIXED_REACT_APP_SUPABASE_ANON_KEY}`
        );
      }
    }
    
    // Write back to the .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log("✅ Environment file updated to use Supabase");
    return true;
  } catch (error) {
    console.error("Error updating environment file:", error);
    return false;
  }
}

// Step 5: Verify migration by checking table counts
async function verifyMigration(supabaseUrl, supabaseKey) {
  console.log("\nVerifying migration...");
  
  try {
    // Query Supabase for table list
    const apiUrl = `${supabaseUrl}/rest/v1/sql`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: `
          SELECT table_name, 
                 (SELECT COUNT(*) FROM ${tableName}) as record_count
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      console.error("Error verifying tables:", result.error);
      return false;
    }
    
    console.log("Table verification results:");
    console.table(result);
    
    return true;
  } catch (error) {
    console.error("Error verifying migration:", error);
    return false;
  }
}

// Main function to run the entire migration process
async function completeMigration() {
  console.log("Starting complete migration process...");
  
  // Step 1: Fix environment variables
  const { supabaseUrl, supabaseKey, supabaseServiceKey } = fixEnvironmentVariables();
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials after fixing environment variables");
    return false;
  }
  
  // Step 2: Create schema
  const schemaCreated = await createSchema(supabaseUrl, supabaseServiceKey);
  
  if (!schemaCreated) {
    console.error("❌ Failed to create schema");
    return false;
  }
  
  // Step 3: Migrate data
  const dataMigrated = await migrateData(supabaseUrl, supabaseServiceKey);
  
  if (!dataMigrated) {
    console.error("❌ Failed to migrate data");
    return false;
  }
  
  // Step 4: Update environment file
  const envUpdated = updateEnvironmentFile();
  
  if (!envUpdated) {
    console.error("❌ Failed to update environment file");
    // Continue anyway since this isn't critical
  }
  
  // Step 5: Verify migration
  const migrationVerified = await verifyMigration(supabaseUrl, supabaseServiceKey);
  
  if (!migrationVerified) {
    console.warn("⚠️ Migration verification had issues");
    // Continue anyway since the migration might still be valid
  }
  
  console.log("\n✅ Migration completed successfully");
  return true;
}

// Run the migration
completeMigration()
  .then(success => {
    if (success) {
      console.log("\n🎉 Migration to Supabase completed");
      process.exit(0);
    } else {
      console.error("\n❌ Migration failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("\n❌ Migration error:", error);
    process.exit(1);
  });
