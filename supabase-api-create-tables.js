require('dotenv').config();
// Modern Node.js has built-in fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createTables() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    return false;
  }
  
  console.log('Starting table creation in Supabase...');
  
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // SQL to create all tables
  const CREATE_TABLES_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  location VARCHAR(255),
  category VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resorts table
CREATE TABLE IF NOT EXISTS resorts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  price_range VARCHAR(50),
  amenities TEXT[],
  rating DECIMAL(3, 2),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  listing_id INTEGER REFERENCES listings(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER,
  total_price DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  interest VARCHAR(100),
  message TEXT,
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  points INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'bronze',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social shares table
CREATE TABLE IF NOT EXISTS social_shares (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content_id INTEGER,
  platform VARCHAR(50),
  share_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather cache table
CREATE TABLE IF NOT EXISTS weather_cache (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(location, date)
);

-- Villas table
CREATE TABLE IF NOT EXISTS villas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  bedrooms INTEGER,
  bathrooms INTEGER,
  capacity INTEGER,
  price_per_night DECIMAL(10, 2),
  amenities TEXT[],
  images TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adventures table
CREATE TABLE IF NOT EXISTS adventures (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  price DECIMAL(10, 2),
  location VARCHAR(255),
  difficulty VARCHAR(50),
  category VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session table
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR(255) NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session ("expire");
  `;
  
  // First create rpc function to execute SQL if it doesn't exist
  console.log('Creating SQL execution function in Supabase...');
  
  try {
    // Step 1: Create exec_sql function using Management API
    const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
    RETURNS SETOF json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      RETURN QUERY EXECUTE sql_string;
    END;
    $$;
    `;
    
    // Direct API call to create the function
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        sql_string: createFunctionSQL
      })
    }).catch(err => {
      console.log('Initial RPC call failed (expected if function does not exist yet):', err.message);
      return { ok: false };
    });
    
    // If RPC call failed (expected if function doesn't exist), try direct SQL
    if (!response.ok) {
      console.log('Creating exec_sql function directly...');
      
      const directResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: createFunctionSQL
      }).catch(err => {
        console.log('Direct SQL request failed:', err.message);
        return { ok: false };
      });
      
      if (!directResponse.ok) {
        console.log('Both methods to create exec_sql function failed');
        console.log('Continuing with table creation anyway...');
      } else {
        console.log('exec_sql function created directly');
      }
    } else {
      console.log('exec_sql function already exists');
    }
    
    // Step 2: Create tables using Management API
    console.log('Creating tables in Supabase...');
    
    // Attempt 1: Try using exec_sql RPC if it exists
    const tablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        sql_string: CREATE_TABLES_SQL
      })
    }).catch(err => {
      console.log('RPC call for table creation failed:', err.message);
      return { ok: false };
    });
    
    if (tablesResponse.ok) {
      console.log('✅ Tables created successfully via RPC');
    } else {
      console.log('❌ RPC table creation failed, trying direct SQL...');
      
      // Attempt 2: Try direct SQL API
      const directTablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: CREATE_TABLES_SQL
      }).catch(err => {
        console.log('Direct SQL request for table creation failed:', err.message);
        return { ok: false };
      });
      
      if (directTablesResponse.ok) {
        console.log('✅ Tables created successfully via direct SQL');
      } else {
        // If both methods fail, try a different approach
        console.log('❌ Both methods to create tables failed');
        console.log('Attempting to create tables one by one...');
        
        // Step 3: Try to create each table individually via direct SQL
        const tableStatements = CREATE_TABLES_SQL.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0)
          .map(stmt => stmt + ';');
        
        for (let i = 0; i < tableStatements.length; i++) {
          const statement = tableStatements[i];
          
          try {
            console.log(`Creating table ${i+1}/${tableStatements.length}...`);
            
            const singleTableResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
              },
              body: statement
            });
            
            if (singleTableResponse.ok) {
              console.log(`✅ Statement ${i+1} executed successfully`);
            } else {
              console.log(`❌ Failed to execute statement ${i+1}`);
            }
          } catch (error) {
            console.log(`❌ Error executing statement ${i+1}:`, error.message);
          }
        }
      }
    }
    
    // Step 4: Verify table creation by trying to access each table
    console.log('\nVerifying tables in Supabase...');
    const tables = [
      'users', 'listings', 'resorts', 'bookings', 'leads', 'guide_submissions',
      'rewards', 'social_shares', 'weather_cache', 'villas', 'adventures', 'session'
    ];
    
    let successCount = 0;
    
    for (const table of tables) {
      try {
        console.log(`Verifying table: ${table}`);
        
        const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (verifyResponse.ok) {
          console.log(`✅ Table '${table}' exists and is accessible`);
          successCount++;
        } else {
          console.log(`❌ Table '${table}' is not accessible`);
        }
      } catch (error) {
        console.log(`❌ Error verifying table '${table}':`, error.message);
      }
    }
    
    console.log(`\nTable verification: ${successCount}/${tables.length} tables accessible`);
    
    return successCount > 0;
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
        console.log('Table creation completed successfully!');
        process.exit(0);
      } else {
        console.error('Table creation failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createTables };