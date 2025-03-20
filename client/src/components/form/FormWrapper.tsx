import { useState, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { submitFormToAirtable, getSuccessMessage } from '@/lib/forms';

interface FormWrapperProps {
  formId: string;
  children: React.ReactNode;
  onSuccess?: () => void;
  className?: string;
}

export default function FormWrapper({
  formId,
  children,
  onSuccess,
  className = ''
}: FormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    guideUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setSubmissionResult({
        success: false,
        message: 'Please complete the reCAPTCHA verification.'
      });
      return;
    }

    setIsSubmitting(true);

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const result = await submitFormToAirtable(formId, data, recaptchaToken);
      setSubmissionResult(result);
      if (result.success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        {getSuccessMessage(formId, submissionResult)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      
      {submissionResult && !submissionResult.success && (
        <div className="mb-4 text-red-600">
          {submissionResult.message}
        </div>
      )}

      <div className="mb-4">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaToken(token)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !recaptchaToken}
        className={`w-full px-6 py-3 text-white bg-blue-600 rounded-lg transition-colors
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
} 