import { createContext, useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../services/api";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");

      const userStorage = await AsyncStorage.getItem("@user");

      if (token && userStorage) {
        api.defaults.headers.Authorization = `Bearer ${token}`;

        setUser(JSON.parse(userStorage));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    const userData = {
      name: user.name,
      email: user.email,
    };

    await AsyncStorage.setItem("@token", token);

    await AsyncStorage.setItem(
      "@user",
      JSON.stringify(userData)
    );

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@token");

    await AsyncStorage.removeItem("@user");

    delete api.defaults.headers.Authorization;

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};