-- Add new columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact_time TEXT,
ADD COLUMN IF NOT EXISTS form_name TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT;

-- Add new columns to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact_time TEXT,
ADD COLUMN IF NOT EXISTS form_name TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS budget TEXT;

-- Add new columns to guide_submissions table
ALTER TABLE guide_submissions
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact_time TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS interest_areas TEXT[],
ADD COLUMN IF NOT EXISTS travel_dates TEXT,
ADD COLUMN IF NOT EXISTS number_of_travelers INTEGER,
ADD COLUMN IF NOT EXISTS download_link TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP; 

CREATE TABLE IF NOT EXISTS adventures (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  current_price TEXT NOT NULL,
  original_price TEXT,
  discount TEXT,
  duration TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]',
  min_age TEXT,
  provider TEXT,
  category TEXT NOT NULL DEFAULT 'water',
  key_features JSONB DEFAULT '[]',
  things_to_bring JSONB DEFAULT '[]',
  top_recommended BOOLEAN DEFAULT false,
  rating DECIMAL,
  featured BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add hidden column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'adventures' AND column_name = 'hidden'
  ) THEN
    ALTER TABLE adventures ADD COLUMN hidden BOOLEAN DEFAULT false;
  END IF;
END $$;