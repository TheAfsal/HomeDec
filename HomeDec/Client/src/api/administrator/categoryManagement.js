import api from "../apiConfigAdmin";

export const addCategory = async (details) => {
  try {
    const response = await api.post(`/admin/category/add`, details);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const listCategory = async (role) => {
  try {
    console.log(role);

    const response = await api.get(`/${role}/category/list`);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(error?.response?.data?.error);
  }
};

export const changeStatusCategory = async (id) => {
  try {
    const response = await api.patch(`/admin/category/toggle-status/${id}`);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(error?.response?.data?.error);
  }
};

export const updateCategoryAndSubCategory = async (details) => {
  try {
    const response = await api.put(`/admin/category/edit`, details);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(error?.response?.data?.error);
  }
};
