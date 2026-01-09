import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setRole(res.data.user.role);
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
  const res = await api.post("/auth/login", formData);
  setUser(res.data.user);
  setRole(res.data.user.role);
  return res.data.user; // 👈 return user
};


  const register = async (formData) => {
    return api.post("/auth/register", formData);
  };

 const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout failed");
  } finally {
    setUser(null);
    setRole(null);
  }
};



  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
