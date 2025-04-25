import { db } from "../server/db";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool } from "@neondatabase/serverless";

async function updateSchema() {
  try {
    console.log("Updating database schema...");
    
    // Create the site_images table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_images (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        image_file TEXT NOT NULL UNIQUE,
        image_url TEXT NOT NULL,
        alt_text TEXT NOT NULL,
        description TEXT,
        width INTEGER,
        height INTEGER,
        category TEXT NOT NULL,
        tags JSONB,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("Database schema updated successfully!");
  } catch (error) {
    console.error("Error updating database schema:", error);
    process.exit(1);
  } finally {
    // Close the database connection - using $client instead of client
    await db.$client.end();
    process.exit(0);
  }
}

updateSchema();