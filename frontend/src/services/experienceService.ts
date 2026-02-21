import axios from "axios";
import type { CreateExperienceData, ExperienceListItem, ExperienceQueryParams, ExperirnceSlotData, PaginatedResponse } from "../@types/experience.types";

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

export const createExperience = async (experienceData: CreateExperienceData) => {
    try {
        const response = await api.post('/experiences/', experienceData);
        return response.data;
    } catch (error) {
        console.error("Error creating experience:", error);
        throw error;
    }
};

export const getExperienceById = async (id: string) => {
  try {
    const response = await api.get(`/experiences/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw error;
  }
};

export const getAllExperiences = async (params?: ExperienceQueryParams) => {
  try {
    const response = await api.get<PaginatedResponse<ExperienceListItem>>(
      "/experiences/",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

export const updateExperienceFull = async (id: string, experienceData: CreateExperienceData) => {
  try {
    const response = await api.put(`/experiences/${id}/`, experienceData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const updateExperiencePartial = async (id: string, experienceData: Partial<CreateExperienceData>) => {
  try {
    const response = await api.patch(`/experiences/${id}/`, experienceData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const deleteExperience = async (id: string) => {
  try {
    await api.delete(`/experiences/${id}/`);
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};

export const createExperienceSlot = async (experienceId: string, slotData: ExperirnceSlotData) => {
  try {
    const response = await api.post(`/experiences/${experienceId}/slots/`, slotData);
    return response.data;
  } catch (error) {
    console.error("Error creating experience slot:", error);
    throw error;
  }
};

export const getExperienceSlots = async (experienceId: string) => {
  try {
    const response = await api.get(`/experiences/${experienceId}/slots/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience slots:", error);
    throw error;
  }
};

export const getSlotById = async (experienceId: string, slotId: string) => {
  try {
    const response = await api.get(`/experiences/${experienceId}/slots/${slotId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience slot:", error);
    throw error;
  }
};

export const updateExperienceSlotFull = async (experienceId: string, slotId: string, slotData: ExperirnceSlotData) => {
  try {
    const response = await api.put(`/experiences/${experienceId}/slots/${slotId}/`, slotData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience slot:", error);
    throw error;
  }
};

export const updateExperienceSlotPartial = async (experienceId: string, slotId: string, slotData: Partial<ExperirnceSlotData>) => {
    try {
        const response = await api.patch(`/experiences/${experienceId}/slots/${slotId}/`, slotData);
        return response.data;
    } catch (error) {
        console.error("Error updating experience slot:", error);
        throw error;
    }
};

export const deleteExperienceSlot = async (experienceId: string, slotId: string) => {
  try {
    await api.delete(`/experiences/${experienceId}/slots/${slotId}/`);
  } catch (error) {
    console.error("Error deleting experience slot:", error);
    throw error;
  }
};
