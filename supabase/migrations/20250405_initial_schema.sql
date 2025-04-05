-- Initial schema migration from Neon PostgreSQL to Supabase
-- Created on April 5, 2025

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'traveler',
  "points" INTEGER DEFAULT 0,
  "level" INTEGER DEFAULT 1
);

-- Listings table
CREATE TABLE IF NOT EXISTS "listings" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "price" INTEGER,
  "location" TEXT NOT NULL,
  "booking_type" TEXT NOT NULL,
  "partner_id" INTEGER REFERENCES "users"("id")
);

-- Resorts table
CREATE TABLE IF NOT EXISTS "resorts" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "rating" DECIMAL NOT NULL,
  "review_count" INTEGER NOT NULL,
  "price_level" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "amenities" JSONB NOT NULL,
  "rooms" INTEGER NOT NULL,
  "max_guests" INTEGER NOT NULL,
  "is_beachfront" BOOLEAN DEFAULT FALSE,
  "is_oceanfront" BOOLEAN DEFAULT FALSE,
  "google_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Villas table
CREATE TABLE IF NOT EXISTS "villas" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "bedrooms" INTEGER NOT NULL,
  "bathrooms" INTEGER NOT NULL,
  "max_guests" INTEGER NOT NULL,
  "amenities" JSONB NOT NULL DEFAULT '[]',
  "image_url" TEXT NOT NULL,
  "image_urls" JSONB NOT NULL DEFAULT '[]',
  "price_per_night" DECIMAL NOT NULL,
  "location" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "latitude" DECIMAL,
  "longitude" DECIMAL,
  "trackhs_id" TEXT UNIQUE,
  "last_synced_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "preferred_contact_method" TEXT,
  "preferred_contact_time" TEXT,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "form_name" TEXT,
  "form_data" JSONB,
  "notes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "tags" TEXT[],
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "booking_type" TEXT NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "guests" INTEGER NOT NULL,
  "total_amount" DECIMAL,
  "currency" TEXT DEFAULT 'USD',
  "payment_status" TEXT DEFAULT 'pending',
  "payment_method" TEXT,
  "special_requests" TEXT,
  "budget" TEXT,
  "listing_id" INTEGER REFERENCES "listings"("id"),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS "leads" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "preferred_contact_method" TEXT,
  "preferred_contact_time" TEXT,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "form_name" TEXT,
  "form_data" JSONB,
  "notes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "tags" TEXT[],
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "interest_type" TEXT NOT NULL,
  "budget" TEXT,
  "timeline" TEXT,
  "priority" TEXT DEFAULT 'normal',
  "assigned_to" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Guide Submissions table
CREATE TABLE IF NOT EXISTS "guide_submissions" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "preferred_contact_method" TEXT,
  "preferred_contact_time" TEXT,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "form_name" TEXT,
  "form_data" JSONB,
  "notes" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "tags" TEXT[],
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "guide_type" TEXT NOT NULL,
  "interest_areas" TEXT[],
  "travel_dates" TEXT,
  "number_of_travelers" INTEGER,
  "download_link" TEXT,
  "processed_at" TIMESTAMP,
  "submission_id" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Rewards table
CREATE TABLE IF NOT EXISTS "rewards" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "points_required" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "value" DECIMAL NOT NULL,
  "active" BOOLEAN DEFAULT TRUE
);

-- Social Shares table
CREATE TABLE IF NOT EXISTS "social_shares" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("id"),
  "listing_id" INTEGER REFERENCES "listings"("id"),
  "platform" TEXT NOT NULL,
  "shared_at" TIMESTAMP DEFAULT NOW(),
  "points_earned" INTEGER DEFAULT 10
);

-- Weather Cache table
CREATE TABLE IF NOT EXISTS "weather_cache" (
  "id" SERIAL PRIMARY KEY,
  "location" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Session storage
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "bookings_email_idx" ON "bookings" ("email");
CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "leads" ("email");
CREATE INDEX IF NOT EXISTS "guide_submissions_email_idx" ON "guide_submissions" ("email");
CREATE INDEX IF NOT EXISTS "villas_trackhs_id_idx" ON "villas" ("trackhs_id");
CREATE INDEX IF NOT EXISTS "resorts_name_idx" ON "resorts" ("name");
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
