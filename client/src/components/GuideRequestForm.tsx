import FormWrapper from './form/FormWrapper';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function GuideRequestForm() {
  return (
    <FormWrapper
      formId="ultimate-guide"
      className="space-y-4 p-6 bg-white rounded-lg shadow-sm"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          required
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
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Your phone number"
        />
      </div>

      <div className="text-sm text-gray-500">
        By submitting this form, you'll receive our Ultimate Cabo Guide and occasional updates about Cabo. You can unsubscribe at any time.
      </div>
    </FormWrapper>
  );
} 