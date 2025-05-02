import { useState, useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart4,
  Users,
  CalendarDays,
  FileText,
  Link as LinkIcon,
  LogOut,
  Download,
  Image,
  ImageUp,
  Compass,
  BedDouble,
  PalmtreeIcon,
  Newspaper,
  HomeIcon,
  Menu,
  X
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GuideDownloads } from "@/components/admin/guide-downloads";
import { Bookings } from "@/components/admin/bookings";
import { Leads } from "@/components/admin/leads";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AdventureManager from "@/components/admin/AdventureManager";
import ResortManager from "@/components/admin/ResortManager";
import VillaManager from "@/components/admin/VillaManager";
import RestaurantManager from "@/components/admin/RestaurantManager";
import BlogManager from "@/components/admin/BlogManager";
import ImageManager from "@/components/admin/ImageManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

// Use our new Analytics Dashboard component
function Analytics() {
  return <AnalyticsDashboard />;
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
              <h3 className="text-xl font-bold">ActiveCampaign</h3>
              <p className="text-muted-foreground">Email notifications and contact management</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Connected
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">API Key: {process.env.ACTIVECAMPAIGN_API_KEY ? `${process.env.ACTIVECAMPAIGN_API_KEY.slice(0, 4)}****` : "Not configured"}</p>
            <p className="text-sm text-muted-foreground mb-4">API URL: {process.env.ACTIVECAMPAIGN_API_URL ? "Configured" : "Not configured"}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reconfigure
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/admin/test-notification"}
              >
                Test ActiveCampaign
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/admin/email-notifications"}
              >
                Test SendGrid
              </Button>
            </div>
          </div>
        </div>
        
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

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">SendGrid</h3>
              <p className="text-muted-foreground">Email notifications for leads, bookings and guides</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Connected
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">API Key: {process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.slice(0, 4)}****` : "Not configured"}</p>
            <p className="text-sm text-muted-foreground mb-4">Used for: Lead notifications, booking confirmations, guide download notifications</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/admin/email-notifications"}
              >
                Test Email Notifications
              </Button>
            </div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, logoutMutation } = useAuth();
  
  // Check if user is authenticated and redirect if not
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth status from AdminDashboard component");
      
      try {
        // Direct API check to bypass any caching issues
        const res = await fetch('/api/user', { credentials: 'include' });
        
        if (!res.ok) {
          console.log("Auth check failed with status:", res.status);
          throw new Error("Not authenticated");
        }
        
        const userData = await res.json();
        console.log("User data from API:", userData);
        
        if (!userData || userData.role !== "admin") {
          console.log("User is not admin, redirecting");
          window.location.href = "/admin/login";
        } else {
          console.log("User authenticated as admin");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        window.location.href = "/admin/login";
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
        });
        // Use window.location for a hard redirect after logout
        window.location.href = "/admin/login";
      }
    });
  };

  const menuItems = [
    { id: "analytics", label: "Analytics", icon: <BarChart4 className="h-5 w-5" /> },
    { id: "leads", label: "Leads", icon: <Users className="h-5 w-5" /> },
    { id: "bookings", label: "Bookings", icon: <CalendarDays className="h-5 w-5" /> },
    
    // Content management
    { id: "title-cms", label: "CONTENT MANAGEMENT", isDivider: true },
    { id: "adventures", label: "Adventures", icon: <PalmtreeIcon className="h-5 w-5" /> },
    { id: "resorts", label: "Resorts & Hotels", icon: <BedDouble className="h-5 w-5" /> },
    { id: "villas", label: "Villas", icon: <HomeIcon className="h-5 w-5" /> },
    { id: "restaurants", label: "Restaurants", icon: <Compass className="h-5 w-5" /> },
    { id: "blogs", label: "Blog Posts", icon: <Newspaper className="h-5 w-5" /> },
    { id: "images", label: "Image Library", icon: <Image className="h-5 w-5" /> },
    
    // Utilities
    { id: "title-utils", label: "UTILITIES", isDivider: true },
    { id: "guides", label: "Guide Downloads", icon: <Download className="h-5 w-5" /> },
    { id: "integrations", label: "Integrations", icon: <LinkIcon className="h-5 w-5" /> },
    { id: "photo-sync", label: "Photo Sync Manager", icon: <ImageUp className="h-5 w-5" />, isLink: true, href: "/admin/photo-sync" },
  ];

  const handleNavigation = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-muted/30">
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Cabo Admin</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile sidebar (overlay) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">Cabo Admin</h1>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    {item.isDivider ? (
                      <div className="text-xs font-semibold text-muted-foreground mt-6 mb-2 px-2">{item.label}</div>
                    ) : item.isLink ? (
                      <Link to={item.href!} className="flex items-center w-full p-2 rounded-md text-left hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item.id)}
                        className={`flex items-center w-full p-2 rounded-md text-left ${
                          activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                ))}
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
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-sm h-screen overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Cabo Admin</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.isDivider ? (
                  <div className="text-xs font-semibold text-muted-foreground mt-6 mb-2 px-2">{item.label}</div>
                ) : item.isLink ? (
                  <Link to={item.href!} className="flex items-center w-full p-2 rounded-md text-left hover:bg-muted">
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full p-2 rounded-md text-left ${
                      activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )}
              </li>
            ))}
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
          <h2 className="text-xl font-semibold">
            {activeTab === "analytics" && "Dashboard"}
            {activeTab === "leads" && "Leads Management"}
            {activeTab === "bookings" && "Bookings Management"}
            {activeTab === "guides" && "Guide Downloads"}
            {activeTab === "adventures" && "Adventure Management"}
            {activeTab === "resorts" && "Resort Management"}
            {activeTab === "villas" && "Villa Management"}
            {activeTab === "restaurants" && "Restaurant Management"}
            {activeTab === "blogs" && "Blog Management"}
            {activeTab === "images" && "Image Library"}
            {activeTab === "integrations" && "Integrations"}
          </h2>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "leads" && <Leads />}
          {activeTab === "bookings" && <Bookings />}
          {activeTab === "guides" && <GuideDownloads />}
          {activeTab === "adventures" && <AdventureManager />}
          {activeTab === "resorts" && <ResortManager />}
          {activeTab === "villas" && <VillaManager />}
          {activeTab === "restaurants" && <RestaurantManager />}
          {activeTab === "blogs" && <BlogManager />}
          {activeTab === "images" && <ImageManager />}
          {activeTab === "integrations" && <Integrations />}
        </div>
      </div>
    </div>
  );
}