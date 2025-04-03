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
import { FormError } from "@/components/form/FormError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Enhanced form schema with additional fields
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  preferredContactMethod: z.enum(["Email", "Phone", "Either"]).default("Email"),
  interestAreas: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

interface GuideDownloadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideDownloadForm({ isOpen, onClose }: GuideDownloadFormProps) {
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredContactMethod: 'Email',
      interestAreas: []
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const submissionData = {
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        phone: data.phone || '',
        preferredContactMethod: data.preferredContactMethod,
        guideType: "Cabo San Lucas Travel Guide",
        source: "website",
        status: "pending" as const,
        formName: "guide-download",
        submissionId: nanoid(),
        tags: ["Guide Request", "Website"],
        interestAreas: data.interestAreas.length > 0 ? data.interestAreas : ["Travel Guide"],
      };
      
      const response = await apiRequest("POST", "/api/guide-submissions", submissionData);
      return await response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      reset();
      toast({
        title: "Guide Request Submitted",
        description: "Your guide is ready to download!",
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
    console.log("Form submission started with data:", data);
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
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-6 shadow-xl">
        {success ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F4F4F] mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">Your guide is ready to download</p>
              <a
                href="https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#2F4F4F] text-white px-6 py-3 rounded-xl hover:bg-[#1F3F3F] transition-colors mb-4"
              >
                Download Guide Now
              </a>
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
              <DialogTitle className="text-2xl font-bold text-[#2F4F4F]">Get Your Free Guide</DialogTitle>
              <DialogDescription className="text-gray-600">
                Enter your details below to receive your free guide to Cabo's best experiences.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
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
                    <FormError message={errors.firstName.message ?? "First name is required"} />
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
                  <FormError message={errors.email.message ?? "Valid email is required"} />
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

              <div className="space-y-2">
                <Label htmlFor="preferredContactMethod" className="text-[#2F4F4F]">Preferred Contact Method</Label>
                <select
                  id="preferredContactMethod"
                  {...register("preferredContactMethod")}
                  disabled={submitMutation.isPending}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Either">Either</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#2F4F4F]">What are you interested in?</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interest-villas"
                      value="Villas"
                      {...register("interestAreas")}
                      className="rounded border-gray-300 text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <Label htmlFor="interest-villas" className="text-sm font-normal">Luxury Villas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interest-resorts"
                      value="Resorts"
                      {...register("interestAreas")}
                      className="rounded border-gray-300 text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <Label htmlFor="interest-resorts" className="text-sm font-normal">Resorts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interest-activities"
                      value="Activities"
                      {...register("interestAreas")}
                      className="rounded border-gray-300 text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <Label htmlFor="interest-activities" className="text-sm font-normal">Activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interest-restaurants"
                      value="Restaurants"
                      {...register("interestAreas")}
                      className="rounded border-gray-300 text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <Label htmlFor="interest-restaurants" className="text-sm font-normal">Restaurants</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interest-concierge"
                      value="Concierge"
                      {...register("interestAreas")}
                      className="rounded border-gray-300 text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <Label htmlFor="interest-concierge" className="text-sm font-normal">Concierge</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="interest-weddings"
                      value="Weddings"
                      {...register("interestAreas")}
                      className="rounded border-gray-300 text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <Label htmlFor="interest-weddings" className="text-sm font-normal">Weddings</Label>
                  </div>
                </div>
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
                  "Get Guide Now"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}