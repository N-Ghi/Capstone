import api from './api';
import type { Review, ReviewFormData } from "../@types/review.types";


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
