import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const HealthCheck: NextPage = () => {
  const [health, setHealth] = useState<any>({ loading: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch('/api/health');
        
        if (!response.ok) {
          throw new Error(`Health check failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        setHealth({ loading: false, ...data });
      } catch (err: any) {
        console.error('Health check error:', err);
        setError(err.message);
        setHealth({ loading: false, status: 'error' });
      }
    }
    
    checkHealth();
  }, []);

  return (
    <>
      <Head>
        <title>API Health Check | Cabo Travel</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">System Health Status</h1>
          
          {health.loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-red-700 font-medium">Error: {error}</p>
              <p className="text-red-600 mt-2 text-sm">
                The API health check endpoint could not be reached. This could indicate a server or networking issue.
              </p>
            </div>
          ) : (
            <>
              <div className={`p-4 ${health.status === 'ok' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-md mb-6`}>
                <div className="flex items-center">
                  {health.status === 'ok' ? (
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className={`font-medium ${health.status === 'ok' ? 'text-green-800' : 'text-red-800'}`}>
                    Status: {health.status === 'ok' ? 'Healthy' : 'Unhealthy'}
                  </p>
                </div>
                <p className={`mt-1 text-sm ${health.status === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
                  {health.message || 'System health status information'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Uptime</p>
                    <p className="mt-1 font-mono text-gray-800">{Math.floor(health.uptime || 0)} seconds</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Timestamp</p>
                    <p className="mt-1 font-mono text-gray-800 text-sm">
                      {health.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {health.port && (
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Port Configuration</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Running:</span> {health.port.running}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Replit:</span> {health.port.replit}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Proxy:</span> {health.port.proxy}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          This page is for system monitoring only
        </div>
      </div>
    </>
  );
};

export default HealthCheck;