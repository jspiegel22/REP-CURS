import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
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
import { Check, Calendar, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Enhanced schema for lead generation forms
const leadFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  numberOfPeople: z.string().min(1, "Please indicate group size"),
  message: z.string().min(10, "Please tell us more about your trip"),
  preferredDates: z.string().min(1, "Please indicate your preferred dates"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface LeadGenTemplateProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  features: Feature[];
  faqs: FAQ[];
  benefits: string[];
  testimonials: Array<{
    name: string;
    text: string;
    rating: number;
    image?: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export default function LeadGenTemplate({
  title,
  subtitle,
  description,
  imageUrl,
  features,
  faqs,
  benefits,
  testimonials,
  stats
}: LeadGenTemplateProps) {
  const { toast } = useToast();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      numberOfPeople: "",
      message: "",
      preferredDates: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      // Handle form submission
      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch with you shortly.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Something went wrong",
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
            <p className="text-xl md:text-2xl mb-6 max-w-2xl">{subtitle}</p>
          )}

          {/* Stats Section in Hero */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Content */}
          <div className="space-y-12">
            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="p-6 rounded-lg border bg-card">
                  <div className="mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Benefits List */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">What You'll Get</h2>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">What Others Say</h2>
              <div className="grid gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-card rounded-lg p-6 border">
                    <div className="flex items-center gap-4 mb-4">
                      {testimonial.image && (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{testimonial.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="sticky top-8">
              <div className="bg-card p-6 rounded-lg border shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Start Planning Your Trip</h2>
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
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
                      name="numberOfPeople"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of People</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
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
                          <FormLabel>Tell us about your trip</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="What are you looking for in your perfect Cabo experience?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
                      disabled={form.formState.isSubmitting}
                    >
                      Get Started
                    </Button>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
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
      </div>
    </div>
  );
}