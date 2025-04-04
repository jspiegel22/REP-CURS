import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form/FormError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, Download, X } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { guideFormSchema } from '@shared/schema';

// Simplify form schema for the user-facing form
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
      phone: '',
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Prepare submission data using our schema
      const submissionData = {
        firstName: data.firstName,
        email: data.email,
        phone: data.phone || '',
        preferredContactMethod: "Email",
        guideType: "Ultimate Cabo Guide 2025", 
        source: "website",
        formName: "guide_download",
        status: "pending",
        submissionId: nanoid(),
        interestAreas: ["Cabo Travel"],
        tags: ["website-download"],
        // Include more metadata about the submission
        formData: {
          device: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        }
      };
      
      const response = await apiRequest("POST", "/api/guide-submissions", submissionData);
      return await response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      reset();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Sorry!",
        description: "There was a problem. Please try again or contact us for assistance.",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      if (!isOpen) setSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-xl p-5 shadow-lg">
        <button 
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        {success ? (
          <div className="py-4 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#2F4F4F] mb-2">Thanks!</h3>
            <p className="text-gray-600 mb-4 text-sm">Your Cabo guide is ready</p>
            
            <a
              href="https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#2F4F4F] text-white px-5 py-2 rounded-lg hover:bg-[#1F3F3F] transition-colors mx-auto mb-1 w-3/4"
            >
              <Download size={18} />
              <span>Download Guide</span>
            </a>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#2F4F4F] text-center">
                Get Your Free Cabo Guide
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit((data) => submitMutation.mutate(data))} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="firstName" className="text-[#2F4F4F] text-sm">Name*</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  disabled={submitMutation.isPending}
                  placeholder="Your name"
                  className="border-gray-300"
                />
                {errors.firstName && <FormError message="Name is required" />}
              </div>

              <div>
                <Label htmlFor="email" className="text-[#2F4F4F] text-sm">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={submitMutation.isPending}
                  placeholder="your@email.com"
                  className="border-gray-300"
                />
                {errors.email && <FormError message="Valid email is required" />}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-[#2F4F4F] text-sm">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  disabled={submitMutation.isPending}
                  placeholder="(Optional)"
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-5 mt-2"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Get Free Guide"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}