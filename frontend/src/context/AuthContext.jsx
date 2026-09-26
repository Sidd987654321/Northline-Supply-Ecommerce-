import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
const STORAGE_KEY = "ns_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved session on first render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.register({ name, email, password, phone });
    persist(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    token: user?.token,
    isAdmin: user?.role === "admin",
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
