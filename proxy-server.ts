import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer } from 'http';
import { setupAuth } from './server/auth';
import session from 'express-session';
import { storage } from './server/storage';

const app = express();
const PORT = process.env.PORT || 5000;
const NEXT_PORT = 3000;

// Setup session and auth
const sessionSettings: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'devsecret123',
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
};

app.use(express.json());
app.use(session(sessionSettings));
setupAuth(app);

// API routes
import { registerRoutes } from './server/routes';
registerRoutes(app);

// Proxy all other requests to Next.js
app.use(
  createProxyMiddleware({
    target: `http://localhost:${NEXT_PORT}`,
    changeOrigin: true,
  })
);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Express proxy server running at http://localhost:${PORT}`);
  console.log(`Proxying requests to Next.js at http://localhost:${NEXT_PORT}`);
});