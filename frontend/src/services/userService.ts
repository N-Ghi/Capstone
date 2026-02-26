import axios from "axios";
import type { User } from "../@types/auth.types";

const API_URL = import.meta.env.VITE_API_BASE_URL
const timeout = import.meta.env.VITE_API_TIMEOUT;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: timeout,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const listUsers = async () => {
    // List all users
    const response = await api.get("/users/all/");
    return response.data;
}

export const getUserById = async (id: string) => {
    // Get user details by ID
    const response = await api.get(`/users/${id}/`);
    return response.data;
}

export const updateUserFull = async (id: string, data: User) => {
    // Update user details
    const response = await api.put(`/users/${id}/`, data);
    return response.data;
}

export const updateUserPartial = async (id: string, data: Partial<User>) => {
    // Partially update user details
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
}

export const deleteUser = async (id: string) => {
    // Delete user
    try {
        await api.delete(`/users/${id}/`);
    } catch (error) {
        throw error;
    }
}