import { Calendar, Users, Heart, Star, ChevronRight, Camera, Wifi, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

const formSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  socialHandle: z.string().min(1, "Please enter your social media handle"),
  platform: z.string().min(1, "Please select your main platform"),
  followers: z.string().min(1, "Please enter your follower count"),
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function InfluencerPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form submission started with data:", data);
      
      // Prepare the payload for Make.com webhook
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        interestType: 'influencer',
        source: 'website',
        status: 'new',
        budget: data.followers.includes('k') || data.followers.includes('K') || 
                parseInt(data.followers) > 10000 ? '$10000+' : '$5000-$10000',
        timeline: `${data.checkIn} to ${data.checkOut}`,
        tags: 'Influencer, Content Creation',
        formName: 'influencer-partnership',
        formData: {
          socialHandle: data.socialHandle,
          platform: data.platform,
          followers: data.followers,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          notes: data.notes,
          preferredContactMethod: 'Email',
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
        description: "Our influencer partnerships team will be in touch shortly.",
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
      icon: <Camera className="w-8 h-8" />,
      title: "Content Creation Support",
      description: "Professional photography and videography assistance",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "High-Speed Internet",
      description: "Stay connected with your audience",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Exclusive Locations",
      description: "Access to unique shooting locations",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Local Partnerships",
      description: "Connect with local brands and businesses",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Support",
      description: "Dedicated team for your content needs",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "VIP Treatment",
      description: "Special perks and exclusive access",
    },
  ];

  const testimonials = [
    {
      name: "@travelblogger",
      text: "Their influencer program is amazing! They understood exactly what I needed to create engaging content.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "@lifestylevlogger",
      text: "The team went above and beyond to help me create unforgettable content. Best collab ever!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const stats = [
    { value: "100+", label: "Creator Collabs" },
    { value: "1M+", label: "Reach Generated" },
    { value: "50+", label: "Exclusive Locations" },
    { value: "24/7", label: "Creator Support" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-12 md:pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4 md:mb-6">
              <p className="text-[#2F4F4F] text-xs md:text-sm font-medium">Creator Partnership Program</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Create Content That Inspires
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Join our exclusive creator program and showcase the beauty of Cabo San Lucas to your audience. Get access to stunning locations, professional support, and amazing perks.
            </p>

            {/* Enhanced Desktop CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg hover:gap-4"
            >
              Join Our Creator Program
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              Join Our Creator Program
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative mt-8">
            <img
              src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3"
              alt="Creator shooting content in Cabo"
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Creator Program Benefits</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Creator Testimonials</h2>
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

      {/* Booking Form Section */}
      <div id="booking-form" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Apply to Our Creator Program</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Grid layout - 2 columns on both mobile and desktop */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <Input {...form.register("firstName")} placeholder="First Name" className="text-sm md:text-base" />
                  <Input {...form.register("lastName")} placeholder="Last Name" className="text-sm md:text-base" />
                  <Input {...form.register("email")} type="email" placeholder="Email" className="text-sm md:text-base" />
                  <Input {...form.register("phone")} type="tel" placeholder="Phone" className="text-sm md:text-base" />
                  <Input {...form.register("socialHandle")} placeholder="Social Handle" className="text-sm md:text-base" />
                  <Input {...form.register("platform")} placeholder="Main Platform" className="text-sm md:text-base" />
                  <Input {...form.register("followers")} placeholder="Follower Count" className="text-sm md:text-base" />
                  <Input {...form.register("checkIn")} type="date" placeholder="Preferred Visit Date" className="text-sm md:text-base" />
                  {/* Notes field spans full width */}
                  <div className="col-span-2">
                    <Textarea 
                      {...form.register("notes")} 
                      placeholder="Tell us about your content style and vision (Optional)"
                      className="w-full h-24 md:h-32 text-sm md:text-base mt-0"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 md:py-6 text-base md:text-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
