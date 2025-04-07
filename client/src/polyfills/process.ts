// Simple polyfill for process.env in the browser
if (typeof window !== 'undefined') {
  // Safely access import.meta.env.MODE or default to 'development'
  const NODE_ENV = 
    typeof import.meta !== 'undefined' && 
    import.meta.env && 
    import.meta.env.MODE ? 
    import.meta.env.MODE : 'development';
  
  // Create process.env if it doesn't exist
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};
  
  // Set NODE_ENV and other variables
  (window as any).process.env.NODE_ENV = NODE_ENV;
  
  // Add any other environment variables needed by the application
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Map any VITE_ prefixed env vars that might be needed
    Object.entries(import.meta.env).forEach(([key, value]) => {
      if (key.startsWith('VITE_')) {
        (window as any).process.env[key.replace('VITE_', '')] = value;
      }
    });
  }
}
