import api from './api';
import type { AuthResponse, User } from "../@types/auth.types";


export const register = async (data: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  confirm_password: string;
}) => {
  return api.post("users/auth/create/", data);
};

export const login = async (data: {
  identifier: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post("users/auth/login/", data);
  return response.data;
};

export const verifyEmail = async (uid: string, token: string) => {
  return api.get(`/users/auth/verify-email/${uid}/${token}/`);
};

export const resendVerificationEmail = async (email: string) => {
  return api.post("/users/auth/resend-verification-email/", { email });
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/users/me/");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};