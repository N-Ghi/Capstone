import type { Location } from './location.types';

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface CreateExperienceData {
  title: string;
  description: string;
  expertise: string[];
  photos: string[];
  languages: string[];
  payment_methods: string[];
  location_id?: string;
  guide_id?: string;
  origin_lang_id: string;
}

export interface ExperirnceSlotData {
  date: string;
  end_date: string;
  capacity: number;
  price: number;
  start_time: string;
  end_time: string;
}

export interface Slot {
  id: string;
  date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  remaining_slots: number;
  price: number;
  is_active: boolean;
  experience: string;
}

export interface ExperienceQueryParams {
  ordering?: string;
  expertise?: string;
  expertise_name?: string;
  guide_id?: string;
  guide_username?: string;
  title?: string;
  description?: string;
}

export interface GetAllSlotsParams {
  upcoming?: boolean;
  past?: boolean;
  guide_id?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ExperienceListItem {
  id: string;
  title: string;
  description: string;
  photos: string[];
  location?: Location;
  guide: string;
  is_active: boolean;
  created_at: string;
  languages: string[];
  guide_name?: string;
  average_rating: number | null;
  reviews_count: number;
  origin_lang: Language;
}

export interface ExperienceDetail {
  id: string;
  guide: string;
  title: string;
  description: string;
  expertise: string[];
  location?: Location;
  photos: string[];
  languages: string[];
  payment_methods: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  origin_lang: Language;
}