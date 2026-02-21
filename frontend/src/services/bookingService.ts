import axios from "axios";
import type { Booking, CreateBookingResponse, CreateBooking } from "../@types/booking.types";
const API_URL = import.meta.env.VITE_API_BASE_URL
const timeout = import.meta.env.VITE_API_TIMEOUT;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: timeout,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createBooking = async (bookingData: CreateBooking): Promise<CreateBookingResponse> => {
  try {
    const response = await api.post<CreateBookingResponse>('/bookings/', bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookingById = async (id: string): Promise<CreateBookingResponse> => {
  try {
    const response = await api.get<CreateBookingResponse>(`/bookings/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
};

export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>('/bookings/');
    return response.data;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};

export const getBookingBySlotId = async (slotId: string): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>(`/bookings/slot/${slotId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings by slot ID:", error);
    throw error;
  }
};

export const updateBooking = async (id: string, bookingData: Partial<CreateBooking>): Promise<CreateBookingResponse> => {
  try {
    const response = await api.patch<CreateBookingResponse>(`/bookings/${id}/`, bookingData);
    return response.data;
    } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    await api.delete(`/bookings/${id}/`);
    } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

export const upcommingBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>('/bookings/upcoming/');
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    throw error;
  }
};

export const pastBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<Booking[]>('/bookings/past/');
    return response.data;
  } catch (error) {
    console.error("Error fetching past bookings:", error);
    throw error;
  }
};