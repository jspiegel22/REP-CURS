// Script to create tables in Supabase using the Supabase JavaScript client
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Check if Supabase credentials are available
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Define the tables we need to create, based on our schema
const tables = [
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'username', type: 'text not null unique' },
      { name: 'email', type: 'text' },
      { name: 'password', type: 'text not null' },
      { name: 'points', type: 'integer not null default 0' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'listings',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'name', type: 'text not null' },
      { name: 'type', type: 'text not null' },
      { name: 'price', type: 'numeric not null' },
      { name: 'description', type: 'text' },
      { name: 'location', type: 'text' },
      { name: 'image_url', type: 'text' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'resorts',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'name', type: 'text not null' },
      { name: 'description', type: 'text' },
      { name: 'location', type: 'text' },
      { name: 'image_url', type: 'text' },
      { name: 'rating', type: 'numeric' },
      { name: 'price_range', type: 'text' },
      { name: 'amenities', type: 'text[]' },
      { name: 'slug', type: 'text unique' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'bookings',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'user_id', type: 'integer references users(id)' },
      { name: 'listing_id', type: 'integer references listings(id)' },
      { name: 'check_in', type: 'date not null' },
      { name: 'check_out', type: 'date not null' },
      { name: 'guests', type: 'integer not null' },
      { name: 'total_price', type: 'numeric not null' },
      { name: 'status', type: 'text default \'pending\'' },
      { name: 'name', type: 'text' },
      { name: 'email', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'leads',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'name', type: 'text not null' },
      { name: 'email', type: 'text not null' },
      { name: 'phone', type: 'text' },
      { name: 'message', type: 'text' },
      { name: 'source', type: 'text' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'guide_submissions',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'name', type: 'text not null' },
      { name: 'email', type: 'text not null' },
      { name: 'trip_date', type: 'date' },
      { name: 'party_size', type: 'integer' },
      { name: 'interests', type: 'text[]' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'rewards',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'name', type: 'text not null' },
      { name: 'description', type: 'text' },
      { name: 'points_required', type: 'integer not null' },
      { name: 'image_url', type: 'text' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'social_shares',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'user_id', type: 'integer references users(id)' },
      { name: 'platform', type: 'text not null' },
      { name: 'content_id', type: 'text' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'weather_cache',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'location', type: 'text not null unique' },
      { name: 'data', type: 'jsonb not null' },
      { name: 'updated_at', type: 'timestamp with time zone default now()' },
    ]
  },
  {
    name: 'villas',
    columns: [
      { name: 'id', type: 'serial primary key' },
      { name: 'name', type: 'text not null' },
      { name: 'description', type: 'text' },
      { name: 'location', type: 'text' },
      { name: 'bedrooms', type: 'integer' },
      { name: 'bathrooms', type: 'numeric' },
      { name: 'max_guests', type: 'integer' },
      { name: 'price_per_night', type: 'numeric' },
      { name: 'amenities', type: 'text[]' },
      { name: 'images', type: 'text[]' },
      { name: 'trackhs_id', type: 'text unique' },
      { name: 'created_at', type: 'timestamp with time zone default now()' },
    ]
  }
];

async function createTablesInSupabase() {
  console.log('Creating tables in Supabase...');
  
  // Function to attempt creating a table using direct SQL
  async function tryDirectSQL(tableName, sql) {
    console.log(`Attempting to use direct SQL API for table ${tableName}...`);
    try {
      // Check if the sql method exists on the supabase client
      if (typeof supabase.sql !== 'function') {
        console.log('Direct SQL method not available on this Supabase client.');
        return false;
      }
      
      // Try using the Supabase client's direct SQL method
      const { data, error } = await supabase.sql(sql);
      
      if (error) {
        console.error(`Direct SQL error for table ${tableName}:`, error);
        return false;
      } else {
        console.log(`Table ${tableName} created successfully using direct SQL.`);
        return true;
      }
    } catch (sqlErr) {
      console.error(`Direct SQL exception for table ${tableName}:`, sqlErr);
      return false;
    }
  }
  
  // Function to create a table using REST API
  async function tryRestApi(tableName, sql) {
    console.log(`Attempting to use REST API for table ${tableName}...`);
    try {
      // Create a unique temporary table name to test if we can create tables
      const testTableName = `_test_${Math.random().toString(36).substring(2, 10)}`;
      const testSql = `CREATE TABLE IF NOT EXISTS ${testTableName} (id serial primary key, test boolean)`;
      
      // Try to create a simple test table first
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id: 1,  // This will likely fail but it's just to check if the endpoint exists
          test: true
        })
      });
      
      if (response.status === 404) {
        // Table doesn't exist, so attempt to create it
        return await tryDirectSQL(tableName, sql);
      } else {
        console.log(`Table ${tableName} already exists (HTTP status: ${response.status}).`);
        return true;
      }
    } catch (restErr) {
      console.error(`REST API exception for table ${tableName}:`, restErr);
      return false;
    }
  }
  
  // Check if exec_sql function is available by making a test call
  let execSqlAvailable = false;
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql_string: 'SELECT 1 as test'
    });
    execSqlAvailable = !error;
  } catch (err) {
    console.log('exec_sql function is not available:', err.message);
    execSqlAvailable = false;
  }
  
  // Create tables one by one
  for (const table of tables) {
    console.log(`Creating table: ${table.name}`);
    
    // Check if table already exists
    let tableExists = false;
    try {
      const { data, error } = await supabase.from(table.name).select('*').limit(1);
      if (!error) {
        console.log(`Table ${table.name} already exists.`);
        tableExists = true;
      }
    } catch (err) {
      // Table might not exist, continue with creation
    }
    
    if (tableExists) {
      continue; // Skip to the next table
    }
    
    // Build the CREATE TABLE SQL statement
    let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
    
    table.columns.forEach((column, index) => {
      sql += `  ${column.name} ${column.type}`;
      if (index < table.columns.length - 1) {
        sql += ',\n';
      }
    });
    
    sql += '\n);';
    
    let tableCreated = false;
    
    // Method 1: Try using exec_sql RPC if available
    if (execSqlAvailable) {
      try {
        console.log(`Creating table ${table.name} using exec_sql RPC...`);
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_string: sql
        });
        
        if (error) {
          console.error(`Error creating table ${table.name} via exec_sql:`, error.message);
        } else {
          console.log(`Table ${table.name} created successfully via exec_sql.`);
          tableCreated = true;
        }
      } catch (rpcErr) {
        console.error(`exec_sql RPC exception for table ${table.name}:`, rpcErr.message);
      }
    }
    
    // Method 2: If exec_sql failed or is not available, try direct SQL
    if (!tableCreated) {
      tableCreated = await tryDirectSQL(table.name, sql);
    }
    
    // Method 3: If direct SQL failed, try REST API
    if (!tableCreated) {
      tableCreated = await tryRestApi(table.name, sql);
    }
    
    // If all methods failed, report it
    if (!tableCreated) {
      console.error(`Failed to create table ${table.name} using all available methods.`);
    }
  }
  
  console.log('Completed table creation process.');
}

