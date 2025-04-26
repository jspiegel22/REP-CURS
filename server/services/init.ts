import { db } from "../db";
import { resorts, blogPosts, siteImages } from "../../shared/schema";
import { count } from "drizzle-orm";

/**
 * Performs a lightweight database connection warmup
 * This function helps ensure the database connection is established
 * without performing expensive operations during startup
 */
export async function warmupDatabaseConnection(): Promise<void> {
  try {
    // Execute a lightweight count query on each table
    // This establishes connection without fetching large datasets
    const [resortCount] = await db.select({ count: count() }).from(resorts);
    const [blogCount] = await db.select({ count: count() }).from(blogPosts);
    const [imageCount] = await db.select({ count: count() }).from(siteImages);
    
    console.log(`Database warmup complete: ${resortCount?.count || 0} resorts, ${blogCount?.count || 0} blog posts, ${imageCount?.count || 0} images`);
  } catch (error) {
    console.error("Error during database warmup:", error);
    throw error;
  }
}

/**
 * Initializes critical application services
 * This should be called AFTER server is already running
 */
export async function initializeServices(): Promise<void> {
  try {
    // Import and initialize services as needed
    // Always use dynamic imports to avoid loading at startup
    const { scheduleVillaSync } = await import('./trackhs');
    
    // Only attempt to initialize if appropriate environment variables are set
    if (process.env.TRACKHS_API_KEY) {
      await scheduleVillaSync(60); // Sync every hour
      console.log('Villa sync scheduler initialized');
    } else {
      console.log('TrackHS villa sync disabled (missing API key)');
    }
    
    // Additional service initialization can go here
    // Always check for required configuration before initializing
  } catch (error) {
    console.error("Error initializing services:", error);
    throw error;
  }
}