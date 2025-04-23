import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema, insertLeadSchema, insertGuideSubmissionSchema, insertListingSchema } from "@shared/schema";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";
import passport from "passport";
import { 
  sendLeadWebhook, 
  sendBookingWebhook, 
  sendGuideRequestWebhook 
} from './services/webhookClient';

import { registerStripeRoutes } from './routes/stripe';
import itineraryRoutes from './routes/itinerary';

export async function registerRoutes(app: Express): Promise<Server> {
  // Register Stripe routes for direct bookings
  registerStripeRoutes(app);
  
  // Register itinerary routes
  app.use('/api', itineraryRoutes);
  // Webhook check endpoint
  app.get("/api/guides/check-webhook", (req, res) => {
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    const viteWebhookUrl = process.env.VITE_MAKE_WEBHOOK_URL;
    
    res.json({
      webhookConfigured: !!makeWebhookUrl,
      webhookUrl: makeWebhookUrl ? makeWebhookUrl.substring(0, 20) + "..." : "Not set",
      clientWebhookConfigured: !!viteWebhookUrl,
      status: makeWebhookUrl ? "ready" : "not configured"
    });
  });
  setupAuth(app);

  // Add guide submission endpoint with Airtable integration and email sending
  app.post("/api/guide-submissions", async (req, res) => {
    try {
      console.log("Guide submission received:", req.body);
      // Create a direct schema without using drizzle-zod to avoid validation conflicts
      const directGuideSubmissionSchema = z.object({
        firstName: z.string(),
        lastName: z.string().optional().nullable(),
        email: z.string().email(),
        phone: z.string().optional().nullable(),
        guideType: z.string(),
        source: z.string(),
        status: z.string(),
        formName: z.string(),
        submissionId: z.string(),
        interestAreas: z.string().optional(),
        tags: z.string().optional(),
        formData: z.record(z.any()).optional()
      });
      
      // Validate request body
      const submissionData = directGuideSubmissionSchema.safeParse({
        ...req.body,
        submissionId: req.body.submissionId || req.body.submission_id || nanoid(),
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
      
      // Send webhook notification (non-blocking)
      sendGuideRequestWebhook(submission)
        .then(result => {
          if (result.status === 'success') {
            console.log(`Guide request webhook sent. Tracking ID: ${result.tracking_id}`);
          } else {
            console.warn(`Guide request webhook warning: ${result.message}`);
          }
        })
        .catch(error => {
          console.error("Error sending guide request webhook:", error);
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
      
      // Send webhook notification (non-blocking)
      sendBookingWebhook(booking)
        .then(result => {
          if (result.status === 'success') {
            console.log(`Booking webhook sent. Tracking ID: ${result.tracking_id}`);
          } else {
            console.warn(`Booking webhook warning: ${result.message}`);
          }
        })
        .catch(error => {
          console.error("Error sending booking webhook:", error);
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
      
      // Send webhook notification (non-blocking)
      sendLeadWebhook(lead)
        .then(result => {
          if (result.status === 'success') {
            console.log(`Lead webhook sent. Tracking ID: ${result.tracking_id}`);
          } else {
            console.warn(`Lead webhook warning: ${result.message}`);
          }
        })
        .catch(error => {
          console.error("Error sending lead webhook:", error);
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
  
  // Admin routes for webhook management
  app.get("/api/admin/webhooks", requireAdmin, async (req, res) => {
    try {
      const { listWebhooks } = await import('./services/webhookClient');
      const webhooks = await listWebhooks();
      res.json(webhooks);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      res.status(500).json({ message: "Failed to fetch webhooks" });
    }
  });
  
  app.post("/api/admin/webhooks", requireAdmin, async (req, res) => {
    try {
      const { setupWebhook } = await import('./services/webhookClient');
      const webhook = await setupWebhook(req.body);
      res.status(201).json(webhook);
    } catch (error) {
      console.error("Error creating webhook:", error);
      res.status(500).json({ message: "Failed to create webhook" });
    }
  });
  
  app.get("/api/admin/webhook-deliveries", requireAdmin, async (req, res) => {
    try {
      const { listWebhookDeliveries } = await import('./services/webhookClient');
      const deliveries = await listWebhookDeliveries({
        limit: parseInt(req.query.limit as string) || 100,
        event_type: req.query.event_type as string,
        webhook_id: req.query.webhook_id ? parseInt(req.query.webhook_id as string) : undefined,
        success: req.query.success === 'true'
      });
      res.json(deliveries);
    } catch (error) {
      console.error("Error fetching webhook deliveries:", error);
      res.status(500).json({ message: "Failed to fetch webhook deliveries" });
    }
  });
  
  app.post("/api/admin/webhook-retry/:id", requireAdmin, async (req, res) => {
    try {
      const { retryWebhook } = await import('./services/webhookClient');
      const result = await retryWebhook(parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      console.error("Error retrying webhook:", error);
      res.status(500).json({ message: "Failed to retry webhook" });
    }
  });
  
  // Autoblogger webhook endpoint
  app.post("/api/webhooks/autoblogger", async (req, res) => {
    try {
      const { title, content, excerpt, slug, image_url, category, tags, publish } = req.body;
      
      // Basic validation
      if (!title || !content) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          details: "Title and content are required" 
        });
      }
      
      // Check for webhook signature
      const signature = req.headers['x-webhook-signature'];
      const webhookSecret = process.env.WEBHOOK_SECRET || "41d203af-5210-4f49-a1b6-865d15fca215";
      
      if (!signature || signature !== webhookSecret) {
        return res.status(401).json({ 
          message: "Unauthorized", 
          details: "Invalid or missing webhook signature" 
        });
      }
      
      console.log(`Autoblogger webhook received for post: ${title}`);
      
      // Generate slug if not provided
      const finalSlug = slug || generateSlug(title);
      
      // Store the blog post
      const blogPost = await storage.createBlogPost({
        title,
        content,
        excerpt: excerpt || (content.length > 150 ? content.substring(0, 150) + '...' : content),
        slug: finalSlug,
        imageUrl: image_url || null,
        author: 'Cabo Team',
        categories: category ? [category] : ["travel"],
        tags: tags || [],
        status: publish ? 'published' : 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Autoblogger post successfully created: ${blogPost.slug}`);
      
      res.status(201).json({ 
        status: "success",
        message: "Blog post created successfully", 
        post_id: blogPost.id,
        post_slug: blogPost.slug
      });
    } catch (error) {
      console.error("Error processing autoblogger webhook:", error);
      res.status(500).json({ 
        status: "error",
        message: "Failed to process blog post", 
        details: error.message 
      });
    }
  });
  
  // Blog auto-sync webhook endpoint
  app.post("/api/blog/webhook", async (req, res) => {
    try {
      const { title, content, excerpt, featuredImage, author, slug, categories, tags, pubDate } = req.body;
      
      // Basic validation
      if (!title || !content || !slug) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          details: "Title, content, and slug are required" 
        });
      }
      
      // Check for API key for authentication
      const apiKey = req.headers['x-api-key'];
      const configuredApiKey = process.env.BLOG_WEBHOOK_API_KEY;
      
      if (!apiKey || apiKey !== configuredApiKey) {
        return res.status(401).json({ 
          message: "Unauthorized", 
          details: "Invalid or missing API key" 
        });
      }
      
      console.log(`Blog webhook received for post: ${title} (${slug})`);
      
      // Store the blog post
      const blogPost = await storage.createBlogPost({
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        slug,
        imageUrl: featuredImage || null,
        author: author || 'Cabo Team',
        pubDate: pubDate ? new Date(pubDate) : new Date(),
        categories: categories || [],
        tags: tags || [],
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Blog post successfully created: ${blogPost.slug}`);
      
      res.status(201).json({ 
        message: "Blog post created successfully", 
        postId: blogPost.id,
        slug: blogPost.slug
      });
    } catch (error) {
      console.error("Error processing blog webhook:", error);
      res.status(500).json({ 
        message: "Failed to process blog post", 
        details: error.message 
      });
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