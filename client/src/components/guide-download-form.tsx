import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";

// Form schema for guide download form
const formSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  investmentLevel: z.string().optional(),
  agentInterest: z.string().optional(),
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
      name: "",
      email: "",
      phone: "",
      investmentLevel: "",
      agentInterest: "",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      console.log(`${guideType} guide form submission started with data:`, data);
      
      // Prepare the payload for Make.com webhook
      const payload = {
        firstName: data.name.split(' ')[0],
        lastName: data.name.includes(' ') ? data.name.split(' ').slice(1).join(' ') : '',
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
                {...form.register("name")} 
                placeholder="Your Name" 
                className={`${backgroundColor} ${textColor} w-full`}
                disabled={isSubmitting}
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
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
            
            <div>
              <Input 
                {...form.register("investmentLevel")} 
                placeholder="Budget Range (Optional)" 
                className={`${backgroundColor} ${textColor} w-full`}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="col-span-2 mb-2">
              <Select
                onValueChange={(value) => form.setValue("agentInterest", value)}
                value={form.watch("agentInterest")}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`${backgroundColor} ${textColor} w-full`}>
                  <SelectValue placeholder="Interested in speaking with an agent?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, I'd like to speak with an agent</SelectItem>
                  <SelectItem value="no">No, just send me the guide</SelectItem>
                  <SelectItem value="maybe">Maybe later</SelectItem>
                </SelectContent>
              </Select>
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
          className={`w-full gap-2 ${guideType === "Real Estate" ? "bg-white hover:bg-gray-100 text-[#2F4F4F] border border-[#2F4F4F]" : "bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"}`}
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