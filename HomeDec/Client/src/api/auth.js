import api from "./apiConfig";

export const userLogin = async (credentials) => {
  try {
    console.log(credentials);
    const response = await api.post("/login", credentials);
    console.log(response);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const registerUser = async (credentials) => {
  try {
    console.log(credentials);
    const response = await api.post("/register", credentials);
    return response.data;

  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const verifyEmail = async (credentials) => {
  try {
    console.log("credentials");
    console.log(credentials);
    const response = await api.post("/verify-email", {email:credentials});
    return response.data;

  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const adminLogin = async (credentials) => {
  try {
    console.log(credentials);
    const response = await api.post("/admin/login", credentials);
    console.log(response);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const createSeller = async (credentials) => {
  try {
    const response = await api.post("/admin/seller/add", credentials);
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
    
    throw new Error(error?.response?.data?.error);
  }
};

export const sellerLogin = async (credentials) => {
  try {
    console.log(credentials);
    const response = await api.post("/seller/login", credentials);
    console.log(response);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
