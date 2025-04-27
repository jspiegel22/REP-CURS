import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: number;
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<any, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type LoginCredentials = {
  username: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<Error | null>(null);
  
  // Fetch the current user data
  const { 
    data: user, 
    isLoading,
    refetch: refetchUser
  } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, return null instead of throwing
            return null;
          }
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        return userData || null; // Ensure we always return a valid value
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Invalid username or password');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      // Refetch user data after successful login
      refetchUser();
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    },
    onError: (error: Error) => {
      setAuthError(error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    onSuccess: () => {
      // Clear user data after logout
      refetchUser();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const contextValue: AuthContextType = {
    user: user || null, // Ensure user is never undefined
    isLoading,
    error: authError,
    loginMutation,
    logoutMutation,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}