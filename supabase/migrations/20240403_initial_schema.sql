-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "net";

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'traveler' CHECK (role IN ('admin', 'partner', 'traveler')),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('resort', 'hotel', 'villa', 'adventure', 'restaurant')),
    image_url TEXT NOT NULL,
    price INTEGER,
    location TEXT NOT NULL,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('direct', 'form')),
    partner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resorts table
CREATE TABLE resorts (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create villas table
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
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
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
    booking_type TEXT NOT NULL CHECK (booking_type IN ('villa', 'resort', 'adventure', 'restaurant', 'event')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    guests INTEGER NOT NULL,
    total_amount DECIMAL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    special_requests TEXT,
    budget TEXT,
    listing_id INTEGER REFERENCES listings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
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
    interest_type TEXT NOT NULL CHECK (interest_type IN ('villa', 'resort', 'adventure', 'wedding', 'group_trip', 'influencer', 'concierge')),
    budget TEXT,
    timeline TEXT,
    priority TEXT DEFAULT 'normal',
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guide_submissions table
CREATE TABLE guide_submissions (
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
    guide_type TEXT NOT NULL,
    interest_areas TEXT[],
    travel_dates TEXT,
    number_of_travelers INTEGER,
    download_link TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    submission_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    points_required INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('discount', 'freebie', 'upgrade')),
    value DECIMAL NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_shares table
CREATE TABLE social_shares (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    listing_id INTEGER REFERENCES listings(id),
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'whatsapp')),
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points_earned INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weather_cache table
CREATE TABLE weather_cache (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON listings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON resorts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON villas FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON bookings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON leads FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON guide_submissions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON rewards FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON social_shares FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON weather_cache FOR SELECT USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resorts_updated_at
    BEFORE UPDATE ON resorts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_villas_updated_at
    BEFORE UPDATE ON villas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_submissions_updated_at
    BEFORE UPDATE ON guide_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
    BEFORE UPDATE ON rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_shares_updated_at
    BEFORE UPDATE ON social_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weather_cache_updated_at
    BEFORE UPDATE ON weather_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 