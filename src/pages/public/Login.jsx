import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Login = () => {
    const { login, role } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login({ email, password });
            navigate(`/${role}`);
        } catch {
            setError("Invalid email or password");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-surface dark:bg-dark-surface p-6 rounded shadow w-80"
            >
                <h2 className="text-xl mb-4 text-center">Login</h2>

                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-3 p-2 border border-border dark:border-dark-border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 border border-border dark:border-dark-border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
