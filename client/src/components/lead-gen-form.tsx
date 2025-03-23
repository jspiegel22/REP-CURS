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
import { leadGenSchema, type LeadGen } from "@/types/booking";
import { submitLead } from "@/lib/airtable";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LeadGenFormData = Omit<LeadGen, 'submissionId' | 'submissionDate' | 'leadId'>;

interface LeadGenFormProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

export function LeadGenForm({ isOpen, onClose, source }: LeadGenFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<LeadGenFormData>({
    resolver: zodResolver(leadGenSchema),
    defaultValues: {
      source,
    },
  });

  const onSubmit = async (data: LeadGenFormData) => {
    setRecaptchaError("");
    const token = recaptchaRef.current?.getValue();
    
    if (!token) {
      setRecaptchaError("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitLead(data, token);
      if (result.success) {
        onClose();
        form.reset();
      } else {
        setRecaptchaError(result.message);
      }
    } catch (error) {
      console.error("Lead submission error:", error);
      setRecaptchaError("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tell Us About Your Interest</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you with more information.
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

          <div className="space-y-2">
            <Label htmlFor="interestType">What are you interested in?*</Label>
            <Select
              onValueChange={(value) => form.setValue("interestType", value)}
              defaultValue={form.getValues("interestType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">Villa Rental</SelectItem>
                <SelectItem value="yacht">Yacht Charter</SelectItem>
                <SelectItem value="both">Both Villa & Yacht</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormError message={form.formState.errors.interestType?.message} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredContactMethod">Preferred Contact Method*</Label>
              <Select
                onValueChange={(value) => form.setValue("preferredContactMethod", value)}
                defaultValue={form.getValues("preferredContactMethod")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                </SelectContent>
              </Select>
              <FormError message={form.formState.errors.preferredContactMethod?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredContactTime">Preferred Contact Time*</Label>
              <Select
                onValueChange={(value) => form.setValue("preferredContactTime", value)}
                defaultValue={form.getValues("preferredContactTime")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                </SelectContent>
              </Select>
              <FormError message={form.formState.errors.preferredContactTime?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Input
              id="additionalInfo"
              {...form.register("additionalInfo")}
              disabled={isSubmitting}
            />
            <FormError message={form.formState.errors.additionalInfo?.message} />
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
              "Submit Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 