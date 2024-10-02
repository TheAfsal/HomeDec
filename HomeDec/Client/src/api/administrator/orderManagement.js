import api from "../apiConfigAdmin";
import userAPI from "../apiConfigUser";

export const ListAllOrders = async () => {
  try {
    const response = await api.get("/admin/orders/list");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const ListMyOrders = async () => {
  try {
    const response = await api.get("/seller/orders/list");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchUserOrders = async () => {
  try {
    const response = await userAPI.get("/account/orders/list");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchOrder = async (orderId) => {
  try {
    const response = await userAPI.get(`/account/orders/details/${orderId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const changeOrderStatus = async (
  status,
  orderId,
  productId,
  variantId
) => {
  try {
    const response = await api.patch("/seller/orders/update-status", {
      status,
      orderId,
      productId,
      variantId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const changeOrderStatusByUser = async (
  status,
  orderId,
  productId,
  variantId
) => {
  try {
    const response = await userAPI.patch("/orders/update-status", {
      status,
      orderId,
      productId,
      variantId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};
