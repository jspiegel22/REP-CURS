import { Calendar, Users, Briefcase, Globe, Award, Target, ChevronRight } from "lucide-react";
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
  companyName: z.string().min(2, "Please enter your company name"),
  eventType: z.string().min(1, "Please select an event type"),
  checkIn: z.string().min(1, "Please select a check-in date"),
  checkOut: z.string().min(1, "Please select a check-out date"),
  budget: z.string().min(1, "Please enter your budget").optional(),
  groupSize: z.string().min(1, "Please enter group size").optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    alt: "Corporate event by the beach",
    caption: "Executives strategizing with an ocean view"
  },
  {
    src: "https://images.unsplash.com/photo-1524117074681-31bd4de22ad3",
    alt: "Team building activity",
    caption: "Team building activities that strengthen bonds"
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    alt: "Evening corporate reception",
    caption: "Elegant networking events under the stars"
  },
  {
    src: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6",
    alt: "Corporate awards ceremony",
    caption: "Recognition ceremonies that inspire"
  },
  {
    src: "https://images.unsplash.com/photo-1559223607-a43fac982a92",
    alt: "Luxury corporate transportation",
    caption: "Executive transportation services"
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    alt: "Resort meeting space",
    caption: "State-of-the-art facilities for productive meetings"
  }
];

export default function CorporateEventsPage() {
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
        interestType: 'group_trip',
        source: 'website',
        status: 'new',
        budget: data.budget || '$10000-$50000',
        timeline: `${data.checkIn} to ${data.checkOut}`,
        tags: "Corporate Event, Group Trip, Business",
        formName: 'corporate-event-form',
        formData: {
          companyName: data.companyName,
          eventType: data.eventType,
          groupSize: data.groupSize,
          notes: data.notes,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          preferredContactMethod: 'Email',
          specificType: 'corporate_event'
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
        description: "We'll be in touch shortly to plan your corporate event in Cabo.",
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
      icon: <Briefcase className="w-8 h-8" />,
      title: "President's Club Events",
      description: "Reward top performers with an unforgettable experience",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Strategic Planning",
      description: "Productive sessions in inspiring settings",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Building",
      description: "Strengthen bonds with exciting group activities",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Recognition Ceremonies",
      description: "Celebrate achievements in style",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Full-Service Planning",
      description: "End-to-end event management and logistics",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Customized Itineraries",
      description: "Tailored schedules for your business objectives",
    },
  ];

  const testimonials = [
    {
      name: "Jane Wilson",
      title: "VP of Sales, TechCorp",
      text: "Our President's Club trip to Cabo was a tremendous success. The team loved the balance of productive sessions and relaxation.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Michael Roberts",
      title: "HR Director, Global Finance",
      text: "The attention to detail in coordinating our corporate retreat was impressive. Every aspect was aligned with our company culture.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const stats = [
    { value: "100+", label: "Corporate Events" },
    { value: "50+", label: "Fortune 500 Clients" },
    { value: "25K+", label: "Attendees Hosted" },
    { value: "24/7", label: "Concierge Support" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-12 md:pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4 md:mb-6">
              <p className="text-[#2F4F4F] text-xs md:text-sm font-medium">Corporate Excellence in Paradise</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Elevate Your Corporate Events in Cabo
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              From executive retreats and President's Club celebrations to strategic planning sessions, we create exceptional corporate experiences in the perfect setting.
            </p>

            {/* Enhanced Desktop CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg hover:gap-4"
            >
              Plan Your Corporate Event
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              Plan Your Corporate Event
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative mt-8">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72"
              alt="Corporate event at Cabo San Lucas"
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Corporate Services & Experiences</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Client Testimonials</h2>
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
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
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
        title="Corporate Excellence in Cabo"
        subtitle="Real events we've organized for our business clients"
        images={galleryImages}
      />

      {/* Booking Form Section */}
      <div id="booking-form" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Plan Your Corporate Event</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Grid layout - 2 columns on both mobile and desktop */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <Input {...form.register("firstName")} placeholder="First Name*" className="text-sm md:text-base" />
                  <Input {...form.register("lastName")} placeholder="Last Name*" className="text-sm md:text-base" />
                  <Input {...form.register("email")} type="email" placeholder="Email*" className="text-sm md:text-base" />
                  <Input {...form.register("phone")} type="tel" placeholder="Phone*" className="text-sm md:text-base" />
                  <Input {...form.register("companyName")} placeholder="Company Name*" className="text-sm md:text-base" />
                  <select 
                    {...form.register("eventType")} 
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Event Type*</option>
                    <option value="presidents_club">President's Club</option>
                    <option value="team_building">Team Building</option>
                    <option value="strategic_planning">Strategic Planning</option>
                    <option value="incentive_trip">Incentive Trip</option>
                    <option value="conference">Conference/Meeting</option>
                    <option value="other">Other</option>
                  </select>
                  <Input {...form.register("checkIn")} type="date" placeholder="Check-in" className="text-sm md:text-base" />
                  <Input {...form.register("checkOut")} type="date" placeholder="Check-out" className="text-sm md:text-base" />
                  <Input {...form.register("budget")} type="text" placeholder="Budget Range" className="text-sm md:text-base" />
                  <Input {...form.register("groupSize")} type="number" placeholder="Approx. Group Size" className="text-sm md:text-base" />
                  
                  {/* Notes field spans full width */}
                  <div className="col-span-2">
                    <Textarea 
                      {...form.register("notes")} 
                      placeholder="Event requirements and additional notes (Optional)"
                      className="w-full h-24 md:h-32 text-sm md:text-base mt-0"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 md:py-6 text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Submit Corporate Event Request
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}