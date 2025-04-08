import { useState, useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart4,
  Users,
  CalendarDays,
  FileText,
  Link,
  LogOut,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideDownloads } from "@/components/admin/guide-downloads";
import { Bookings } from "@/components/admin/bookings";
import { Leads } from "@/components/admin/leads";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// This will show a simple analytics dashboard
function Analytics() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-muted-foreground mb-2">Total Leads</h3>
          <p className="text-3xl font-bold">248</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-muted-foreground mb-2">Guide Downloads</h3>
          <p className="text-3xl font-bold">127</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-muted-foreground mb-2">Booking Requests</h3>
          <p className="text-3xl font-bold">53</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg text-muted-foreground mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold">21.3%</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Monthly Lead Acquisition</h3>
        <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
          <p className="text-muted-foreground">Chart visualization placeholder</p>
        </div>
      </div>
    </div>
  );
}

// This will show integration settings
function Integrations() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Integrations</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Airtable</h3>
              <p className="text-muted-foreground">Connect to Airtable for lead and booking management</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Connected
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Base ID: {process.env.AIRTABLE_BASE_ID ? `${process.env.AIRTABLE_BASE_ID.slice(0, 4)}****` : "Not configured"}</p>
            <Button variant="outline" size="sm">
              Reconfigure
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">TrackHS</h3>
              <p className="text-muted-foreground">Connect to TrackHS for property management</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Connected
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">API Key: {process.env.TRACKHS_API_KEY ? `${process.env.TRACKHS_API_KEY.slice(0, 4)}****` : "Not configured"}</p>
            <Button variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </div>
        

      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        
        const user = await res.json();
        if (user.role !== "admin") {
          throw new Error("Not authorized");
        }
      } catch (error) {
        // Redirect to login
        setLocation("/admin/login");
      }
    };
    
    checkAuth();
  }, [setLocation]);
  
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Logged out successfully",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Cabo Admin</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center w-full p-2 rounded-md text-left ${
                  activeTab === "analytics" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <BarChart4 className="mr-2 h-5 w-5" />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex items-center w-full p-2 rounded-md text-left ${
                  activeTab === "leads" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                <span>Leads</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center w-full p-2 rounded-md text-left ${
                  activeTab === "bookings" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>Bookings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("guides")}
                className={`flex items-center w-full p-2 rounded-md text-left ${
                  activeTab === "guides" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <Download className="mr-2 h-5 w-5" />
                <span>Guide Downloads</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("integrations")}
                className={`flex items-center w-full p-2 rounded-md text-left ${
                  activeTab === "integrations" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <Link className="mr-2 h-5 w-5" />
                <span>Integrations</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded-md text-left hover:bg-muted text-red-500"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        
        <div className="p-4">
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "leads" && <Leads />}
          {activeTab === "bookings" && <Bookings />}
          {activeTab === "guides" && <GuideDownloads />}
          {activeTab === "integrations" && <Integrations />}
        </div>
      </div>
    </div>
  );
}