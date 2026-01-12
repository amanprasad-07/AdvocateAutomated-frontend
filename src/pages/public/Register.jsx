import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    role: "client",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(form);
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className=" flex flex-col min-h-screen items-center justify-center bg-bg ">

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
          hover:bg-surface-elevated
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
          w-full max-w-md
          rounded-xl
          border border-border
          bg-surface
          p-6
          shadow-sm
        "
        >
          <h2 className="mb-4 text-center text-lg sm:text-xl font-semibold text-text-primary">
            Register
          </h2>

          {error && (
            <p className="mb-3 text-center text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Name ---------- */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
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

          {/* ---------- Email ---------- */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
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

          {/* ---------- Address ---------- */}
          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
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

          {/* ---------- Phone ---------- */}
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Phone"
            onChange={handleChange}
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

          {/* ---------- Password ---------- */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
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

          {/* ---------- Confirm Password ---------- */}
          <input
            name="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
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

          {/* ---------- Role ---------- */}
          <select
            name="role"
            onChange={handleChange}
            className="
            mb-4 w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
          >
            <option value="client">Client</option>
            <option value="advocate">Advocate</option>
            <option value="junior_advocate">Junior Advocate</option>
          </select>

          {/* ---------- Submit ---------- */}
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
            Register
          </button>

          {/* Login link */}
          <p className="mt-4 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
