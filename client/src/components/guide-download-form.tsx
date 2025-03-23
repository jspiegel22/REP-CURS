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
import { guideDownloadSchema, type GuideDownload } from "@/types/booking";
import { submitGuideDownload } from "@/lib/airtable";
import ReCAPTCHA from "react-google-recaptcha";

type GuideDownloadFormData = Omit<GuideDownload, 'submissionId' | 'submissionDate'>;

interface GuideDownloadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideDownloadForm({ isOpen, onClose }: GuideDownloadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<GuideDownloadFormData>({
    resolver: zodResolver(guideDownloadSchema),
    defaultValues: {
      guideName: "Ultimate Cabo Guide 2025",
      guideType: "digital",
      source: "homepage",
      formName: "guide_download",
    },
  });

  const onSubmit = async (data: GuideDownloadFormData) => {
    setRecaptchaError("");
    const token = recaptchaRef.current?.getValue();
    
    if (!token) {
      setRecaptchaError("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitGuideDownload(data, token);
      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setRecaptchaError(result.message);
      }
    } catch (error) {
      console.error("Guide download submission error:", error);
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
          <DialogTitle>Download Your Ultimate Cabo Guide 2025</DialogTitle>
          <DialogDescription>
            Get exclusive insights, tips, and recommendations for your perfect Cabo getaway.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <div className="text-center text-green-600">
              <p className="font-medium">Thank you for your interest!</p>
              <p className="mt-2">Your guide will be sent to your email shortly.</p>
            </div>
            <Button
              onClick={onClose}
              className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            >
              Close
            </Button>
          </div>
        ) : (
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
                "Download Guide"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}