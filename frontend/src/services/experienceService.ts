import api from './api';
import type { CreateExperienceData, ExperienceListItem, ExperienceQueryParams, ExperirnceSlotData, PaginatedResponse, GetAllSlotsParams } from "../@types/experience.types";


export const createExperience = async (experienceData: CreateExperienceData) => {
    try {
        const response = await api.post('/experiences/', experienceData);
        return response.data;
    } catch (error) {
        console.error("Error creating experience:", error);
        throw error;
    }
};

export const getExperienceById = async (id: string) => {
  try {
    const response = await api.get(`/experiences/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw error;
  }
};

export const getAllExperiences = async (params?: ExperienceQueryParams) => {
  try {
    const response = await api.get<PaginatedResponse<ExperienceListItem>>(
      "/experiences/",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

export const getAllExperiencesCount = async (guide_id: string) => {
  try {
    const response = await getAllExperiences({  guide_id });
    return response.count;
  } catch (error) {
    console.error("Error fetching upcoming experiences count:", error);
    return 0;
  }
};

export const updateExperienceFull = async (id: string, experienceData: CreateExperienceData) => {
  try {
    const response = await api.put(`/experiences/${id}/`, experienceData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const updateExperiencePartial = async (id: string, experienceData: Partial<CreateExperienceData>) => {
  try {
    const response = await api.patch(`/experiences/${id}/`, experienceData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const deleteExperience = async (id: string) => {
  try {
    await api.delete(`/experiences/${id}/`);
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};

export const createExperienceSlot = async (experienceId: string, slotData: ExperirnceSlotData) => {
  try {
    const response = await api.post(`/experiences/${experienceId}/slots/`, slotData);
    return response.data;
  } catch (error) {
    console.error("Error creating experience slot:", error);
    throw error;
  }
};

export const getExperienceSlots = async ( experienceId: string, params?: GetAllSlotsParams ) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.upcoming !== undefined) {
      queryParams.append("upcoming", params.upcoming ? "true" : "false");
    }
    if (params?.past !== undefined) {
      queryParams.append("past", params.past ? "true" : "false");
    }


    const queryString = queryParams.toString();
    const url = `/experiences/${experienceId}/slots/${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience slots:", error);
    throw error;
  }
};

export const getAllExperienceSlots = async (params?: GetAllSlotsParams) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.upcoming !== undefined) {
      queryParams.append("upcoming", params.upcoming ? "true" : "false");
    }
    if (params?.past !== undefined) {
      queryParams.append("past", params.past ? "true" : "false");
    }
    if (params?.guide_id) {
      queryParams.append("guide_id", params.guide_id.toString());
    }

    const queryString = queryParams.toString();
    const url = `/experiences/all_slots/${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching all experience slots:", error);
    throw error;
  }
};

export const getUpcomingSlotsCount = async (guide_id: string) => {
  try {
    const response = await getAllExperienceSlots({ upcoming: true, guide_id });
    return response.count;
  } catch (error) {
    console.error("Error fetching upcoming slots count:", error);
    return 0;
  }
};

export const getSlotById = async (experienceId: string, slotId: string) => {
  try {
    const response = await api.get(`/experiences/${experienceId}/slots/${slotId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching experience slot:", error);
    throw error;
  }
};

export const updateExperienceSlotFull = async (experienceId: string, slotId: string, slotData: ExperirnceSlotData) => {
  try {
    const response = await api.put(`/experiences/${experienceId}/slots/${slotId}/`, slotData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience slot:", error);
    throw error;
  }
};

export const updateExperienceSlotPartial = async (experienceId: string, slotId: string, slotData: Partial<ExperirnceSlotData>) => {
    try {
        const response = await api.patch(`/experiences/${experienceId}/slots/${slotId}/`, slotData);
        return response.data;
    } catch (error) {
        console.error("Error updating experience slot:", error);
        throw error;
    }
};

export const deleteExperienceSlot = async (experienceId: string, slotId: string) => {
  try {
    await api.delete(`/experiences/${experienceId}/slots/${slotId}/`);
  } catch (error) {
    console.error("Error deleting experience slot:", error);
    throw error;
  }
};
