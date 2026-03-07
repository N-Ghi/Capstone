import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import type { User, RegisterData, LoginData } from "../@types/auth.types";
import { Roles } from "../@types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  isAdmin: boolean;
  isGuide: boolean;
  isTourist: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = user?.role === Roles.Admin;
  const isGuide = user?.role === Roles.Guide;
  const isTourist = user?.role === Roles.Tourist;
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
  const login = async (inputs: LoginData) => {
    const data = await authService.login(inputs);

    localStorage.setItem("access", data.tokens.access);
    localStorage.setItem("refresh", data.tokens.refresh);

    setUser(data.user);

    return data.user;
  };

  // REGISTER
  const register = async (data: RegisterData) => {
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
    <AuthContext.Provider value={{ user, loading, login, register, logout,
      refreshUser, isAdmin, isGuide, isTourist, }}
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