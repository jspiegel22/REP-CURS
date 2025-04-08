import { type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";

/**
 * TEMPORARY MOCK AUTH HOOK
 * 
 * This is a stripped-down version of useAuth that simply returns mock values
 * to prevent errors in components that use auth features.
 */

// Basic mock type for the auth hook return value
type AuthReturnType = {
  user: null;
  isLoading: boolean;
  error: null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

// Fake auth context - never used but keeps TypeScript happy
export const AuthContext = {
  Provider: ({ children }: { children: ReactNode }) => children
};

// Temporary function that creates a mock mutation that does nothing
const createEmptyMutation = () => {
  return {
    mutate: () => {},
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false
  };
};

// Mock auth hook that returns dummy values
export function useAuth(): AuthReturnType {
  return {
    user: null,
    isLoading: false,
    error: null,
    loginMutation: createEmptyMutation(),
    logoutMutation: createEmptyMutation(),
    registerMutation: createEmptyMutation()
  };
}

// Mock provider that does nothing but render children
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}