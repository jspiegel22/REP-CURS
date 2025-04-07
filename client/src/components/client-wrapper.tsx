import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR to avoid any client-side only code issues
const NavigationBar = dynamic(() => import('./navigation-bar'), { ssr: false });
const HomePage = dynamic(() => import('../pages/home-page'), { ssr: false });
const Footer = dynamic(() => import('./footer'), { ssr: false });

/**
 * Client-side only wrapper component for the main application layout
 * This component is loaded dynamically with { ssr: false } to ensure no server-side rendering issues
 */
export default function ClientWrapper() {
  // Safety state to ensure all window references are accessed after mount
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // Mark component as mounted in browser environment
      setIsMounted(true);
      console.log("ClientWrapper mounted successfully");
    } catch (error) {
      console.error("Error in ClientWrapper mount:", error);
      setHasError(true);
    }
  }, []);

  // Show error state if something went wrong
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Something went wrong</h1>
          <p className="mb-4">We encountered an error while loading the application.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Add safety check to prevent SSR issues
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Initializing Cabo Travel Guide...</h1>
          <div className="mx-auto mt-4 w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Only render full application after client-side mount
  return (
    <>
      <NavigationBar />
      <HomePage />
      <Footer />
    </>
  );
}