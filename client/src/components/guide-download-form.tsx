import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form/FormError";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Download, ChevronRight } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export function GuideDownloadForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: "guide-download",
          interestType: "guide",
          formData: {
            guideName: "2025 ULTIMATE Cabo Guide",
            downloadDate: new Date().toISOString(),
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      form.setError("root", {
        message: "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white text-lg py-6 px-8 rounded-xl w-full md:w-auto flex items-center gap-2"
      >
        Get Your 2025 ULTIMATE Cabo Guide
        <ChevronRight className="w-5 h-5" />
      </Button>

      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setIsSuccess(false);
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Your 2025 ULTIMATE Cabo Guide</DialogTitle>
            <DialogDescription>
              Enter your details below to receive your comprehensive guide to Cabo.
            </DialogDescription>
          </DialogHeader>

          {!isSuccess ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  {...form.register("firstName")}
                  placeholder="First Name*"
                  disabled={isSubmitting}
                />
                <FormError message={form.formState.errors.firstName?.message || ""} />
              </div>

              <div className="space-y-2">
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="Email*"
                  disabled={isSubmitting}
                />
                <FormError message={form.formState.errors.email?.message || ""} />
              </div>

              {form.formState.errors.root && (
                <FormError message={form.formState.errors.root.message || ""} />
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
                  "Get Your Guide"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 mt-4">
              <p className="text-green-600 font-semibold text-center">Thanks! Your guide is ready to download.</p>
              <Button
                onClick={() => window.open("/cabo-guide-2025.pdf", "_blank")}
                className="w-full flex items-center justify-center bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Your Guide
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Check your email - we've also sent you a copy for safekeeping!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}