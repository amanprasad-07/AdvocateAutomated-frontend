import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  // ⏳ Still checking auth
  if (loading) {
    return <p>Loading...</p>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect user to their own dashboard
    return <Navigate to={`/${role}`} replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
