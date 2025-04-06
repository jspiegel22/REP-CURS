/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:5000', '0.0.0.0:5000']
    }
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