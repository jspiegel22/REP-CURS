import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  status: 'ok' | 'error';
  uptime: number;
  message: string;
  timestamp: string;
  version: string;
  env: string;
}

// Server start time
const serverStartTime = Date.now();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Calculate uptime in seconds
  const uptime = (Date.now() - serverStartTime) / 1000;
  
  // Return health information
  res.status(200).json({
    status: 'ok',
    uptime,
    message: 'API server is running properly',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV || 'development'
  });
}