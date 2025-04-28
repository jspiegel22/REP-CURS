import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { scheduleVillaSync } from "./services/trackhs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Add Helmet for security headers
// In development, use a more permissive configuration to allow local development
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(
  helmet({
    contentSecurityPolicy: isDevelopment ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://maps.googleapis.com", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*.unsplash.com", "https://*.googleapis.com", "https://images.unsplash.com"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'", "https://js.stripe.com"],
      },
    },
    // Force HTTPS in production only
    hsts: isDevelopment ? false : {
      maxAge: 15552000, // 180 days in seconds
      includeSubDomains: true,
      preload: true,
    },
    // Prevent MIME type sniffing
    noSniff: true,
    // Prevent clickjacking
    frameguard: {
      action: isDevelopment ? "sameorigin" : "deny",
    },
    // Enable XSS protection
    xssFilter: true,
    // Disable DNS prefetching to prevent information leakage
    dnsPrefetchControl: {
      allow: isDevelopment,
    },
    // Prevent IE from executing downloads in your site's context
    ieNoOpen: true,
    // Turn on referrer policy 
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  })
);

// Implement HTTPS redirect in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Check for HTTPS
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      // Redirect to HTTPS
      return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    next();
  });
}

// Apply general rate limiting to all requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per window
  standardHeaders: 'draft-7', // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply stricter rate limiting to sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 login/register attempts per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from public directory
app.use(express.static(path.resolve(__dirname, '../public')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Start the server first to meet the timeout requirements
  const server = await registerRoutes(app);
  
  // Create a variable to track if the server is up and running
  let serverReady = false;
  
  // Set up immediate action to start server first, then minimal delayed initializations
  // This helps avoid the 20-second timeout issue in Replit
  console.log('Running minimal initialization to speed up startup...');
  
  // Log message instead of doing heavy initialization during startup
  console.log('TrackHS villa sync disabled for testing');
  
  // Mark server as ready immediately
  serverReady = true;
  
  // After server is ready, perform non-blocking database warmup with short timeout
  setTimeout(() => {
    const initDbConnection = async () => {
      try {
        // Use dynamic import to avoid blocking startup
        const { warmupDatabaseConnection } = await import('./services/init');
        await warmupDatabaseConnection();
        console.log('Database connection warmed up successfully');
        
        // Test database connection to verify villas and adventures data
        const { testDbConnection } = await import('./db');
        const counts = await testDbConnection();
        console.log(`Database verification complete - villas: ${counts.villas}, adventures: ${counts.adventures}`);
      } catch (error) {
        console.error('Error during database initialization:', error);
      }
    };
    
    // Execute but don't wait for completion
    initDbConnection();
  }, 500); // Reduced to 500ms to start even faster

  // Handle API routes first
  app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // Handle errors
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Important: Serve static files and handle client-side routing
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Catch-all route for client-side routing
  app.get("*", (_req, res) => {
    if (app.get("env") === "development") {
      res.sendFile(path.resolve(__dirname, "..", "client", "index.html"));
    } else {
      res.sendFile(path.resolve(__dirname, "public", "index.html"));
    }
  });

  const port = process.env.NODE_ENV === 'production' ? 5000 : 3000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port} in ${process.env.NODE_ENV} mode`);
  });
})();