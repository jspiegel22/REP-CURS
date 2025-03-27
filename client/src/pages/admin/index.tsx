import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideDownloads } from "@/components/admin/guide-downloads";
import { Bookings } from "@/components/admin/bookings";
import { Leads } from "@/components/admin/leads";
import { Integrations } from "@/components/admin/integrations";
import { Analytics } from "@/components/admin/analytics";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("guide-downloads");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Cabo Admin Dashboard</h1>
        
        <Tabs defaultValue="guide-downloads" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="guide-downloads">Guide Downloads</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="guide-downloads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guide Download Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <GuideDownloads />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Bookings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <Leads />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Integrations />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <Analytics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 