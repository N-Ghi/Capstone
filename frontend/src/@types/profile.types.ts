export interface SelectOption {
  id: string;
  name: string;
}

export interface Language extends SelectOption {}
export interface PaymentMethod extends SelectOption {}
export interface TravelPreference extends SelectOption {}

export interface TouristProfile {
  id: string;
  user_id: string;
  travel_preferences: string[];
  payment_methods: string[];
  languages: string[];
}

export interface GuideProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  languages: string[];
  payment_methods: string[];
  expertise: string[];
  location: Location | null;
}

export interface AdminProfile {
  id: string;
  user_id: string;
}

export type AnyProfile = TouristProfile | GuideProfile | AdminProfile;

export interface UpdateTouristProfileData {
  travel_preferences?: string[]; // array of IDs
  payment_methods?: string[];
  languages?: string[];
}

export interface UpdateGuideProfileData {
  name?: string;
  bio?: string;
  languages?: string[];
  payment_methods?: string[];
  expertise?: string[];
  location?: string | null;
}

export interface UpdateAdminProfileData {}

export type UpdateProfileData =
  | UpdateTouristProfileData
  | UpdateGuideProfileData
  | UpdateAdminProfileData;