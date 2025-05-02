import { db } from "./db";
import { eq, and, ne, SQL, desc, sql } from "drizzle-orm";
import { users, listings, bookings, rewards, socialShares, weatherCache, resorts, villas, leads, guideSubmissions, blogPosts, adventures, restaurants } from "@shared/schema";
import type { User, InsertUser, Listing, Booking, Reward, SocialShare, WeatherCache, Resort, Villa, Lead, InsertLead, InsertBlogPost, Adventure, InsertAdventure, Restaurant, InsertRestaurant } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { nanoid } from "nanoid";

interface IStorage {
  sessionStore: session.Store;
  createGuideSubmission(submission: any): Promise<any>;
  getVillas(): Promise<Villa[]>;
  getVillaByTrackHsId(trackHsId: string): Promise<Villa | undefined>;
  createVilla(villaData: Partial<Villa>): Promise<Villa>;
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
  getBookingByPaymentIntentId(paymentIntentId: string): Promise<Booking | undefined>;
  updateBookingStatus(bookingId: number, status: string): Promise<Booking>;
  createBlogPost(blogPost: any): Promise<any>;
  getBlogPostBySlug(slug: string): Promise<any>;
  getBlogPosts(limit?: number, category?: string): Promise<any[]>;

  // Recent data retrieval for admin notification
  getRecentLeads(limit: number): Promise<Lead[]>;
  getRecentBookings(limit: number): Promise<Booking[]>;
  getRecentGuideSubmissions(limit: number): Promise<any[]>;

  // Adventures related methods
  getAdventures(category?: string, includeHidden?: boolean): Promise<Adventure[]>;
  getAdventure(id: number): Promise<Adventure | undefined>;
  getAdventureBySlug(slug: string): Promise<Adventure | undefined>;
  createAdventure(adventure: InsertAdventure): Promise<Adventure>;
  updateAdventure(id: number, adventure: Partial<Adventure>): Promise<Adventure>;
  deleteAdventure(id: number): Promise<boolean>;

  // Restaurant related methods
  getRestaurants(category?: string): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  getRestaurantBySlug(slug: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<Restaurant>): Promise<Restaurant>;
  deleteRestaurant(id: number): Promise<boolean>;

  // Analytics methods
  getLeadAnalytics(): Promise<any>;
  getGuideAnalytics(): Promise<any>;
  getDashboardAnalytics(): Promise<any>;
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

      // Store form data as JSON with all the additional fields
      const formData = {
        ...(submission.formData || {}),
        // Store tags in the form data 
        _tags: Array.isArray(submission.tags) ? submission.tags : [],
        // Additional fields from Airtable mapping
        submission_type: "Guide Request",
        download_link: "https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing",
        interest_type: submission.guideType || "Cabo Travel Guide"
      };

      // Format interest areas as a string if it's an array for Airtable compatibility
      const interestAreasJson = Array.isArray(submission.interestAreas) 
        ? JSON.stringify(submission.interestAreas)
        : JSON.stringify([submission.interestAreas || "Travel Guide"]);

      // Only include columns that actually exist in the database
      // Use camelCase field names matching the schema definition in shared/schema.ts
      const result = await db.insert(guideSubmissions).values({
        firstName: submission.first_name || submission.firstName,
        lastName: submission.last_name || submission.lastName || '',
        email: submission.email,
        phone: submission.phone || '',
        preferredContactMethod: submission.preferred_contact_method || submission.preferredContactMethod || "Email",
        guideType: submission.guide_type || submission.guideType || "Cabo San Lucas Travel Guide",
        source: submission.source || "website",
        status: submission.status || "pending",
        formName: submission.form_name || submission.formName || "guide-download",
        submissionId: submission.submission_id || submission.submissionId || nanoid(),
        interestAreas: submission.interest_areas || submission.interestAreas ? 
            (Array.isArray(submission.interest_areas || submission.interestAreas) ? 
             (submission.interest_areas || submission.interestAreas) : 
             [(submission.interest_areas || submission.interestAreas)]) : 
            ["Travel Guide"],
        formData: formData
      }).returning();

