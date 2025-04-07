import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Health Check Endpoint
 * This simple endpoint returns the health status and uptime of the application
 * Used for monitoring and troubleshooting, especially for the proxy detection
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Cabo Travel Platform API is running',
    port: {
      running: process.env.PORT || 3000,
      replit: 5000,
      proxy: 'Active'
    }
  });
}