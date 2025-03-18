import { Calendar, Users, Heart, Sun, Map, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  checkInDate: z.string().min(1, "Please select a check-in date"),
  checkOutDate: z.string().min(1, "Please select a check-out date"),
  budget: z.string().min(1, "Please enter your budget"),
  numberOfChildren: z.string().min(1, "Please enter number of children"),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function FamilyTripsPage() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      checkInDate: "",
      checkOutDate: "",
      budget: "",
      numberOfChildren: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Handle form submission
      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch shortly to plan your perfect family vacation.",
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

  const stats = [
    { value: "500+", label: "Families Served" },
    { value: "100%", label: "Safe Trips" },
    { value: "50+", label: "Kid-Friendly Activities" },
    { value: "24/7", label: "Support" },
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

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section with minimalist design */}
      <div className="relative pt-8 md:pt-12 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-[#2F4F4F] text-sm font-medium mb-4">Looking for a 2025 Family Vacation Guide?</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Experience Luxury Family Travel in Paradise
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover the finest experiences Cabo San Lucas has to offer, with insider tips and exclusive access 🎯
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"
              alt="Family enjoying beach vacation"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
            <p className="ml-4 text-sm text-gray-600">from 2000+ happy travelers</p>
          </div>
        </div>
      </div>

      {/* Floating Form - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-4">Book Your Family Vacation</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...form.register("firstName")}
                  placeholder="First Name"
                  className="h-10"
                />
                <Input
                  {...form.register("lastName")}
                  placeholder="Last Name"
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="h-10"
                />
                <Input
                  {...form.register("phone")}
                  type="tel"
                  placeholder="Phone Number"
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...form.register("checkInDate")}
                  type="date"
                  placeholder="Check-in Date"
                  className="h-10"
                />
                <Input
                  {...form.register("checkOutDate")}
                  type="date"
                  placeholder="Check-out Date"
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...form.register("budget")}
                  type="number"
                  placeholder="Budget (USD)"
                  className="h-10"
                />
                <Input
                  {...form.register("numberOfChildren")}
                  type="number"
                  placeholder="Number of Children"
                  className="h-10"
                />
              </div>
              <Textarea
                {...form.register("additionalNotes")}
                placeholder="Any special requirements or preferences?"
                className="min-h-[60px]"
              />
              <Button 
                type="submit" 
                className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white h-10 text-base"
              >
                Book Now
              </Button>
              <p className="text-xs text-center text-gray-500">Free consultation • No card required</p>
            </form>
          </div>
        </div>
      </div>

      {/* Content with bottom padding to account for fixed form */}
      <div className="pb-[400px]">
        {/* Social Proof */}
        <div className="bg-gray-50 py-20">
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
                <div key={index} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
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
    </div>
  );
}