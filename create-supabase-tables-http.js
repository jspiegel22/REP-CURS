require('dotenv').config();
// Modern Node.js has built-in fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createSupabaseTablesHttp() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    return false;
  }
  
  console.log('Starting Supabase table creation via HTTP API...');
  
  try {
    // First verify we can connect to Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to connect to Supabase. Please check your credentials.');
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Now try to create the tables using raw SQL via the SQL HTTP API
    console.log('Creating tables via SQL API...');
    
    const createTablesSQL = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'traveler',
      points INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Listings table
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      price INTEGER,
      location VARCHAR(255) NOT NULL,
      booking_type VARCHAR(50) NOT NULL,
      partner_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Guide submissions table
    CREATE TABLE IF NOT EXISTS guide_submissions (
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
    `;
    
    // Send the SQL to Supabase via the SQL API endpoint
    const sqlResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: createTablesSQL
      })
    });
    
    if (!sqlResponse.ok) {
      console.error('Failed to create tables via SQL API. Status:', sqlResponse.status);
      
      // Try an alternative with the pg_dump format
      console.log('Trying alternative SQL API format...');
      
      const altSqlResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/pg_dump`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          query: createTablesSQL
        })
      });
      
      if (!altSqlResponse.ok) {
        console.error('Alternative SQL API failed. Status:', altSqlResponse.status);
        
        // Try creating a SQL function first
        console.log('Trying to create a SQL execution function first...');
        
        const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION exec_sql(query text)
        RETURNS void AS $$
        BEGIN
          EXECUTE query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        // Create the function
        const funcResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            query: createFunctionSQL
          })
        });
        
        // If creating the function fails, try one more direct approach
        if (!funcResponse.ok) {
          console.log('Function creation failed. Trying direct table creation via HTTP...');
          
          const tablesToCreate = [
            { name: 'users', columns: [
              { name: 'id', type: 'serial', isPrimaryKey: true },
              { name: 'username', type: 'varchar', isUnique: true, isNotNull: true },
              { name: 'password', type: 'varchar', isNotNull: true },
              { name: 'role', type: 'varchar', defaultValue: 'traveler', isNotNull: true },
              { name: 'points', type: 'integer', defaultValue: 0 },
              { name: 'level', type: 'integer', defaultValue: 1 },
              { name: 'created_at', type: 'timestamp', defaultValue: 'now()' }
            ]},
            { name: 'guide_submissions', columns: [
              { name: 'id', type: 'serial', isPrimaryKey: true },
              { name: 'name', type: 'varchar', isNotNull: true },
              { name: 'email', type: 'varchar', isNotNull: true },
              { name: 'guide_id', type: 'varchar' },
              { name: 'downloaded', type: 'boolean', defaultValue: false },
              { name: 'created_at', type: 'timestamp', defaultValue: 'now()' }
            ]}
          ];
          
          // Create tables one by one
          for (const table of tablesToCreate) {
            console.log(`Creating table ${table.name}...`);
            
            const tableCreationResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table.name}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({
                name: table.name,
                columns: table.columns
              })
            });
            
            if (tableCreationResponse.ok) {
              console.log(`✅ Table ${table.name} created successfully`);
            } else {
              console.error(`❌ Failed to create table ${table.name}`);
            }
          }
        }
      } else {
        console.log('✅ Tables created successfully via alternative SQL API');
      }
    } else {
      console.log('✅ Tables created successfully via SQL API');
    }
    
    // Verify the tables exist
    console.log('\nVerifying tables in Supabase...');
    
    const tables = ['users', 'listings', 'guide_submissions'];
    let successCount = 0;
    
    for (const table of tables) {
      try {
        console.log(`Checking table: ${table}`);
        
        // Try to select from the table
        const verifyResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?limit=1`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          }
        });
        
        if (verifyResponse.ok) {
          console.log(`✅ Table '${table}' exists and is accessible`);
          successCount++;
        } else {
          console.log(`❌ Table '${table}' does not exist or is not accessible`);
        }
      } catch (err) {
        console.error(`❌ Error verifying table '${table}':`, err.message);
      }
    }
    
    console.log(`\nTable verification: ${successCount}/${tables.length} tables accessible`);
    
    return successCount > 0;
  } catch (error) {
    console.error('Error creating Supabase tables via HTTP:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  createSupabaseTablesHttp()
    .then(success => {
      if (success) {
        console.log('Supabase tables created successfully via HTTP!');
        process.exit(0);
      } else {
        console.error('Failed to create Supabase tables via HTTP!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createSupabaseTablesHttp };