-- Enums
CREATE TYPE adventure_category AS ENUM (
    'water',
    'land',
    'luxury',
    'family'
);

CREATE TYPE adventure_provider AS ENUM (
    'Cabo Adventures',
    'Papillon Yachts'
);

CREATE TYPE booking_type AS ENUM (
    'direct',
    'form'
);

-- Core Tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'traveler',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
);

CREATE TABLE guide_submissions (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    guide_type TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'website',
    status TEXT NOT NULL DEFAULT 'pending',
    form_name TEXT NOT NULL DEFAULT 'guide-download',
    submission_id TEXT NOT NULL,
    phone TEXT,
    last_name TEXT,
    form_data JSONB,
    interest_areas TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE villas (
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
);

CREATE TABLE resorts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    review_count INTEGER NOT NULL,
    price_level TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    amenities JSONB NOT NULL DEFAULT '[]',
    bookings_today INTEGER DEFAULT 0,
    google_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adventures (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT NOT NULL,
    provider adventure_provider NOT NULL,
    duration TEXT NOT NULL,
    current_price TEXT NOT NULL,
    original_price TEXT,
    discount TEXT,
    min_age TEXT,
    booking_type booking_type DEFAULT 'form' NOT NULL,
    max_guests INTEGER,
    category adventure_category,
    rating DECIMAL,
    available_dates JSONB,
    included JSONB,
    requirements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    listing_id INTEGER,
    adventure_id INTEGER REFERENCES adventures(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    form_data JSONB,
    points_earned INTEGER
);

CREATE TABLE session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX idx_session_expire ON session (expire);

-- Enable Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;

-- Create default policies
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Auth users can insert" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON guide_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert" ON guide_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON villas FOR SELECT USING (true);
CREATE POLICY "Admin insert access" ON villas FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON resorts FOR SELECT USING (true);
CREATE POLICY "Admin insert access" ON resorts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON adventures FOR SELECT USING (true);
CREATE POLICY "Admin insert access" ON adventures FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read access" ON bookings FOR SELECT USING (true);
CREATE POLICY "Users can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR auth.role() = 'authenticated');