import api from './api';
import type { LocationData, Location } from "../@types/location.types";


export const createLocation = async (placeName: string): Promise<LocationData> => {
  try {
    const response = await api.post("/locations/geocode/", { place_name: placeName });
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

export const saveLocation = async (locationData: LocationData): Promise<Location> => {
  try {
    const response = await api.post("/locations/save/", locationData);
    return response.data;
    } catch (error) {
    console.error("Error saving location:", error);
    throw error;
    }
};
