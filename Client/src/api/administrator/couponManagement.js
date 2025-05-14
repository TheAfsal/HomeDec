import api from "../apiConfigAdmin";

export const createCoupon = async (details) => {
  try {
    const response = await api.post(`/admin/coupons/create`, details);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const listCoupons = async (role) => {
  try {
    const response = await api.get(`/${role}/coupons`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const updateCoupon = async (details) => {
  try {
    const response = await api.put(`/admin/coupons/update`, details);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const toggleCouponStatus = async (id) => {
  try {
    const response = await api.patch(`/admin/coupons/toggle-status/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
