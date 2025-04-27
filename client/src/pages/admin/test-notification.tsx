import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TestNotificationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Redirect if not logged in
  if (!user) {
    window.location.href = "/admin/login";
    return null;
  }

  async function handleSendTestEmail() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-admin-notification');
      const data = await response.json();
      
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Test email sent successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send test email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Error",
        description: "An error occurred while sending the test email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSendComprehensiveEmail() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-comprehensive-notification');
      const data = await response.json();
      
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Comprehensive email sent successfully with ${data.dataCounts?.leads || 0} leads, ${data.dataCounts?.bookings || 0} bookings, and ${data.dataCounts?.guides || 0} guide downloads!`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send comprehensive email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending comprehensive email:", error);
      
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Error",
        description: "An error occurred while sending the comprehensive email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = "/admin"}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Admin Email Notification</CardTitle>
            <CardDescription>
              Send a test email to verify the ActiveCampaign integration is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will send a test HTML email template to the admin email 
              (jeff@instacabo.com) through the ActiveCampaign service.
            </p>
            
            {result && (
              <Alert className={`mb-4 ${result.success ? "bg-green-50" : "bg-red-50"}`}>
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/admin"}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleSendTestEmail} 
              disabled={loading}
              className="bg-primary"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Test Email
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Database Summary</CardTitle>
            <CardDescription>
              Send a comprehensive email with actual data from your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will send a detailed HTML email containing recent leads, bookings, and guide downloads 
              from the database to the admin email (jeff@instacabo.com).
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              The email includes the 5 most recent records from each category with all their details.
              Use this to get a quick summary of recent activity.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSendComprehensiveEmail} 
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Comprehensive Summary
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}