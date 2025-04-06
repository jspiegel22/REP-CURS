import React from 'react';
import type { AppProps } from 'next/app';
// Import global styles (Next.js will handle these properly)
import { AppWrapper } from '../client/src/components/ui/app-wrapper';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}