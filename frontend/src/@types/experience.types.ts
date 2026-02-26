import type{ Location } from './location.types';

export interface CreateExperienceData {
  title: string;
  description: string;
  expertise: string[];
  photos: string[];
  date: string;
  languages: string[];
  payment_methods: string[];
  location_id?: string;
  guide_id?: string;
}

export interface ExperirnceSlotData {
  date: string,
  capacity: number,
  price: number,
  start_time: string,
  end_time: string
}

export interface Slot {
    id: string;
    date: string;
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
  guide_name?: string;
  is_active: boolean;
  created_at: string;
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
}