import axios from "axios";
import type { AnyProfile, TouristProfile, GuideProfile, UpdateTouristProfileData, UpdateGuideProfileData, UpdateProfileData, } from "../@types/profile.types";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const timeout = import.meta.env.VITE_API_TIMEOUT;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: timeout,
  headers: { "Content-Type": "application/json" },
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createTouristProfile = async ( data: UpdateTouristProfileData ): Promise<TouristProfile> => {
  try {
    const response = await api.post("/profiles/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating tourist profile:", error);
    throw error;
  }
};

export const createGuideProfile = async ( data: UpdateGuideProfileData ): Promise<GuideProfile> => {
  try {
    const response = await api.post("/profiles/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating guide profile:", error);
    throw error;
  }
};

export const getProfileById = async (id: string): Promise<AnyProfile> => {
  try {
    const response = await api.get(`/profiles/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getAllProfiles = async (): Promise<AnyProfile[]> => {
  try {
    const response = await api.get("/profiles/");
    return response.data.results ?? response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};

export const updateFullProfile = async ( id: string, data: UpdateProfileData ): Promise<AnyProfile> => {
  try {
    const response = await api.put(`/profiles/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updatePartialProfile = async ( id: string, data: UpdateProfileData ): Promise<AnyProfile> => {
  try {
    const response = await api.patch(`/profiles/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error partially updating profile:", error);
    throw error;
  }
};

export const deleteProfile = async (id: string): Promise<void> => {
  try {
    await api.delete(`/profiles/${id}/`);
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
};