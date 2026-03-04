export interface Review {
  id: string;
  experience: string;
  traveler: string;
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

export interface ReviewPatchData {
  rating?: number;
  comment?: string;
}

export interface FilterQueryParams {
  ordering?: string;
  experience?: string;
  rating?: string;
  traveler?: string;
}