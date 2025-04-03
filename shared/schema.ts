import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing tables remain unchanged
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "partner", "traveler"] }).notNull().default("traveler"),
  points: integer("points").default(0),
  level: integer("level").default(1),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["resort", "hotel", "villa", "adventure", "restaurant"] }).notNull(),
  imageUrl: text("image_url").notNull(),
  price: integer("price"),
  location: text("location").notNull(),
  bookingType: text("booking_type", { enum: ["direct", "form"] }).notNull(),
  partnerId: integer("partner_id").references(() => users.id),
});

// Add new resorts table with updated fields
export const resorts = pgTable("resorts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: decimal("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  priceLevel: text("price_level").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  amenities: jsonb("amenities").notNull(),
  rooms: integer("rooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  isBeachfront: boolean("is_beachfront").default(false),
  isOceanfront: boolean("is_oceanfront").default(false),
  googleUrl: text("google_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Common fields for all submissions
const commonFields = {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredContactMethod: text("preferred_contact_method"),
  preferredContactTime: text("preferred_contact_time"),
  source: text("source").notNull(),
  status: text("status").notNull(),
  formName: text("form_name"),
  formData: jsonb("form_data"),
  notes: text("notes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  tags: text("tags").array(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

// Enhanced bookings table
export const bookings = pgTable("bookings", {
  ...commonFields,
  bookingType: text("booking_type", {
    enum: ["villa", "resort", "adventure", "restaurant", "event"]
  }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guests: integer("guests").notNull(),
  totalAmount: decimal("total_amount"),
  currency: text("currency").default("USD"),
  paymentStatus: text("payment_status").default("pending"),
  paymentMethod: text("payment_method"),
  specialRequests: text("special_requests"),
  budget: text("budget"),
  listingId: integer("listing_id").references(() => listings.id),
});

// Enhanced leads table
export const leads = pgTable("leads", {
  ...commonFields,
  interestType: text("interest_type", {
    enum: ["villa", "resort", "adventure", "wedding", "group_trip", "influencer", "concierge"]
  }).notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  priority: text("priority").default("normal"),
  assignedTo: text("assigned_to"),
});

// Enhanced guide submissions table
export const guideSubmissions = pgTable("guide_submissions", {
  ...commonFields,
  guideType: text("guide_type").notNull(),
  interestAreas: text("interest_areas").array(),
  travelDates: text("travel_dates"),
  numberOfTravelers: integer("number_of_travelers"),
  downloadLink: text("download_link"),
  processedAt: timestamp("processed_at"),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsRequired: integer("points_required").notNull(),
  type: text("type", { enum: ["discount", "freebie", "upgrade"] }).notNull(),
  value: decimal("value").notNull(),
  active: boolean("active").default(true),
});

export const socialShares = pgTable("social_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  listingId: integer("listing_id").references(() => listings.id),
  platform: text("platform", { enum: ["facebook", "twitter", "instagram", "whatsapp"] }).notNull(),
  sharedAt: timestamp("shared_at").defaultNow(),
  pointsEarned: integer("points_earned").default(10),
});

export const weatherCache = pgTable("weather_cache", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema for inserting new users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Add schema for inserting new resorts
export const insertResortSchema = createInsertSchema(resorts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update insert schema
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Other insert schemas
export const insertListingSchema = createInsertSchema(listings);
export const insertRewardSchema = createInsertSchema(rewards);
export const insertSocialShareSchema = createInsertSchema(socialShares);

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGuideSubmissionSchema = createInsertSchema(guideSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Resort = typeof resorts.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type SocialShare = typeof socialShares.$inferSelect;
export type WeatherCache = typeof weatherCache.$inferSelect;
export type InsertResort = z.infer<typeof insertResortSchema>;

// Add villas table definition after existing tables
export const villas = pgTable("villas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: jsonb("amenities").notNull().default([]),
  imageUrl: text("image_url").notNull(),
  imageUrls: jsonb("image_urls").notNull().default([]),
  pricePerNight: decimal("price_per_night").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  trackHsId: text("trackhs_id").unique(),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Add villa schema and types
export const insertVillaSchema = createInsertSchema(villas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Villa = typeof villas.$inferSelect;
export type InsertVilla = z.infer<typeof insertVillaSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

// Add this new table definition after the existing tables
export const guideFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  guideType: z.string().default("Ultimate Cabo Guide 2025"),
  source: z.string().default("website"),
  formName: z.string().default("guide_download"),
  status: z.enum(["pending", "sent", "failed"]).default("pending"),
});

export type GuideFormData = z.infer<typeof guideFormSchema>;