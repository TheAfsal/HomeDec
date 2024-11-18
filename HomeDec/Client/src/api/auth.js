import api from "./apiConfigAdmin";

export const userLogin = async (credentials) => {
  try {
    const response = await api.post("/login", credentials, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const registerUser = async (credentials) => {
  try {
    const response = await api.post("/register", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const verifyEmail = async (credentials) => {
  try {
    const response = await api.post("/verify-email", { email: credentials });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const createSeller = async (credentials) => {
  try {
    const response = await api.post("/admin/seller/add", credentials);

    return response.data;
  } catch (error) {
    //

    throw new Error(error?.response?.data?.error);
  }
};

export const sellerLogin = async (credentials) => {
  try {
    const response = await api.post("/seller/login", credentials);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
