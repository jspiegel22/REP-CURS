import React from 'react';
import '../../index.css';

/**
 * AppWrapper component that wraps the entire application and provides global styles
 * This is used in Next.js's _app.tsx to ensure styles are applied properly
 */
export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-wrapper min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  );
}