require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Verify environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncSchemaToSupabase() {
  console.log('Starting Supabase schema sync...');

  try {
    // Check if users table exists by trying to select from it
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError && usersError.code === '42P01') {
      console.log('Creating users table...');
      
      // Create users table with Supabase SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            email TEXT UNIQUE,
            password TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            points INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `
      });

      if (createError) {
        console.error('Error creating users table with exec_sql:', createError);
        console.log('Trying alternative approach...');
        
        // Try using the REST API to create the table
        const { error: restError } = await supabase
          .from('users')
          .insert([
            { 
              username: 'testuser', 
              password: 'password_hash', 
              first_name: 'Test',
              last_name: 'User'
            }
          ]);

        if (restError && restError.code === '42P01') {
          console.error('Failed to create users table via REST API too:', restError);
        } else if (restError) {
          console.error('Error inserting test user:', restError);
        } else {
          console.log('✓ Created users table via REST API');
        }
      } else {
        console.log('✓ Created users table via exec_sql');
      }
    } else if (usersError) {
      console.error('Error checking users table:', usersError);
    } else {
      console.log('✓ Users table already exists');
    }

    // Create or verify supabase_functions table for exec_sql
    console.log('\nCreating exec_sql RPC function...');
    
    const { error: funcError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (funcError) {
      console.error('Error creating exec_sql function:', funcError);
      console.log('This is likely because the exec_sql function doesn\'t exist yet or permissions are restricted');
      console.log('You need to manually create this function in the Supabase SQL editor.');
    } else {
      console.log('✓ Created exec_sql function');
    }

    // Try to use the function to create other tables
    if (!funcError) {
      console.log('\nCreating other tables...');
      
      // Create resorts table
      const { error: resortsError } = await supabase.rpc('exec_sql', {
        sql: `
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
          )
        `
      });

      if (resortsError) {
        console.error('Error creating resorts table:', resortsError);
      } else {
        console.log('✓ Created resorts table');
      }
    }

    console.log('\nChecking tables in Supabase...');
    
    // Check users table again
    const { data: finalUsersData, error: finalUsersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (finalUsersError) {
      console.error('Error checking final users table status:', finalUsersError);
    } else {
      console.log('✓ Users table verified with', finalUsersData.length, 'rows');
      console.log(finalUsersData);
    }

  } catch (error) {
    console.error('Unexpected error during Supabase schema sync:', error);
  }
}

// Execute the function
syncSchemaToSupabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});