import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema, insertLeadSchema, insertGuideSubmissionSchema, insertListingSchema, insertAdventureSchema, insertRestaurantSchema } from "@shared/schema";
// Use our own version of generateSlug since we need it server-side
// instead of importing from client utils
import { nanoid } from "nanoid";
import passport from "passport";
import { 
  sendLeadWebhook, 
  sendBookingWebhook, 
  sendGuideRequestWebhook 
} from './services/webhookClient';

import { registerStripeRoutes } from './routes/stripe';
import itineraryRoutes from './routes/itinerary';
import imageRoutes from './routes/image';
import { importRestaurantData } from './routes/import-restaurant-data';
import { registerImageOptimizationRoutes } from './routes/image-optimization';

export async function registerRoutes(app: Express): Promise<Server> {
  // Define admin middleware at the beginning
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
  
  // Cache control middleware for read-only public endpoints
  const publicCacheControl = (req: any, res: any, next: any) => {
    // Apply cache headers for GET requests to read-only endpoints
    // In production, set longer cache times 
    const isDev = process.env.NODE_ENV !== 'production';
    
    // Set cache header durations based on environment
    const maxAge = isDev ? 60 : 3600; // 1 minute in dev, 1 hour in production
    
    // Set cache-control header
    res.set('Cache-Control', `public, max-age=${maxAge}`);
    
    next();
  };
  
  // Cache control middleware for private/authenticated endpoints
  const privateCacheControl = (req: any, res: any, next: any) => {
    // Prevent caching for private/authenticated endpoints
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    next();
  };
  
  // Register Stripe routes for direct bookings
  registerStripeRoutes(app);
  
  // Register itinerary routes
  app.use('/api', itineraryRoutes);
  
  // Register image management routes
  app.use('/api/images', imageRoutes);
  
  // Register image optimization routes
  registerImageOptimizationRoutes(app);
  
  // Test endpoint for admin notification
  app.get("/api/test-admin-notification", requireAdmin, async (req, res) => {
    try {
      // Import the sendAdminNotification function
      const { sendAdminNotification } = await import('./services/activeCampaign');
      
      // Test HTML template
      const subject = 'Test Admin Notification';
      const body = `
        <h2>Test Email Notification</h2>
        <p>This is a test email to verify that HTML templates are working correctly.</p>
        
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          <h3 style="color: #2F4F4F; margin-top: 0;">Sample Lead Information</h3>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Phone:</strong> 555-123-4567</p>
          <p><strong>Interest:</strong> Villa Rental</p>
          <p><strong>Budget:</strong> $5,000-$10,000</p>
          <p><strong>Timeline:</strong> Summer 2025</p>
        </div>
        
        <p>This email was generated from the test endpoint at ${new Date().toLocaleString()}.</p>
        <p>If you received this, the HTML email template system is working correctly!</p>
      `;
      
      // Send the notification
      const result = await sendAdminNotification(subject, body);
      
      // Return the result
      if (result) {
        res.json({ success: true, message: 'Admin notification email sent successfully!' });
      } else {
        res.status(500).json({ success: false, message: 'Failed to send admin notification email.' });
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
      res.status(500).json({ success: false, message: 'Error sending admin notification', error: String(error) });
    }
  });
  
  // Comprehensive test endpoint with real data summary from database
  app.get("/api/test-comprehensive-notification", requireAdmin, async (req, res) => {
    try {
      // Import the sendAdminNotification function
      const { sendAdminNotification } = await import('./services/activeCampaign');
      
      // Get actual data from storage
      const recentLeads = await storage.getRecentLeads(5);
      const recentBookings = await storage.getRecentBookings(5);
      const recentGuides = await storage.getRecentGuideSubmissions(5);
      
      // Create leads HTML
      let leadsHtml = '<h3 style="color: #2F4F4F; margin-top: 20px;">Recent Leads</h3>';
      
      if (recentLeads.length > 0) {
        leadsHtml += '<div style="margin-bottom: 20px; max-height: 300px; overflow-y: auto;">';
        recentLeads.forEach((lead, index) => {
          leadsHtml += `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #eee; background-color: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};">
              <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName || ''}</p>
              <p><strong>Email:</strong> ${lead.email}</p>
              <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
              <p><strong>Interest:</strong> ${lead.interestType || 'Not specified'}</p>
              <p><strong>Budget:</strong> ${lead.budget || 'Not specified'}</p>
              <p><strong>Timeline:</strong> ${lead.timeline || 'Not specified'}</p>
              <p><strong>Source:</strong> ${lead.source || 'Website'}</p>
              <p><strong>Status:</strong> ${lead.status || 'New'}</p>
              <p><strong>Created:</strong> ${new Date(lead.createdAt || new Date()).toLocaleString()}</p>
            </div>
          `;
        });
        leadsHtml += '</div>';
      } else {
        leadsHtml += '<p>No recent leads found.</p>';
      }
      
      // Create bookings HTML
      let bookingsHtml = '<h3 style="color: #2F4F4F; margin-top: 20px;">Recent Bookings</h3>';
      
      if (recentBookings.length > 0) {
        bookingsHtml += '<div style="margin-bottom: 20px; max-height: 300px; overflow-y: auto;">';
        recentBookings.forEach((booking, index) => {
          bookingsHtml += `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #eee; background-color: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};">
              <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName || ''}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
              <p><strong>Booking Type:</strong> ${booking.bookingType}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> ${booking.guests}</p>
              ${booking.totalAmount ? `<p><strong>Total Amount:</strong> $${booking.totalAmount}</p>` : ''}
              <p><strong>Special Requests:</strong> ${booking.specialRequests || 'None'}</p>
              <p><strong>Source:</strong> ${booking.source || 'Website'}</p>
              <p><strong>Status:</strong> ${booking.status || 'Pending'}</p>
              <p><strong>Created:</strong> ${new Date(booking.createdAt || new Date()).toLocaleString()}</p>
            </div>
          `;
        });
        bookingsHtml += '</div>';
      } else {
        bookingsHtml += '<p>No recent bookings found.</p>';
      }
      
      // Create guides HTML
      let guidesHtml = '<h3 style="color: #2F4F4F; margin-top: 20px;">Recent Guide Downloads</h3>';
      
      if (recentGuides.length > 0) {
        guidesHtml += '<div style="margin-bottom: 20px; max-height: 300px; overflow-y: auto;">';
        recentGuides.forEach((guide, index) => {
          guidesHtml += `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #eee; background-color: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};">
              <p><strong>Name:</strong> ${guide.firstName} ${guide.lastName || ''}</p>
              <p><strong>Email:</strong> ${guide.email}</p>
              <p><strong>Phone:</strong> ${guide.phone || 'Not provided'}</p>
              <p><strong>Guide Type:</strong> ${guide.guideType}</p>
              <p><strong>Interest Areas:</strong> ${
                Array.isArray(guide.interestAreas) 
                  ? guide.interestAreas.join(', ') 
                  : (guide.interestAreas || 'Not specified')
              }</p>
              <p><strong>Source:</strong> ${guide.source || 'Website'}</p>
              <p><strong>Created:</strong> ${new Date(guide.createdAt || new Date()).toLocaleString()}</p>
            </div>
          `;
        });
        guidesHtml += '</div>';
      } else {
        guidesHtml += '<p>No recent guide downloads found.</p>';
      }
      
      // Complete HTML body
      const body = `
        <h2>Comprehensive Data Summary - ${new Date().toLocaleString()}</h2>
        <p>This is a comprehensive summary of recent leads, bookings, and guide downloads from the database.</p>
        
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
          ${leadsHtml}
          ${bookingsHtml}
          ${guidesHtml}
        </div>
        
        <p>This summary was generated from actual database records at ${new Date().toLocaleString()}.</p>
      `;
      
      // Send the notification
      const result = await sendAdminNotification('Comprehensive Data Summary', body);
      
      // Return the result
      if (result) {
        res.json({ 
          success: true, 
          message: 'Comprehensive admin notification email sent successfully!',
          dataCounts: {
            leads: recentLeads.length,
            bookings: recentBookings.length,
            guides: recentGuides.length
          }
        });
      } else {
        res.status(500).json({ success: false, message: 'Failed to send comprehensive admin notification email.' });
      }
    } catch (error) {
      console.error('Error sending comprehensive admin notification:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error sending comprehensive admin notification', 
        error: String(error) 
      });
    }
  });
  
  // Analytics endpoints - protected by admin auth
  app.get("/api/analytics/leads", requireAdmin, async (req, res) => {
    try {
      // Get lead analytics data
      const leadsData = await storage.getLeadAnalytics();
      res.json(leadsData);
    } catch (error) {
      console.error("Error fetching lead analytics:", error);
      res.status(500).json({ error: "Failed to fetch lead analytics data" });
    }
  });

  app.get("/api/analytics/guides", requireAdmin, async (req, res) => {
    try {
      // Get guide downloads analytics data
      const guideData = await storage.getGuideAnalytics();
      res.json(guideData);
    } catch (error) {
      console.error("Error fetching guide analytics:", error);
      res.status(500).json({ error: "Failed to fetch guide analytics data" });
    }
  });

  app.get("/api/analytics/dashboard", requireAdmin, async (req, res) => {
    try {
      console.log("Dashboard analytics endpoint called");
      // Get combined analytics data for dashboard
      const dashboardData = await storage.getDashboardAnalytics();
      console.log("Dashboard analytics data retrieved:", JSON.stringify(dashboardData).slice(0, 200) + "...");
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard analytics data" });
    }
  });
  
  // Webhook check endpoint - protected by admin auth
  app.get("/api/guides/check-webhook", requireAdmin, (req, res) => {
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
      
      // Process in ActiveCampaign for notifications (non-blocking)
      import('./services/activeCampaign').then(({ processGuideRequest }) => {
        processGuideRequest(submission)
          .then(success => {
            if (success) {
              console.log(`Guide request processed in ActiveCampaign for ${submission.email}`);
            } else {
              console.error(`Failed to process guide request in ActiveCampaign for ${submission.email}`);
            }
          })
          .catch(error => {
            console.error("Error processing guide request in ActiveCampaign:", error);
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
      
      // Process in ActiveCampaign for admin notifications (non-blocking)
      import('./services/activeCampaign').then(({ processBooking }) => {
        processBooking(booking)
          .then(success => {
            if (success) {
              console.log(`Booking processed in ActiveCampaign for ${booking.email}`);
            } else {
              console.error(`Failed to process booking in ActiveCampaign for ${booking.email}`);
            }
          })
          .catch(error => {
            console.error("Error processing booking in ActiveCampaign:", error);
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
      
      // Process in ActiveCampaign for admin notifications (non-blocking)
      import('./services/activeCampaign').then(({ processLead }) => {
        processLead(lead)
          .then(success => {
            if (success) {
              console.log(`Lead processed in ActiveCampaign for ${lead.email}`);
            } else {
              console.error(`Failed to process lead in ActiveCampaign for ${lead.email}`);
            }
          })
          .catch(error => {
            console.error("Error processing lead in ActiveCampaign:", error);
          });
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

  // Function to generate slug for resorts and villas
  function generateSlug(str: string): string {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  // Internal debugging endpoint - protected by admin auth
  app.get("/api/debug", requireAdmin, async (req, res) => {
    try {
      console.log("DEBUG ENDPOINT CALLED - Testing storage functions");
      
      // Test villa retrieval
      console.log("Testing getVillas() function:");
      const villas = await storage.getVillas();
      console.log(`Found ${villas.length} villas in the database`);
      if (villas.length > 0) {
        console.log(`First villa sample: ${JSON.stringify(villas[0]).substring(0, 200)}...`);
      }
      
      // Test adventure retrieval
      console.log("Testing getAdventures() function:");
      const adventures = await storage.getAdventures();
      console.log(`Found ${adventures.length} adventures in the database`);
      if (adventures.length > 0) {
        console.log(`First adventure sample: ${JSON.stringify(adventures[0]).substring(0, 200)}...`);
      }
      
      res.json({ 
        success: true,
        villaCount: villas.length,
        adventureCount: adventures.length
      });
    } catch (error) {
      console.error("DEBUG ENDPOINT ERROR:", error);
      res.status(500).json({ message: "Debug endpoint failed", error: String(error) });
    }
  });

  // Keep existing routes
  app.get("/api/villas", publicCacheControl, async (req, res) => {
    try {
      console.log("GET /api/villas endpoint called");
      const villas = await storage.getVillas();
      console.log(`Returning ${villas.length} villas from the database`);
      res.json(villas);
    } catch (error) {
      console.error("Error fetching villas:", error);
      res.status(500).json({ message: "Failed to fetch villas" });
    }
  });

  app.get("/api/villas/:trackHsId", publicCacheControl, async (req, res) => {
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
  
  // Import villas from JSON
  app.post("/api/villas/import", requireAdmin, async (req, res) => {
    try {
      const { villas } = req.body;
      
      if (!Array.isArray(villas)) {
        return res.status(400).json({ message: "Invalid request. Expected 'villas' array." });
      }
      
      console.log(`Importing ${villas.length} villas from JSON`);
      
      let importedCount = 0;
      let errors = [];
      
      for (const villaData of villas) {
        try {
          // Adapt the villa data to match our database schema
          const processedVilla = {
            name: villaData.name,
            address: villaData.address || "",
            location: villaData.location || "Cabo San Lucas",
            description: villaData.description || "",
            bedrooms: parseInt(villaData.bedrooms) || 0,
            bathrooms: parseFloat(villaData.bathrooms) || 0,
            maxGuests: parseInt(villaData.maxGuests || villaData.sleeps) || 0,
            pricePerNight: parseInt(villaData.pricePerNight) || 0,
            imageUrls: Array.isArray(villaData.imageUrls) ? villaData.imageUrls : 
                      villaData.imageUrl ? [villaData.imageUrl] : [],
            amenities: Array.isArray(villaData.amenities) ? villaData.amenities : [],
            featured: Boolean(villaData.featured) || false
          };
          
          await storage.createVilla(processedVilla);
          importedCount++;
        } catch (error) {
          console.error("Error importing villa:", villaData.name, error);
          errors.push({
            name: villaData.name,
            error: String(error)
          });
        }
      }
      
      res.json({
        importedCount,
        totalVillas: villas.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully imported ${importedCount} out of ${villas.length} villas.`
      });
    } catch (error) {
      console.error("Error importing villas:", error);
      res.status(500).json({ message: "Failed to import villas", error: String(error) });
    }
  });

  // Resorts endpoints
  app.get("/api/resorts", publicCacheControl, async (req, res) => {
    try {
      const resorts = await storage.getResorts();
      res.json(resorts);
    } catch (error) {
      console.error("Error fetching resorts:", error);
      res.status(500).json({ message: "Failed to fetch resorts" });
    }
  });
  
  app.get("/api/resorts/:slug", publicCacheControl, async (req, res) => {
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
  
  // Update resort endpoint - protected by admin auth
  app.put("/api/resorts/:id", requireAdmin, async (req, res) => {
    try {
      const resortId = parseInt(req.params.id);
      if (isNaN(resortId)) {
        return res.status(400).json({ message: "Invalid resort ID" });
      }

      console.log("Updating resort:", resortId, "with data:", req.body);
      
      const updatedResort = await storage.updateResort(resortId, req.body);
      
      if (!updatedResort) {
        return res.status(404).json({ message: "Resort not found" });
      }
      
      res.json(updatedResort);
    } catch (error) {
      console.error("Error updating resort:", error);
      res.status(500).json({ message: "Failed to update resort" });
    }
  });


  // Listings endpoints
  app.get("/api/listings", publicCacheControl, async (req, res) => {
    const type = req.query.type as string | undefined;
    const listings = await storage.getListings(type);
    res.json(listings);
  });

  app.get("/api/listings/:id", publicCacheControl, async (req, res) => {
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
  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      
      if (!user) {
        console.error("Login failed - no user found with credentials:", req.body.username);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      if (user.role !== "admin") {
        console.error("Login failed - user is not an admin:", user.username);
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          return next(err);
        }
        
        console.log("Admin login successful:", user.username);
        return res.json(user);
      });
    })(req, res, next);
  });

  // Protected admin routes

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
  
  // Helper function to generate slug from title
  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim(); // Trim leading/trailing whitespace
  }

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
          password: await hashPassword("instacabo"),
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
  
  // Adventures API endpoints
  app.get("/api/adventures", publicCacheControl, async (req, res) => {
    try {
      console.log("GET /api/adventures endpoint called");
      
      // Input validation for category query parameter
      const categorySchema = z.object({
        category: z.string().optional()
          .refine(val => !val || ['luxury', 'yacht', 'family', 'water', 'land'].includes(val), {
            message: "Category must be one of: luxury, yacht, family, water, land"
          })
      });
      
      const result = categorySchema.safeParse({ category: req.query.category });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid category parameter", 
          errors: result.error.errors
        });
      }
      
      const category = result.data.category;
      const adventures = await storage.getAdventures(category);
      
      console.log(`Returning ${adventures.length} adventures from the database`);
      
      // Set cache control headers for this non-sensitive, public data
      res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
      res.json(adventures);
    } catch (error) {
      console.error("Error fetching adventures:", error);
      res.status(500).json({ message: "Failed to fetch adventures" });
    }
  });

  app.get("/api/adventures/:idOrSlug", publicCacheControl, async (req, res) => {
    try {
      // Input validation for idOrSlug path parameter
      const idOrSlug = req.params.idOrSlug;
      
      // Validate the parameter is either a valid ID (number) or slug (string with allowed characters)
      const idOrSlugSchema = z.union([
        z.string().regex(/^[a-z0-9-]+$/, {
          message: "Slug must contain only lowercase letters, numbers, and hyphens"
        }).min(3).max(100),
        z.coerce.number().int().positive()
      ]);
      
      const validationResult = idOrSlugSchema.safeParse(idOrSlug);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid adventure ID or slug", 
          errors: validationResult.error.errors
        });
      }
      
      const id = parseInt(idOrSlug);
      
      if (isNaN(id)) {
        // If not a number, treat as slug
        const sanitizedSlug = idOrSlug.toLowerCase();
        const adventure = await storage.getAdventureBySlug(sanitizedSlug);
        if (!adventure) {
          return res.status(404).json({ message: "Adventure not found" });
        }
        
        // Set cache control headers for this non-sensitive, public data
        res.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes
        return res.json(adventure);
      }
      
      const adventure = await storage.getAdventure(id);
      if (!adventure) {
        return res.status(404).json({ message: "Adventure not found" });
      }
      
      // Set cache control headers
      res.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes
      res.json(adventure);
    } catch (error) {
      console.error("Error fetching adventure:", error);
      res.status(500).json({ message: "Failed to fetch adventure" });
    }
  });

  app.post("/api/adventures", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Validate request body
      const adventureData = insertAdventureSchema.safeParse(req.body);
      if (!adventureData.success) {
        return res.status(400).json({ 
          message: "Invalid adventure data",
          errors: adventureData.error.errors 
        });
      }

      // Create adventure
      const adventure = await storage.createAdventure(adventureData.data);
      res.status(201).json(adventure);
    } catch (error) {
      console.error("Adventure creation error:", error);
      res.status(500).json({ message: "Failed to create adventure" });
    }
  });

  app.put("/api/adventures/:id", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid adventure ID" });
      }

      // First check if adventure exists
      const existingAdventure = await storage.getAdventure(id);
      if (!existingAdventure) {
        return res.status(404).json({ message: "Adventure not found" });
      }

      // Update adventure
      const updatedAdventure = await storage.updateAdventure(id, req.body);
      res.json(updatedAdventure);
    } catch (error) {
      console.error("Adventure update error:", error);
      res.status(500).json({ message: "Failed to update adventure" });
    }
  });

  app.delete("/api/adventures/:id", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid adventure ID" });
      }

      // Delete adventure
      const deleted = await storage.deleteAdventure(id);
      if (!deleted) {
        return res.status(404).json({ message: "Adventure not found" });
      }
      
      res.json({ success: true, message: "Adventure deleted successfully" });
    } catch (error) {
      console.error("Adventure deletion error:", error);
      res.status(500).json({ message: "Failed to delete adventure" });
    }
  });

  // Restaurant API endpoints
  app.post("/api/restaurants/import", requireAdmin, importRestaurantData);
  
  app.get("/api/restaurants", publicCacheControl, async (req, res) => {
    try {
      // Input validation for category query parameter
      const categorySchema = z.object({
        category: z.string().optional()
          .refine(val => !val || ['seafood', 'mexican', 'italian', 'steakhouse', 'fusion', 'american', 'japanese', 'vegan', 'international'].includes(val), {
            message: "Category must be one of: seafood, mexican, italian, steakhouse, fusion, american, japanese, vegan, international"
          })
      });
      
      const result = categorySchema.safeParse({ category: req.query.category });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid category parameter", 
          errors: result.error.errors
        });
      }
      
      const category = result.data.category;
      const restaurants = await storage.getRestaurants(category);
      
      // Set cache control headers for this non-sensitive, public data
      res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
      res.json(restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:idOrSlug", publicCacheControl, async (req, res) => {
    try {
      // Input validation for idOrSlug path parameter
      const idOrSlug = req.params.idOrSlug;
      
      // Validate the parameter is either a valid ID (number) or slug (string with allowed characters)
      const idOrSlugSchema = z.union([
        z.string().regex(/^[a-z0-9-]+$/, {
          message: "Slug must contain only lowercase letters, numbers, and hyphens"
        }).min(3).max(100),
        z.coerce.number().int().positive()
      ]);
      
      const validationResult = idOrSlugSchema.safeParse(idOrSlug);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid restaurant ID or slug", 
          errors: validationResult.error.errors
        });
      }
      
      const id = parseInt(idOrSlug);
      
      if (isNaN(id)) {
        // If not a number, treat as slug
        const sanitizedSlug = idOrSlug.toLowerCase();
        const restaurant = await storage.getRestaurantBySlug(sanitizedSlug);
        if (!restaurant) {
          return res.status(404).json({ message: "Restaurant not found" });
        }
        
        // Set cache control headers for this non-sensitive, public data
        res.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes
        return res.json(restaurant);
      }
      
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      // Set cache control headers
      res.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes
      res.json(restaurant);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  app.post("/api/restaurants", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Validate request body
      const restaurantData = insertRestaurantSchema.safeParse(req.body);
      if (!restaurantData.success) {
        return res.status(400).json({ 
          message: "Invalid restaurant data",
          errors: restaurantData.error.errors 
        });
      }

      // Create restaurant
      const restaurant = await storage.createRestaurant(restaurantData.data);
      res.status(201).json(restaurant);
    } catch (error) {
      console.error("Restaurant creation error:", error);
      res.status(500).json({ message: "Failed to create restaurant" });
    }
  });

  app.put("/api/restaurants/:id", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }

      // First check if restaurant exists
      const existingRestaurant = await storage.getRestaurant(id);
      if (!existingRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Update restaurant
      const updatedRestaurant = await storage.updateRestaurant(id, req.body);
      res.json(updatedRestaurant);
    } catch (error) {
      console.error("Restaurant update error:", error);
      res.status(500).json({ message: "Failed to update restaurant" });
    }
  });

  app.delete("/api/restaurants/:id", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }

      // Delete restaurant
      const deleted = await storage.deleteRestaurant(id);
      if (!deleted) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      res.json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
      console.error("Restaurant deletion error:", error);
      res.status(500).json({ message: "Failed to delete restaurant" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}