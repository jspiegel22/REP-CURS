import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Health check endpoint for the application
 * Returns basic information about the server environment
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nextVersion: process.env.NEXT_VERSION || 'unknown',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  };

  res.status(200).json(healthData);
}