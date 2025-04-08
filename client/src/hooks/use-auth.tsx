import { createContext, ReactNode, useContext } from "react";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock auth provider that returns null user (not authenticated)
  const authValue: AuthContextType = {
    user: null,
    isLoading: false,
    error: null,
    loginMutation: {
      mutate: () => {},
      isPending: false,
    },
    logoutMutation: {
      mutate: () => {},
      isPending: false,
    },
    registerMutation: {
      mutate: () => {},
      isPending: false,
    },
  };

  return (
    <AuthContext.Provider value={authValue}>
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