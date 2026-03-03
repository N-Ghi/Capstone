import api from './api';
import type { User } from "../@types/auth.types";


export const listUsers = async () => {
    // List all users
    const response = await api.get("/users/all/");
    return response.data;
}

export const getUserById = async (id: string) => {
    // Get user details by ID
    const response = await api.get(`/users/${id}/`);
    return response.data;
}

export const updateUserFull = async (id: string, data: User) => {
    // Update user details
    const response = await api.put(`/users/${id}/`, data);
    return response.data;
}

export const updateUserPartial = async (id: string, data: Partial<User>) => {
    // Partially update user details
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
}

export const deleteUser = async (id: string) => {
    // Delete user
    try {
        await api.delete(`/users/${id}/`);
    } catch (error) {
        throw error;
    }
}