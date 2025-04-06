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
  // Add rewrites to handle Vite app
  rewrites: async () => {
    return [
      {
        source: '/client',
        destination: '/client',
      },
      {
        source: '/src/:path*',
        destination: '/src/:path*',
      },
      {
        source: '/_next/:path*',
        destination: '/_next/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Configure allowedDevOrigins
  allowedDevOrigins: [
    'localhost',
    '0.0.0.0',
    '127.0.0.1',
    '*.replit.dev',
    '*.repl.co'
  ],
}

// Export with port configuration
module.exports = nextConfig