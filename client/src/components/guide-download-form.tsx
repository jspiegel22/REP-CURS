import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form/FormError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, Download, X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { guideFormSchema } from '@shared/schema';

// Simplify form schema for the user-facing form
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface GuideDownloadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideDownloadForm({ isOpen, onClose }: GuideDownloadFormProps) {
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("/guides/ultimate-cabo-guide-2025.pdf");
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Effect to handle video play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => {
          console.error("Video play error:", e);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, showVideo]);

  // Effect to handle muting
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      email: '',
      phone: '',
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Prepare submission data using our schema
      const submissionData = {
        firstName: data.firstName,
        email: data.email,
        phone: data.phone || '',
        preferredContactMethod: "Email",
        guideType: "Ultimate Cabo Guide 2025", 
        source: "website",
        formName: "guide_download",
        status: "completed", // Mark as completed immediately
        submissionId: nanoid(),
        interestAreas: ["Cabo Travel"],
        tags: ["website-download"],
        // Include more metadata about the submission
        formData: {
          device: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        }
      };
      
      const response = await apiRequest("POST", "/api/guide-submissions", submissionData);
      return await response.json();
    },
    onSuccess: (data) => {
      // If the API returns a specific download URL, use it
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      }
      
      setSuccess(true);
      setShowVideo(true);
      reset();
      
      // Auto-play the preview video
      setTimeout(() => {
        setIsPlaying(true);
      }, 500);
      
      // Track the event (could be connected to analytics later)
      try {
        console.log("TRACKING: Guide request completed", {
          guide: "Ultimate Cabo Guide 2025",
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error("Tracking error:", e);
      }
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Sorry!",
        description: "There was a problem. Please try again or contact us for assistance.",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    // Pause video if playing
    if (isPlaying) {
      setIsPlaying(false);
    }
    
    onClose();
    setTimeout(() => {
      if (!isOpen) {
        setSuccess(false);
        setShowVideo(false);
      }
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-5 shadow-lg">
        <button 
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-20"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        {success ? (
          <div className="py-4 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#2F4F4F] mb-2">Thanks!</h3>
            <p className="text-gray-600 mb-4 text-sm">Your Cabo guide is ready</p>
            
            {showVideo && (
              <div className="relative mb-5 mt-2 rounded-lg overflow-hidden shadow-md">
                <video 
                  ref={videoRef}
                  src="/cabo-travel.mp4"
                  className="w-full h-auto rounded-lg"
                  loop
                  playsInline
                  poster="/video-poster.svg"
                ></video>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-between items-center">
                  <Button 
                    onClick={togglePlay} 
                    variant="ghost" 
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  
                  <Button 
                    onClick={toggleMute} 
                    variant="ghost" 
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                </div>
              </div>
            )}
            
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#2F4F4F] text-white px-5 py-2 rounded-lg hover:bg-[#1F3F3F] transition-colors mx-auto mb-1 w-3/4"
            >
              <Download size={18} />
              <span>Download Guide</span>
            </a>
            
            <p className="text-xs text-gray-500 mt-4">
              We'll also send a copy to your email for future reference.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#2F4F4F] text-center">
                Get Your Free Cabo Guide
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit((data) => submitMutation.mutate(data))} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="firstName" className="text-[#2F4F4F] text-sm">Name*</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  disabled={submitMutation.isPending}
                  placeholder="Your name"
                  className="border-gray-300"
                />
                {errors.firstName && <FormError message="Name is required" />}
              </div>

              <div>
                <Label htmlFor="email" className="text-[#2F4F4F] text-sm">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={submitMutation.isPending}
                  placeholder="your@email.com"
                  className="border-gray-300"
                />
                {errors.email && <FormError message="Valid email is required" />}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-[#2F4F4F] text-sm">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  disabled={submitMutation.isPending}
                  placeholder="(Optional)"
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white py-5 mt-2"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Get Free Guide"
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                By submitting, you agree to receive occasional updates about Cabo.
                <br />We'll never share your information with third parties.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}