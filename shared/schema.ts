import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  listingId: integer("listing_id").references(() => listings.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
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
  value: decimal("value").notNull(), // Percentage or fixed amount
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

// Other insert schemas
export const insertListingSchema = createInsertSchema(listings);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertRewardSchema = createInsertSchema(rewards);
export const insertSocialShareSchema = createInsertSchema(socialShares);

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type SocialShare = typeof socialShares.$inferSelect;
export type WeatherCache = typeof weatherCache.$inferSelect;