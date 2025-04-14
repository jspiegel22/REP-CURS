import { Calendar, Users, Heart, Sun, Map, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import { ClientGallery } from "@/components/client-gallery";

// Form schema
const formSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
  budget: z.string().min(1, "Please enter your budget").optional(),
  children: z.string().min(1, "Please enter number of children").optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa",
    alt: "Family enjoying beach vacation",
    caption: "The Martinez family's unforgettable week in Cabo"
  },
  {
    src: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf",
    alt: "Kids playing on the beach",
    caption: "Creating memories that last a lifetime"
  },
  {
    src: "https://images.unsplash.com/photo-1565538394668-0c2720bb5c9e",
    alt: "Family dinner by the ocean",
    caption: "Magical sunset dinners with the whole family"
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    alt: "Pool activities",
    caption: "Fun pool activities for all ages"
  },
  {
    src: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570",
    alt: "Beach activities",
    caption: "Beach adventures with the little ones"
  },
  {
    src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a",
    alt: "Family exploration",
    caption: "Exploring Cabo's hidden gems together"
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    alt: "Resort activities",
    caption: "Endless activities for the whole family"
  },
  {
    src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a",
    alt: "Sunset family moment",
    caption: "Cherished moments under the Cabo sun"
  }
];

export default function FamilyTripsPage() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form submission started with data:", data);
      
      // Prepare the payload for Make.com webhook
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        interestType: 'lead',
        source: 'website',
        status: 'new',
        budget: data.budget || '$5000-$10000',
        timeline: `${data.checkIn} to ${data.checkOut}`,
        tags: "Family Trip, Group Travel",
        formName: 'family-trip-form',
        formData: {
          numberOfChildren: data.children,
          notes: data.notes,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          preferredContactMethod: 'Email',
          specificType: 'family_trip'
        }
      };
      
      // Send the data to our API which will forward to Make.com webhook
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form. Please try again.');
      }
      
      console.log("Submission sent to server, which will forward to Make.com webhook");
      
      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch shortly to plan your perfect family vacation.",
      });
      form.reset();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to submit form. Please try again.",
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

            {/* Enhanced Desktop CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg hover:gap-4"
            >
              Book Your Family Vacation
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              Book Your Family Vacation
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Hero Image */}
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

      {/* Client Gallery */}
      <ClientGallery 
        title="Family Memories in Cabo"
        subtitle="Real moments from our happy families"
        images={galleryImages}
      />

      {/* Booking Form Section - Updated for better mobile layout */}
      <div id="booking-form" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Plan Your Family Vacation</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Grid layout - 2 columns on both mobile and desktop */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <Input {...form.register("firstName")} placeholder="First Name*" className="text-sm md:text-base" />
                  <Input {...form.register("lastName")} placeholder="Last Name*" className="text-sm md:text-base" />
                  <Input {...form.register("email")} type="email" placeholder="Email*" className="text-sm md:text-base" />
                  <Input {...form.register("phone")} type="tel" placeholder="Phone*" className="text-sm md:text-base" />
                  <Input {...form.register("checkIn")} type="date" placeholder="Check-in" className="text-sm md:text-base" />
                  <Input {...form.register("checkOut")} type="date" placeholder="Check-out" className="text-sm md:text-base" />
                  <Input {...form.register("budget")} type="text" placeholder="Budget Range" className="text-sm md:text-base" />
                  <Input {...form.register("children")} type="number" placeholder="# of Children" className="text-sm md:text-base" />
                  {/* Notes field spans full width */}
                  <div className="col-span-2">
                    <Textarea 
                      {...form.register("notes")} 
                      placeholder="Additional Notes (Optional)"
                      className="w-full h-24 md:h-32 text-sm md:text-base mt-0"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 md:py-6 text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Start Planning Your Family Vacation
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}