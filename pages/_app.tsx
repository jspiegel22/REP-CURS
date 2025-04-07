import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../client/src/index.css';
import { AppWrapper } from '../client/src/components/ui/app-wrapper';

export default function App({ Component, pageProps }: AppProps) {
  // Register service worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}