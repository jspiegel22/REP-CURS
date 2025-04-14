import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";

// Form schema for guide download form
const formSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string().min(2, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  investmentLevel: z.string().optional(),
  agentInterest: z.boolean().optional().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface GuideDownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  guideType?: string;
  title?: string;
  description?: string;
  tags?: string;
}

export default function GuideDownloadPopup({
  isOpen,
  onClose,
  guideType = "Ultimate Cabo Guide 2025",
  title = "Download Your Free Guide",
  description = "Enter your details below to get instant access to our premium guide.",
  tags = "Guide Request, Website"
}: GuideDownloadPopupProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      investmentLevel: "",
      agentInterest: false,
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      console.log(`${guideType} guide form submission started with data:`, data);
      
      // Prepare the payload for Make.com webhook
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        guideType: guideType,
        source: "website",
        status: "pending",
        interestAreas: guideType,
        tags: tags,
        formName: `${guideType.toLowerCase().replace(/\s+/g, '-')}-guide`,
        formData: {
          investmentLevel: data.investmentLevel,
          agentInterest: data.agentInterest,
          preferredContactMethod: 'Email',
          requestType: 'Guide Download'
        }
      };
      
      // Send the data to our API which will forward to Make.com webhook
      const response = await fetch('/api/guide-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form. Please try again.');
      }
      
      console.log(`${guideType} guide request sent to Make.com webhook`);
      
      toast({
        title: "Thanks for your interest!",
        description: `Your ${guideType.toLowerCase()} guide has been sent to your email.`,
      });
      
      form.reset();
      onClose();
      
      // Simulate download start
      setTimeout(() => {
        window.open('/cabo-travel.pdf', '_blank');
      }, 1000);
      
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                {...form.register("firstName")} 
                placeholder="First Name*" 
                className="w-full"
                disabled={isSubmitting}
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <Input 
                {...form.register("lastName")} 
                placeholder="Last Name*" 
                className="w-full"
                disabled={isSubmitting}
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                {...form.register("email")} 
                type="email" 
                placeholder="Email Address*" 
                className="w-full"
                disabled={isSubmitting}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Input 
                {...form.register("phone", { required: "Phone is required" })} 
                type="tel" 
                placeholder="Phone*" 
                className="w-full"
                disabled={isSubmitting}
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gap-2 bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Guide
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you'll receive our guide and occasional updates. 
            You can unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}