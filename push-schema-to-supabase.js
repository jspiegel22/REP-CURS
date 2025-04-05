require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');

async function pushSchemaToSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    return false;
  }
  
  console.log('Connecting to Supabase...');
  
  try {
    // First check if we can connect to Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Get the Postgres connection string for this Supabase project
    const connString = `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${process.env.SUPABASE_URL.replace('https://', '')}:5432/postgres`;
    
    console.log('Using connection string with service role as password...');
    
    // Connect directly to Postgres using the service role key as password
    const sql = postgres(connString, { max: 1 });
    const db = drizzle(sql);
    
    // Try to create a simple test table first
    try {
      console.log('Testing connection with simple query...');
      
      await sql`
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      console.log('✅ Test table created successfully');
      
      // Now try to run the schema from our models
      console.log('Creating tables from schema...');
      
      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'traveler',
          points INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1
        )
      `;
      console.log('✅ Users table created');
      
      // Create listings table
      await sql`
        CREATE TABLE IF NOT EXISTS listings (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          type TEXT NOT NULL,
          image_url TEXT NOT NULL,
          price INTEGER,
          location TEXT NOT NULL,
          booking_type TEXT NOT NULL,
          partner_id INTEGER REFERENCES users(id)
        )
      `;
      console.log('✅ Listings table created');
      
      // Create resorts table
      await sql`
        CREATE TABLE IF NOT EXISTS resorts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          rating DECIMAL NOT NULL,
          review_count INTEGER NOT NULL,
          price_level TEXT NOT NULL,
          location TEXT NOT NULL,
          description TEXT NOT NULL,
          image_url TEXT NOT NULL,
          amenities JSONB NOT NULL,
          rooms INTEGER NOT NULL,
          max_guests INTEGER NOT NULL,
          is_beachfront BOOLEAN DEFAULT FALSE,
          is_oceanfront BOOLEAN DEFAULT FALSE,
          google_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Resorts table created');
      
      // Create villas table
      await sql`
        CREATE TABLE IF NOT EXISTS villas (
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
        )
      `;
      console.log('✅ Villas table created');
      
      // Create bookings table
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT,
          email TEXT NOT NULL,
          phone TEXT,
          preferred_contact_method TEXT,
          preferred_contact_time TEXT,
          source TEXT NOT NULL,
          status TEXT NOT NULL,
          form_name TEXT,
          form_data JSONB,
          notes TEXT,
          ip_address TEXT,
          user_agent TEXT,
          referrer TEXT,
          tags TEXT[],
          utm_source TEXT,
          utm_medium TEXT, 
          utm_campaign TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          booking_type TEXT NOT NULL,
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          guests INTEGER NOT NULL,
          total_amount DECIMAL,
          currency TEXT DEFAULT 'USD',
          payment_status TEXT DEFAULT 'pending',
          payment_method TEXT,
          special_requests TEXT,
          budget TEXT,
          listing_id INTEGER REFERENCES listings(id)
        )
      `;
      console.log('✅ Bookings table created');
      
      // Create leads table
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT,
          email TEXT NOT NULL,
          phone TEXT,
          preferred_contact_method TEXT,
          preferred_contact_time TEXT,
          source TEXT NOT NULL,
          status TEXT NOT NULL,
          form_name TEXT,
          form_data JSONB,
          notes TEXT,
          ip_address TEXT,
          user_agent TEXT,
          referrer TEXT,
          tags TEXT[],
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          interest_type TEXT NOT NULL,
          budget TEXT,
          timeline TEXT,
          priority TEXT DEFAULT 'normal',
          assigned_to TEXT
        )
      `;
      console.log('✅ Leads table created');
      
      // Create guide_submissions table
      await sql`
        CREATE TABLE IF NOT EXISTS guide_submissions (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT,
          email TEXT NOT NULL,
          phone TEXT,
          preferred_contact_method TEXT,
          preferred_contact_time TEXT,
          source TEXT NOT NULL,
          status TEXT NOT NULL,
          form_name TEXT,
          form_data JSONB,
          notes TEXT,
          ip_address TEXT,
          user_agent TEXT,
          referrer TEXT,
          tags TEXT[],
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          guide_type TEXT NOT NULL,
          interest_areas TEXT[],
          travel_dates TEXT,
          number_of_travelers INTEGER,
          download_link TEXT,
          processed_at TIMESTAMP,
          submission_id TEXT NOT NULL UNIQUE
        )
      `;
      console.log('✅ Guide submissions table created');
      
      // Create rewards table
      await sql`
        CREATE TABLE IF NOT EXISTS rewards (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          points_required INTEGER NOT NULL,
          type TEXT NOT NULL,
          value DECIMAL NOT NULL,
          active BOOLEAN DEFAULT TRUE
        )
      `;
      console.log('✅ Rewards table created');
      
      // Create social_shares table
      await sql`
        CREATE TABLE IF NOT EXISTS social_shares (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          listing_id INTEGER REFERENCES listings(id),
          platform TEXT NOT NULL,
          shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          points_earned INTEGER DEFAULT 10
        )
      `;
      console.log('✅ Social shares table created');
      
      // Create weather_cache table
      await sql`
        CREATE TABLE IF NOT EXISTS weather_cache (
          id SERIAL PRIMARY KEY,
          location TEXT NOT NULL,
          data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Weather cache table created');
      
      // Create session table
      await sql`
        CREATE TABLE IF NOT EXISTS session (
          sid TEXT NOT NULL PRIMARY KEY,
          sess JSONB NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session ("expire")`;
      console.log('✅ Session table created');
      
      // Verify tables
      console.log('\nVerifying tables in Supabase...');
      
      const tables = [
        'test_table', 'users', 'listings', 'resorts', 'villas', 'bookings', 
        'leads', 'guide_submissions', 'rewards', 'social_shares', 'weather_cache', 'session'
      ];
      
      let successCount = 0;
      
      for (const table of tables) {
        try {
          const result = await sql`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = ${table}
            )
          `;
          
          if (result[0].exists) {
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
      
      // Close the SQL connection
      await sql.end();
      
      return successCount > 0;
    } catch (err) {
      console.error('Error creating schema:', err.message);
      return false;
    }
  } catch (error) {
    console.error('Error pushing schema to Supabase:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  pushSchemaToSupabase()
    .then(success => {
      if (success) {
        console.log('Schema successfully pushed to Supabase!');
        process.exit(0);
      } else {
        console.error('Failed to push schema to Supabase!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { pushSchemaToSupabase };