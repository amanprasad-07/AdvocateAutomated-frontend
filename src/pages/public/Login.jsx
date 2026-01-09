import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
        <h2 className="mb-4 text-center text-xl font-semibold text-text-primary">
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
            text-sm font-medium text-white
            hover:bg-primary-hover
            transition-colors
          "
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
