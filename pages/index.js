import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This component redirects to our Vite application at the root URL
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Forward to our Vite app running at port 3000
    window.location.href = '/client';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column' 
    }}>
      <h1>Redirecting to Cabo Travel Guide...</h1>
      <p>Please wait while we redirect you to the application.</p>
      <div style={{ 
        marginTop: '20px',
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}