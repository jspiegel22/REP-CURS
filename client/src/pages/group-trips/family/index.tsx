import { Calendar, Users, Heart, Sun, Map, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

const leadFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function FamilyTripsPage() {
  const { toast } = useToast();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      // Handle form submission
      toast({
        title: "Thanks for your interest!",
        description: "We'll send you our family travel guide shortly.",
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

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family-Friendly Activities",
      description: "Curated experiences perfect for all age groups",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Plan activities around your family's needs",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Care",
      description: "Dedicated concierge for your family's needs",
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Beach Activities",
      description: "Safe and fun beach experiences for everyone",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Local Expertise",
      description: "Insider knowledge of family-friendly spots",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "Vetted activities and accommodations",
    },
  ];

  const testimonials = [
    {
      name: "The Johnson Family",
      text: "Our trip to Cabo was perfect for the whole family. The kids had a blast, and we parents got to relax too!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Sarah M.",
      text: "The attention to detail in planning activities for both our toddler and teenager was impressive.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=2",
    },
  ];

  const stats = [
    { value: "500+", label: "Families Served" },
    { value: "100%", label: "Safe Trips" },
    { value: "50+", label: "Kid-Friendly Activities" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-6">
              <p className="text-[#2F4F4F] text-sm font-medium">Your Ultimate Family Guide to Cabo</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Unforgettable Family Memories in Paradise
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the magic of Cabo San Lucas with your loved ones. From toddler-friendly beach days to exciting teen adventures, we create the perfect balance for a memorable family vacation.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"
              alt="Family enjoying beach vacation"
              className="w-full h-[500px] object-cover rounded-2xl"
            />

            {/* Floating Form */}
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
              <div className="bg-white rounded-xl shadow-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Get Your FREE 2025 Family Guide</h3>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      {...form.register("name")}
                      placeholder="Enter your name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white">
                    Download the Guide
                  </Button>
                  <p className="text-xs text-center text-gray-500">Free forever • No card required</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gray-50 py-20 mt-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-[#2F4F4F]">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Family Package?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border bg-white hover:shadow-lg transition-shadow">
                <div className="text-[#2F4F4F] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Families Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}