import React from 'react';
import '../../index.css';
import { HelmetProvider } from 'react-helmet-async';

/**
 * AppWrapper component that wraps the entire application and provides global styles
 * This is used in Next.js's _app.tsx to ensure styles are applied properly
 * Also includes HelmetProvider to enable SEO components to work correctly
 */
export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <div className="app-wrapper min-h-screen bg-background text-foreground antialiased">
        {children}
      </div>
    </HelmetProvider>
  );
}