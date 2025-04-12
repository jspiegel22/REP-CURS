import { Star, ChevronRight, Crown, Gem, Car, Calendar, Phone, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required").min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
  budget: z.string().optional(),
  groupSize: z.string().optional(),
  notes: z.string().optional(),
});

// Form error display component
const FormError = ({ message }: { message: string }) => {
  return message ? (
    <span className="text-sm text-red-500 mt-1">{message}</span>
  ) : null;
};

type FormData = z.infer<typeof formSchema>;

export default function LuxuryConcierge() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      budget: "",
      groupSize: "",
      notes: "",
    }
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log("Form submission started with data:", data);
      
      // Prepare the payload for Make.com webhook
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        interestType: "concierge",
        source: "website",
        budget: data.budget || "$10000+",
        timeline: `${data.checkIn} to ${data.checkOut}`,
        tags: "Luxury, Concierge, VIP",
        formName: "luxury-concierge",
        formData: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          groupSize: data.groupSize,
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

      // Show success message
      toast({
        title: "Thanks for your interest in our VIP services!",
        description: "One of our luxury concierge specialists will contact you within 24 hours to discuss your custom experience.",
        duration: 5000,
      });

      // Reset form
      form.reset();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: "VIP Access",
      description: "Exclusive access to premier venues and events",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Custom Itineraries",
      description: "Personalized schedules tailored to your preferences",
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Luxury Transport",
      description: "Premium vehicles and private chauffeurs",
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock personal concierge service",
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Special Requests",
      description: "From yacht charters to private chefs",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Priority Service",
      description: "Immediate attention to all your needs",
    },
  ];

  const testimonials = [
    {
      name: "Robert M.",
      text: "Exceptional service from start to finish. Every detail was perfectly executed.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=8",
    },
    {
      name: "Isabella K.",
      text: "The concierge team went above and beyond to make our stay unforgettable.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=9",
    },
  ];

  const stats = [
    { value: "100+", label: "Luxury Experiences" },
    { value: "50+", label: "VIP Partnerships" },
    { value: "24/7", label: "Concierge Service" },
    { value: "100%", label: "Client Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-12 md:pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4 md:mb-6">
              <p className="text-[#2F4F4F] text-xs md:text-sm font-medium">Luxury Concierge Services</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Experience Cabo Like Never Before
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Your personal gateway to exclusive experiences in Cabo San Lucas. From private yacht charters to VIP reservations, we handle every detail with precision and care.
            </p>

            {/* Enhanced Desktop CTA Button */}
            <Button
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg hover:gap-4"
            >
              Begin Your VIP Experience
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile CTA Button */}
            <Button
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              Begin Your VIP Experience
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative mt-8">
            <img
              src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3"
              alt="Luxury experience in Cabo"
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

      {/* Features and Benefits */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Exclusive VIP Services</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Client Experiences</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Request VIP Services</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("firstName")} 
                      placeholder="First Name*" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                    <FormError message={form.formState.errors.firstName?.message || ""} />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("lastName")} 
                      placeholder="Last Name" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("email")} 
                      type="email" 
                      placeholder="Email*" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                    <FormError message={form.formState.errors.email?.message || ""} />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("phone")} 
                      type="tel" 
                      placeholder="Phone" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("checkIn")} 
                      type="date" 
                      placeholder="Check-in" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("checkOut")} 
                      type="date" 
                      placeholder="Check-out" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("budget")} 
                      type="text" 
                      placeholder="Budget Range" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Input 
                      {...form.register("groupSize")} 
                      type="number" 
                      placeholder="Group Size" 
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2">
                    <Textarea
                      {...form.register("notes")}
                      placeholder="Tell us about your desired experience (Optional)"
                      className="w-full h-24 md:h-32"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 md:py-6 text-base md:text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request VIP Services
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}