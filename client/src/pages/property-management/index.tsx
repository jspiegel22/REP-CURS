import { Home, DollarSign, Shield, Settings, BarChart, CalendarRange, ChevronRight } from "lucide-react";
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
  propertyType: z.string().min(1, "Please select your property type"),
  propertyAddress: z.string().min(1, "Please enter your property address").optional(),
  bedrooms: z.string().min(1, "Please enter number of bedrooms").optional(),
  bathrooms: z.string().min(1, "Please enter number of bathrooms").optional(),
  managementType: z.string().min(1, "Please select management type").optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    alt: "Luxury villa in Cabo",
    caption: "One of our premium managed properties in Pedregal"
  },
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    alt: "Modern home interior",
    caption: "Professional interior design services for rental optimization"
  },
  {
    src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    alt: "Property manager with client",
    caption: "Our property management team at work"
  },
  {
    src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
    alt: "Maintenance services",
    caption: "Regular maintenance keeps properties in perfect condition"
  },
  {
    src: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    alt: "Rental marketing",
    caption: "Professional photography for maximum booking potential"
  },
  {
    src: "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
    alt: "Booking management",
    caption: "Seamless booking experience for guests and owners"
  }
];

export default function PropertyManagementPage() {
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
        interestType: 'property_management',
        source: 'website',
        status: 'new',
        tags: "Property Management, Real Estate",
        formName: 'property-management-form',
        formData: {
          propertyType: data.propertyType,
          propertyAddress: data.propertyAddress,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          managementType: data.managementType,
          notes: data.notes,
          preferredContactMethod: 'Email',
          specificType: 'property_management'
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
        description: "We'll be in touch shortly to discuss managing your Cabo property.",
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
      icon: <Home className="w-8 h-8" />,
      title: "Full-Service Management",
      description: "End-to-end property care and rental services",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Revenue Optimization",
      description: "Strategies to maximize your rental income",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Property Protection",
      description: "Security, maintenance, and insurance solutions",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Maintenance Services",
      description: "Regular upkeep and emergency repairs",
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Marketing & Promotion",
      description: "Exposure to our network of 250,000+ travelers",
    },
    {
      icon: <CalendarRange className="w-8 h-8" />,
      title: "Booking Management",
      description: "Seamless reservation handling and guest services",
    },
  ];

  const testimonials = [
    {
      name: "Robert Thompson",
      title: "Villa Owner, Pedregal",
      text: "Since partnering with @cabo for property management, my occupancy rate has increased by 35% and the property is maintained perfectly.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=8",
    },
    {
      name: "Sarah Johnson",
      title: "Condo Owner, Cabo San Lucas",
      text: "Their network of luxury travelers has transformed my rental income. The maintenance team is professional and thorough.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=9",
    },
  ];

  const stats = [
    { value: "150+", label: "Properties Managed" },
    { value: "95%", label: "Owner Satisfaction" },
    { value: "250K+", label: "Traveler Network" },
    { value: "28%", label: "Avg. Revenue Increase" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-12 md:pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-block bg-[#2F4F4F]/10 px-4 py-2 rounded-full mb-4 md:mb-6">
              <p className="text-[#2F4F4F] text-xs md:text-sm font-medium">Property Management Excellence</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Maximize Your Cabo Property's Potential
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Professional property management services for short-term and long-term rentals with marketing to our network of 250,000+ Cabo travelers.
            </p>

            {/* Enhanced Desktop CTA Button */}
            <Button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-xl px-10 py-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg hover:gap-4"
            >
              Manage My Property
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="md:hidden w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              Manage My Property
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative mt-8">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
              alt="Luxury villa in Cabo San Lucas"
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Property Management Services</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What Property Owners Say</h2>
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
        title="Our Managed Properties"
        subtitle="Properties in our management portfolio"
        images={galleryImages}
      />

      {/* Management Process */}
      <div className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Management Process</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-[#2F4F4F] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">1</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Property Evaluation</h3>
                  <p className="text-gray-600">We'll assess your property's potential, recommend optimizations, and develop a tailored management strategy.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-[#2F4F4F] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">2</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Setup & Preparation</h3>
                  <p className="text-gray-600">Professional photography, market analysis, listing setup, and property preparation for guests.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-[#2F4F4F] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">3</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Active Management</h3>
                  <p className="text-gray-600">Booking management, guest communication, cleaning, maintenance, and 24/7 support.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-[#2F4F4F] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">4</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Reporting & Optimization</h3>
                  <p className="text-gray-600">Regular financial reporting, performance analytics, and continual strategy refinement to maximize returns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-form" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Get Started with Property Management</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 border">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Grid layout - 2 columns on both mobile and desktop */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <Input {...form.register("firstName")} placeholder="First Name*" className="text-sm md:text-base" />
                  <Input {...form.register("lastName")} placeholder="Last Name*" className="text-sm md:text-base" />
                  <Input {...form.register("email")} type="email" placeholder="Email*" className="text-sm md:text-base" />
                  <Input {...form.register("phone")} type="tel" placeholder="Phone*" className="text-sm md:text-base" />
                  
                  <select 
                    {...form.register("propertyType")} 
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Property Type*</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <select 
                    {...form.register("managementType")} 
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Management Type*</option>
                    <option value="full_service">Full-Service Management</option>
                    <option value="rental_only">Rental Management Only</option>
                    <option value="maintenance_only">Maintenance Only</option>
                    <option value="consulting">Consulting Services</option>
                  </select>
                  
                  <Input {...form.register("propertyAddress")} placeholder="Property Address" className="text-sm md:text-base" />
                  <div className="flex gap-3">
                    <Input {...form.register("bedrooms")} type="number" placeholder="Bedrooms" className="text-sm md:text-base" />
                    <Input {...form.register("bathrooms")} type="number" placeholder="Bathrooms" className="text-sm md:text-base" />
                  </div>
                  
                  {/* Notes field spans full width */}
                  <div className="col-span-2">
                    <Textarea 
                      {...form.register("notes")} 
                      placeholder="Tell us more about your property and management needs (Optional)"
                      className="w-full h-24 md:h-32 text-sm md:text-base mt-0"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-4 md:py-6 text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Get Property Management Quote
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