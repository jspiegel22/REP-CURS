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
import { submitToAirtable } from "@/lib/airtable";
import ReCAPTCHA from "react-google-recaptcha";
import { nanoid } from "nanoid";

type GuideDownloadFormData = Pick<GuideDownload, 'firstName' | 'email'>;

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
      const enrichedData = {
        ...data,
        formName: "guide_download",
        source: "homepage",
        tags: ["GUIDE", "DOWNLOAD"],
        status: "New",
        submissionId: nanoid(),
        submissionDate: new Date().toISOString(),
        randomId: Math.floor(Math.random() * 1000000),
        formData: JSON.stringify(data),
        guideUrl: "https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing"
      };

      const result = await submitToAirtable(
        {
          baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
          tableName: 'ALL'
        },
        enrichedData,
        token
      );

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

  // Test function
  const testFormSubmission = async () => {
    const testData = {
      firstName: "Jeff",
      email: "jeff@newpsmedia.com"
    };

    setIsSubmitting(true);
    try {
      const enrichedData = {
        ...testData,
        formName: "guide_download",
        source: "homepage",
        tags: ["GUIDE", "DOWNLOAD"],
        status: "New",
        submissionId: nanoid(),
        submissionDate: new Date().toISOString(),
        randomId: Math.floor(Math.random() * 1000000),
        formData: JSON.stringify(testData),
        guideUrl: "https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing"
      };

      const result = await submitToAirtable(
        {
          baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
          tableName: 'ALL'
        },
        enrichedData,
        "test-token" // Using a test token for testing
      );

      if (result.success) {
        setSuccess(true);
        console.log("Test submission successful!");
      } else {
        console.error("Test submission failed:", result.message);
      }
    } catch (error) {
      console.error("Test submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add test button in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2F4F4F]">Get Your Ultimate Cabo Guide 2025</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your details below to receive your free guide to Cabo's best experiences.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2F4F4F] mb-2">Thank you for your interest!</h3>
              <p className="text-gray-600 mb-4">Your guide will be sent to your email shortly.</p>
              <a
                href="https://drive.google.com/file/d/1iM6eeb5P5aKLcSiE1ZI_7Vu3XsJqgOs6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#2F4F4F] text-white px-6 py-3 rounded-xl hover:bg-[#1F3F3F] transition-colors mb-4"
              >
                Download Guide Now
              </a>
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
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[#2F4F4F]">First Name*</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                disabled={isSubmitting}
                placeholder="Your first name"
                className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
              />
              <FormError message={form.formState.errors.firstName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2F4F4F]">Email*</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                disabled={isSubmitting}
                placeholder="your@email.com"
                className="border-gray-300 focus:border-[#2F4F4F] focus:ring-[#2F4F4F]"
              />
              <FormError message={form.formState.errors.email?.message} />
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
              className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Get Guide Now"
              )}
            </Button>
          </form>
        )}

        {isDevelopment && (
          <Button
            onClick={testFormSubmission}
            className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            Test Form Submission
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}