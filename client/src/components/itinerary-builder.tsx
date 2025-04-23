import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, ChevronRight } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';

// Define the steps of the form
type FormStep = 'preferences' | 'contact' | 'itinerary' | 'chat';

// Define the stay types
const stayTypes = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'family', label: 'Family' },
  { value: 'couple', label: 'Couple' },
  { value: 'group', label: 'Group' },
  { value: 'party', label: 'Party' }
];

// Initial form schema for validation
const itineraryFormSchema = z.object({
  stayType: z.enum(['adventure', 'luxury', 'family', 'couple', 'group', 'party']),
  numNights: z.coerce.number().min(1).max(30),
  startDate: z.string().min(1, "Start date is required"),
  budget: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Contact info schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" })
});

interface ItineraryBuilderProps {
  className?: string;
}

export default function ItineraryBuilder({ className }: ItineraryBuilderProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<FormStep>('preferences');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    stayType: '',
    numNights: 3,
    startDate: '',
    budget: '',
    additionalInfo: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Generated itinerary state
  const [itinerary, setItinerary] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numNights' ? parseInt(value) || 1 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePreferencesForm = () => {
    try {
      itineraryFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateContactForm = () => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextStep = () => {
    if (step === 'preferences') {
      if (!validatePreferencesForm()) return;
      setStep('contact');
    } else if (step === 'contact') {
      if (!validateContactForm()) return;
      generateItinerary();
    }
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      // Save the lead in the database
      const leadResponse = await apiRequest('POST', '/api/leads', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        interestType: 'concierge',
        source: 'website',
        formData: {
          stayType: formData.stayType,
          numNights: formData.numNights,
          startDate: formData.startDate,
          budget: formData.budget,
          additionalInfo: formData.additionalInfo,
          formName: 'itinerary-builder'
        },
        tags: ['Itinerary Builder', formData.stayType],
      });

      if (!leadResponse.ok) {
        throw new Error('Failed to save lead information');
      }

      // Call the API to generate the itinerary based on preferences
      const response = await apiRequest('POST', '/api/generate-itinerary', formData);
      
      if (!response.ok) {
        throw new Error('Failed to generate itinerary. Please try again.');
      }
      
      const data = await response.json();
      setItinerary(data.itinerary);
      
      // Add the first assistant message to chat history
      setChatHistory([
        { role: 'assistant', content: data.itinerary }
      ]);
      
      // Move to itinerary step
      setStep('itinerary');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    
    // Add user message to chat history
    const newMessage = { role: 'user' as const, content: chatMessage };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setChatMessage('');
    
    setLoading(true);
    
    try {
      // Send chat message to API to get response
      const response = await apiRequest('POST', '/api/chat-with-itinerary', {
        chatHistory: updatedHistory,
        preferences: {
          stayType: formData.stayType,
          numNights: formData.numNights,
          startDate: formData.startDate
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to chat with assistant');
      }
      
      const data = await response.json();
      
      // Add assistant response to chat history
      setChatHistory([...updatedHistory, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error chatting with assistant:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get a response",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookItinerary = async () => {
    // Here you would implement the booking functionality
    // This could redirect to a booking page or open a modal
    toast({
      title: "Booking Initiated",
      description: "We'll reach out to you shortly to finalize your booking!",
    });
  };

  const renderPreferencesStep = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="stayType">Type of Stay <span className="text-red-500">*</span></Label>
        <Select
          onValueChange={(value) => handleSelectChange('stayType', value)}
          value={formData.stayType}
        >
          <SelectTrigger id="stayType" className={errors.stayType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select type of stay" />
          </SelectTrigger>
          <SelectContent>
            {stayTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.stayType && <p className="text-sm text-red-500 mt-1">{errors.stayType}</p>}
      </div>

      <div>
        <Label htmlFor="numNights">Number of Nights <span className="text-red-500">*</span></Label>
        <Input
          id="numNights"
          name="numNights"
          type="number"
          min="1"
          max="30"
          value={formData.numNights}
          onChange={handleInputChange}
          className={errors.numNights ? "border-red-500" : ""}
        />
        {errors.numNights && <p className="text-sm text-red-500 mt-1">{errors.numNights}</p>}
      </div>

      <div>
        <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            className={errors.startDate ? "border-red-500" : ""}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
      </div>

      <div>
        <Label htmlFor="budget">Budget (Optional)</Label>
        <Input
          id="budget"
          name="budget"
          placeholder="e.g. $1,000 - $5,000"
          value={formData.budget}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="additionalInfo">Additional Preferences (Optional)</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          placeholder="Tell us more about what you're looking for... special interests, accessibility needs, etc."
          value={formData.additionalInfo}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleNextStep}
          className="w-full bg-[#FF8C38] hover:bg-[#E67D29]"
        >
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button 
          onClick={handleNextStep}
          className="w-full bg-[#FF8C38] hover:bg-[#E67D29]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Itinerary...
            </>
          ) : (
            <>
              Generate My Itinerary <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setStep('preferences')}
          className="w-full"
          disabled={loading}
        >
          Back to Preferences
        </Button>
      </div>
    </div>
  );

  const renderItineraryStep = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-xl font-semibold mb-3">Your Custom Cabo Itinerary</h4>
        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
          {itinerary}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button 
          onClick={() => setStep('chat')}
          className="w-full bg-[#FF8C38] hover:bg-[#E67D29]"
        >
          Refine My Itinerary <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleBookItinerary}
          variant="outline"
          className="w-full border-[#FF8C38] text-[#FF8C38] hover:bg-[#FF8C38]/10"
        >
          Book This Itinerary
        </Button>
      </div>
    </div>
  );

  const renderChatStep = () => (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 bg-gray-50 p-4 rounded-lg mb-4 max-h-[400px]">
        {chatHistory.map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'ml-12 bg-[#FF8C38]/10 text-gray-800' 
                : 'mr-12 bg-white border text-gray-700'
            }`}
          >
            <p className="whitespace-pre-line">{message.content}</p>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#FF8C38]" />
          </div>
        )}
      </div>

      <form onSubmit={handleChatSubmit} className="flex space-x-2">
        <Input
          placeholder="Ask questions or request changes to your itinerary..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !chatMessage.trim()}
          className="bg-[#FF8C38] hover:bg-[#E67D29]"
        >
          Send
        </Button>
      </form>

      <div className="pt-4 space-y-3">
        <Button
          onClick={handleBookItinerary}
          className="w-full bg-[#FF8C38] hover:bg-[#E67D29]"
        >
          Book This Itinerary
        </Button>
        
        <Button
          onClick={() => setStep('itinerary')}
          variant="outline"
          className="w-full"
        >
          Back to Itinerary
        </Button>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold">Build Your Own Cabo Itinerary</h3>
          <p className="text-gray-600 mt-1">
            Let us create a personalized itinerary based on your preferences
          </p>
        </div>
        
        {step === 'preferences' && renderPreferencesStep()}
        {step === 'contact' && renderContactStep()}
        {step === 'itinerary' && renderItineraryStep()}
        {step === 'chat' && renderChatStep()}
      </CardContent>
    </Card>
  );
}