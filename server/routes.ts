import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema, insertLeadSchema, insertGuideSubmissionSchema } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Add guide submission endpoint
  app.post("/api/guide-submissions", async (req, res) => {
    try {
      // Validate request body
      const submissionData = insertGuideSubmissionSchema.safeParse({
        ...req.body,
        submissionId: nanoid(),
      });

      if (!submissionData.success) {
        return res.status(400).json({ 
          message: "Invalid submission data",
          errors: submissionData.error.errors 
        });
      }

      // Create guide submission
      const submission = await storage.createGuideSubmission(submissionData.data);

      res.status(201).json(submission);
    } catch (error) {
      console.error("Guide submission error:", error);
      res.status(500).json({ message: "Failed to create guide submission" });
    }
  });

  // Booking endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
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
        status: "pending"
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Lead form submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      console.log('Received lead submission:', req.body); // Debug log

      // Validate request body
      const leadData = insertLeadSchema.safeParse(req.body);
      if (!leadData.success) {
        console.log('Lead validation failed:', leadData.error.errors); // Debug log
        return res.status(400).json({ 
          message: "Invalid lead data",
          errors: leadData.error.errors 
        });
      }

      // Create lead
      const lead = await storage.createLead({
        ...leadData.data,
        status: "new",
        createdAt: new Date(),
      });

      console.log('Lead created successfully:', lead); // Debug log

      res.status(201).json(lead);
    } catch (error) {
      console.error("Lead creation error:", error);
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  // Keep existing routes
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

  // Resorts endpoint
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

  const httpServer = createServer(app);
  return httpServer;
}