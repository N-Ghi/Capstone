import axios from "axios";
import type { Review, ReviewFormData } from "../types/review.types";

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

export const createReview = async (reviewData: ReviewFormData): Promise<Review> => {
  try {
    const response = await api.post("/reviews/", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const updateReviewFull = async (reviewId: number, reviewData: ReviewFormData): Promise<Review> => {
  try {
    const response = await api.put(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const updateReviewPartial = async (reviewId: number, reviewData: Partial<ReviewFormData>): Promise<Review> => {
  try {
    const response = await api.patch(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await api.delete(`/reviews/${reviewId}/`);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
