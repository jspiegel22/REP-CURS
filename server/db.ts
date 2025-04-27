import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Setting up database connection...");
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Add debug function to test database connection
export const testDbConnection = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM villas');
    console.log(`Database connection test: Found ${result.rows[0].count} villas`);
    
    const adventuresResult = await pool.query('SELECT COUNT(*) FROM adventures');
    console.log(`Database connection test: Found ${adventuresResult.rows[0].count} adventures`);
    
    return {
      villas: parseInt(result.rows[0].count),
      adventures: parseInt(adventuresResult.rows[0].count)
    };
  } catch (error) {
    console.error("Database connection test failed:", error);
    throw error;
  }
};
