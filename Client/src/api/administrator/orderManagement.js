import axios from "axios";
import api from "../apiConfigAdmin";
import userAPI from "../apiConfigUser";

export const ListAllOrders = async () => {
  try {
    const response = await api.get("/admin/orders/list");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const ListMyOrders = async () => {
  try {
    const response = await api.get("/seller/orders/list");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchUserOrders = async () => {
  try {
    const response = await userAPI.get("/account/orders/list");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchOrder = async (orderId) => {
  try {
    const response = await userAPI.get(`/account/orders/details/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const generateReturnOrCancelRequest = async (
  orderId,
  productId,
  variantId,
  reason,
  comments,
  returnOrCancel
) => {
  try {
    const response = await userAPI.patch(`/orders/request-return`, {
      orderId,
      productId,
      variantId,
      reason,
      comments,
      returnOrCancel,
    });
    return response.data;
  } catch (error) {
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
    throw new Error(error?.response?.data?.error);
  }
};

export const rejectCancelOrReturnOrder = async (
  orderId,
  productId,
  variantId
) => {
  try {
    const response = await api.patch("/seller/orders/reject-cancel-or-return", {
      status,
      orderId,
      productId,
      variantId,
    });
    return response.data;
  } catch (error) {
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
    throw new Error(error?.response?.data?.error);
  }
};

export const generateInvoice = async (orderId, productId, variantId) => {
  try {
    const response = await userAPI.get(
      `/account/orders/generate-invoice/${orderId}/${productId}/${variantId}`,
      { responseType: "blob" }
    );
    return response.data; // Return the blob data
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw new Error(
      error?.response?.data?.message || "Error generating invoice"
    );
  }
};
