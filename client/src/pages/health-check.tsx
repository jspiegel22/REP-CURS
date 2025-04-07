import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HealthCheck() {
  const [nextPort, setNextPort] = useState<string | null>(null);
  const [proxyStatus, setProxyStatus] = useState<string>('Checking...');
  const [requestUrl, setRequestUrl] = useState<string>('');

  useEffect(() => {
    // Get the current URL
    const url = window.location.href;
    setRequestUrl(url);

    // Get the port from the server
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setNextPort(data.nextPort);
        setProxyStatus(data.proxyStatus || 'Unknown');
      })
      .catch(err => {
        console.error('Error fetching health data:', err);
        setProxyStatus('Error');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mx-auto bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Health Check
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            System status and port information
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="p-4 border border-gray-300 rounded-t-md">
              <h3 className="text-lg font-medium text-gray-900">Port Configuration</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Next.js Port</span>
                  <span className="text-sm text-gray-900">{nextPort || 'Loading...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Proxy Status</span>
                  <span className="text-sm text-gray-900">{proxyStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Requested URL</span>
                  <span className="text-sm text-gray-900 truncate max-w-[200px]">{requestUrl}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-300 rounded-b-md">
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Server Status</span>
                  <span className="text-sm text-green-600">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Client Status</span>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}