export interface CreateExperienceData {
    title: string;
    description: string;
    expertise: string[];
    photos: string[];
    date: Date;
    languages: string[];
    payment_methods: string[];
    location_id?: string;

}

export interface ExperirnceSlotData {
  date: Date,
  capacity: number,
  price: number,
  start_time: string,
  end_time: string
}

export interface Slot {
    id: string;
    date: Date;
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
  photos: string[];
  description: string;
  location?: {
    id: string;
    name: string;
  };
}