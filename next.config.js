/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set experimental options
  experimental: {
    // This allows cross-origin requests from trusted origins
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:5000', '0.0.0.0:5000', '*.replit.dev', '*.repl.co', '*.janeway.replit.dev']
    }
  },
  // Set this to allow Replit to use the app
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Set up CORS headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
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
      // Handle all other routes with client-side routing
      {
        source: '/:path*',
        destination: '/:path*',
      }
    ];
  },
  // Configure cross-origin access
  crossOrigin: 'anonymous',
  // Set allowedDevOrigins to include Replit domains
  allowedDevOrigins: [
    'localhost',
    '0.0.0.0',
    '127.0.0.1',
    '*.replit.dev',
    '*.repl.co',
    '*.janeway.replit.dev',
    'cxbuxrzsxtnb.janeway.replit.dev',
    '*-cxbuxrzsxtnb.janeway.replit.dev',
    // Add exact Replit domain 
    '603d1be0-7877-4e31-a83b-029d972cc9fd-00-cxbuxrzsxtnb.janeway.replit.dev'
  ],
  // This solves the "ModuleError: Module Error:" problems
  webpack: (config, { dev, isServer }) => {
    // Allow importing CSS files in main.tsx
    config.module.rules.push({
      test: /\.(css)$/,
      use: ['style-loader', 'css-loader'],
    });
    
    return config;
  },
}

// Export the configuration
module.exports = nextConfig