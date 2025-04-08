import { db } from "./db";
import { eq } from "drizzle-orm";
import { users, listings, bookings, rewards, socialShares, weatherCache, resorts, villas, leads, guideSubmissions } from "@shared/schema";
import type { User, InsertUser, Listing, Booking, Reward, SocialShare, WeatherCache, Resort, Villa, Lead, InsertLead } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { generateResortSlug } from "../client/src/lib/utils";

interface IStorage {
  sessionStore: session.Store;
  createGuideSubmission(submission: any): Promise<any>;
  getVillas(): Promise<Villa[]>;
  getVillaByTrackHsId(trackHsId: string): Promise<Villa | undefined>;
  getResorts(): Promise<Resort[]>;
  getResortBySlug(slug: string): Promise<Resort | undefined>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getListings(type?: string): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: Omit<Listing, "id">): Promise<Listing>;
  createBooking(booking: Omit<Booking, "id">): Promise<Booking>;
  getUserBookings(userId: number): Promise<Booking[]>;
  cacheWeather(location: string, data: any): Promise<WeatherCache>;
  getWeatherCache(location: string): Promise<WeatherCache | undefined>;
  addUserPoints(userId: number, points: number): Promise<User>;
  createSocialShare(share: Omit<SocialShare, "id">): Promise<SocialShare>;
  getAvailableRewards(userPoints: number): Promise<Reward[]>;
  createLead(lead: Omit<Lead, "id">): Promise<Lead>;
  getBookingsByEmail(email: string): Promise<Booking[]>;
  getLeadsByEmail(email: string): Promise<Lead[]>;
  getGuideSubmissions(): Promise<any[]>;
  getAllBookings(): Promise<Booking[]>;
  getAllLeads(): Promise<Lead[]>;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // Add the new createGuideSubmission method
  async createGuideSubmission(submission: any): Promise<any> {
    try {
      console.log("Creating guide submission with data:", submission);
      
      // We'll use raw SQL to avoid any type issues with Drizzle
      const result = await db.execute(
        `INSERT INTO guide_submissions (
          first_name, 
          last_name, 
          email, 
          phone, 
          preferred_contact_method, 
          guide_type, 
          source, 
          status, 
          form_name, 
          submission_id, 
          interest_areas, 
          tags,
          form_data
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING *`,
        [
          submission.firstName,
          submission.lastName || null,
          submission.email,
          submission.phone || null,
          submission.preferredContactMethod || "Email",
          submission.guideType,
          submission.source,
          submission.status || "pending",
          submission.formName,
          submission.submissionId,
          Array.isArray(submission.interestAreas) ? submission.interestAreas : null,
          Array.isArray(submission.tags) ? submission.tags : null,
          submission.formData || {}
        ]
      );

      const newSubmission = result.rows[0];
      
      // Transform snake_case back to camelCase for the response
      const formattedSubmission = {
        id: newSubmission.id,
        firstName: newSubmission.first_name,
        lastName: newSubmission.last_name,
        email: newSubmission.email,
        phone: newSubmission.phone,
        preferredContactMethod: newSubmission.preferred_contact_method,
        guideType: newSubmission.guide_type,
        source: newSubmission.source,
        status: newSubmission.status,
        formName: newSubmission.form_name,
        submissionId: newSubmission.submission_id,
        interestAreas: newSubmission.interest_areas,
        tags: newSubmission.tags,
        formData: newSubmission.form_data,
        createdAt: newSubmission.created_at,
        updatedAt: newSubmission.updated_at
      };

      console.log("Successfully created guide submission:", formattedSubmission);
      return formattedSubmission;
    } catch (error) {
      console.error("Error creating guide submission:", error);
      throw new Error("Failed to create guide submission");
    }
  }

  // Villa Management
  async getVillas(): Promise<Villa[]> {
    try {
      const villaList = await db.select().from(villas);
      if (villaList.length === 0) {
        console.log('No villas found in database');
      }
      return villaList;
    } catch (error) {
      console.error('Error fetching villas:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  async getVillaByTrackHsId(trackHsId: string): Promise<Villa | undefined> {
    const [villa] = await db.select().from(villas).where(eq(villas.trackHsId, trackHsId));
    return villa;
  }

  // Resort Management
  async getResorts(): Promise<Resort[]> {
    return db.select().from(resorts);
  }

  async getResortBySlug(slug: string): Promise<Resort | undefined> {
    const allResorts = await this.getResorts();
    return allResorts.find(resort => generateResortSlug(resort.name) === slug);
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Listing Management
  async getListings(type?: string): Promise<Listing[]> {
    if (type) {
      return db.select().from(listings).where(eq(listings.type, type));
    }
    return db.select().from(listings);
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(listing: Omit<Listing, "id">): Promise<Listing> {
    const [newListing] = await db.insert(listings).values(listing).returning();
    return newListing;
  }

  // Booking Management
  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    try {
      // First save to database
      const [newBooking] = await db
        .insert(bookings)
        .values({
          ...booking,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
        })
        .returning();

      // Then sync to Airtable with retry logic
      try {
        await retryFailedSync(syncBookingToAirtable, newBooking);
      } catch (error) {
        console.error("Failed to sync booking to Airtable:", error);
        // Don't throw error here - we still want to return the booking
        // The sync can be retried later if needed
      }

      return newBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking");
    }
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    try {
      return await db
        .select()
        .from(bookings)
        .where(eq(bookings.userId, userId))
        .orderBy(bookings.startDate);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }

  // Weather Cache Management
  async cacheWeather(location: string, data: any): Promise<WeatherCache> {
    const [cached] = await db
      .insert(weatherCache)
      .values({ location, data })
      .returning();
    return cached;
  }

  async getWeatherCache(location: string): Promise<WeatherCache | undefined> {
    const [cached] = await db
      .select()
      .from(weatherCache)
      .where(eq(weatherCache.location, location));
    return cached;
  }

  // Rewards Management
  async addUserPoints(userId: number, points: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ points: users.points + points })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createSocialShare(share: Omit<SocialShare, "id">): Promise<SocialShare> {
    const [newShare] = await db.insert(socialShares).values(share).returning();
    return newShare;
  }

  async getAvailableRewards(userPoints: number): Promise<Reward[]> {
    return db
      .select()
      .from(rewards)
      .where(eq(rewards.active, true))
      .where(rewards.pointsRequired <= userPoints);
  }

  // New methods for bookings and leads
  async createLead(lead: Omit<Lead, "id">): Promise<Lead> {
    try {
      // First save to database
      const [newLead] = await db
        .insert(leads)
        .values(lead)
        .returning();

      // Then sync to Airtable with retry logic
      try {
        await retryFailedSync(syncLeadToAirtable, newLead);
      } catch (error) {
        console.error("Failed to sync lead to Airtable:", error);
        // Don't throw error here - we still want to return the lead
        // The sync can be retried later if needed
      }

      return newLead;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw new Error("Failed to create lead");
    }
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    try {
      return await db
        .select()
        .from(bookings)
        .where(eq(bookings.email, email))
        .orderBy(bookings.startDate);
    } catch (error) {
      console.error("Error fetching bookings by email:", error);
      throw new Error("Failed to fetch bookings");
    }
  }

  async getLeadsByEmail(email: string): Promise<Lead[]> {
    try {
      return await db
        .select()
        .from(leads)
        .where(eq(leads.email, email))
        .orderBy(leads.createdAt);
    } catch (error) {
      console.error("Error fetching leads by email:", error);
      throw new Error("Failed to fetch leads");
    }
  }

  // Admin methods
  async getGuideSubmissions(): Promise<any[]> {
    try {
      return await db
        .select()
        .from(guideSubmissions)
        .orderBy(guideSubmissions.createdAt);
    } catch (error) {
      console.error("Error fetching guide submissions:", error);
      throw new Error("Failed to fetch guide submissions");
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      return await db
        .select()
        .from(bookings)
        .orderBy(bookings.createdAt);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw new Error("Failed to fetch all bookings");
    }
  }

  async getAllLeads(): Promise<Lead[]> {
    try {
      return await db
        .select()
        .from(leads)
        .orderBy(leads.createdAt);
    } catch (error) {
      console.error("Error fetching all leads:", error);
      throw new Error("Failed to fetch all leads");
    }
  }
}

export const storage = new DatabaseStorage();

// Placeholder functions -  replace with actual implementations
async function retryFailedSync(func: any, data: any) {
    try{
        await func(data)
    } catch(error){
        console.error("Retry failed", error)
        throw error
    }
}

async function syncBookingToAirtable(data: any) {
    // Implementation to sync with Airtable
    console.log("Syncing booking to Airtable:", data);
}

async function syncLeadToAirtable(data: any) {
    //Implementation to sync with Airtable
    console.log("Syncing lead to Airtable:", data);
}