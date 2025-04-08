import { Route } from "wouter";

/**
 * Temporary replacement for ProtectedRoute
 * This simply renders the component without any auth protection
 */
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  return (
    <Route path={path} component={Component} />
  );
}