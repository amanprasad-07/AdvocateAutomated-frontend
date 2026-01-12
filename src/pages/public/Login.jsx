import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({ email, password });
      navigate(`/${user.role}`);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
    {/* ---------- Header ---------- */}
      <header className="
         sticky top-0 z-10
    flex items-center justify-between
    border-b border-border
    bg-bg/80 px-8 py-4
    backdrop-blur w-full
      ">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Advocate Automated
        </h1>
        {/* Close / Back to Landing */}
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
        <h2 className="mb-4 text-center text-lg sm:text-xl font-semibold text-text-primary">
          Login
        </h2>

        {error && (
          <p className="mb-3 text-center text-sm text-error">
            {error}
          </p>
        )}

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

        {/* Register link */}
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
