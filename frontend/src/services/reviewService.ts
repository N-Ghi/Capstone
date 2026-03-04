import api from './api';
import type { Review, ReviewFormData, FilterQueryParams } from "../@types/review.types";
import type { PaginatedResponse } from '../@types/experience.types';

export const createReview = async (reviewData: ReviewFormData): Promise<Review> => {
  try {
    const response = await api.post("/reviews/", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const getReviews = async (params?: FilterQueryParams) => {
  try {
    const response = await api.get<PaginatedResponse<Review>>(`/reviews/`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};


export const updateReviewFull = async (reviewId: string, reviewData: ReviewFormData): Promise<Review> => {
  try {
    const response = await api.put(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const updateReviewPartial = async (reviewId: string, reviewData: Partial<ReviewFormData>): Promise<Review> => {
  try {
    const response = await api.patch(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await api.delete(`/reviews/${reviewId}/`);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getExperienceReviews = async (experienceId: string): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/?experience=${experienceId}`);
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};