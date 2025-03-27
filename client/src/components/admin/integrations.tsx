import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Integrations() {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ActiveCampaign Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable ActiveCampaign</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync form submissions with ActiveCampaign
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="Enter your ActiveCampaign API key" />
              </div>
              <div className="space-y-2">
                <Label>List ID</Label>
                <Input placeholder="Enter your ActiveCampaign list ID" />
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Airtable Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Airtable</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync form submissions with Airtable
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="Enter your Airtable API key" />
              </div>
              <div className="space-y-2">
                <Label>Base ID</Label>
                <Input placeholder="Enter your Airtable base ID" />
              </div>
              <div className="space-y-2">
                <Label>Table Name</Label>
                <Input placeholder="Enter your Airtable table name" />
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Google Sheets</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync form submissions with Google Sheets
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Service Account Key</Label>
                <Input type="file" accept=".json" />
              </div>
              <div className="space-y-2">
                <Label>Spreadsheet ID</Label>
                <Input placeholder="Enter your Google Sheets ID" />
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Google Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track form submissions and user behavior
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Measurement ID</Label>
                <Input placeholder="Enter your Google Analytics Measurement ID" />
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 