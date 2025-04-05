/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:5000', '0.0.0.0:5000']
    }
  },
  // Set the port for Next.js server to 5000
  devIndicators: {
    buildActivity: true,
  },
  // Configure server to listen on port 5000
  server: {
    port: 5000,
  },
  // Enable port override through env vars
  env: {
    PORT: '5000',
  },
  // Allow for Replit host
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
}

// Export with port configuration
module.exports = nextConfig