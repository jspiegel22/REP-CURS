import { useEffect } from "react";
import { useLocation } from "wouter";

export default function TransportationRedirect() {
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/transportation/");
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to transportation page...</p>
    </div>
  );
}