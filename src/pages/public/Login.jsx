import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

/**
 * Login Page
 *
 * Handles user authentication using email and password.
 * On successful login, redirects the user to their
 * role-specific dashboard.
 */
const Login = () => {
  // Access login action from authentication context
  const { login } = useAuth();

  // Navigation helper for programmatic redirects
  const navigate = useNavigate();

  // Local state for controlled form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Stores authentication error messages
  const [error, setError] = useState("");

  /**
   * Form submit handler
   *
   * Attempts to authenticate the user and redirect
   * based on their assigned role.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Perform login via auth context
      const user = await login({ email, password });

      // Redirect to role-based root route
      navigate(`/${user.role}`);
    } catch {
      // Display generic error message on authentication failure
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {/* ---------- Header ---------- */}
      <header
        className="
          sticky top-0 z-10
          flex items-center justify-between
          border-b border-border
          bg-bg/80 px-8 py-4
          backdrop-blur w-full
        "
      >
        {/* Application brand */}
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Advocate Automated
        </h1>

        {/* Close button navigates back to landing page */}
        <button
          onClick={() => navigate("/")}
          aria-label="Close login"
          className="
            top-4 right-4
            flex items-center justify-center
            w-10 h-10
            rounded-lg border border-border
            text-text-secondary
            hover:bg-surfaceElevated
            hover:text-text-primary
            transition-colors
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* ---------- Login Form ---------- */}
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="
            w-full max-w-sm
            rounded-xl
            border border-border
            bg-surface
            p-6
            shadow-sm
          "
        >
          {/* Form title */}
          <h2 className="mb-4 text-center text-lg sm:text-xl font-semibold text-text-primary">
            Login
          </h2>

          {/* Authentication error message */}
          {error && (
            <p className="mb-3 text-center text-sm text-error">
              {error}
            </p>
          )}

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              mb-3 w-full rounded-lg
              border border-border
              bg-bg
              px-3 py-2
              text-text-primary
              placeholder:text-text-muted
              focus:outline-none
              focus:ring-2 focus:ring-primary/30
            "
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              mb-4 w-full rounded-lg
              border border-border
              bg-bg
              px-3 py-2
              text-text-primary
              placeholder:text-text-muted
              focus:outline-none
              focus:ring-2 focus:ring-primary/30
            "
          />

          {/* Submit button */}
          <button
            type="submit"
            className="
              w-full rounded-lg
              bg-primary
              py-2
              text-sm font-medium text-text-primary
              hover:bg-primary-hover
              transition-colors
            "
          >
            Login
          </button>

          {/* Registration link */}
          <p className="mt-4 text-center text-sm text-text-secondary">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
