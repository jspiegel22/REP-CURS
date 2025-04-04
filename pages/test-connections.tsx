import { useEffect, useState } from 'react';
import Head from 'next/head';

interface TestResults {
  environment: {
    supabaseUrl: string;
    supabaseKey: string;
    neonUrl: string;
    airtableKey: string;
    airtableBase: string;
  };
  connections: {
    supabase: {
      status: 'success' | 'error';
      message?: string;
      data?: {
        version?: string;
        message?: string;
      };
    } | null;
    neon: {
      status: 'success' | 'error';
      message?: string;
      data?: {
        version?: string;
        tableCount?: number;
      };
    } | null;
    airtable: {
      status: 'success' | 'error';
      message?: string;
      data?: {
        tables?: Array<{
          name: string;
          recordCount: number;
        }>;
      };
    } | null;
  };
}

export default function TestConnections() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/test-connections');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Testing Connections...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Connection Tests</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Connection Test Results</h1>
          <button
            onClick={testConnections}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh Tests'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(results?.environment || {}).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <span className="font-medium w-48">{key}:</span>
                <span className={value.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
          <div className="space-y-4">
            {Object.entries(results?.connections || {}).map(([key, value]) => (
              <div key={key} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium capitalize mb-2">{key}</h3>
                {value ? (
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      value.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {value.status}
                    </span>
                    {value.message && (
                      <p className="mt-2 text-sm text-gray-600">{value.message}</p>
                    )}
                    {value.data && (
                      <div className="mt-2 text-sm">
                        {key === 'supabase' && value.data.version && (
                          <p>Version: {value.data.version}</p>
                        )}
                        {key === 'neon' && (
                          <>
                            <p>Version: {value.data.version}</p>
                            <p>Table Count: {value.data.tableCount}</p>
                          </>
                        )}
                        {key === 'airtable' && value.data.tables && (
                          <div>
                            <p className="font-medium mb-1">Tables:</p>
                            <ul className="list-disc list-inside">
                              {value.data.tables.map((table) => (
                                <li key={table.name}>
                                  {table.name} ({table.recordCount} records)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Not tested</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 