import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * SafeNavigation Component
 * 
 * Problem Solved:
 * 1. The wouter Link component wraps content in an <a> tag, which can cause DOM nesting errors
 *    when used within components that might already have <a> tags.
 * 2. Using window or document directly causes SSR issues because they don't exist during server rendering.
 * 
 * Solution:
 * - Use a direct <a> tag with a client-side only onClick handler that uses wouter's useLocation hook
 * - Only enable navigation after component mount with an isMounted state
 * - Provide fallback behavior during SSR (preventDefault on the link)
 */
interface SafeNavigationProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Safe navigation component that avoids SSR issues with wouter
 * This component ensures that navigation links only render after component mount
 * and avoids nested <a> tag issues by using a direct <a> tag with onClick handler
 */
export function SafeNavigation({ to, children, className, onClick }: SafeNavigationProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
    if (isMounted) navigate(to);
  };

  return (
    <a 
      href={isMounted ? to : "#"} 
      className={className} 
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

/**
 * Safe button navigation component for use in buttons
 */
export function SafeButtonNavigation({ to, children, className, onClick }: SafeNavigationProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
    if (isMounted) navigate(to);
  };

  return (
    <button 
      className={className} 
      onClick={handleClick}
    >
      {children}
    </button>
  );
}