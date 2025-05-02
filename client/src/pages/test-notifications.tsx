import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Send, 
  Loader2, 
  UserPlus, 
  Calendar, 
  Download 
} from "lucide-react";

// Form validation schema for test email
const testEmailSchema = z.object({
  recipientEmail: z.string().email({ message: "Please enter a valid email address" }),
  emailType: z.enum(["test", "booking", "lead", "guide"]),
  name: z.string().optional(),
  bookingType: z.enum(["transportation", "villa", "resort", "adventure"]).optional(),
});

type TestEmailFormValues = z.infer<typeof testEmailSchema>;

// Sample transportation booking data
const sampleTransportationBooking = {
  id: "sample-booking-123",
  confirmationNumber: "CB" + Math.floor(100000 + Math.random() * 900000),
  date: new Date().toLocaleDateString(),
  amount: "149.00",
  fromLocation: "Los Cabos International Airport (SJD)",
  toLocation: "Cabo San Lucas - Downtown",
  departureDate: new Date().toLocaleDateString(),
  returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  passengers: "4",
  vehicleType: "Suburban SUV"
};

// Sample lead data
const sampleLeadData = {
  id: 1,
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  interestType: "transportation",
  status: "new",
  details: {
    from: "Los Cabos International Airport (SJD)",
    to: "Cabo San Lucas - Downtown",
    date: new Date().toLocaleDateString(),
    passengers: "3"
  }
};

export default function TestNotificationsPage() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [selectedTab, setSelectedTab] = useState("test");
  
  // Form setup
  const form = useForm<TestEmailFormValues>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      recipientEmail: "",
      emailType: "test",
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: TestEmailFormValues) => {
    setIsSending(true);
    
    try {
      let response;
      
      switch (values.emailType) {
        case "test":
          response = await apiRequest("POST", "/api/send-test-email", {
            recipientEmail: values.recipientEmail
          });
          break;
          
        case "booking":
          // Send a sample booking confirmation
          response = await apiRequest("POST", "/api/send-booking-confirmation", {
            email: values.recipientEmail,
            name: values.name || "Test User",
            bookingType: values.bookingType || "transportation",
            confirmationNumber: sampleTransportationBooking.confirmationNumber,
            booking: sampleTransportationBooking
          });
          break;
          
        case "lead":
          // Send a sample lead notification
          response = await apiRequest("POST", "/api/send-lead-notification", {
            leadId: 1, // Using sample lead data
            email: values.recipientEmail
          });
          break;
          
        case "guide":
          // Send a sample guide notification
          response = await apiRequest("POST", "/api/send-guide-notification", {
            email: values.recipientEmail,
            name: values.name || "Test User",
            guideType: "transportation"
          });
          break;
      }
      
      if (response.ok) {
        toast({
          title: "Email Sent Successfully",
          description: `The ${values.emailType} email has been sent to ${values.recipientEmail}`,
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to Send Email",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    form.setValue("emailType", value as any);
  };
  
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Notification Testing</h1>
          <p className="text-gray-500">
            Test various email notifications using SendGrid integration
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Send Test Notifications</CardTitle>
            <CardDescription>
              Send different types of notification emails to test the email system
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email address to receive the test notification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Tabs value={selectedTab} onValueChange={handleTabChange}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="test">
                      <Mail className="h-4 w-4 mr-2" />
                      Simple Test
                    </TabsTrigger>
                    <TabsTrigger value="booking">
                      <Calendar className="h-4 w-4 mr-2" />
                      Booking
                    </TabsTrigger>
                    <TabsTrigger value="lead">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Lead
                    </TabsTrigger>
                    <TabsTrigger value="guide">
                      <Download className="h-4 w-4 mr-2" />
                      Guide
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="test" className="pt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Send a simple test email to verify the email service is working correctly.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="booking" className="pt-4 space-y-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Send a sample booking confirmation email.
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bookingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select booking type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="transportation">Transportation</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="resort">Resort</SelectItem>
                              <SelectItem value="adventure">Adventure</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="lead" className="pt-4">
                    <p className="text-sm text-gray-500">
                      Send a sample lead notification email using the following test data:
                    </p>
                    <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-auto">
                      {JSON.stringify(sampleLeadData, null, 2)}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="guide" className="pt-4 space-y-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Send a sample guide download notification email.
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-start border-t pt-6">
            <h3 className="text-sm font-medium mb-2">About SendGrid Integration</h3>
            <p className="text-sm text-gray-500">
              This page tests the email notification system using SendGrid. All emails are
              sent through the SendGrid API using the configured API key. Make sure your
              SendGrid account is properly set up and the API key has the necessary permissions.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}