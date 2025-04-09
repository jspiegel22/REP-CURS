import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormError } from "@/components/form/FormError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema with bachelorette party specific fields
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  timeline: z.string().min(1, "Timeline is required"),
  budget: z.string().min(1, "Budget is required"),
  groupSize: z.string().min(1, "Group size is required"),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BacheloretteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BacheloretteForm({ isOpen, onClose }: BacheloretteFormProps) {
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      timeline: '',
      budget: '',
      groupSize: '',
      specialRequests: '',
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Format lead data for the API
      const leadData = {
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        phone: data.phone || '',
        preferredContactMethod: 'Email' as const,
        interestType: "group_trip" as const,
        budget: data.budget,
        timeline: data.timeline,
        source: "website",
        status: "new" as const,
        formName: "bachelorette-party",
        formData: {
          groupSize: data.groupSize,
          specialRequests: data.specialRequests,
          eventType: "Bachelorette Party",
        },
        tags: ["Bachelorette Party", "Group Travel", "Event Planning"],
        submissionId: nanoid(),
      };
      
      // Submit to server API
      const response = await apiRequest("POST", "/api/leads", leadData);
      return await response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      reset();
      toast({
        title: "Request Submitted",
        description: "Thank you! We'll contact you about your bachelorette party planning.",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: FormData) => {
    console.log("Bachelorette form submission started with data:", data);
    submitMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    // Reset state after dialog is closed
    setTimeout(() => {
      if (!isOpen) {
        setSuccess(false);
      }
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-6 shadow-xl">
        {success ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F4F4F] mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your bachelorette party inquiry has been submitted successfully. 
                One of our event planners will contact you shortly to discuss your plans.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#2F4F4F]">
                Plan Your Bachelorette Party
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Fill out the form below and our team will help you plan the perfect Cabo bachelorette experience.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#2F4F4F]">First Name*</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    disabled={submitMutation.isPending}
                    placeholder="Your first name"
                    className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                  />
                  {errors.firstName && (
                    <FormError message={errors.firstName.message || "First name is required"} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#2F4F4F]">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    disabled={submitMutation.isPending}
                    placeholder="Your last name"
                    className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2F4F4F]">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={submitMutation.isPending}
                    placeholder="your@email.com"
                    className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                  />
                  {errors.email && (
                    <FormError message={errors.email.message || "Valid email is required"} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#2F4F4F]">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    disabled={submitMutation.isPending}
                    placeholder="(123) 456-7890"
                    className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-[#2F4F4F]">When are you planning to visit?*</Label>
                  <Select 
                    onValueChange={(value) => setValue("timeline", value)}
                    disabled={submitMutation.isPending}
                  >
                    <SelectTrigger id="timeline" className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Within 3 months">Within 3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="More than a year">More than a year</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.timeline && (
                    <FormError message={errors.timeline.message || "Timeline is required"} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-[#2F4F4F]">What's your budget?*</Label>
                  <Select 
                    onValueChange={(value) => setValue("budget", value)}
                    disabled={submitMutation.isPending}
                  >
                    <SelectTrigger id="budget" className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$1,000-$2,000 per person">$1,000-$2,000 per person</SelectItem>
                      <SelectItem value="$2,000-$3,500 per person">$2,000-$3,500 per person</SelectItem>
                      <SelectItem value="$3,500-$5,000 per person">$3,500-$5,000 per person</SelectItem>
                      <SelectItem value="$5,000+ per person">$5,000+ per person</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.budget && (
                    <FormError message={errors.budget.message || "Budget is required"} />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupSize" className="text-[#2F4F4F]">Group Size*</Label>
                <Select 
                  onValueChange={(value) => setValue("groupSize", value)}
                  disabled={submitMutation.isPending}
                >
                  <SelectTrigger id="groupSize" className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]">
                    <SelectValue placeholder="Select group size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-4 people">2-4 people</SelectItem>
                    <SelectItem value="5-8 people">5-8 people</SelectItem>
                    <SelectItem value="9-12 people">9-12 people</SelectItem>
                    <SelectItem value="13+ people">13+ people</SelectItem>
                  </SelectContent>
                </Select>
                {errors.groupSize && (
                  <FormError message={errors.groupSize.message || "Group size is required"} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-[#2F4F4F]">
                  Special Requests or Activities
                </Label>
                <Textarea
                  id="specialRequests"
                  {...register("specialRequests")}
                  disabled={submitMutation.isPending}
                  placeholder="Any special experiences or activities you're interested in? (spa packages, yacht parties, private chef, etc.)"
                  className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F] min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-6 text-lg"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}