import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema, insertLeadSchema, insertGuideSubmissionSchema, insertListingSchema } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";
import passport from "passport";
import { dualDb } from "./services/dual-db"; // Import our dual-database service

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Simplified guide submission endpoint without external service dependencies
  app.post("/api/guide-submissions", async (req, res) => {
    try {
      // Create a simpler validator with only essential fields
      const simpleGuideSubmissionSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional().nullable(),
        guideType: z.string().default("Ultimate Cabo Guide 2025"),
        source: z.string().default("website"),
        status: z.string().default("completed"), // Mark as completed by default
        formName: z.string().default("guide-download"),
        submissionId: z.string().optional(),
        tags: z.array(z.string()).optional(),
      });
      
      // Validate request body
      const submissionData = simpleGuideSubmissionSchema.safeParse({
        ...req.body,
        submissionId: req.body.submissionId || nanoid(),
      });

      if (!submissionData.success) {
        return res.status(400).json({ 
          message: "Invalid submission data",
          errors: submissionData.error.errors 
        });
      }

      // Add empty values for fields that are in the DB schema but not in form
      const fullSubmissionData = {
        ...submissionData.data,
        lastName: null,
        preferredContactMethod: "Email",
        interestAreas: ["Travel Guide"],
        downloadLink: "/guides/ultimate-cabo-guide-2025.pdf", // Static guide link
        processedAt: new Date(), // Mark as processed now
      };

      // Create guide submission in database using the dual-database service
      // This will save to both Supabase and Airtable
      const submission = await dualDb.submitGuideRequest(fullSubmissionData);
      
      // Log the submission for debugging
      console.log(`✅ Guide submission recorded for ${submission.email} with ID ${submission.submissionId}`);

      res.status(201).json({
        ...submission,
        // Additional info for the frontend if needed
        message: "Your guide is ready for download",
        downloadUrl: submission.downloadLink || "/guides/ultimate-cabo-guide-2025.pdf"
      });
    } catch (error) {
      console.error("Guide submission error:", error);
      res.status(500).json({ message: "Failed to create guide submission" });
    }
  });

  // Simplified booking endpoint without external service dependencies
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

      // Add booking metadata
      const bookingWithMeta = {
        ...bookingData.data,
        status: "confirmed", // Set as confirmed immediately
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmationCode: `CABO-${Math.floor(100000 + Math.random() * 900000)}` // Generate a confirmation code
      };

      // Create booking in database using the dual-database service
      // This will save to both Supabase and Airtable
      const booking = await dualDb.submitBooking(bookingWithMeta);

      // Log successful booking
      console.log(`✅ Booking created for ${booking.email}, confirmation: ${booking.confirmationCode}`);
      
      res.status(201).json({
        ...booking,
        message: "Your booking has been confirmed.",
        details: {
          confirmationNumber: booking.confirmationCode,
          confirmedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Simplified lead form submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      // Validate request body
      const leadData = insertLeadSchema.safeParse(req.body);
      if (!leadData.success) {
        console.log('Lead validation failed:', leadData.error.errors);
        return res.status(400).json({ 
          message: "Invalid lead data",
          errors: leadData.error.errors 
        });
      }

      // Add lead metadata
      const leadWithMeta = {
        ...leadData.data,
        status: "received", // Mark as received immediately
        createdAt: new Date(),
        updatedAt: new Date(),
        trackingId: `LEAD-${Date.now().toString().slice(-6)}` // Generate a tracking ID
      };

      // Create lead in database using the dual-database service
      // This will save to both Supabase and Airtable
      const lead = await dualDb.submitLead(leadWithMeta);

      // Log successful lead creation
      console.log(`✅ Lead created for ${lead.email}, tracking ID: ${lead.trackingId}`);
      
      res.status(201).json({
        ...lead,
        message: "Thank you! Your inquiry has been received.",
        details: {
          trackingId: lead.trackingId,
          receivedAt: new Date().toISOString()
        }
      });
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
        listingId: listingId || null,
        platform: platform || "facebook",
        sharedAt: new Date(),
        pointsEarned: 10
      });

      // Award points for sharing
      const updatedUser = await storage.addUserPoints(req.user.id, share.pointsEarned || 10);

      res.status(201).json({ share, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to record share" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    if (req.user?.role !== "admin") {
      req.logout((err) => {
        if (err) console.error("Logout error:", err);
      });
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // Protected admin routes
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };

  app.get("/api/admin/guide-submissions", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getGuideSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching guide submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Create admin user if it doesn't exist
  const { hashPassword } = await import("./auth");
  storage.getUserByUsername("jefe").then(async (user) => {
    if (!user) {
      try {
        await storage.createUser({
          username: "jefe",
          password: await hashPassword("cryptoboy"),
          email: "admin@cabo.is",
          role: "admin"
          // created_at and updated_at will be set by database defaults
        });
        console.log("Admin user created successfully");
      } catch (error) {
        console.error("Error creating admin user:", error);
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}