      const [newSubmission] = result;

      // Transform snake_case back to camelCase for the response
      // Direct return of newSubmission since it's already in camelCase format
      const formattedSubmission = {
        id: newSubmission.id,
        firstName: newSubmission.firstName,
        lastName: newSubmission.lastName,
        email: newSubmission.email,
        phone: newSubmission.phone,
        preferredContactMethod: newSubmission.preferredContactMethod,
        guideType: newSubmission.guideType,
        source: newSubmission.source,
        status: newSubmission.status,
        formName: newSubmission.formName,
        submissionId: newSubmission.submissionId,
        interestAreas: newSubmission.interestAreas,
        // Extract tags from formData
        tags: formData._tags || [],
        formData: newSubmission.formData,
        createdAt: newSubmission.createdAt,
        updatedAt: newSubmission.updatedAt
      };

      console.log("Successfully created guide submission:", formattedSubmission);

      // Send to Make.com webhook if configured
      try {
        if (process.env.MAKE_WEBHOOK_URL) {
          console.log("Sending guide request to Make.com webhook");

          // Format the data according to Airtable column structure
          const webhookData = {
            "First Name": submission.first_name || submission.firstName,
            "Last Name": submission.last_name || submission.lastName || '',
            "Email": submission.email,
            "Phone": submission.phone || '',
            "Preferred Contact Method": submission.preferred_contact_method || submission.preferredContactMethod || "Email",
            "Submission Type": "Guide Request",
            "Status": "New",
            "Notes": "Guide download request",
            "Interest Type": submission.guide_type || submission.guideType || "Cabo Travel Guide",
            "Guide Type": submission.guide_type || submission.guideType || "Cabo San Lucas Travel Guide",
            "Interest Areas": Array.isArray(submission.interest_areas || submission.interestAreas) 
              ? (submission.interest_areas || submission.interestAreas).join(", ") 
              : (submission.interest_areas || submission.interestAreas || "Travel Guide"),
            "Download Link": "https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing",
            "Source Page": submission.source || "website",
            "Form Name": submission.form_name || submission.formName || "guide-download",
            "Form Data": JSON.stringify(formData),
            "Submission ID": submission.submission_id || submission.submissionId,
            "Created At": new Date().toISOString(),
            "Last Modified": new Date().toISOString(),
            "User Agent": submission.user_agent || submission.userAgent || "",
            "Referrer": submission.referrer || "",
            "Tags": Array.isArray(submission.tags) ? submission.tags.join(", ") : "Guide Request, Website"
          };

          // Send to Make.com in the background
          fetch(process.env.MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookData)
          }).catch(err => {
            console.warn("Background Make.com webhook error:", err);
          });
        }
      } catch (webhookError) {
        console.error("Failed to send to webhook, but submission was saved:", webhookError);
        // Don't fail the main request if webhook sending fails
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

  async createVilla(villaData: Partial<Villa>): Promise<Villa> {
    try {
      console.log("Creating new villa:", villaData.name);

      // Convert any arrays to JSON strings if needed
      const processedVilla = {
        ...villaData,
        imageUrls: Array.isArray(villaData.imageUrls) 
          ? villaData.imageUrls 
          : [],
        amenities: Array.isArray(villaData.amenities) 
          ? villaData.amenities 
          : [],
        featured: villaData.featured || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [newVilla] = await db.insert(villas).values(processedVilla as any).returning();
      console.log("Villa created successfully:", newVilla.id);
      return newVilla;
    } catch (error) {
      console.error("Error creating villa:", error);
      throw new Error("Failed to create villa");
    }
  }

  // Resort Management
  async getResorts(): Promise<Resort[]> {
    return db.select().from(resorts);
  }

  async updateResort(id: number, updateData: Partial<Resort>): Promise<Resort | null> {
    try {
      console.log("Updating resort with ID:", id, "with data:", JSON.stringify(updateData));

      // Remove any fields that don't exist in the database schema
      const validFields = ['name', 'description', 'location', 'rating', 'reviewCount', 
                          'priceLevel', 'imageUrl', 'imageUrls', 'amenities', 'googleUrl', 
                          'bookingsToday', 'category', 'featured'];

      const filteredData: any = {};
      for (const key in updateData) {
        if (validFields.includes(key)) {
          filteredData[key] = updateData[key as keyof Partial<Resort>];
        }
      }

      // Add the updatedAt field
      filteredData.updatedAt = new Date();

      const [updatedResort] = await db.update(resorts)
        .set(filteredData)
        .where(eq(resorts.id, id))
        .returning();

      console.log("Resort updated successfully:", updatedResort);
      return updatedResort;
    } catch (error) {
      console.error("Error updating resort:", error);
      throw error;
    }
  }

  // Helper function to generate resort slug
  private generateResortSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  async getResortBySlug(slug: string): Promise<Resort | undefined> {
    const allResorts = await this.getResorts();
    return allResorts.find(resort => {
      // Generate slug from resort name
      const resortSlug = resort.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      return resortSlug === slug;
    });
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
      // Use a safe SQL query with only columns known to exist in the database
      const result = await db.execute(
        sql`SELECT id, listing_id, adventure_id, start_date, end_date, user_id, 
        form_data, points_earned, payment_intent_id, status 
        FROM bookings ORDER BY id DESC`
      );

      return result.map(row => {
        // Extract form data safely
        const formData = row.form_data || {};

        return {
          id: row.id,
          bookingType: (formData.bookingType || "resort") as any,
          startDate: new Date(row.start_date),
          endDate: new Date(row.end_date),
          listingId: row.listing_id,
          adventureId: row.adventure_id,
          userId: row.user_id,
          formData: formData,
          pointsEarned: row.points_earned,
          paymentIntentId: row.payment_intent_id,
          status: row.status,

          // Extract data from form_data or use defaults
          firstName: formData.firstName || "Guest",
          lastName: formData.lastName || "",
          email: formData.email || "guest@example.com",
          phone: formData.phone || null,
          source: "website",
          guests: formData.guests || 2,

          // Set defaults for schema compatibility
          createdAt: null,
          updatedAt: null,
          formName: null,
          notes: null,
          ipAddress: null,
          userAgent: null,
          referrer: null,
          tags: null,
          utmSource: null,
          utmMedium: null,
          utmCampaign: null,
          totalAmount: null,
          specialRequests: null
        };
      });
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

  async getBookingByPaymentIntentId(paymentIntentId: string): Promise<Booking | undefined> {
    try {
      // Use raw query since we added the column without full Drizzle schema support
      const result = await db.execute(
        `SELECT * FROM bookings WHERE payment_intent_id = $1 LIMIT 1`,
        [paymentIntentId]
      );

      if (result.rows.length === 0) {
        return undefined;
      }

      return result.rows[0] as Booking;
    } catch (error) {
      console.error("Error fetching booking by payment intent ID:", error);
      return undefined;
    }
  }

  async updateBookingStatus(bookingId: number, status: string): Promise<Booking> {
    try {
      // Use raw query since we have schema inconsistencies
      await db.execute(
        `UPDATE bookings SET status = $1, updated_at = $2 WHERE id = $3`,
        [status, new Date(), bookingId]
      );

      // Fetch the updated booking
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));

      if (!booking) {
        throw new Error(`Booking with ID ${bookingId} not found after update`);
      }

      // Send to webhook
      try {
        await retryFailedSync(syncBookingToAirtable, booking);
      } catch (error) {
        console.error("Failed to sync updated booking to Airtable:", error);
        // Don't throw error here - we still want to return the booking
      }

      return booking;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw new Error(`Failed to update booking status to ${status}`);
    }
  }

  // Blog post management
  async createBlogPost(blogPost: any): Promise<any> {
    try {
      console.log("Creating blog post:", blogPost.title);

      // Insert into database
      const [newBlogPost] = await db.insert(blogPosts).values({
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        excerpt: blogPost.excerpt || (blogPost.content.length > 150 ? blogPost.content.substring(0, 150) + '...' : blogPost.content),
        imageUrl: blogPost.imageUrl || null,
        author: blogPost.author || 'Cabo Team',
        pubDate: blogPost.pubDate ? new Date(blogPost.pubDate) : new Date(),
        categories: Array.isArray(blogPost.categories) ? blogPost.categories : [],
        tags: Array.isArray(blogPost.tags) ? blogPost.tags : [],
        status: blogPost.status || 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log(`Blog post created successfully: ${newBlogPost.slug}`);
      return newBlogPost;
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
  }

  async getBlogPostBySlug(slug: string): Promise<any> {
    try {
      const [blogPost] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return blogPost;
    } catch (error: any) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }
  }

  async getBlogPosts(limit = 10, category?: string): Promise<any[]> {
    try {
      // If category is provided, filter by it
      if (category) {
        // For jsonb array contains query, use raw SQL
        const result = await db.execute(
          `SELECT * FROM blog_posts 
           WHERE categories @> $1::jsonb
           ORDER BY pub_date DESC 
           LIMIT $2`,
          [JSON.stringify([category]), limit]
        );
        return result.rows;
      } else {
        // Otherwise just return the latest posts
        const posts = await db.select()
          .from(blogPosts)
          .orderBy(blogPosts.pubDate)
          .limit(limit);
        return posts;
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return []; // Return empty array instead of throwing
    }
  }

  // Adventure Management
  async getAdventures(category?: string, includeHidden = false): Promise<Adventure[]> {
    try {
      let query = db.select().from(adventures);
      if (category) {
        query = query.where(eq(adventures.category, category));
      }
      if (!includeHidden) {
        query = query.where(eq(adventures.hidden, false));
      }
      const results = await query;

      // Format ratings to show only one decimal place
      return results.map(adventure => {
        if (adventure.rating) {
          // Convert to number, round to 1 decimal place, and convert back to string
          adventure.rating = Number(Number(adventure.rating).toFixed(1));
        }
        return adventure;
      });
    } catch (error) {
      console.error('Error fetching adventures:', error);
      return [];
    }
  }

  async getAdventure(id: number): Promise<Adventure | undefined> {
    try {
      const [adventure] = await db.select().from(adventures).where(eq(adventures.id, id));
      if (adventure && adventure.rating) {
        // Format rating to one decimal place
        adventure.rating = Number(Number(adventure.rating).toFixed(1));
      }
      return adventure;
    } catch (error) {
      console.error(`Error fetching adventure with ID ${id}:`, error);
      return undefined;
    }
  }

  async getAdventureBySlug(slug: string): Promise<Adventure | undefined> {
    try {
      const [adventure] = await db.select().from(adventures).where(eq(adventures.slug, slug));
      if (adventure && adventure.rating) {
        // Format rating to one decimal place
        adventure.rating = Number(Number(adventure.rating).toFixed(1));
      }
      return adventure;
    } catch (error) {
      console.error(`Error fetching adventure with slug ${slug}:`, error);
      return undefined;
    }
  }

  async createAdventure(adventure: InsertAdventure): Promise<Adventure> {
    try {
      // Generate a slug from the title if not provided
      if (!adventure.slug) {
        adventure.slug = adventure.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
      }

      // Format rating to one decimal place if provided
      if (adventure.rating) {
        adventure.rating = Number(Number(adventure.rating).toFixed(1));
      }

      const [newAdventure] = await db.insert(adventures).values(adventure).returning();
      return newAdventure;
    } catch (error) {
      console.error('Error creating adventure:', error);
      throw new Error('Failed to create adventure');
    }
  }

  async updateAdventure(id: number, adventure: Partial<Adventure>): Promise<Adventure> {
    try {
      // Get current adventure to check for conflicts
      const currentAdventure = await this.getAdventure(id);
      if (!currentAdventure) {
        throw new Error('Adventure not found');
      }

      // Create a clean adventure object for the update
      const adventureToUpdate: Partial<Adventure> = {...adventure};

      // Remove or fix date/timestamp fields to prevent errors
      if (adventureToUpdate.createdAt && !(adventureToUpdate.createdAt instanceof Date)) {
        delete adventureToUpdate.createdAt;
      }

      if (adventureToUpdate.updatedAt && !(adventureToUpdate.updatedAt instanceof Date)) {
        delete adventureToUpdate.updatedAt;
      }

      // Set updatedAt to current timestamp
      adventureToUpdate.updatedAt = new Date();

      // Generate a slug from the title if title is updated and slug is not provided
      if (adventureToUpdate.title && !adventureToUpdate.slug) {
        let baseSlug = adventureToUpdate.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');

        // If slug is being changed, check for potential conflicts
        if (baseSlug !== currentAdventure.slug) {
          // If the slug we're trying to use already exists, keep the original slug
          // or create a unique one by adding a timestamp
          try {
            // Check if another adventure already has this slug
            // (excluding the current adventure)
            const existingSlugs = await db
              .select({ slug: adventures.slug })
              .from(adventures)
              .where(and(
                eq(adventures.slug, baseSlug),
                ne(adventures.id, id)
              ));

            if (existingSlugs.length > 0) {
              // If slug already exists, keep current slug or add timestamp
              if (currentAdventure.slug) {
                adventureToUpdate.slug = currentAdventure.slug;
              } else {
                // Add timestamp to make it unique
                adventureToUpdate.slug = `${baseSlug}-${Date.now()}`;
              }
            } else {
              adventureToUpdate.slug = baseSlug;
            }
          } catch (error) {
            // If there's an error checking, keep the existing slug
            console.log('Error checking slug, keeping current one:', error);
            adventureToUpdate.slug = currentAdventure.slug;
          }
        } else {
          // Keep the same slug if title hasn't changed
          adventureToUpdate.slug = currentAdventure.slug;
        }
      }

      // Format rating to one decimal place if provided
      if (adventureToUpdate.rating) {
        adventureToUpdate.rating = Number(Number(adventureToUpdate.rating).toFixed(1));
      }

      const [updatedAdventure] = await db
        .update(adventures)
        .set(adventureToUpdate)
        .where(eq(adventures.id, id))
        .returning();

      return updatedAdventure;
    } catch (error) {
      console.error(`Error updating adventure with ID ${id}:`, error);
      throw new Error('Failed to update adventure');
    }
  }

  async deleteAdventure(id: number): Promise<boolean> {
    try {
      const result = await db.delete(adventures).where(eq(adventures.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting adventure with ID ${id}:`, error);
      return false;
    }
  }

  // Restaurant related methods
  async getRestaurants(category?: string): Promise<Restaurant[]> {
    try {
      if (category) {
        // Filter by category if provided
        return db.select().from(restaurants).where(eq(restaurants.category, category));
      }
      returndb.select().from(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    try {
      const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
      return restaurant;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      return undefined;
    }
  }

  async getRestaurantByName(name: string): Promise<Restaurant | undefined> {
    try {
      const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.name, name));
      return restaurant;
    } catch (error) {
      console.error(`Error fetching restaurant with name "${name}":`, error);
      return undefined;
    }
  }

  async getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
    // We don't have a slug field in the restaurants table, so we'll generate slugs on the fly
    const allRestaurants = await this.getRestaurants();

    // Find the restaurant by matching the slug with the generated slug of each restaurant
    return allRestaurants.find(restaurant => {
      const restaurantSlug = this.generateResortSlug(restaurant.name);
      return restaurantSlug === slug;
    });
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    try {
      console.log("Creating new restaurant:", restaurant);

      // Set default values for optional fields if not provided
      const restaurantWithDefaults = {
        ...restaurant,
        imageUrls: restaurant.imageUrls || [],
        features: restaurant.features || [],
        tags: restaurant.tags || [],
        reviews: restaurant.reviews || [],
        featured: restaurant.featured !== undefined ? restaurant.featured : false
      };

      const [newRestaurant] = await db.insert(restaurants)
        .values(restaurantWithDefaults)
        .returning();

      console.log("Restaurant created successfully:", newRestaurant);
      return newRestaurant;
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw new Error("Failed to create restaurant");
    }
  }

  async updateRestaurant(id: number, restaurant: Partial<Restaurant>): Promise<Restaurant> {
    try {
      console.log("Updating restaurant with ID:", id, "with data:", JSON.stringify(restaurant));

      // Add the updatedAt field
      const updatedData = {
        ...restaurant,
        updatedAt: new Date()
      };

      const [updatedRestaurant] = await db.update(restaurants)
        .set(updatedData)
        .where(eq(restaurants.id, id))
        .returning();

      console.log("Restaurant updated successfully:", updatedRestaurant);
      return updatedRestaurant;
    } catch (error) {
      console.error("Error updating restaurant:", error);
      throw new Error("Failed to update restaurant");
    }
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    try {
      const result = await db.delete(restaurants)
        .where(eq(restaurants.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      return false;
    }
  }

  // Recent data retrieval for admin notification
  async getRecentLeads(limit: number): Promise<Lead[]> {
    try {
      // Get the most recent leads, sorted by creation date (descending)
      const recentLeads = await db
        .select()
        .from(leads)
        .orderBy(leads.createdAt, 'desc')
        .limit(limit);

      return recentLeads;
    } catch (error) {
      console.error("Error retrieving recent leads:", error);
      return [];
    }
  }

  async getRecentBookings(limit: number): Promise<Booking[]> {
    try {
      // Get the most recent bookings, sorted by creation date (descending)
      const recentBookings = await db
        .select()
        .from(bookings)
        .orderBy(bookings.createdAt, 'desc')
        .limit(limit);

      return recentBookings;
    } catch (error) {
      console.error("Error retrieving recent bookings:", error);
      return [];
    }
  }

  async getRecentGuideSubmissions(limit: number): Promise<any[]> {
    try {
      // Get the most recent guide submissions, sorted by creation date (descending)
      const recentGuideSubmissions = await db
        .select()
        .from(guideSubmissions)
        .orderBy(guideSubmissions.createdAt, 'desc')
        .limit(limit);

      return recentGuideSubmissions;
    } catch (error) {
      console.error("Error retrieving recent guide submissions:", error);
      return [];
    }
  }

  // Analytics methods
  async getLeadAnalytics(): Promise<any> {
    try {
      // Get leads by type
      const leads = await this.getAllLeads();

      const leadsByType = {
        villa: leads.filter(l => l.interestType === 'villa').length,
        resort: leads.filter(l => l.interestType === 'resort').length,
        adventure: leads.filter(l => l.interestType === 'adventure').length,
        wedding: leads.filter(l => l.interestType === 'wedding').length,
        group_trip: leads.filter(l => l.interestType === 'group_trip').length,
        influencer: leads.filter(l => l.interestType === 'influencer').length,
        concierge: leads.filter(l => l.interestType === 'concierge').length,
      };

      // Get leads by month (last 12 months)
      const now = new Date();
      const monthLabels = [];
      const leadsByMonth = [];

      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthLabels.push(monthName);

        const monthLeads = leads.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          return leadDate.getMonth() === month.getMonth() && 
                 leadDate.getFullYear() === month.getFullYear();
        }).length;

        leadsByMonth.push(monthLeads);
      }

      return {
        total: leads.length,
        byType: leadsByType,
        byStatus: {
          new: leads.filter(l => l.status === 'new').length,
          contacted: leads.filter(l => l.status === 'contacted').length,
          qualified: leads.filter(l => l.status === 'qualified').length,
          converted: leads.filter(l => l.status === 'converted').length,
          closed: leads.filter(l => l.status === 'closed').length,
        },
        timeSeries: {
          labels: monthLabels,
          data: leadsByMonth
        }
      };
    } catch (error) {
      console.error("Error getting lead analytics:", error);
      return {
        total: 0,
        byType: {},
        byStatus: {},
        timeSeries: { labels: [], data: [] }
      };
    }
  }

  async getGuideAnalytics(): Promise<any> {
    try {
      // Get guide submissions
      const guides = await this.getGuideSubmissions();

      // Get guides by month (last 12 months)
      const now = new Date();
      const monthLabels = [];
      const guidesByMonth = [];

      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthLabels.push(monthName);

        const monthGuides = guides.filter(guide => {
          const guideDate = new Date(guide.createdAt);
          return guideDate.getMonth() === month.getMonth() && 
                 guideDate.getFullYear() === month.getFullYear();
        }).length;

        guidesByMonth.push(monthGuides);
      }

      // Get guides by type
      const guidesByType = {};
      guides.forEach(guide => {
        const type = guide.guideType || 'Ultimate Cabo Guide';
        guidesByType[type] = (guidesByType[type] || 0) + 1;
      });

      return {
        total: guides.length,
        byType: guidesByType,
        byStatus: {
          pending: guides.filter(g => g.status === 'pending').length,
          sent: guides.filter(g => g.status === 'sent').length,
          failed: guides.filter(g => g.status === 'failed').length,
        },
        timeSeries: {
          labels: monthLabels,
          data: guidesByMonth
        }
      };
    } catch (error) {
      console.error("Error getting guide analytics:", error);
      return {
        total: 0,
        byType: {},
        byStatus: {},
        timeSeries: { labels: [], data: [] }
      };
    }
  }

  async getDashboardAnalytics(): Promise<any> {
    try {
      console.time('getDashboardAnalytics');

      // Get all data for dashboard
      // Limit the data for better performance - only get what's necessary for the dashboard
      const [leadsData, guidesData, listings, allRestaurants] = await Promise.all([
        this.getLeadAnalytics(),
        this.getGuideAnalytics(),
        this.getListings(),
        this.getRestaurants()
      ]);

      console.timeLog('getDashboardAnalytics', 'Got analytics data');

      // Listing/booking counts by type
      const listingsByType = {
        villa: listings.filter(l => l.type === 'villa').length,
        resort: listings.filter(l => l.type === 'resort').length,
        adventure: listings.filter(l => l.type === 'adventure').length,
        restaurant: listings.filter(l => l.type === 'restaurant').length,
        hotel: listings.filter(l => l.type === 'hotel').length,
      };

      // Get recent leads and recent guide downloads - optimized to only fetch what we need
      console.timeLog('getDashboardAnalytics', 'Starting to fetch recent data');

      // Function to get only the most recent records directly from the database
      const getRecentRecords = async (table, limit = 5) => {
        return await db.select().from(table).orderBy(desc(table.createdAt)).limit(limit);
      };

      // Fetch recent data in parallel
      const [recentLeads, recentGuides] = await Promise.all([
        getRecentRecords(leads, 5),
        getRecentRecords(guideSubmissions, 5)
      ]);

      console.timeLog('getDashboardAnalytics', 'Finished fetching recent data');

      // Restaurant analytics
      const restaurantsByCategory = {};
      allRestaurants.forEach(restaurant => {
        const category = restaurant.category;
        restaurantsByCategory[category] = (restaurantsByCategory[category] || 0) + 1;
      });

      return {
        leads: leadsData,
        guides: guidesData,
        listings: {
          total: listings.length,
          byType: listingsByType
        },
        restaurants: {
          total: allRestaurants.length,
          featured: allRestaurants.filter(r => r.featured).length,
          byCategory: restaurantsByCategory
        },
        recent: {
          leads: recentLeads,
          guides: recentGuides
        }
      };
    } catch (error) {
      console.error("Error getting dashboard analytics:", error);
      return {
        leads: { total: 0 },
        guides: { total: 0 },
        listings: { total: 0 },
        restaurants: { total: 0, featured: 0, byCategory: {} },
        recent: { leads: [], guides: [] }
      };
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