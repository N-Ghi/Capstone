import axios from "axios";
import type { CreateProfileData } from "../types/profile.types";

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

export const createProfile = async (profileData: CreateProfileData) => {
    try {
        const response = await api.post('/profiles/', profileData);
        return response.data;
    } catch (error) {
        console.error("Error creating profile:", error);
        throw error;
    }
};

export const getProfileById = async (id: string) => {
  try {
    const response = await api.get(`/profiles/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateFullProfile = async (id: string, profileData: CreateProfileData) => {
  try {
    const response = await api.put(`/profiles/${id}/`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updatePartialProfile = async (id: string, profileData: Partial<CreateProfileData>) => {
  try {
    const response = await api.patch(`/profiles/${id}/`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error partially updating profile:", error);
    throw error;
  }
};

export const deleteProfile = async (id: string) => {
  try {
    await api.delete(`/profiles/${id}/`);
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
};

export const getAllProfiles = async () => {
  try {
    const response = await api.get('/profiles/');
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};
