import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import React from 'react';

interface FormData {
  [key: string]: any;
}

interface FormSubmissionResponse {
  success: boolean;
  message: string;
  guideUrl?: string;
}

interface FormConfig {
  baseId: string;
  tableName: string;
  view?: string;
  guideUrl?: string;
  formName: string;
}

const FORM_CONFIGS: { [key: string]: FormConfig } = {
  'ultimate-guide': {
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
    tableName: 'Guide Requests',
    guideUrl: process.env.NEXT_PUBLIC_ULTIMATE_GUIDE_URL,
    formName: 'Ultimate Cabo Guide Download'
  },
  'contact': {
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
    tableName: 'Contact Form',
    formName: 'Contact Form'
  },
  'booking': {
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!,
    tableName: 'Booking Requests',
    formName: 'Booking Request'
  }
};

export async function submitFormToAirtable(
  formId: string,
  formData: FormData,
  recaptchaToken: string
): Promise<FormSubmissionResponse> {
  try {
    // Verify reCAPTCHA token
    const recaptchaVerification = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaVerification.success) {
      return {
        success: false,
        message: 'reCAPTCHA verification failed. Please try again.'
      };
    }

    const config = FORM_CONFIGS[formId];
    if (!config) {
      throw new Error('Invalid form ID');
    }

    // Add metadata to form submission
    const enrichedData = {
      ...formData,
      formName: config.formName,
      submissionId: nanoid(),
      submissionDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      randomId: Math.floor(Math.random() * 1000000)
    };

    // Submit to Airtable
    const response = await fetch(`https://api.airtable.com/v0/${config.baseId}/${config.tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            fields: enrichedData
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit form to Airtable');
    }

    // Return success response with guide URL if applicable
    return {
      success: true,
      message: 'Thank you for your submission!',
      ...(config.guideUrl && { guideUrl: config.guideUrl })
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'An error occurred while submitting the form. Please try again.'
    };
  }
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return await response.json();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false };
  }
}

export function getSuccessMessage(formId: string, response: FormSubmissionResponse): React.ReactElement {
  if (!response.success) {
    return React.createElement('div', { className: 'text-red-600' }, response.message);
  }

  if (response.guideUrl) {
    return React.createElement('div', { className: 'space-y-4' }, [
      React.createElement('p', { className: 'text-green-600', key: 'message' }, response.message),
      React.createElement('p', { key: 'instruction' }, 'Click the button below to download your guide:'),
      React.createElement(
        'a',
        {
          key: 'download-link',
          href: response.guideUrl,
          className: 'inline-block px-6 py-3 bg-[#2F4F4F] text-white rounded-lg hover:bg-[#1F3F3F] transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        'Download Guide'
      )
    ]);
  }

  return React.createElement('div', { className: 'text-green-600' }, response.message);
} 