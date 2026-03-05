import api from './api';
import type { Booking, CreateBookingResponse, CreateBooking } from "../@types/booking.types";



export const createBooking = async (bookingData: CreateBooking): Promise<CreateBookingResponse> => {
  try {
    const response = await api.post<CreateBookingResponse>('/bookings/', bookingData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Booking failed with status:', error.response.status);
      console.error('Backend response:', error.response.data);
      throw new Error(error.response.data.detail || JSON.stringify(error.response.data));
    } else {
      console.error('Booking error:', error.message);
      throw error;
    }
  }
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<CreateBookingResponse> => {
  try {
    const response = await api.get<CreateBookingResponse>(`/bookings/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
};

// List all bookings
export const getAllBookings = async (page: number = 1): Promise<{ results: Booking[]; count: number }> => {
  try {
    const response = await api.get<{ results: Booking[]; count: number }>('/bookings/', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};

// List bookings by slot
export const getBookingBySlotId = async (slotId: string): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>(`/bookings/slot/${slotId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings by slot ID:", error);
    throw error;
  }
};

// Update booking (partial)
export const updateBooking = async (id: string, bookingData: Partial<CreateBooking>): Promise<CreateBookingResponse> => {
  try {
    const response = await api.patch<CreateBookingResponse>(`/bookings/${id}/`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

// Cancel booking
export const deleteBooking = async (id: string): Promise<void> => {
  try {
    await api.delete(`/bookings/${id}/`);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

// Upcoming bookings
export const upcomingBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>('/bookings/upcoming/');
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    throw error;
  }
};

// Past bookings
export const pastBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>('/bookings/past/');
    return response.data;
  } catch (error) {
    console.error("Error fetching past bookings:", error);
    throw error;
  }
};
