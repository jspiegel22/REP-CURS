import { Calendar, Users, Heart, Camera, Map, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";
import { ClientGallery } from "@/components/client-gallery";

const formSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  date: z.string().min(1, "Please select a preferred date"),
  guestCount: z.string().min(1, "Please enter expected guest count"),
  budget: z.string().min(1, "Please enter your budget"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function WeddingsPage() {
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
        interestType: "lead",
        source: "website",
        status: "new",
        budget: data.budget,
        timeline: data.date,
        tags: "Wedding, Event Planning",
        formName: "wedding-planning-form",
        formData: {
          date: data.date,
          guestCount: data.guestCount,
          notes: data.notes,
          preferredContactMethod: 'Email',
          specificType: 'wedding'
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
        description: "We'll be in touch shortly to plan your perfect wedding.",
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
      icon: <Map className="w-8 h-8" />,
      title: "Stunning Venues",
      description: "Breathtaking beachfront and luxury resort locations",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Photo & Video",
      description: "Professional photography and videography services",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Full Planning",
      description: "Comprehensive wedding planning and coordination",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customization",
      description: "Personalized decorations and themes",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Dates",
      description: "Year-round availability for your perfect day",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Luxury Service",
      description: "5-star catering and premium amenities",
    },
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      image: "https://images.unsplash.com/photo-1623778392692-e5856a682b60?ixlib=rb-4.0.3",
      rating: 5,
      text: "Our Cabo wedding was absolutely perfect! The team took care of every detail, making our dream wedding come true.",
    },
    {
      name: "Emily & James",
      image: "https://images.unsplash.com/photo-1623778392692-e5856a682b60?ixlib=rb-4.0.3",
      rating: 5,
      text: "From the stunning beachfront ceremony to the reception, everything was magical. Our guests are still talking about it!",
    },
  ];

  const stats = [
    { value: "150+", label: "Weddings" },
    { value: "5⭐", label: "Rating" },
    { value: "100%", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
  ];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74",
      alt: "Beach wedding ceremony",
      caption: "Beachfront ceremony at sunset"
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      alt: "Wedding reception",
      caption: "Elegant beach reception setup"
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      alt: "Wedding details",
      caption: "Beautiful wedding decoration details"
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      alt: "Couple photo",
      caption: "Romantic couple photos by the ocean"
    },
    {
      src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74",
      alt: "Wedding party",
      caption: "Celebrating with friends and family"
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      alt: "First dance",
      caption: "First dance under the stars"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-12 md:pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4 md:mb-6">
              <p className="text-[#2F4F4F] text-xs md:text-sm font-medium">Your Dream Wedding in Paradise</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Create Your Perfect Wedding in Cabo
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Let us help you plan the wedding of your dreams in beautiful Cabo San Lucas. From intimate ceremonies to grand celebrations, we'll make your special day unforgettable.
            </p>

            {/* Desktop CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg hover:gap-4"
            >
              Start Planning Your Wedding
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              Start Planning Your Wedding
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative mt-8">
            <img
              src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74"
              alt="Beach wedding ceremony"
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

      {/* Features Grid */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Us for Your Wedding?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border bg-white hover:shadow-lg transition-shadow">
                <div className="text-[#2F4F4F] mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Gallery */}
      <ClientGallery 
        title="Wedding Moments in Cabo"
        subtitle="Real moments from our happy couples"
        images={galleryImages}
      />

      {/* Testimonials */}
      <div className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What Couples Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
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

      {/* Booking Form Section */}
      <div id="booking-form" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Start Planning Your Wedding</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <div>
                    <Input {...form.register("firstName")} placeholder="First Name*" className="text-sm md:text-base" />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Input {...form.register("lastName")} placeholder="Last Name*" className="text-sm md:text-base" />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <Input {...form.register("email")} type="email" placeholder="Email*" className="text-sm md:text-base" />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Input {...form.register("phone")} type="tel" placeholder="Phone*" className="text-sm md:text-base" />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Input {...form.register("date")} type="date" placeholder="Preferred Date*" className="text-sm md:text-base" />
                    {form.formState.errors.date && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                  <div>
                    <Input {...form.register("guestCount")} type="number" placeholder="Guest Count*" className="text-sm md:text-base" />
                    {form.formState.errors.guestCount && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.guestCount.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input {...form.register("budget")} type="text" placeholder="Budget Range*" className="text-sm md:text-base w-full" />
                    {form.formState.errors.budget && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.budget.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Textarea 
                      {...form.register("notes")} 
                      placeholder="Tell us about your dream wedding (Optional)"
                      className="w-full h-24 md:h-32 text-sm md:text-base mt-0"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 md:py-6 text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Start Planning Your Wedding
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
