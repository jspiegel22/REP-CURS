/**
 * Authentication middleware for protecting routes
 */
import { Request, Response, NextFunction } from 'express';

// Define the User type to match our app's user model
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string; // Add email field to User type
      role: string;
      lastLogin?: Date;
      createdAt?: Date;
    }
  }
}

/**
 * Middleware to require authentication for protected routes
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

/**
 * Middleware to require admin role for protected routes
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated() || req.user?.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized - Admin access required" });
  }
  next();
}

/**
 * Middleware to require certain roles for protected routes
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized - Insufficient role" });
    }
    
    next();
  };
}