import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import type { User } from "../@types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access");

      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to fetch user");
          authService.logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // LOGIN
  const login = async (identifier: string, password: string) => {
    const data = await authService.login({ identifier, password });

    localStorage.setItem("access", data.tokens.access);
    localStorage.setItem("refresh", data.tokens.refresh);

    setUser(data.user);

    return data.user;
  };

  // REGISTER
  const register = async (data: any) => {
    await authService.register(data);
  };

  // LOGOUT
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};