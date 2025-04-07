import React, { useEffect, useState } from 'react';
import Head from 'next/head';

type HealthStatus = {
  status: 'ok' | 'error';
  uptime: number;
  message: string;
  timestamp: string;
  version: string;
  env: string;
} | null;

export default function HealthCheckPage() {
  const [health, setHealth] = useState<HealthStatus>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    // Collect client information
    setClientInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'direct',
    });

    // Fetch API health
    fetch('/api/health')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Health Check | Cabo Travel</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">System Health Check</h1>
            <p className="text-gray-600 mt-2">Use this page to verify the application is working correctly</p>
          </header>
          
          <div className="grid gap-6">
            {/* API Health Status */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">API Health</h2>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <h3 className="font-medium mb-1">Error connecting to API</h3>
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className={`bg-${health?.status === 'ok' ? 'green' : 'red'}-50 border border-${health?.status === 'ok' ? 'green' : 'red'}-200 rounded-lg p-4`}>
                    <h3 className={`font-medium text-${health?.status === 'ok' ? 'green' : 'red'}-800 mb-2`}>
                      {health?.status === 'ok' ? 'System Operational' : 'System Error'}
                    </h3>
                    
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Status</dt>
                        <dd className="mt-1">{health?.status}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Uptime</dt>
                        <dd className="mt-1">{Math.floor(health?.uptime || 0)} seconds</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Environment</dt>
                        <dd className="mt-1">{health?.env}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Version</dt>
                        <dd className="mt-1">{health?.version}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-600">Message</dt>
                        <dd className="mt-1">{health?.message}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-600">Timestamp</dt>
                        <dd className="mt-1">{health?.timestamp}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
            
            {/* Client Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Client Information</h2>
              </div>
              
              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(clientInfo).map(([key, value]) => (
                    <div key={key} className={key === 'userAgent' ? 'sm:col-span-2' : ''}>
                      <dt className="text-sm font-medium text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                      <dd className="mt-1 text-sm text-gray-900 break-words">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Home
              </a>
              <a 
                href="/debug" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Debug Page
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Refresh Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}