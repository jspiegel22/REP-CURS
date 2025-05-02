import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
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

// Update resorts table to match actual database schema
export const resorts = pgTable("resorts", {
  id: serial("id").primaryKey(),
  hidden: boolean("hidden").default(false),
  name: text("name").notNull(),
  rating: decimal("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  priceLevel: text("price_level").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  amenities: jsonb("amenities").notNull(),
  googleUrl: text("google_url"),
  bookingsToday: integer("bookings_today"),
  category: text("category"),
  featured: boolean("featured"),
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
  // Removed preferred contact fields as requested
  source: text("source").notNull(),
  status: text("status").notNull(),
  formName: text("form_name"),
  formData: jsonb("form_data"),
  notes: text("notes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  tags: text("tags"),
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
  paymentIntentId: text("payment_intent_id"),
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

// Guide submissions table matching the actual database schema
export const guideSubmissions = pgTable("guide_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  guideType: text("guide_type").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull().default("pending"),
  formName: text("form_name").notNull(),
  submissionId: text("submission_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  interestAreas: text("interest_areas"),
  formData: jsonb("form_data"),
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

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  author: text("author").notNull().default("Cabo Team"),
  pubDate: timestamp("pub_date").notNull().defaultNow(),
  categories: jsonb("categories").default([]),
  tags: jsonb("tags").default([]),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow(),
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
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Create a base schema from the table definition
const baseLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Create a custom schema that overrides the tags field to be a string
export const insertLeadSchema = baseLeadSchema.extend({
  tags: z.string().optional(),
});

// Create a base schema from the table definition
const baseGuideSubmissionSchema = createInsertSchema(guideSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Create a custom schema that ensures interest_areas is a string
export const insertGuideSubmissionSchema = baseGuideSubmissionSchema.extend({
  interestAreas: z.string().optional(),
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
  hidden: boolean("hidden").default(false),
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
export type GuideSubmission = typeof guideSubmissions.$inferSelect;
export type InsertGuideSubmission = z.infer<typeof insertGuideSubmissionSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Add this new table definition after the existing tables
export const guideFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional().nullable(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  guide_type: z.string().default("Ultimate Cabo Guide 2025"),
  source: z.string().default("website"),
  form_name: z.string().default("guide_download"),
  status: z.enum(["pending", "sent", "failed"]).default("pending"),
  interest_areas: z.string().optional(),
  tags: z.string().optional(),
  form_data: z.record(z.any()).optional()
});

export type GuideFormData = z.infer<typeof guideFormSchema>;

// Image categories enum
export const ImageCategory = [
  "hero",
  "resort",
  "villa",
  "restaurant",
  "activity",
  "beach",
  "wedding",
  "yacht",
  "luxury",
  "family",
  "blog",
  "testimonial",
] as const;

// Images table with all SEO and reference information
export const siteImages = pgTable("site_images", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image_file: text("image_file").notNull().unique(),
  image_url: text("image_url").notNull(),
  alt_text: text("alt_text").notNull(),
  description: text("description"),
  width: integer("width"),
  height: integer("height"),
  category: text("category", { enum: ImageCategory }).notNull(),
  tags: jsonb("tags").$type<string[]>(),
  featured: boolean("featured").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Create schemas for the images table
export const insertSiteImageSchema = createInsertSchema(siteImages).omit({
  id: true,
  created_at: true, 
  updated_at: true,
});

// Export types
// Restaurants table with all necessary fields for restaurant info
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  cuisine: text("cuisine").notNull(), // Type of food (Mexican, Seafood, etc.)
  priceLevel: text("price_level").notNull(), // $, $$, $$$, $$$$
  rating: decimal("rating").notNull().default("4.0"),
  reviewCount: integer("review_count").notNull().default(0),
  openTable: text("open_table_url"), // OpenTable URL for reservations
  website: text("website_url"), // Restaurant website
  phone: text("phone"),
  openHours: jsonb("open_hours").$type<Record<string, string>>().default({}), // Store hours by day
  menuUrl: text("menu_url"), // Link to menu
  imageUrl: text("image_url").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  category: text("category", { 
    enum: ["seafood", "mexican", "italian", "steakhouse", "fusion", "american", "japanese", "vegan", "international"]
  }).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]), // Features like outdoor seating, view, etc.
  reviews: jsonb("reviews").$type<Array<{name: string, rating: number, comment: string, date: string}>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Adventures table for all Cabo experiences and activities (including yacht tours)
export const adventures = pgTable("adventures", {
  id: serial("id").primaryKey(),
  hidden: boolean("hidden").default(false),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  currentPrice: text("current_price").notNull(),
  originalPrice: text("original_price"),
  discount: text("discount"),
  duration: text("duration").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  minAge: text("min_age"),
  // Make provider optional for backward compatibility
  provider: text("provider"),
  // Add yacht category for yacht activities
  category: text("category", { enum: ["water", "land", "luxury", "family", "yacht"] }).notNull().default("water"),
  keyFeatures: jsonb("key_features").default([]),
  thingsToBring: jsonb("things_to_bring").default([]),
  topRecommended: boolean("top_recommended").default(false),
  rating: decimal("rating"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create schemas for the adventures table
export const insertAdventureSchema = createInsertSchema(adventures).omit({
  id: true,
  createdAt: true, 
  updatedAt: true,
});

// Create schema for the restaurants table
export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type SiteImage = typeof siteImages.$inferSelect;
export type InsertSiteImage = z.infer<typeof insertSiteImageSchema>;
export type Adventure = typeof adventures.$inferSelect;
export type InsertAdventure = z.infer<typeof insertAdventureSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;