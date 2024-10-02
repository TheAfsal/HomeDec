import api from "../apiConfigAdmin";

export const listSellers = async () => {
  try {
    const response = await api.get(`/admin/seller/list`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};
