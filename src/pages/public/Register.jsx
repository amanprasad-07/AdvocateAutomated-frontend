import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    alert("Registered successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="client">Client</option>
        <option value="advocate">Advocate</option>
        <option value="junior">Junior</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
