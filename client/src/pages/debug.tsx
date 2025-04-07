import React from 'react';
import Head from 'next/head';

export default function DebugPage() {
  return (
    <>
      <Head>
        <title>Debug Page | Cabo Travel</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Debug Info</h1>
            
            <div className="grid gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Debug Page is Working</h2>
                <p className="text-green-700">
                  If you can see this page, Next.js is running and the proxy is correctly forwarding requests!
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Configuration Info</h2>
                <ul className="space-y-2 text-blue-700">
                  <li><span className="font-medium">Node.js Version:</span> {process.version}</li>
                  <li><span className="font-medium">Next.js Runtime:</span> {process.env.NODE_ENV}</li>
                  <li><span className="font-medium">Base Path:</span> {process.env.NEXT_PUBLIC_BASE_PATH || '/'}</li>
                  <li><span className="font-medium">Host:</span> {typeof window !== 'undefined' ? window.location.host : 'server-side'}</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Environment Variables</h2>
                <ul className="space-y-2 text-gray-700">
                  {Object.keys(process.env)
                    .filter(key => key.startsWith('NEXT_PUBLIC_'))
                    .map(key => (
                      <li key={key}>
                        <span className="font-medium">{key}:</span> {process.env[key] || '(not set)'}
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-yellow-800 mb-2">Troubleshooting Links</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/" className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg text-center">
                    Go to Homepage
                  </a>
                  <a href="/health-check" className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg text-center">
                    View Health Check
                  </a>
                  <a href="/api/health" className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg text-center">
                    API Health Endpoint
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}