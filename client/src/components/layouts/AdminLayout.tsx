import React, { useState, useEffect } from 'react';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const user = await response.json();
          setIsAuthenticated(user && user.role === 'admin');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cabo Admin</h1>
          <button 
            onClick={() => {
              fetch('/api/logout', { method: 'POST' })
                .then(() => setIsAuthenticated(false))
                .catch(err => console.error('Logout failed:', err));
            }}
            className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
}