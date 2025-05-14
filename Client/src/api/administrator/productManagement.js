import api from "../apiConfigAdmin";
import userAPI from "../apiConfigUser";

export const addProduct = async (details) => {
  try {
    const response = await api.post("/seller/products/add", details);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const updateProduct = async (details, prodId) => {
  try {
    const response = await api.post("/seller/products/edit", {
      details,
      prodId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const ListProducts = async () => {
  try {
    const response = await api.get("seller/products/list");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const ListAllProducts = async ({ pageParam }) => {
  try {
    const response = await api.get(
      // role === "admin"
      //   ? "admin/products/list"
      //   :
      `products/list?limit=6&cursor=${pageParam}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchDetails = async (productId) => {
  try {
    const response = await api.get(`/product/details/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const distinctCatForHome = async () => {
  try {
    const response = await userAPI.get(`/category/list-dist`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const changeProductStatus = async ({ pId, index }) => {
  try {
    const response = await api.patch(
      `/seller/products/toggle-status/${pId}/${index}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchSearchingProducts = async (query, sort, filter) => {
  try {
    filter?.value.length !== 0 && filter?.value.join(",");

    const response = await userAPI.get(
      `/products/search?q=${query}&sort=${sort}&option=category&value=${filter?.value}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const addProductImage = async (
  formData,
  variantIndex,
  posIndex,
  setVariants
) => {
  try {
    const response = await api.post(
      `/seller/products/add-product-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentComplete = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setVariants((prev) => {
            const updated = [...prev];

            if (updated[variantIndex]) {
              if (
                updated[variantIndex].images &&
                updated[variantIndex].images[posIndex]
              ) {
                updated[variantIndex].images[posIndex].progress =
                  percentComplete;
              } else {
                console.warn(`Image at position ${posIndex} does not exist.`);
              }
            } else {
              console.warn(`Variant at index ${variantIndex} does not exist.`);
            }

            return updated;
          });
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};
