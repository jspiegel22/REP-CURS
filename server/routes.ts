import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema } from "@shared/schema";
import { generateSlug } from "@/lib/utils";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Add villa routes
  app.get("/api/villas", async (req, res) => {
    try {
      const villas = await storage.getVillas();
      res.json(villas);
    } catch (error) {
      console.error("Error fetching villas:", error);
      res.status(500).json({ message: "Failed to fetch villas" });
    }
  });

  app.get("/api/villas/:trackHsId", async (req, res) => {
    try {
      const villa = await storage.getVillaByTrackHsId(req.params.trackHsId);
      if (!villa) {
        return res.status(404).json({ message: "Villa not found" });
      }
      res.json(villa);
    } catch (error) {
      console.error("Error fetching villa:", error);
      res.status(500).json({ message: "Failed to fetch villa" });
    }
  });

  // Villa-specific booking endpoint
  app.post("/api/villa-bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Please log in to make a booking" });
      }

      // Validate request body
      const bookingData = insertBookingSchema.safeParse(req.body);
      if (!bookingData.success) {
        return res.status(400).json({ 
          message: "Invalid booking data",
          errors: bookingData.error.errors 
        });
      }

      try {
        // Create booking in our database
        const booking = await storage.createBooking({
          ...bookingData.data,
          userId: req.user.id,
          status: "pending",
          pointsEarned: 100 // Default points for villa bookings
        });

        // Create Airtable record for villa owner
        const airtableRecord = {
          fields: {
            Name: req.user.username,
            Email: bookingData.data.contactEmail,
            Phone: bookingData.data.contactPhone,
            "Check In": bookingData.data.startDate,
            "Check Out": bookingData.data.endDate,
            "Number of Guests": bookingData.data.guests,
            "Special Requests": bookingData.data.specialRequests || "",
            Status: "Pending",
          }
        };

        // Send to Make webhook for processing
        const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
        if (!makeWebhookUrl) {
          throw new Error("Make webhook URL not configured");
        }

        await fetch(makeWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(airtableRecord)
        });

        res.status(201).json(booking);
      } catch (error) {
        console.error("Error in villa booking process:", error);
        throw error;
      }
    } catch (error) {
      console.error("Villa booking error:", error);
      res.status(500).json({ message: "Failed to create villa booking" });
    }
  });

  // Booking endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Please log in to make a booking" });
      }

      // Validate request body
      const bookingData = insertBookingSchema.safeParse(req.body);
      if (!bookingData.success) {
        return res.status(400).json({ 
          message: "Invalid booking data",
          errors: bookingData.error.errors 
        });
      }

      // Create booking
      const booking = await storage.createBooking({
        ...bookingData.data,
        userId: req.user.id,
        status: "pending"
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get user's bookings
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Please log in to view bookings" });
    }

    try {
      const bookings = await storage.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Weather endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const location = "cabo-san-lucas";
      let weather = await storage.getWeatherCache(location);

      if (!weather || Date.now() - new Date(weather.updatedAt).getTime() > 1800000) {
        // Mock weather data - in production this would come from a weather API
        const mockWeather = {
          temperature: 28,
          condition: "sunny" as const,
        };

        weather = await storage.cacheWeather(location, mockWeather);
      }

      res.json(weather.data);
    } catch (error) {
      console.error("Weather fetch error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Listings endpoints
  app.get("/api/listings", async (req, res) => {
    const type = req.query.type as string | undefined;
    const listings = await storage.getListings(type);
    res.json(listings);
  });

  app.get("/api/listings/:id", async (req, res) => {
    const listing = await storage.getListing(parseInt(req.params.id));
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  });

  app.post("/api/listings", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "partner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = insertListingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid listing data" });
    }

    const listing = await storage.createListing({
      ...result.data,
      partnerId: req.user.id,
    });
    res.status(201).json(listing);
  });


  // Social Share endpoint
  app.post("/api/social-share", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { listingId, platform } = req.body;
    try {
      const share = await storage.createSocialShare({
        userId: req.user.id,
        listingId,
        platform,
      });

      // Award points for sharing
      const updatedUser = await storage.addUserPoints(req.user.id, share.pointsEarned);

      res.status(201).json({ share, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to record share" });
    }
  });

  // Resorts endpoint (from original code)
  app.get("/api/resorts/:slug", async (req, res) => {
    try {
      const resorts = await storage.getResorts();
      const resort = resorts.find(
        r => generateSlug(r.name) === req.params.slug
      );

      if (!resort) {
        return res.status(404).json({ message: "Resort not found" });
      }

      res.json(resort);
    } catch (error) {
      console.error("Error fetching resort:", error);
      res.status(500).json({ message: "Failed to fetch resort" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}