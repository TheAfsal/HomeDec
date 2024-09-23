import api from "./apiConfig";

export const addProduct = async (details) => {
  try {
    const response = await api.post("/seller/products/add", details);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const ListProducts = async () => {
  try {
    const response = await api.get("/seller/products/list");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};
