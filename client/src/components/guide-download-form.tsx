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

// Simplified form schema with just the essential fields
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
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
      email: '',
      phone: ''
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Prepare submission data with required API fields
      const submissionData = {
        firstName: data.firstName,
        lastName: '', // Not collected anymore but required by API
        email: data.email,
        phone: data.phone || '',
        preferredContactMethod: 'Email' as const, // Default to email
        guideType: "Cabo San Lucas Travel Guide",
        source: "website",
        status: "pending" as const,
        formName: "guide-download",
        submissionId: nanoid(),
        tags: ["Guide Request", "Website"],
        interestAreas: ["Travel Guide"], // Default interest area
      };
      
      // Submit to our main API
      const response = await apiRequest("POST", "/api/guide-submissions", submissionData);
      const result = await response.json();
      
      // Instead of using the webhook library directly, we'll use our direct Make.com webhook
      // if it's configured in the environment
      try {
        const makeWebhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
        if (makeWebhookUrl) {
          console.log("Attempting direct Make.com webhook submission for guide");
          
          // Format data according to Airtable column structure
          const webhookData = {
            "First Name": data.firstName,
            "Last Name": '', 
            "Email": data.email,
            "Phone": data.phone || '',
            "Preferred Contact Method": 'Email',
            "Preferred Contact Time": "Any",
            "Submission Type": "Guide Request",
            "Status": "New",
            "Priority": "Normal",
            "Interest Type": "Cabo Travel Guide",
            "Guide Type": "Cabo San Lucas Travel Guide",
            "Interest Areas": "Travel Guide",
            "Form Name": "guide-download",
            "Source Page": "website",
            "Form Data": JSON.stringify({
              source: "website",
              formName: "guide-download",
              preferredContactMethod: 'Email',
              submissionId: submissionData.submissionId,
            }),
            "Submission ID": submissionData.submissionId,
            "Created At": new Date().toISOString(),
            "Download Link": "https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing",
            "Tags": "Guide Request, Website"
          };
          
          // Use fetch directly - don't await to keep form submission fast
          fetch(makeWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }).then(response => {
            if (response.ok) {
              console.log("Make.com webhook sent successfully!");
            } else {
              console.warn("Make.com webhook returned non-200 response:", response.status);
            }
          }).catch(error => {
            console.error("Make.com webhook error:", error);
          });
        } else {
          console.log("No Make.com webhook URL found in environment");
        }
      } catch (webhookError) {
        console.error("Error preparing webhook data:", webhookError);
        // Don't fail the main flow if webhook fails
      }
      
      return result;
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