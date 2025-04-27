import AdminLogin from "@/components/admin/AdminLogin";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    console.log("AdminLoginPage - User state:", user, "isLoading:", isLoading);
    
    if (user && !isLoading) {
      console.log("User is authenticated, redirecting to /admin dashboard");
      // Use hard redirect to prevent endless loops
      window.location.href = '/admin';
    }
  }, [user, isLoading]);
  
  const handleLoginSuccess = () => {
    // Navigate to admin dashboard on successful login
    window.location.href = '/admin';
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}