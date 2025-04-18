import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema, insertLeadSchema, insertGuideSubmissionSchema, insertListingSchema } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";
import passport from "passport";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Add guide submission endpoint with Airtable integration and email sending
  app.post("/api/guide-submissions", async (req, res) => {
    try {
      // Create a custom validator that extends the base schema but allows additional fields
      const extendedGuideSubmissionSchema = insertGuideSubmissionSchema.extend({
        // Add the new fields that we're collecting from the form
        lastName: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        preferredContactMethod: z.enum(["Email", "Phone", "Either"]).default("Email"),
        tags: z.array(z.string()).optional(),
        interestAreas: z.array(z.string()).optional(),
      });
      
      // Validate request body
      const submissionData = extendedGuideSubmissionSchema.safeParse({
        ...req.body,
        submissionId: req.body.submissionId || nanoid(),
        // No need to set createdAt and updatedAt as they have database defaults
      });

      if (!submissionData.success) {
        return res.status(400).json({ 
          message: "Invalid submission data",
          errors: submissionData.error.errors 
        });
      }

      // Create guide submission in database
      const submission = await storage.createGuideSubmission(submissionData.data);

      // Process the submission for Airtable & email (non-blocking)
      import('./services/guideSubmissions').then(({ processGuideSubmission }) => {
        processGuideSubmission(submission)
          .then(success => {
            if (success) {
              console.log(`Guide submission successfully processed for ${submission.email}`);
            } else {
              console.error(`Failed to process guide submission for ${submission.email}`);
            }
          })
          .catch(error => {
            console.error("Error in background processing:", error);
          });
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error("Guide submission error:", error);
      res.status(500).json({ message: "Failed to create guide submission" });
    }
  });

  // Booking endpoint with Airtable integration and email confirmation
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
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Send confirmation email and sync to Airtable (non-blocking)
      import('./services/airtable').then(({ syncBookingToAirtable, retryFailedSync }) => {
        retryFailedSync(syncBookingToAirtable, booking)
          .then(() => console.log(`Booking synced to Airtable for ${booking.email}`))
          .catch(error => console.error("Error syncing booking to Airtable:", error));
      });

      import('./services/emailService').then(({ sendEmail, createBookingConfirmationEmail }) => {
        const emailOptions = createBookingConfirmationEmail(booking);
        sendEmail(emailOptions)
          .then(success => {
            if (success) {
              console.log(`Booking confirmation email sent to ${booking.email}`);
            } else {
              console.error(`Failed to send booking confirmation email to ${booking.email}`);
            }
          })
          .catch(error => {
            console.error("Error sending booking confirmation email:", error);
          });
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Lead form submission endpoint with Airtable integration
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
        updatedAt: new Date()
      });

      console.log('Lead created successfully:', lead); // Debug log

      // Sync to Airtable (non-blocking)
      import('./services/airtable').then(({ syncLeadToAirtable, retryFailedSync }) => {
        retryFailedSync(syncLeadToAirtable, lead)
          .then(() => console.log(`Lead synced to Airtable for ${lead.email}`))
          .catch(error => console.error("Error syncing lead to Airtable:", error));
      });

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