import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { scheduleVillaSync } from "./services/trackhs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  const server = await registerRoutes(app);

  // Temporarily disabled TrackHS integration for testing
  // try {
  //   scheduleVillaSync(60); // Sync every hour
  //   console.log('Villa sync scheduler started');
  // } catch (error) {
  //   console.error('Failed to start villa sync scheduler:', error);
  // }
  console.log('TrackHS villa sync disabled for testing');

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