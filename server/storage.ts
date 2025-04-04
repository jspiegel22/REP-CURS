import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import { users, listings, bookings, rewards, socialShares, weatherCache, resorts, villas, leads, guideSubmissions } from "@shared/schema";
import type { User, InsertUser, Listing, Booking, Reward, SocialShare, WeatherCache, Resort, Villa, Lead, InsertLead, GuideSubmission } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { generateResortSlug } from "../client/src/lib/utils";
import { supabase, supabaseAdmin, isSupabaseConfigured, handleDatabaseError } from "./services/supabase";

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

  // Simplified createGuideSubmission method
  async createGuideSubmission(submission: any): Promise<any> {
    try {
      console.log("Creating guide submission with data:", submission);
      
      // Ensure interestAreas is always a properly formatted JSON array
      let interestAreasJson = '[]';
      if (submission.interestAreas) {
        if (Array.isArray(submission.interestAreas)) {
          interestAreasJson = JSON.stringify(submission.interestAreas);
        } else if (typeof submission.interestAreas === 'string') {
          interestAreasJson = JSON.stringify([submission.interestAreas]);
        }
      }
      
      // Create form data JSON
      const formData = JSON.stringify({
        tags: Array.isArray(submission.tags) ? submission.tags : null,
        referrer: submission.referrer || null,
        ipAddress: submission.ipAddress || null,
        userAgent: submission.userAgent || null,
        utmSource: submission.utmSource || null,
        utmMedium: submission.utmMedium || null,
        utmCampaign: submission.utmCampaign || null
      });
      
      // Simplified query
      const result = await pool.query(`
        INSERT INTO guide_submissions 
        (first_name, email, phone, guide_type, source, status, form_name, submission_id, interest_areas, form_data, last_name, preferred_contact_method)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          submission.firstName,
          submission.email,
          submission.phone || null,
          submission.guideType || "Cabo San Lucas Travel Guide",
          submission.source || "website",
          submission.status || "pending",
          submission.formName || "guide-download",
          submission.submissionId || Date.now().toString(),
          interestAreasJson,
          formData,
          submission.lastName || null,
          submission.preferredContactMethod || "Email"
        ]
      );
      
      if (!result.rows || result.rows.length === 0) {
        throw new Error("Failed to insert guide submission");
      }
      
      const dbSubmission = result.rows[0];
      
      // Simplified formatting
      const formattedSubmission = {
        id: dbSubmission.id,
        firstName: dbSubmission.first_name,
        email: dbSubmission.email,
        phone: dbSubmission.phone,
        guideType: dbSubmission.guide_type,
        submissionId: dbSubmission.submission_id,
        createdAt: dbSubmission.created_at
      };

      console.log("Successfully created guide submission:", formattedSubmission);
      
      // Sync to Airtable and process submission
      try {
        const airtableService = await import("./services/airtable").catch(() => null);
        const guideService = await import("./services/guideSubmissions").catch(() => null);
        
        // Process in background
        if (airtableService?.syncGuideSubmissionToAirtable) {
          airtableService.syncGuideSubmissionToAirtable(formattedSubmission)
            .catch(err => console.error("Error syncing to Airtable:", err));
        }
        
        if (guideService?.processGuideSubmission) {
          guideService.processGuideSubmission(formattedSubmission)
            .catch(err => console.error("Error processing submission:", err));
        }
      } catch (processingError) {
        console.error("Error in post-processing setup:", processingError);
      }
      
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
  async createBooking(booking: any): Promise<any> {
    try {
      console.log("Creating booking with data:", booking);
      
      // Store data according to the actual database schema
      const bookingData = {
        user_id: booking.userId || null,
        listing_id: booking.listingId || null,
        start_date: new Date(booking.startDate),
        end_date: new Date(booking.endDate),
        status: booking.status || "pending",
        // Store all other details as JSON
        form_data: JSON.stringify({
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email, 
          phone: booking.phone,
          guests: booking.guests,
          specialRequests: booking.specialRequests,
          bookingType: booking.bookingType,
          preferredContactMethod: booking.preferredContactMethod,
          budget: booking.budget,
          totalAmount: booking.totalAmount,
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod
        }),
        points_earned: booking.pointsEarned || 0,
        adventure_id: booking.adventureId || null
      };
      
      // Use raw SQL to insert with precision
      const result = await db.execute(
        `INSERT INTO bookings (
          user_id, 
          listing_id, 
          start_date, 
          end_date, 
          status, 
          form_data, 
          points_earned, 
          adventure_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING *`,
        [
          bookingData.user_id,
          bookingData.listing_id,
          bookingData.start_date,
          bookingData.end_date,
          bookingData.status,
          bookingData.form_data,
          bookingData.points_earned,
          bookingData.adventure_id
        ]
      );

      if (!result.rows || result.rows.length === 0) {
        throw new Error("Failed to insert booking");
      }
      
      const newBooking = result.rows[0];
      
      // Format for API response
      const formattedBooking = {
        id: newBooking.id,
        userId: newBooking.user_id,
        listingId: newBooking.listing_id,
        startDate: newBooking.start_date,
        endDate: newBooking.end_date,
        status: newBooking.status,
        adventureId: newBooking.adventure_id,
        pointsEarned: newBooking.points_earned,
        // Add back form data fields
        ...JSON.parse(newBooking.form_data || '{}')
      };

      // Then sync to Airtable
      try {
        // Use the airtable service from the project
        const { syncBookingToAirtable } = await import("./services/airtable");
        await syncBookingToAirtable(formattedBooking);
      } catch (syncError) {
        console.error("Failed to sync booking to Airtable:", syncError);
        // Don't throw error here - we still want to return the booking
      }

      console.log("Successfully created booking:", formattedBooking);
      return formattedBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking");
    }
  }

  async getUserBookings(userId: number): Promise<any[]> {
    try {
      const result = await db.execute(
        `SELECT * FROM bookings WHERE user_id = $1 ORDER BY start_date`,
        [userId]
      );
      
      // Format the bookings
      return result.rows.map(booking => ({
        id: booking.id,
        userId: booking.user_id,
        listingId: booking.listing_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        status: booking.status,
        adventureId: booking.adventure_id,
        pointsEarned: booking.points_earned,
        // Add back form data fields
        ...JSON.parse(booking.form_data || '{}')
      }));
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
  async createLead(lead: any): Promise<any> {
    try {
      console.log("Creating lead with data:", lead);
      
      // Prepare data based on the actual database schema
      const leadData = {
        first_name: lead.firstName,
        last_name: lead.lastName || null,
        email: lead.email,
        phone: lead.phone || null,
        interest_type: lead.interestType || "villa",
        source: lead.source || "website",
        status: lead.status || "new",
        // Store additional data as JSON
        form_data: JSON.stringify({
          preferredContactMethod: lead.preferredContactMethod,
          budget: lead.budget,
          timeline: lead.timeline,
          specialRequests: lead.specialRequests,
          tags: lead.tags,
          submissionId: lead.submissionId
        }),
        notes: lead.notes || null,
        assigned_to: lead.assignedTo || null
      };
      
      // Use raw SQL to ensure precise column mapping
      const result = await db.execute(
        `INSERT INTO leads (
          first_name,
          last_name,
          email,
          phone,
          interest_type,
          source,
          status,
          form_data,
          notes,
          assigned_to
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *`,
        [
          leadData.first_name,
          leadData.last_name,
          leadData.email,
          leadData.phone,
          leadData.interest_type,
          leadData.source,
          leadData.status,
          leadData.form_data,
          leadData.notes,
          leadData.assigned_to
        ]
      );

      if (!result.rows || result.rows.length === 0) {
        throw new Error("Failed to insert lead");
      }
      
      const newLead = result.rows[0];
      
      // Format for API response
      const formattedLead = {
        id: newLead.id,
        firstName: newLead.first_name,
        lastName: newLead.last_name,
        email: newLead.email,
        phone: newLead.phone,
        interestType: newLead.interest_type,
        source: newLead.source,
        status: newLead.status,
        notes: newLead.notes,
        assignedTo: newLead.assigned_to,
        createdAt: newLead.created_at,
        updatedAt: newLead.updated_at,
        // Add back the form data details
        ...JSON.parse(newLead.form_data || '{}')
      };

      // Then sync to Airtable
      try {
        // Use the airtable service from the project
        const { syncLeadToAirtable } = await import("./services/airtable");
        await syncLeadToAirtable(formattedLead);
      } catch (syncError) {
        console.error("Failed to sync lead to Airtable:", syncError);
        // Don't throw here - we still want to return the lead
      }

      console.log("Successfully created lead:", formattedLead);
      return formattedLead;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw new Error("Failed to create lead");
    }
  }

  async getBookingsByEmail(email: string): Promise<any[]> {
    try {
      // Email is stored in form_data, so we need to use raw SQL
      const result = await db.execute(
        `SELECT * FROM bookings 
         WHERE form_data->>'email' = $1 
         ORDER BY start_date DESC`,
        [email]
      );
      
      // Format the bookings
      return result.rows.map(booking => ({
        id: booking.id,
        userId: booking.user_id,
        listingId: booking.listing_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        status: booking.status,
        adventureId: booking.adventure_id,
        pointsEarned: booking.points_earned,
        // Add back form data fields
        ...JSON.parse(booking.form_data || '{}')
      }));
    } catch (error) {
      console.error("Error fetching bookings by email:", error);
      throw new Error("Failed to fetch bookings");
    }
  }

  async getLeadsByEmail(email: string): Promise<any[]> {
    try {
      const result = await db.execute(
        `SELECT * FROM leads WHERE email = $1 ORDER BY created_at DESC`,
        [email]
      );
      
      // Format the leads
      return result.rows.map(lead => ({
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        interestType: lead.interest_type,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        assignedTo: lead.assigned_to,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at,
        // Add back the form data details
        ...JSON.parse(lead.form_data || '{}')
      }));
    } catch (error) {
      console.error("Error fetching leads by email:", error);
      throw new Error("Failed to fetch leads");
    }
  }

  // Admin methods
  async getGuideSubmissions(): Promise<any[]> {
    try {
      const result = await db.execute(
        `SELECT * FROM guide_submissions ORDER BY created_at DESC`
      );
      
      // Transform snake_case to camelCase for the response
      return result.rows.map(submission => ({
        id: submission.id,
        firstName: submission.first_name,
        email: submission.email,
        guideType: submission.guide_type,
        source: submission.source,
        status: submission.status,
        formName: submission.form_name,
        submissionId: submission.submission_id,
        interestAreas: JSON.parse(submission.interest_areas),
        createdAt: submission.created_at,
        updatedAt: submission.updated_at
      }));
    } catch (error) {
      console.error("Error fetching guide submissions:", error);
      throw new Error("Failed to fetch guide submissions");
    }
  }

  async getAllBookings(): Promise<any[]> {
    try {
      const result = await db.execute(
        `SELECT * FROM bookings ORDER BY created_at DESC`
      );
      
      // Format the bookings
      return result.rows.map(booking => ({
        id: booking.id,
        userId: booking.user_id,
        listingId: booking.listing_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        status: booking.status,
        adventureId: booking.adventure_id,
        pointsEarned: booking.points_earned,
        // Add back form data fields
        ...JSON.parse(booking.form_data || '{}')
      }));
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw new Error("Failed to fetch all bookings");
    }
  }

  async getAllLeads(): Promise<any[]> {
    try {
      const result = await db.execute(
        `SELECT * FROM leads ORDER BY created_at DESC`
      );
      
      // Format the leads
      return result.rows.map(lead => ({
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        interestType: lead.interest_type,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        assignedTo: lead.assigned_to,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at,
        // Add back the form data details
        ...JSON.parse(lead.form_data || '{}')
      }));
    } catch (error) {
      console.error("Error fetching all leads:", error);
      throw new Error("Failed to fetch all leads");
    }
  }
}

// Supabase Storage implementation
export class SupabaseStorage implements IStorage {
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

  // Guide Submissions
  async createGuideSubmission(submission: any): Promise<GuideSubmission> {
    try {
      console.log("Creating guide submission with data:", submission);
      
      // Ensure interestAreas is always a properly formatted array
      let interestAreas = [];
      if (submission.interestAreas) {
        interestAreas = Array.isArray(submission.interestAreas) 
          ? submission.interestAreas 
          : [submission.interestAreas];
      }
      
      // Format for Supabase
      const supabaseData = {
        first_name: submission.firstName,
        email: submission.email,
        phone: submission.phone || null,
        guide_type: submission.guideType || "Cabo San Lucas Travel Guide",
        source: submission.source || "website",
        status: submission.status || "pending",
        form_name: submission.formName || "guide-download",
        submission_id: submission.submissionId || Date.now().toString(),
        interest_areas: interestAreas,
        last_name: submission.lastName || null,
        preferred_contact_method: submission.preferredContactMethod || "Email",
        form_data: {
          tags: Array.isArray(submission.tags) ? submission.tags : null,
          referrer: submission.referrer || null,
          ipAddress: submission.ipAddress || null,
          userAgent: submission.userAgent || null,
          utmSource: submission.utmSource || null,
          utmMedium: submission.utmMedium || null,
          utmCampaign: submission.utmCampaign || null
        }
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('guide_submissions')
        .insert(supabaseData)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error creating guide submission:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("No data returned from Supabase");
      }
      
      // Convert Supabase data to GuideSubmission type
      const guideSubmission: GuideSubmission = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        preferredContactMethod: data.preferred_contact_method,
        preferredContactTime: data.preferred_contact_time,
        source: data.source,
        status: data.status,
        formName: data.form_name,
        formData: data.form_data,
        notes: data.notes,
        ipAddress: data.ip_address,
        userAgent: data.user_agent,
        referrer: data.referrer,
        tags: data.tags || [],
        utmSource: data.utm_source,
        utmMedium: data.utm_medium,
        utmCampaign: data.utm_campaign,
        createdAt: new Date(data.created_at),
        updatedAt: data.updated_at ? new Date(data.updated_at) : null,
        guideType: data.guide_type,
        interestAreas: data.interest_areas || [],
        travelDates: data.travel_dates,
        numberOfTravelers: data.number_of_travelers,
        downloadLink: data.download_link,
        processedAt: data.processed_at ? new Date(data.processed_at) : null,
        submissionId: data.submission_id
      };

      console.log("Successfully created guide submission:", guideSubmission.id);
      
      // Process in background - but don't process with insufficient data format
      try {
        const airtableService = await import("./services/airtable").catch(() => null);
        const guideService = await import("./services/guideSubmissions").catch(() => null);
        
        if (airtableService?.syncGuideSubmissionToAirtable) {
          airtableService.syncGuideSubmissionToAirtable(guideSubmission)
            .catch(err => console.error("Error syncing to Airtable:", err));
        }
        
        if (guideService?.processGuideSubmission) {
          guideService.processGuideSubmission(guideSubmission)
            .catch(err => console.error("Error processing submission:", err));
        }
      } catch (processingError) {
        console.error("Error in post-processing setup:", processingError);
      }
      
      return guideSubmission;
    } catch (error) {
      console.error("Error creating guide submission:", error);
      throw new Error("Failed to create guide submission");
    }
  }

  // Other methods would be implemented similarly
  // For brevity, we'll implement a few key methods to test with and add more as needed

  async getVillas(): Promise<Villa[]> {
    try {
      const { data, error } = await supabase
        .from('villas')
        .select('*');
        
      if (error) {
        console.error("Error fetching villas:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching villas:', error);
      return [];
    }
  }

  async getVillaByTrackHsId(trackHsId: string): Promise<Villa | undefined> {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .eq('trackhs_id', trackHsId)
      .single();
      
    if (error) {
      console.error("Error fetching villa by trackHsId:", error);
      return undefined;
    }
    
    return data || undefined;
  }

  async getResorts(): Promise<Resort[]> {
    const { data, error } = await supabase
      .from('resorts')
      .select('*');
      
    if (error) {
      console.error("Error fetching resorts:", error);
      return [];
    }
    
    return data || [];
  }

  async getResortBySlug(slug: string): Promise<Resort | undefined> {
    const resorts = await this.getResorts();
    return resorts.find(resort => generateResortSlug(resort.name) === slug);
  }

  // Remaining methods would be similar adaptations from the DatabaseStorage implementation
  // For now, we'll throw errors for unimplemented methods to identify them during testing

  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
    
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error fetching user by username:", error);
    }
    
    return data || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from Supabase");
    }
    
    return data;
  }

  // For remaining methods, we'll implement them as needed
  // This pattern can be repeated for the rest of the methods

  // Placeholder implementations to satisfy interface
  async getListings(type?: string): Promise<Listing[]> {
    return new DatabaseStorage().getListings(type);
  }

  async getListing(id: number): Promise<Listing | undefined> {
    return new DatabaseStorage().getListing(id);
  }

  async createListing(listing: Omit<Listing, "id">): Promise<Listing> {
    return new DatabaseStorage().createListing(listing);
  }

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    return new DatabaseStorage().createBooking(booking);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return new DatabaseStorage().getUserBookings(userId);
  }

  async cacheWeather(location: string, data: any): Promise<WeatherCache> {
    return new DatabaseStorage().cacheWeather(location, data);
  }

  async getWeatherCache(location: string): Promise<WeatherCache | undefined> {
    return new DatabaseStorage().getWeatherCache(location);
  }

  async addUserPoints(userId: number, points: number): Promise<User> {
    return new DatabaseStorage().addUserPoints(userId, points);
  }

  async createSocialShare(share: Omit<SocialShare, "id">): Promise<SocialShare> {
    return new DatabaseStorage().createSocialShare(share);
  }

  async getAvailableRewards(userPoints: number): Promise<Reward[]> {
    return new DatabaseStorage().getAvailableRewards(userPoints);
  }

  async createLead(lead: Omit<Lead, "id">): Promise<Lead> {
    return new DatabaseStorage().createLead(lead);
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return new DatabaseStorage().getBookingsByEmail(email);
  }

  async getLeadsByEmail(email: string): Promise<Lead[]> {
    return new DatabaseStorage().getLeadsByEmail(email);
  }

  async getGuideSubmissions(): Promise<any[]> {
    return new DatabaseStorage().getGuideSubmissions();
  }

  async getAllBookings(): Promise<Booking[]> {
    return new DatabaseStorage().getAllBookings();
  }

  async getAllLeads(): Promise<Lead[]> {
    return new DatabaseStorage().getAllLeads();
  }
}

// Select the appropriate storage implementation based on environment
// If Supabase is configured and enabled, use it
// Otherwise, fall back to the database storage
export const storage = isSupabaseConfigured() && process.env.USE_SUPABASE === 'true'
  ? new SupabaseStorage()
  : new DatabaseStorage();

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