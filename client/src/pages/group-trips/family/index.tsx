import { Calendar, Users, Heart, Sun, Map, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

// Full form schema for desktop
const desktopFormSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
  budget: z.string().min(1, "Please enter your budget"),
  children: z.string().min(1, "Please enter number of children"),
  notes: z.string().optional(),
});

// Simplified mobile form schema
const mobileFormSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
});

type DesktopFormData = z.infer<typeof desktopFormSchema>;
type MobileFormData = z.infer<typeof mobileFormSchema>;

export default function FamilyTripsPage() {
  const { toast } = useToast();
  const desktopForm = useForm<DesktopFormData>({
    resolver: zodResolver(desktopFormSchema),
  });

  const mobileForm = useForm<MobileFormData>({
    resolver: zodResolver(mobileFormSchema),
  });

  const onSubmit = async (data: DesktopFormData | MobileFormData) => {
    try {
      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch shortly to plan your perfect family vacation.",
      });
      desktopForm.reset();
      mobileForm.reset();
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
      <div className="relative pt-12 md:pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4 md:mb-6">
              <p className="text-[#2F4F4F] text-xs md:text-sm font-medium">Your Ultimate Family Guide to Cabo</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Create Unforgettable Family Memories in Paradise
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Experience the magic of Cabo San Lucas with your loved ones. From toddler-friendly beach days to exciting teen adventures, we create the perfect balance for a memorable family vacation.
            </p>
            {/* CTA Button - Desktop Only */}
            <Button 
              onClick={() => document.getElementById('desktop-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-block bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg px-8 py-6 rounded-xl"
            >
              Book Your Family Vacation
            </Button>
          </div>

          <div className="relative mt-8">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"
              alt="Family enjoying beach vacation"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#2F4F4F]">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {/* Features Grid */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Our Family Package?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-6 rounded-xl border bg-white hover:shadow-lg transition-shadow">
                  <div className="text-[#2F4F4F] mb-4">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto mt-16 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What Families Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
      </div>

      {/* Desktop Form Section */}
      <div id="desktop-form" className="hidden md:block py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Plan Your Family Vacation</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={desktopForm.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input {...desktopForm.register("firstName")} placeholder="First Name" />
                  <Input {...desktopForm.register("lastName")} placeholder="Last Name" />
                  <Input {...desktopForm.register("email")} type="email" placeholder="Email Address" />
                  <Input {...desktopForm.register("phone")} type="tel" placeholder="Phone Number" />
                  <Input {...desktopForm.register("checkIn")} type="date" placeholder="Check-in Date" />
                  <Input {...desktopForm.register("checkOut")} type="date" placeholder="Check-out Date" />
                  <Input {...desktopForm.register("budget")} type="text" placeholder="Budget Range" />
                  <Input {...desktopForm.register("children")} type="number" placeholder="Number of Children" />
                </div>
                <Textarea 
                  {...desktopForm.register("notes")} 
                  placeholder="Additional Notes (Optional)"
                  className="w-full h-32"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-6 text-lg"
                >
                  Start Planning Your Family Vacation
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Form */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={mobileForm.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-2">
              <Input {...mobileForm.register("firstName")} placeholder="First Name" className="text-sm" />
              <Input {...mobileForm.register("lastName")} placeholder="Last Name" className="text-sm" />
              <Input {...mobileForm.register("email")} type="email" placeholder="Email" className="text-sm" />
              <Input {...mobileForm.register("phone")} type="tel" placeholder="Phone" className="text-sm" />
              <Input {...mobileForm.register("checkIn")} type="date" placeholder="Check-in" className="text-sm" />
              <Input {...mobileForm.register("checkOut")} type="date" placeholder="Check-out" className="text-sm" />
            </div>
            <Button 
              type="submit" 
              className="w-full mt-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 text-base"
            >
              Book Now
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}