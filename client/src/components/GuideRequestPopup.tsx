import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormWrapper from './form/FormWrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuideRequestPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideRequestPopup({ isOpen, onClose }: GuideRequestPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Your Ultimate Cabo Guide</DialogTitle>
          <DialogDescription>
            Enter your details below to receive your free guide to Cabo's best experiences.
          </DialogDescription>
        </DialogHeader>
        
        <FormWrapper
          formId="ultimate-guide"
          className="space-y-4"
          onSuccess={onClose}
        >
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Your first name"
              required
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="text-sm text-gray-500">
            By submitting this form, you'll receive our Ultimate Cabo Guide and occasional updates about Cabo. You can unsubscribe at any time.
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
} 