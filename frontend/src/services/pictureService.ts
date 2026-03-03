import api from './api';

export const uploadProfilePicture = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
        const response = await api.post("pictures/upload/profile/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {        console.error("Error uploading profile picture:", error);
        throw error;
    }
};

export const uploadExperiencePicture = async ( image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
        const response = await api.post(`pictures/upload/experience/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading experience picture:", error);
        throw error;
    }
};
