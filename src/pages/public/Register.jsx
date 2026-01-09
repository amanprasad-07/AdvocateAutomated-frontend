import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
        <h2 className="mb-4 text-center text-xl font-semibold text-text-primary">
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
      </form>
    </div>
  );
};

export default Register;
