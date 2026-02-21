import type { User } from "./auth.types";

export interface Review {
  id: number;
  experience: string;
  traveler: User;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  experience: string;
  rating: number;
  comment: string;
}
