import { IStorage } from "./types";
import { User, InsertUser, Listing, Booking } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private listings: Map<number, Listing>;
  private bookings: Map<number, Booking>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.bookings = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, role: "traveler" };
    this.users.set(id, user);
    return user;
  }

  async getListings(type?: string): Promise<Listing[]> {
    const listings = Array.from(this.listings.values());
    if (type) {
      return listings.filter(listing => listing.type === type);
    }
    return listings;
  }

  async getListing(id: number): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async createListing(listing: Omit<Listing, "id">): Promise<Listing> {
    const id = this.currentId++;
    const newListing = { ...listing, id };
    this.listings.set(id, newListing);
    return newListing;
  }

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const id = this.currentId++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }
}

export const storage = new MemStorage();
