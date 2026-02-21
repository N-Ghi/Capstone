import axios from "axios";

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

export const uploadProfilePicture = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
        const response = await api.post("pictures/upload/profile/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {        console.error("Error uploading profile picture:", error);
        throw error;
    }
};

export const uploadExperiencePicture = async ( image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
        const response = await api.post(`pictures/upload/experience/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading experience picture:", error);
        throw error;
    }
};
