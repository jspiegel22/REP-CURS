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
  phone: z.string().optional(),
  investmentLevel: z.string().optional(),
  agentInterest: z.boolean().optional().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface GuideDownloadFormProps {
  guideType: string;
  title?: string;
  buttonText?: string;
  className?: string;
  onSuccessCallback?: () => void;
  tags?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function GuideDownloadForm({
  guideType,
  title = "Download Free Guide",
  buttonText = "Download Guide",
  className = "",
  onSuccessCallback,
  tags = "Guide Request, Website",
  backgroundColor = "bg-white",
  textColor = "text-gray-800"
}: GuideDownloadFormProps) {
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
      
      // Call success callback if provided
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      
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
    <div className={`${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {guideType === "Real Estate" ? (
          // 2x2 layout for Real Estate
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                {...form.register("firstName")} 
                placeholder="First Name" 
                className={`${backgroundColor} ${textColor} w-full`}
                disabled={isSubmitting}
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <Input 
                {...form.register("lastName")} 
                placeholder="Last Name" 
                className={`${backgroundColor} ${textColor} w-full`}
                disabled={isSubmitting}
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <Input 
                {...form.register("email")} 
                type="email" 
                placeholder="Email Address" 
                className={`${backgroundColor} ${textColor} w-full`}
                disabled={isSubmitting}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Input 
                {...form.register("phone")} 
                type="tel" 
                placeholder="Phone (Optional)" 
                className={`${backgroundColor} ${textColor} w-full`}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="col-span-2 flex items-center space-x-2 my-2">
              <Checkbox 
                id="agentInterest"
                checked={form.watch("agentInterest")}
                onCheckedChange={(checked) => {
                  form.setValue("agentInterest", checked === true);
                }}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="agentInterest" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I'd like to speak with a real estate agent about properties
              </Label>
            </div>
          </div>
        ) : (
          // Standard layout for other guide types
          <>
            <Input 
              {...form.register("name")} 
              placeholder="Your Name" 
              className={`${backgroundColor} ${textColor}`}
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
            
            <Input 
              {...form.register("email")} 
              type="email" 
              placeholder="Email Address" 
              className={`${backgroundColor} ${textColor}`}
              disabled={isSubmitting}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
            
            <Input 
              {...form.register("phone")} 
              type="tel" 
              placeholder="Phone (Optional)" 
              className={`${backgroundColor} ${textColor}`}
              disabled={isSubmitting}
            />
          </>
        )}
        
        <Button 
          type="submit" 
          className={`w-full gap-2 ${guideType === "Real Estate" ? "bg-orange-600 hover:bg-orange-700 text-white font-semibold" : "bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"}`}
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
              {buttonText}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}