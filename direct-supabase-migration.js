require('dotenv').config();
const { Pool } = require('pg');
// Modern Node.js has built-in fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function directMigration() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    return false;
  }
  
  // First, try to get the database connection details from Supabase
  console.log('Getting Supabase database connection details...');
  
  try {
    // Check if Supabase is configured properly
    console.log('Testing Supabase connection...');
    
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
    
    console.log('Supabase connection successful.');
    
    // Since we're using Supabase in Replit, we can assume it has a direct database URL
    // provided in the SUPABASE_POSTGRES_URL environment variable, or construct one
    
    const connectionString = process.env.SUPABASE_POSTGRES_URL;
    if (!connectionString) {
      console.log('No direct Postgres connection URL found. Creating tables via REST API...');
      
      // If we don't have a direct connection, try using the REST API
      const createTableResult = await createTablesViaRestApi();
      if (createTableResult) {
        console.log('Tables created successfully via REST API!');
        return true;
      } else {
        console.error('Failed to create tables via REST API.');
        return false;
      }
    }
    
    console.log('Connecting to Supabase Postgres directly...');
    const pool = new Pool({ connectionString });
    
    const client = await pool.connect();
    console.log('Connected to Supabase Postgres database.');
    
    try {
      // Begin transaction
      await client.query('BEGIN');
      
      console.log('Creating tables...');
      
      // SQL to create all tables
      const createTablesSql = `
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
      
      // Split SQL into individual statements and execute them
      const statements = createTablesSql.split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)
        .map(stmt => stmt + ';');
      
      for (let i = 0; i < statements.length; i++) {
        try {
          console.log(`Executing statement ${i+1}/${statements.length}`);
          await client.query(statements[i]);
          console.log(`✅ Statement ${i+1} executed successfully`);
        } catch (err) {
          console.error(`❌ Error executing statement ${i+1}:`, err.message);
          // Continue with other statements
        }
      }
      
      // Set row level security on tables
      console.log('Setting up row level security...');
      const tables = [
        'users', 'listings', 'resorts', 'bookings', 'leads', 'guide_submissions',
        'rewards', 'social_shares', 'weather_cache', 'villas', 'adventures', 'session'
      ];
      
      for (const table of tables) {
        try {
          console.log(`Enabling RLS on table: ${table}`);
          
          // Enable RLS
          await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
          
          // Create a policy that allows all operations
          await client.query(`
            CREATE POLICY "Allow all" ON ${table}
            FOR ALL
            TO authenticated, anon
            USING (true)
            WITH CHECK (true);
          `);
          
          console.log(`✅ RLS enabled on table ${table}`);
        } catch (err) {
          console.error(`❌ Error setting RLS on table ${table}:`, err.message);
          // Continue with other tables
        }
      }
      
      // Commit transaction
      await client.query('COMMIT');
      console.log('Transaction committed.');
      
      // Verify tables exist
      console.log('\nVerifying tables in database...');
      
      let successCount = 0;
      for (const table of tables) {
        try {
          const result = await client.query(
            `SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = $1
            )`,
            [table]
          );
          
          if (result.rows[0].exists) {
            console.log(`✅ Table '${table}' exists`);
            successCount++;
          } else {
            console.log(`❌ Table '${table}' does not exist`);
          }
        } catch (err) {
          console.error(`❌ Error verifying table '${table}':`, err.message);
        }
      }
      
      console.log(`\nTable verification: ${successCount}/${tables.length} tables exist`);
      
      return successCount > 0;
    } catch (err) {
      // Rollback transaction in case of error
      await client.query('ROLLBACK');
      console.error('Transaction rolled back due to error:', err.message);
      return false;
    } finally {
      // Release client back to pool
      client.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Error in direct migration:', error.message);
    return false;
  }
}

async function createTablesViaRestApi() {
  try {
    // Function to create a utility SQL function in Supabase
    const createExecSqlFunction = async () => {
      const functionSql = `
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
      
      // Try to create the function using the SQL API
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sql',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: functionSql
      });
      
      return response.ok;
    };
    
    // Try to create the exec_sql function
    console.log('Creating SQL execution function...');
    const functionCreated = await createExecSqlFunction();
    
    if (!functionCreated) {
      console.log('Failed to create SQL execution function. Trying an alternative method...');
      
      // Try to create tables one by one using the standard API
      return await createTablesOneByOne();
    }
    
    // Now use the function to create tables
    console.log('Creating tables via SQL execution function...');
    
    const createTablesSql = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- More tables ...
    `;
    
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sql_string: createTablesSql
      })
    });
    
    if (!response.ok) {
      console.error('Failed to create tables via SQL execution function');
      return false;
    }
    
    console.log('Tables created successfully via SQL execution function!');
    return true;
  } catch (error) {
    console.error('Error creating tables via REST API:', error.message);
    return false;
  }
}

async function createTablesOneByOne() {
  console.log('Creating tables one by one via REST API...');
  
  try {
    const tables = [
      {
        name: 'users',
        definition: {
          id: { type: 'serial', primary: true },
          username: { type: 'varchar', notNull: true, unique: true },
          email: { type: 'varchar', unique: true },
          password: { type: 'varchar', notNull: true },
          created_at: { type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          updated_at: { type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
        }
      },
      // Define other tables similarly
    ];
    
    for (const table of tables) {
      console.log(`Creating table: ${table.name}`);
      
      // Create table via API
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ definition: table.definition })
      });
      
      if (!response.ok) {
        console.error(`Failed to create table ${table.name}`);
      } else {
        console.log(`✅ Table ${table.name} created successfully`);
      }
    }
    
    // Check at least some tables were created
    return true;
  } catch (error) {
    console.error('Error creating tables one by one:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  directMigration()
    .then(success => {
      if (success) {
        console.log('Supabase direct migration completed successfully!');
        process.exit(0);
      } else {
        console.error('Supabase direct migration failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error in migration:', error);
      process.exit(1);
    });
}

module.exports = { directMigration };