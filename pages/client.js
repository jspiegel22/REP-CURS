import React from 'react';

// This page will be used to serve our client application
export default function ClientApp() {
  React.useEffect(() => {
    // Import the client application code
    import('../client/src/main.tsx').catch(err => {
      console.error('Error loading client application:', err);
    });
  }, []);

  return (
    <div id="root">
      {/* Our client application will be mounted here */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h1>Loading Cabo Travel Guide...</h1>
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
    </div>
  );
}