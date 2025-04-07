# Client-Side Rendering Patterns

This document outlines the client-side rendering patterns used in the Cabo Travel Platform to solve common SSR (Server-Side Rendering) issues.

## Problems Addressed

1. **React Helmet Errors**
   - **Problem**: `react-helmet-async` attempts to access `document.head` during server-side rendering, causing errors.
   - **Solution**: The `SEO` component uses a client-side only rendering pattern with `useState` and `useEffect`.

2. **Navigation Link Nesting**
   - **Problem**: The `wouter` library's `Link` component wraps content in an `<a>` tag, which causes DOM nesting errors when nested within other `<a>` tags.
   - **Solution**: The `SafeNavigation` component uses a direct `<a>` tag with client-side navigation handlers.

3. **Window/Document References**
   - **Problem**: Direct references to `window` or `document` cause errors during server-side rendering.
   - **Solution**: All browser API usage is wrapped in client-side only code patterns.

## Components

### SEO Component

```tsx
function SEO({ title, description, /* other props */ }: SEOProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!isMounted) {
    return null;
  }

  return (
    <Helmet>
      {/* Meta tags */}
    </Helmet>
  );
}
```

### SafeNavigation Component

```tsx
function SafeNavigation({ to, children, className, onClick }: SafeNavigationProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
    if (isMounted) navigate(to);
  };

  return (
    <a 
      href={isMounted ? to : "#"} 
      className={className} 
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
```

## Best Practices

1. **Always use the `isMounted` pattern**:
   ```tsx
   const [isMounted, setIsMounted] = useState(false);
   useEffect(() => { setIsMounted(true); }, []);
   ```

2. **Conditional rendering for browser APIs**:
   ```tsx
   {isMounted && <BrowserAPIComponent />}
   ```

3. **Safe references to window/document**:
   ```tsx
   const windowWidth = isMounted ? window.innerWidth : 0;
   ```

4. **For nested link scenarios**:
   - Use `SafeNavigation` component instead of `wouter`'s Link
   - Or use `SafeButtonNavigation` for button-style links

5. **Type adaptations**:
   - Use `Partial<Type>` for components that need to handle both client-side and server-side data formats
   - Provide fallbacks for all optional properties

By following these patterns, we maintain a consistent approach to handling client-side rendering issues across the application.