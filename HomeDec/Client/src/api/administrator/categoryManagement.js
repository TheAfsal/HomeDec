import api from "../apiConfigAdmin";
import userAPI from "../apiConfigUser";

export const addCategory = async (details) => {
  try {
    const response = await api.post(`/admin/category/add`, details);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const listCategory = async (role) => {
  try {
    const response = await api.get(`/${role}/category/list`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const listCategoryForUser = async (role) => {
  try {
    const response = await userAPI.get(`/category/list`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const changeStatusCategory = async (id) => {
  try {
    const response = await api.patch(`/admin/category/toggle-status/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const updateCategoryAndSubCategory = async (details) => {
  try {
    const response = await api.put(`/admin/category/edit`, details);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
