import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, Download, BookOpen, TrendingUp, Calendar, FileText } from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// Time range options for analytics
type TimeRange = '7d' | '30d' | '90d' | 'all';

// Helper function to get date n days ago
const getDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const LeadsChart = ({ data }: { data: any }) => {
  if (!data || !data.timeSeries || !data.timeSeries.labels) {
    return <div className="flex justify-center p-12">No lead data available</div>;
  }

  const chartData = data.timeSeries.labels.map((label: string, index: number) => ({
    name: label,
    leads: data.timeSeries.data[index],
  }));

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leads" fill="#0088FE" name="Leads" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const GuidesChart = ({ data }: { data: any }) => {
  if (!data || !data.timeSeries || !data.timeSeries.labels) {
    return <div className="flex justify-center p-12">No guide data available</div>;
  }

  const chartData = data.timeSeries.labels.map((label: string, index: number) => ({
    name: label,
    guides: data.timeSeries.data[index],
  }));

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="guides" fill="#00C49F" name="Guide Downloads" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LeadsByTypeChart = ({ data }: { data: any }) => {
  if (!data || !data.byType) {
    return <div className="flex justify-center p-12">No lead type data available</div>;
  }

  const pieData = Object.keys(data.byType).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
    value: data.byType[key],
  }));

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatCard = ({ title, value, icon, description }: { title: string; value: number | string; icon: React.ReactNode; description?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

export default function AnalyticsDashboard() {
  // State for time range filtering
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  // Function to set the appropriate start date based on time range
  const getStartDate = () => {
    // Default to February 1, 2025 as requested
    const defaultStartDate = new Date(2025, 1, 1); // Feb 1, 2025
    
    if (timeRange === 'all') {
      return defaultStartDate;
    }
    
    const daysMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    
    const today = new Date();
    const daysAgo = getDaysAgo(daysMap[timeRange]);
    
    // Don't go earlier than Feb 1, 2025
    return daysAgo < defaultStartDate ? defaultStartDate : daysAgo;
  };

  // Split the dashboard into separate queries to improve loading performance
  // This way we can show parts of the dashboard as they load
  const { data: leadsData, isLoading: isLoadingLeads } = useQuery<any>({
    queryKey: ['/api/analytics/leads', timeRange],
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Include time range parameter in the URL
    query: { 
      startDate: getStartDate().toISOString(),
      timeRange 
    }
  });
  
  const { data: guidesData, isLoading: isLoadingGuides } = useQuery<any>({
    queryKey: ['/api/analytics/guides', timeRange],
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Include time range parameter in the URL
    query: { 
      startDate: getStartDate().toISOString(),
      timeRange 
    }
  });
  
  // Log data loading status
  useEffect(() => {
    if (leadsData) console.log('Leads analytics data loaded successfully');
    if (guidesData) console.log('Guides analytics data loaded successfully');
  }, [leadsData, guidesData]);
  
  // Combine the data for the dashboard
  const data = useMemo(() => ({
    leads: leadsData || { total: 0 },
    guides: guidesData || { total: 0 },
    listings: { total: 0 }, // We'll set this from the UI for faster loading
    recent: { leads: [], guides: [] }
  }), [leadsData, guidesData]);
  
  const isLoading = isLoadingLeads || isLoadingGuides;
  const error = !leadsData && !guidesData;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Error loading analytics</h2>
        <p>There was a problem loading the analytics data. Please try again later.</p>
      </div>
    );
  }

  const { leads, guides, listings, recent } = data;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Key metrics and performance data for your Cabo travel platform.</p>
        </div>
        <div className="flex gap-2">
          <ButtonGroup className="border rounded-md">
            <Button 
              variant={timeRange === '7d' ? 'default' : 'ghost'} 
              onClick={() => setTimeRange('7d')}
              className="rounded-r-none"
            >
              7 Days
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'ghost'} 
              onClick={() => setTimeRange('30d')}
              className="rounded-none border-x"
            >
              30 Days
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'default' : 'ghost'} 
              onClick={() => setTimeRange('90d')}
              className="rounded-l-none"
            >
              90 Days
            </Button>
          </ButtonGroup>
          <Button 
            variant={timeRange === 'all' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Leads" 
          value={leads?.total || 0} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          description="Total leads collected" 
        />
        <StatCard 
          title="Guide Downloads" 
          value={guides?.total || 0} 
          icon={<Download className="h-4 w-4 text-muted-foreground" />} 
          description="Total guide downloads" 
        />
        <StatCard 
          title="Active Listings" 
          value={listings?.total || 0} 
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />} 
          description="Resorts, villas, adventures" 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${(leads?.total > 0 ? (guides?.total / leads?.total * 100).toFixed(1) : 0)}%`} 
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
          description="Guide downloads / leads" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
            <CardDescription>Monthly lead acquisition trends</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsChart data={leads} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads by Type</CardTitle>
            <CardDescription>Distribution of lead interest types</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsByTypeChart data={leads} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Guide Downloads</CardTitle>
            <CardDescription>Monthly guide download trends</CardDescription>
          </CardHeader>
          <CardContent>
            <GuidesChart data={guides} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest leads and guide downloads</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="leads">
              <TabsList className="mb-4">
                <TabsTrigger value="leads">Latest Leads</TabsTrigger>
                <TabsTrigger value="guides">Guide Downloads</TabsTrigger>
              </TabsList>
              <TabsContent value="leads">
                {recent?.leads && recent.leads.length > 0 ? (
                  <div className="space-y-2">
                    {recent.leads.map((lead: any) => (
                      <div key={lead.id} className="flex items-center p-2 rounded-md border border-border">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{lead.firstName} {lead.lastName}</p>
                          <p className="text-xs text-muted-foreground">{lead.email} • {new Date(lead.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-xs font-medium capitalize bg-primary/10 text-primary rounded-full px-2 py-1">
                          {lead.interestType?.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent leads</p>
                )}
              </TabsContent>
              <TabsContent value="guides">
                {recent?.guides && recent.guides.length > 0 ? (
                  <div className="space-y-2">
                    {recent.guides.map((guide: any) => (
                      <div key={guide.id} className="flex items-center p-2 rounded-md border border-border">
                        <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{guide.firstName} {guide.lastName}</p>
                          <p className="text-xs text-muted-foreground">{guide.email} • {new Date(guide.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-xs font-medium capitalize bg-primary/10 text-primary rounded-full px-2 py-1">
                          {guide.guideType?.split(' ').slice(0, 2).join(' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent guide downloads</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}