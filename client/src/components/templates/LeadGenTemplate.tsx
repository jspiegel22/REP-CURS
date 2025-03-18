import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Schema for lead generation forms
const leadFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Please provide more details about your inquiry"),
  preferredDates: z.string().min(1, "Please indicate your preferred dates"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadGenTemplateProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  features?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  amenities?: string[];
  onLeadSubmit?: (data: LeadFormData) => Promise<void>;
}

export default function LeadGenTemplate({
  title,
  subtitle,
  description,
  imageUrl,
  features = [],
  faqs = [],
  amenities = [],
  onLeadSubmit,
}: LeadGenTemplateProps) {
  const { toast } = useToast();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredDates: "",
    },
  });

  const handleSubmit = async (data: LeadFormData) => {
    try {
      if (onLeadSubmit) {
        await onLeadSubmit(data);
      } else {
        // Default submission handler
        await apiRequest("POST", "/api/leads", data);
      }

      toast({
        title: "Inquiry Sent",
        description: "We'll get back to you shortly with more information.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-xl md:text-2xl mb-6">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="prose max-w-none">
              <p className="text-lg">{description}</p>
            </div>

            {features.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-6">Request Information</h2>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Dates</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., July 15-20, 2024" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please share any specific requirements or questions"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Inquiry
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* FAQs Section */}
        {faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}