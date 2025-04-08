// Simple polyfill for process.env in the browser
if (typeof window !== 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: import.meta.env.MODE,
      // Add other environment variables as needed
    }
  };
}
