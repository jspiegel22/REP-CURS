import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Download } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});

type FormData = z.infer<typeof formSchema>;

// Form error display component
const FormError = ({ message }: { message: string }) => {
  return message ? (
    <span className="text-sm text-red-500 mt-1">{message}</span>
  ) : null;
};

export function GuideDownloadForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
    }
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
          interestType: "guide",
          source: "cabo-guide-download"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      form.setError("root", {
        message: "Failed to submit form. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white">
          Get Your 2025 ULTIMATE Cabo Guide
        </Button>
      </DialogTrigger>
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
            <p className="text-green-600">Thanks! Your guide is ready to download.</p>
            <Button
              onClick={() => window.open("/cabo-guide-2025.pdf", "_blank")}
              className="w-full flex items-center justify-center bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Your Guide
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Check your email - we've also sent you a copy for safekeeping!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}