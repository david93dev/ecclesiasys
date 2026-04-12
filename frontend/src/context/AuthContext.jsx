import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (token && userStorage) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(userStorage));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify({
      name: user.name,
      email: user.email
    }));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setUser({
      name: user.name,
      email: user.email
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};