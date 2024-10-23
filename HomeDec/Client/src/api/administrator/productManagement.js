import api from "../apiConfigAdmin";
import userAPI from "../apiConfigUser";

export const addProduct = async (details) => {
  try {
    console.log("addProduct called");
    
    const response = await api.post("/seller/products/add", details);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const ListProducts = async () => {
  try {
    const response = await api.get("seller/products/list");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const ListAllProducts = async (role) => {
  try {
    const response = await api.get(
      role === "admin" ? "admin/products/list" : "products/list"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchDetails = async (productId) => {
  try {
    const response = await api.get(`/product/details/${productId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const changeProductStatus = async ({ pId, index }) => {
  try {
    const response = await api.patch(
      `/seller/products/toggle-status/${pId}/${index}`
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(error?.response?.data?.error);
  }
};

export const fetchSearchingProducts = async (query, sort, filter) => {
  try {
    console.log(query, sort, filter);
    filter?.value.length !== 0 && filter?.value.join(",");

    console.log(filter);

    const response = await userAPI.get(
      `/products/search?q=${query}&sort=${sort}&option=category&value=${filter?.value}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);

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
    console.log(variantIndex, posIndex);

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
          console.log(percentComplete);

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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(error?.response?.data?.error);
  }
};
