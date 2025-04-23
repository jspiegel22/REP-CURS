import pg from 'pg';
import { drizzle } from 'drizzle-orm/pg-core';
import * as schema from '../shared/schema';

const { Pool } = pg;

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function createTables() {
  try {
    console.log('Creating database tables...');

    // Create tables based on schema definitions
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'traveler',
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1
      );
      
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
      );
      
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
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        form_name TEXT,
        form_data JSONB,
        notes TEXT,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        tags TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
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
        listing_id INTEGER REFERENCES listings(id),
        payment_intent_id TEXT
      );
      
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        form_name TEXT,
        form_data JSONB,
        notes TEXT,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        tags TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        interest_type TEXT NOT NULL,
        budget TEXT,
        timeline TEXT,
        priority TEXT DEFAULT 'normal',
        assigned_to TEXT
      );
      
      CREATE TABLE IF NOT EXISTS guide_submissions (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        guide_type TEXT NOT NULL,
        source TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        form_name TEXT NOT NULL,
        submission_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        interest_areas TEXT,
        form_data JSONB
      );
      
      CREATE TABLE IF NOT EXISTS rewards (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        points_required INTEGER NOT NULL,
        type TEXT NOT NULL,
        value DECIMAL NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE IF NOT EXISTS social_shares (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        listing_id INTEGER REFERENCES listings(id),
        platform TEXT NOT NULL,
        shared_at TIMESTAMP DEFAULT NOW(),
        points_earned INTEGER DEFAULT 10
      );
      
      CREATE TABLE IF NOT EXISTS weather_cache (
        id SERIAL PRIMARY KEY,
        location TEXT NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        image_url TEXT,
        author TEXT NOT NULL DEFAULT 'Cabo Team',
        pub_date TIMESTAMP NOT NULL DEFAULT NOW(),
        categories JSONB DEFAULT '[]',
        tags JSONB DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'published',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
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
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createTables();