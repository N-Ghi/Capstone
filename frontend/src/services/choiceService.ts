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

export const getPaymentMethods = async () => {
  try {
    const response = await api.get("choices/payments/");
    return response.data.results ?? response.data;
    } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

export const getTravelPreferences = async () => {
  try {
    const response = await api.get("/choices/travel_preferences/");
    return response.data.results ?? response.data;
  } catch (error) {
    console.error("Error fetching travel preferences:", error);
    throw error;
  }
};

export const getLanguages = async () => {
  try {
    const response = await api.get("/choices/languages/");
    return response.data.results ?? response.data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
};

export const getPaymentStatuses = async () => {
  try {
    const response = await api.get("/choices/payment_statuses/");
    return response.data.results ?? response.data;
  } catch (error) {
    console.error("Error fetching payment statuses:", error);
    throw error;
  }
};

export const getMobileProviders = async () => {
  try {
    const response = await api.get("/choices/mobile_providers/");
    return response.data.results ?? response.data;
  } catch (error) {
    console.error("Error fetching mobile providers:", error);
    throw error;
  }
};

export const getPayoutStatuses = async () => {
  try {
    const response = await api.get("/choices/payout_statuses/");
    return response.data.results ?? response.data;
  } catch (error) {
    console.error("Error fetching payout statuses:", error);
    throw error;
  }
};

