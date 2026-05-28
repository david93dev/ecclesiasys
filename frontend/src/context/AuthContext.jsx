import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { isAdminRole } from "@/utils/roles";

export const AuthContext = createContext();

const normalizeRole = (role) => {
  if (isAdminRole(role)) {
    return "admin";
  }

  return role;
};

const getUserFromStorage = (token, userStorage) => {
  const storedUser = JSON.parse(userStorage);

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      ...storedUser,
      role: normalizeRole(storedUser.role || payload.role)
    };
  } catch {
    return {
      ...storedUser,
      role: normalizeRole(storedUser.role)
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (token && userStorage) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const storedUser = getUserFromStorage(token, userStorage);
      localStorage.setItem("user", JSON.stringify(storedUser));
      setUser(storedUser);
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
      email: user.email,
      role: normalizeRole(user.role)
    }));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setUser({
      name: user.name,
      email: user.email,
      role: normalizeRole(user.role)
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
