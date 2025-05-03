import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { apiRequest } from '@/lib/queryClient';

// Define form schema
const formSchema = z.object({
  date: z.date({
    required_error: 'A date is required',
  }),
  schedule: z.string({
    required_error: 'Please select a time slot',
  }),
  firstName: z.string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  phone: z.string()
    .min(10, { message: 'Phone number must be at least 10 digits' }),
  guests: z.number()
    .min(1, { message: 'At least 1 guest is required' })
    .max(20, { message: 'Maximum 20 guests allowed' }),
  specialRequests: z.string().optional(),
  depositOnly: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ScheduleOption {
  label: string;
  value: string;
}

interface AdventureBookingFormProps {
  adventureId: string;
  adventureTitle: string;
  adventureType: string;
  price: string;
  scheduleOptions: ScheduleOption[];
  depositAmount?: string;
  maxGuests: number;
}

const AdventureBookingForm: React.FC<AdventureBookingFormProps> = ({
  adventureId,
  adventureTitle,
  adventureType,
  price,
  scheduleOptions,
  depositAmount,
  maxGuests
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Format price for display
  const formattedPrice = price.replace(/\$([0-9,]+)/, '$$$1');
  const depositPrice = depositAmount ? `$${depositAmount}` : null;
  
  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Get one year from now for date picker max
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: tomorrow,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      guests: 1,
      specialRequests: '',
      depositOnly: false,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Format data for API
      const bookingData = {
        adventureId,
        adventureTitle,
        adventureType,
        date: format(data.date, 'yyyy-MM-dd'),
        schedule: data.schedule,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        guests: data.guests,
        specialRequests: data.specialRequests || null,
        depositOnly: data.depositOnly,
        totalAmount: data.depositOnly ? depositAmount : price.replace('$', ''),
      };
      
      // API call to create booking
      const response = await apiRequest(
        'POST',
        '/api/bookings/adventures',
        bookingData
      );
      
      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }
      
      // Handle successful booking
      toast({
        title: 'Booking submitted successfully!',
        description: 'We will contact you shortly to confirm your reservation.',
      });
      
      // Reset form
      form.reset();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking failed',
        description: 'There was an error submitting your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add custom styles for form messages on dark background
  const formMessageClass = "text-white/90";
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-[#2F4F4F] p-5 rounded-lg">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < tomorrow || date > oneYearFromNow}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className={formMessageClass} />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {scheduleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className={formMessageClass} />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage className={formMessageClass} />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage className={formMessageClass} />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage className={formMessageClass} />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (123) 456-7890" {...field} />
                </FormControl>
                <FormMessage className={formMessageClass} />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Number of Guests</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={maxGuests}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription className="text-white/70">Maximum {maxGuests} guests allowed</FormDescription>
              <FormMessage className={formMessageClass} />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Special Requests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or requests?"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage className={formMessageClass} />
            </FormItem>
          )}
        />
        
        {depositAmount && (
          <FormField
            control={form.control}
            name="depositOnly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#263F3F] p-4 bg-[#263F3F]">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-2 border-white"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white">Pay deposit only</FormLabel>
                  <FormDescription className="text-xs italic text-white/70">
                    Pay {depositPrice} deposit now instead of the full amount. The balance will be collected on the day of the charter.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-[#F47C3E] hover:bg-[#E36C2E] text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>Book Now ({form.watch('depositOnly') ? depositPrice : formattedPrice})</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AdventureBookingForm;
