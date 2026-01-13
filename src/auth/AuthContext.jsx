import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

/**
 * Authentication Context
 *
 * Provides global authentication state and helper methods
 * for managing user sessions across the application.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 *
 * Wraps the application and exposes authentication state,
 * role information, and auth-related actions.
 */
export const AuthProvider = ({ children }) => {
  // Stores authenticated user object
  const [user, setUser] = useState(null);

  // Stores current user's role for role-based UI logic
  const [role, setRole] = useState(null);

  // Indicates whether authentication state is still being resolved
  const [loading, setLoading] = useState(true);

  /**
   * checkAuth
   *
   * Verifies the current authentication session by calling
   * the backend /auth/me endpoint.
   * Used on initial app load to restore login state.
   */
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setRole(res.data.user.role);
    } catch {
      // Reset state if authentication fails
      setUser(null);
      setRole(null);
    } finally {
      // Mark authentication check as complete
      setLoading(false);
    }
  };

  /**
   * login
   *
   * Authenticates the user using provided credentials
   * and updates global authentication state.
   *
   * @param {Object} formData - Login credentials
   * @returns {Object} Authenticated user object
   */
  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);
    setUser(res.data.user);
    setRole(res.data.user.role);
    return res.data.user;
  };

  /**
   * register
   *
   * Registers a new user account.
   * Does not automatically log the user in.
   *
   * @param {Object} formData - Registration payload
   */
  const register = async (formData) => {
    return api.post("/auth/register", formData);
  };

  /**
   * logout
   *
   * Terminates the current session and clears
   * local authentication state.
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Logout failures should not block local state cleanup
      console.error("Logout failed");
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  /**
   * refreshUser
   *
   * Re-fetches the authenticated user profile
   * without performing a full logout on failure.
   * Useful after profile updates or role changes.
   */
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  /**
   * Perform authentication check on initial mount
   * to restore existing sessions.
   */
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 *
 * Provides convenient access to authentication
 * context values and actions.
 */
export const useAuth = () => useContext(AuthContext);
