import api from "./apiConfig";

export const addCategory = async (details) => {
    try {
        const response = await api.post(`/admin/category/add`, details);
        console.log(response);

        return response;
    } catch (error) {
        console.log(error);

        throw new Error(error?.response?.data?.error);
    }
};

export const listCategory = async () => {
    try {
        const response = await api.get(`/admin/category/list`);
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.log(error);

        throw new Error(error?.response?.data?.error);
    }
};