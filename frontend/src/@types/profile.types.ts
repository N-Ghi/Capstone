export interface SelectOption {
  id: string;
  name: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Language extends SelectOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PaymentMethod extends SelectOption {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  phone_number: string;
  bio: string;
  languages: string[];
  payout_provider: string;
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
  phone_number?: string;
  bio?: string;
  languages?: string[];
  payout_provider?: string | null;
}

export interface UpdateAdminProfileData {}

export type UpdateProfileData =
  | UpdateTouristProfileData
  | UpdateGuideProfileData
  | UpdateAdminProfileData;