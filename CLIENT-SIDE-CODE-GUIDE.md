# Client-Side Code Guide

This document provides guidance on how to properly handle browser-specific APIs (like `window` and `document`) in the application to avoid server-side rendering (SSR) errors.

## The Challenge

In a Next.js environment with server-side rendering, code executes in two contexts:

1. **Server-side**: When the initial HTML is generated on the server
2. **Client-side**: When the JavaScript runs in the browser

Browser-specific APIs like `window`, `document`, `localStorage`, etc., are not available during server-side rendering, causing errors if accessed directly.

## Solution Pattern: The `isMounted` Approach

The recommended approach is to use the "isMounted" pattern:

```tsx
import { useState, useEffect } from 'react';

function MyComponent() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only access browser APIs when component is mounted
  if (isMounted) {
    // Safe to use window, document, etc.
  }
  
  return (
    <div>
      {isMounted && <BrowserAPIComponent />}
    </div>
  );
}
```

## Common Use Cases

### 1. Accessing window properties

```tsx
const windowWidth = isMounted ? window.innerWidth : 0;
```

### 2. Using document selectors

```tsx
useEffect(() => {
  if (isMounted) {
    const element = document.querySelector('#my-element');
    // Do something with element
  }
}, [isMounted]);
```

### 3. Using localStorage

```tsx
const [savedData, setSavedData] = useState(null);

useEffect(() => {
  if (isMounted) {
    const data = localStorage.getItem('my-data');
    setSavedData(data);
  }
}, [isMounted]);
```

### 4. Using third-party libraries that rely on browser APIs

```tsx
useEffect(() => {
  if (isMounted) {
    // Initialize libraries that need window/document
    const library = initializeLibrary();
  }
}, [isMounted]);
```

## Component Patterns

### Fully Client-Side Components

For components that rely heavily on browser APIs, consider making them entirely client-side:

```tsx
function ClientComponent() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null; // Don't render anything during SSR
  }
  
  return (
    <div>
      {/* Component that uses browser APIs */}
    </div>
  );
}
```

### Hybrid Components

For components that can partially render on the server:

```tsx
function HybridComponent() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div>
      {/* This content renders on both server and client */}
      <h1>Static Content</h1>
      
      {/* This content only renders on the client */}
      {isMounted && <DynamicBrowserContent />}
    </div>
  );
}
```

## Best Practices

1. **Avoid direct browser API calls** in the component body or during initialization
2. **Always use the `isMounted` pattern** for browser API access
3. **Provide fallbacks** for values that depend on browser APIs
4. **Keep server-rendered markup similar** to client-rendered markup to avoid hydration errors
5. **Use dynamic imports** for browser-only libraries:
   ```tsx
   useEffect(() => {
     if (isMounted) {
       import('browser-only-library').then((module) => {
         // Use the library
       });
     }
   }, [isMounted]);
   ```

By following these patterns, you can ensure your application works correctly in both server and client environments.