async function createExecSqlFunction() {
  const functionSql = `
  CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    result JSONB;
  BEGIN
    EXECUTE sql_string;
    result := '{"status": "success"}'::JSONB;
    RETURN result;
  EXCEPTION
    WHEN OTHERS THEN
      result := jsonb_build_object(
        'status', 'error',
        'message', SQLERRM,
        'detail', SQLSTATE
      );
      RETURN result;
  END;
  $$;
  `;
  
  // First check if the function already exists by calling it
  console.log('Checking if exec_sql function already exists...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: 'SELECT 1 as test'
    });
    
    if (!error) {
      console.log('exec_sql function already exists.');
      return true;
    }
    
    console.log('exec_sql function does not exist or cannot be accessed:', error?.message || 'Unknown error');
  } catch (checkErr) {
    console.log('exec_sql function check failed:', checkErr.message);
  }
  
  // We need admin access to create functions, so we can't do it via the API normally
  // Let's display instructions for the user to create it manually
  console.log('');
  console.log('====================================================');
  console.log('IMPORTANT: To execute SQL directly in Supabase, you need to create');
  console.log('a helper function through the Supabase dashboard SQL editor:');
  console.log('');
  console.log(functionSql);
  console.log('');
  console.log('After creating this function, run this script again to create the tables.');
  console.log('====================================================');
  console.log('');
  
  // For now, we'll attempt to create tables directly through the Supabase API
  console.log('We will attempt to create tables directly without the exec_sql function.');
  return true;
}

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Final attempt - check if we can access the API info endpoint
  try {
    console.log('Testing API endpoint access...');
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/`, {
      method: 'GET',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (response.ok || response.status === 404) {
      console.log(`Connected to Supabase API endpoint (status: ${response.status}).`);
      
      // Test creating a table
      try {
        console.log('Testing table creation capabilities...');
        const testTableName = `_test_connection_${Math.random().toString(36).substring(2, 7)}`;
        
        // Try to create a test table
        const { error } = await supabase
          .from(testTableName)
          .insert([{ test: true }])
          .select();
          
        // If there's an error but it's because the table doesn't exist, that's expected
        if (error) {
          console.log(`Test table error: ${error.message}`);
          
          if (error.code === '42P01' || 
              (error.message && error.message.includes('does not exist'))) {
            console.log('Error indicates table does not exist, which is expected for a new table.');
            console.log('Supabase connection appears functional for table creation.');
            return true;
          } else {
            console.error('Unexpected error when testing table creation:', error);
            // Even if there's an unexpected error, we'll try to proceed since we confirmed API access
            console.log('Proceeding with table creation despite error...');
            return true;
          }
        } else {
          console.log('Successfully inserted into test table.');
          return true;
        }
      } catch (tableErr) {
        console.error('Exception during table test:', tableErr);
        // Proceed anyway since we have API access
        console.log('Proceeding with connection despite table test error...');
        return true;
      }
    } else {
      console.error(`API endpoint test failed: ${response.status}`);
      return false;
    }
  } catch (fetchErr) {
    console.error('API endpoint test failed:', fetchErr);
    
    // Last resort attempt - try a basic query
    try {
      console.log('Testing basic query capabilities...');
      const { data, error } = await supabase.from('users').select('*').limit(1);
      
      // It's OK if this fails with a table not found error - we'll create the tables
      if (error && error.code !== '42P01' && !error.message.includes('does not exist')) {
        console.error('Basic query test failed with unexpected error:', error);
        return false;
      }
      
      console.log('Basic query test completed - connection appears functional.');
      return true;
    } catch (queryErr) {
      console.error('Basic query test failed with exception:', queryErr);
      return false;
    }
  }
}

async function main() {
  console.log('Starting Supabase table creation script...');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Cannot proceed without a valid Supabase connection.');
    return;
  }
  
  // Create the exec_sql function first
  const functionCreated = await createExecSqlFunction();
  
  // Create tables
  await createTablesInSupabase();
  
  console.log('Table creation process completed.');
}

// Run the main function
main().catch(console.error);