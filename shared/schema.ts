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

// Update the bookings table definition with proper relations and types
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  listingId: integer("listing_id").references(() => listings.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guests: integer("guests").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "cancelled"] }).notNull(),
  formData: jsonb("form_data"),
  pointsEarned: integer("points_earned"),
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
  pointsEarned: true,
}).extend({
  guests: z.string().transform(val => parseInt(val, 10)), // Transform string to number
});

// Other insert schemas
export const insertListingSchema = createInsertSchema(listings);
export const insertRewardSchema = createInsertSchema(rewards);
export const insertSocialShareSchema = createInsertSchema(socialShares);

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