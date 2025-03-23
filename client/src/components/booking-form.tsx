import { useState, useRef } from "react";
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
import { Loader2 } from "lucide-react";
import { bookingSchema, type Booking } from "@/types/booking";
import { submitBooking } from "@/lib/airtable";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingFormData = Omit<Booking, 'submissionId' | 'submissionDate' | 'bookingId'>;

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: Booking['bookingType'];
}

export function BookingForm({ isOpen, onClose, bookingType }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingType,
      status: "pending",
      numberOfGuests: 1,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setRecaptchaError("");
    const token = recaptchaRef.current?.getValue();
    
    if (!token) {
      setRecaptchaError("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitBooking(data, token);
      if (result.success) {
        onClose();
        form.reset();
      } else {
        setRecaptchaError(result.message);
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setRecaptchaError("An error occurred while submitting the booking");
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book Your {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Experience</DialogTitle>
          <DialogDescription>
            Fill out the form below to start planning your Cabo adventure.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.firstName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.lastName?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                type="tel"
                {...form.register("phone")}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.phone?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.startDate?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date*</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate")}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.endDate?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfGuests">Number of Guests*</Label>
              <Input
                id="numberOfGuests"
                type="number"
                min="1"
                {...form.register("numberOfGuests", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              <FormError message={form.formState.errors.numberOfGuests?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range*</Label>
              <Select
                onValueChange={(value) => form.setValue("budget", value)}
                defaultValue={form.getValues("budget")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget ($1,000 - $3,000)</SelectItem>
                  <SelectItem value="moderate">Moderate ($3,000 - $7,000)</SelectItem>
                  <SelectItem value="luxury">Luxury ($7,000+)</SelectItem>
                </SelectContent>
              </Select>
              <FormError message={form.formState.errors.budget?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Input
              id="specialRequests"
              {...form.register("specialRequests")}
              disabled={isSubmitting}
            />
            <FormError message={form.formState.errors.specialRequests?.message} />
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={() => setRecaptchaError("")}
            />
          </div>
          {recaptchaError && (
            <div className="text-red-600 text-sm text-center">
              {recaptchaError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 