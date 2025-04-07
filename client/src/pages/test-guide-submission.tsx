import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { GuideFormSimple } from '@/components/guide-form-simple';

export default function TestGuidePage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  // Fetch submissions when component mounts
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Function to fetch guide submissions from the API
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Check if we can access the admin endpoint (if user is authenticated as admin)
      const response = await apiRequest('GET', '/api/admin/guide-submissions');
      const data = await response.json();
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      // Even if we can't access the admin API, we don't need to show an error
      // as this might just be a regular user without admin privileges
    } finally {
      setLoading(false);
    }
  };

  // Function to test submission directly
  const testDirectSubmission = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Create test submission data
      const testData = {
        firstName: 'Test User',
        email: 'test@example.com',
        phone: '555-123-4567',
        guideType: 'Ultimate Cabo Guide 2025',
        source: 'test-page',
        formName: 'guide_download_test',
        status: 'completed',
        submissionId: `test-${Date.now()}`,
        interestAreas: ['Testing'],
        tags: ['test', 'direct-api']
      };
      
      // Submit to the API
      const response = await apiRequest('POST', '/api/guide-submissions', testData);
      const result = await response.json();
      
      // Set success message
      setTestResult({
        success: true,
        message: 'Guide submission successful!',
        data: result
      });
      
      // Refresh the submissions list
      fetchSubmissions();
    } catch (error: any) {
      console.error('Direct submission error:', error);
      setTestResult({
        success: false,
        message: `Error: ${error.message || 'Failed to submit guide request'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#2F4F4F]">
        Guide Submission Testing
      </h1>
      
      {/* Form Test */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit Guide Request Form</CardTitle>
          </CardHeader>
          <CardContent>
            <GuideFormSimple />
          </CardContent>
        </Card>
      </div>
      
      {/* API Testing controls */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Direct API Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Bypass the form and test the API endpoint directly with sample data.
            </p>
            <Button 
              onClick={testDirectSubmission}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Test API Directly
            </Button>
            
            {testResult && (
              <div className={`p-3 rounded-md text-sm ${
                testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <p className="font-semibold">{testResult.message}</p>
                {testResult.data && (
                  <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-black/5 rounded">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Submissions list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Guide Submissions</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchSubmissions}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="json">JSON View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              {submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-xs font-semibold">ID</th>
                        <th className="p-2 text-left text-xs font-semibold">Name</th>
                        <th className="p-2 text-left text-xs font-semibold">Email</th>
                        <th className="p-2 text-left text-xs font-semibold">Guide Type</th>
                        <th className="p-2 text-left text-xs font-semibold">Status</th>
                        <th className="p-2 text-left text-xs font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-2 text-xs">{sub.id}</td>
                          <td className="p-2 text-xs">{sub.firstName}</td>
                          <td className="p-2 text-xs">{sub.email}</td>
                          <td className="p-2 text-xs">{sub.guideType}</td>
                          <td className="p-2 text-xs">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              sub.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-2 text-xs">
                            {new Date(sub.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  ) : (
                    <p>No submissions found</p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="json">
              <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-96">
                {JSON.stringify(submissions, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}