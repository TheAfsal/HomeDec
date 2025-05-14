import userAPI from "../apiConfigUser";

export const fetchMyCart = async () => {
  try {
    const response = await userAPI.get("/cart/list");
    return response.data.products;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const updateCartCount = async (productId, variantId, quantity) => {
  try {
    const response = await userAPI.put("/cart/add-product", {
      productId,
      variantId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const removeVariantFromCart = async (productId, variantId) => {
  try {
    const response = await userAPI.patch("/cart/remove-product", {
      productId,
      variantId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
