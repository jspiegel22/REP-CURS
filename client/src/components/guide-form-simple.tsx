import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'both']),
  guideType: z.string().min(1, { message: 'Please select a guide type' }),
  interestAreas: z.array(z.string()).min(1, { 
    message: 'Please select at least one area of interest' 
  }),
});

type FormValues = z.infer<typeof formSchema>;

const interestOptions = [
  { id: 'villas', label: 'Vacation Villas' },
  { id: 'resorts', label: 'Resorts & Hotels' },
  { id: 'activities', label: 'Activities & Excursions' },
  { id: 'restaurants', label: 'Restaurants & Dining' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'events', label: 'Events & Nightlife' },
];

const guideOptions = [
  { value: 'Ultimate Cabo Guide 2025', label: 'Ultimate Cabo Guide 2025' },
  { value: 'Cabo Family Travel Guide', label: 'Cabo Family Travel Guide' },
  { value: 'Luxury Villa Guide', label: 'Luxury Villa Guide' },
  { value: 'Adventure Activities Guide', label: 'Adventure Activities Guide' },
];

export function GuideFormSimple() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const { toast } = useToast();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      email: '',
      phone: '',
      preferredContactMethod: 'email',
      guideType: 'Ultimate Cabo Guide 2025',
      interestAreas: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Generate a unique submission ID
      const submissionId = `guide-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      // Prepare the data
      const submissionData = {
        ...data,
        submissionId,
        formName: 'guide_download',
        source: window.location.pathname,
        status: 'pending',
        tags: ['guide-download', 'website', 'test-form']
      };
      
      console.log('Submitting data:', submissionData);
      
      // Submit to API
      const response = await apiRequest('POST', '/api/guide-submissions', submissionData);
      const result = await response.json();
      
      console.log('API response:', result);
      
      if (result.downloadUrl) {
        setDownloadLink(result.downloadUrl);
        setIsSuccess(true);
        toast({
          title: "Guide Request Successful!",
          description: "Your guide is ready to download.",
        });
      } else {
        setIsSuccess(true); // Still mark as success even if no download link
        toast({
          title: "Request Received",
          description: "We'll email your guide shortly.",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isSuccess ? (
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-xl font-bold mb-4">Your Guide is Ready!</h2>
          <p className="text-center mb-6 text-gray-600">
            Thank you for your interest in Cabo San Lucas. {downloadLink ? 'Click the button below to download your guide.' : 'We will email your guide shortly.'}
          </p>
          {downloadLink && (
            <Button 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              asChild
            >
              <a 
                href={downloadLink} 
                download 
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Guide
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            className="mt-4 w-full sm:w-auto"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Submit Another Request
          </Button>
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#2F4F4F]">
              Request Your Free Cabo Guide
            </CardTitle>
            <CardDescription className="text-gray-600">
              Complete the form below to receive your complimentary guide to Cabo's finest experiences.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferredContactMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <label htmlFor="email" className="text-sm">Email</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone" />
                            <label htmlFor="phone" className="text-sm">Phone</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <label htmlFor="both" className="text-sm">Both</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guideType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which Guide Would You Like?</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a guide" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {guideOptions.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interestAreas"
                  render={() => (
                    <FormItem>
                      <FormLabel>What Are You Interested In?</FormLabel>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {interestOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="interestAreas"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2 flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Clear
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#2F4F4F] hover:bg-[#1F3F3F]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Get Guide'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}