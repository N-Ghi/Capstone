import type { Slot } from './experience.types'

export interface CreateBooking {
    slot_id: string;
    guest: number;
}

export interface CreateBookingResponse {
    id: string;
    traveler: string;
    traveler_name: string;
    slot: Slot;
    guests: number;
    experience_id: string;
    experience_title: string;
    experience_location: string;
    price_per_guest: number;
    total_price: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Booking  {
    id: string;
    traveler_name: string;
    experience_title: string;
    booking_date: string;
    guests: number;
    total_price: number;
    status: string;
    created_at: string;
}