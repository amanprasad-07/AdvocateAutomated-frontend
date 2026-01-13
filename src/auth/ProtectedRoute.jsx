import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * ProtectedRoute Component
 *
 * Wraps route elements and enforces:
 * - Authentication (user must be logged in)
 * - Authorization (user role must be permitted)
 *
 * Redirect behavior:
 * - Unauthenticated users are redirected to the login page
 * - Authenticated users with disallowed roles are redirected
 *   to their respective role-based dashboard
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Access authentication state from context
  const { user, role, loading } = useAuth();

  /**
   * Authentication state is still being resolved
   * Prevents premature redirects during initial load
   */
  if (loading) {
    return <p>Loading...</p>;
  }

  /**
   * User is not authenticated
   * Redirect to login page
   */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /**
   * User is authenticated but does not have
   * the required role for this route
   *
   * Redirects to the user's role-based dashboard
   */
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  /**
   * User is authenticated and authorized
   * Render the protected route content
   */
  return children;
};

export default ProtectedRoute;
