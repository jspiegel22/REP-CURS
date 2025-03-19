import { loadScript } from '@/lib/utils';

interface SecurityConfig {
  recaptchaSiteKey: string;
  cloudflareSiteKey: string;
}

const config: SecurityConfig = {
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
  cloudflareSiteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!,
};

export async function initializeSecurity() {
  // Load reCAPTCHA
  await loadScript(`https://www.google.com/recaptcha/api.js?render=${config.recaptchaSiteKey}`);
  // Load Cloudflare Turnstile
  await loadScript('https://challenges.cloudflare.com/turnstile/v0/api.js');
}

export async function validateForm(formData: FormData): Promise<boolean> {
  try {
    // Validate reCAPTCHA
    const recaptchaToken = await window.grecaptcha.execute(config.recaptchaSiteKey, { action: 'submit' });
    const recaptchaValid = await validateRecaptcha(recaptchaToken);

    // Validate Cloudflare Turnstile
    const turnstileToken = await window.turnstile.getResponse();
    const turnstileValid = await validateTurnstile(turnstileToken);

    // Additional form validation
    const formValid = validateFormData(formData);

    return recaptchaValid && turnstileValid && formValid;
  } catch (error) {
    console.error('Form validation error:', error);
    return false;
  }
}

async function validateRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/validate-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA validation error:', error);
    return false;
  }
}

async function validateTurnstile(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/validate-turnstile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Cloudflare validation error:', error);
    return false;
  }
}

function validateFormData(formData: FormData): boolean {
  // Add your form validation logic here
  // Example:
  const requiredFields = ['name', 'email', 'message'];
  return requiredFields.every(field => formData.get(field));
}

export function addSecurityToForm(formId: string) {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (!form) return;

  // Add reCAPTCHA element
  const recaptchaDiv = document.createElement('div');
  recaptchaDiv.className = 'g-recaptcha';
  recaptchaDiv.setAttribute('data-sitekey', config.recaptchaSiteKey);
  form.appendChild(recaptchaDiv);

  // Add Cloudflare Turnstile element
  const turnstileDiv = document.createElement('div');
  turnstileDiv.className = 'cf-turnstile';
  turnstileDiv.setAttribute('data-sitekey', config.cloudflareSiteKey);
  form.appendChild(turnstileDiv);

  // Add form validation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const isValid = await validateForm(formData);
    
    if (isValid) {
      form.submit();
    } else {
      alert('Please complete all required fields and security checks.');
    }
  });
} 