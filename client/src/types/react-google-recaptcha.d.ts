declare module 'react-google-recaptcha' {
  import React from 'react';

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    grecaptcha?: any;
    theme?: 'dark' | 'light';
    type?: 'image' | 'audio';
    tabindex?: number;
    onExpired?: () => void;
    onErrored?: () => void;
    size?: 'compact' | 'normal' | 'invisible';
    stoken?: string;
    hl?: string;
    badge?: 'bottomright' | 'bottomleft' | 'inline';
    isolated?: boolean;
  }

  class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): Promise<string>;
    executeAsync(): Promise<string>;
    getValue(): string | null;
    getWidgetId(): number;
  }

  export default ReCAPTCHA;
}