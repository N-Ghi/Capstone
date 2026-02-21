import axios from "axios";
import type { LocationData, Location } from "../types/location.types";

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

export const createLocation = async (placeName: string): Promise<LocationData> => {
  try {
    const response = await api.post("/locations/geocode/", { place_name: placeName });
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

export const saveLocation = async (locationData: LocationData): Promise<Location> => {
  try {
    const response = await api.post("/locations/save/", locationData);
    return response.data;
    } catch (error) {
    console.error("Error saving location:", error);
    throw error;
    }
};
