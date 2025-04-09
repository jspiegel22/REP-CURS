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
import { FormError } from "@/components/form/FormError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, Calendar } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Form schema with booking specific fields
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  startDate: z.date({
    required_error: "Check-in date is required",
  }),
  endDate: z.date({
    required_error: "Check-out date is required",
  }).refine((date, ctx) => {
    if (ctx.data.startDate && date <= ctx.data.startDate) {
      ctx.addIssue({
        code: "custom",
        message: "Check-out date must be after check-in date",
      });
      return false;
    }
    return true;
  }),
  guests: z.string().min(1, "Number of guests is required"),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface VillaBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  villaName?: string;
  villaId?: string;
}

export function VillaBookingForm({ isOpen, onClose, villaName = "Luxury Villa", villaId }: VillaBookingFormProps) {
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      guests: '',
      specialRequests: '',
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Format booking data for the API
      const bookingData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        bookingType: "villa" as const,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        guests: parseInt(data.guests),
        source: "website",
        status: "pending" as const,
        formName: "villa-booking",
        formData: {
          villaName: villaName,
          villaId: villaId,
          specialRequests: data.specialRequests,
          bookingId: nanoid(8).toUpperCase(),
          preferredContactMethod: 'Email' // Move to formData to avoid schema conflicts
        },
        specialRequests: data.specialRequests,
        submissionId: nanoid(),
        tags: "Villa Booking, Direct Booking"
      };
      
      // Submit to server API
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return await response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      reset();
      toast({
        title: "Booking Request Submitted",
        description: "We'll contact you shortly to confirm your villa booking.",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: FormData) => {
    console.log("Villa booking form submission started with data:", data);
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
                Your booking request for {villaName} has been submitted successfully.
                Our villa specialists will contact you within 24 hours to confirm your reservation.
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
                Book {villaName}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Fill out the form below to book your stay at this luxury villa in Cabo San Lucas.
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
                  <Label htmlFor="lastName" className="text-[#2F4F4F]">Last Name*</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    disabled={submitMutation.isPending}
                    placeholder="Your last name"
                    className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                  />
                  {errors.lastName && (
                    <FormError message={errors.lastName.message || "Last name is required"} />
                  )}
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
                  <Label htmlFor="phone" className="text-[#2F4F4F]">Phone Number*</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    disabled={submitMutation.isPending}
                    placeholder="(123) 456-7890"
                    className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                  />
                  {errors.phone && (
                    <FormError message={errors.phone.message || "Phone number is required"} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2F4F4F]">Check-in Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!startDate ? "text-muted-foreground" : ""}`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM d, yyyy") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setValue("startDate", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <FormError message={errors.startDate.message || "Check-in date is required"} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2F4F4F]">Check-out Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!endDate ? "text-muted-foreground" : ""}`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM d, yyyy") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setValue("endDate", date)}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && (
                    <FormError message={errors.endDate.message || "Check-out date is required"} />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="text-[#2F4F4F]">Number of Guests*</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  {...register("guests")}
                  disabled={submitMutation.isPending}
                  placeholder="Enter number of guests"
                  className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
                />
                {errors.guests && (
                  <FormError message={errors.guests.message || "Number of guests is required"} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-[#2F4F4F]">
                  Special Requests
                </Label>
                <Textarea
                  id="specialRequests"
                  {...register("specialRequests")}
                  disabled={submitMutation.isPending}
                  placeholder="Any special requests or requirements for your stay?"
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
                  "Book Now"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}