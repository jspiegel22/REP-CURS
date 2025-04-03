import { sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  // Add new columns to bookings table
  await sql`
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
  `;

  // Add new columns to leads table
  await sql`
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
  `;

  // Add new columns to guide_submissions table
  await sql`
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
  `;
}

export async function down(db: any) {
  // Remove columns from bookings table
  await sql`
    ALTER TABLE bookings
    DROP COLUMN IF EXISTS preferred_contact_method,
    DROP COLUMN IF EXISTS preferred_contact_time,
    DROP COLUMN IF EXISTS form_name,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS ip_address,
    DROP COLUMN IF EXISTS user_agent,
    DROP COLUMN IF EXISTS referrer,
    DROP COLUMN IF EXISTS tags,
    DROP COLUMN IF EXISTS utm_source,
    DROP COLUMN IF EXISTS utm_medium,
    DROP COLUMN IF EXISTS utm_campaign,
    DROP COLUMN IF EXISTS currency,
    DROP COLUMN IF EXISTS payment_status,
    DROP COLUMN IF EXISTS payment_method,
    DROP COLUMN IF EXISTS budget;
  `;

  // Remove columns from leads table
  await sql`
    ALTER TABLE leads
    DROP COLUMN IF EXISTS preferred_contact_method,
    DROP COLUMN IF EXISTS preferred_contact_time,
    DROP COLUMN IF EXISTS form_name,
    DROP COLUMN IF EXISTS ip_address,
    DROP COLUMN IF EXISTS user_agent,
    DROP COLUMN IF EXISTS referrer,
    DROP COLUMN IF EXISTS tags,
    DROP COLUMN IF EXISTS utm_source,
    DROP COLUMN IF EXISTS utm_medium,
    DROP COLUMN IF EXISTS utm_campaign,
    DROP COLUMN IF EXISTS timeline,
    DROP COLUMN IF EXISTS priority,
    DROP COLUMN IF EXISTS budget;
  `;

  // Remove columns from guide_submissions table
  await sql`
    ALTER TABLE guide_submissions
    DROP COLUMN IF EXISTS last_name,
    DROP COLUMN IF EXISTS phone,
    DROP COLUMN IF EXISTS preferred_contact_method,
    DROP COLUMN IF EXISTS preferred_contact_time,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS ip_address,
    DROP COLUMN IF EXISTS user_agent,
    DROP COLUMN IF EXISTS referrer,
    DROP COLUMN IF EXISTS tags,
    DROP COLUMN IF EXISTS utm_source,
    DROP COLUMN IF EXISTS utm_medium,
    DROP COLUMN IF EXISTS utm_campaign,
    DROP COLUMN IF EXISTS interest_areas,
    DROP COLUMN IF EXISTS travel_dates,
    DROP COLUMN IF EXISTS number_of_travelers,
    DROP COLUMN IF EXISTS download_link,
    DROP COLUMN IF EXISTS processed_at;
  `;
} 