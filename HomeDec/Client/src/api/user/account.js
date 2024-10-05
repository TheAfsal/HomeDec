import userAPI from "../apiConfigUser";

export const fetchMyDetails = async () => {
  try {
    const response = await userAPI.get("/account/profile");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

// export const updateBasicDetails = async () => {
//   try {
//     const response = await userAPI.patch("/account/profile/edit-basic-details");
//     console.log(response.data);

//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw new Error(error?.response?.data?.error);
//   }
// };

export const updateContacts = async (email, phoneNumber) => {
  try {
    const response = await userAPI.patch(
      "/account/profile/edit-contact-details",
      {
        newEmail: email,
        phoneNumber,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await userAPI.patch("/account/profile/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchMyAddresses = async () => {
  try {
    const response = await userAPI.get("/account/address/list");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const addNewAddresses = async (updatedAddress) => {
  try {
    const response = await userAPI.put(
      "/account/address/add-new",
      updatedAddress
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const removeAddress = async (id) => {
  try {
    const response = await userAPI.delete(`/account/address/delete/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const createOrder = async (cartItems) => {
  try {
    const response = await userAPI.post("/cart/checkout/create-new-order", {
      cartItems,
    });
    console.log(response.data);
    return response.data.orderId;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.message);
  }
};

export const updateOrder = async (orderId, paymentMethod, shippingAddress) => {
  try {
    const response = await userAPI.post(
      "/cart/checkout/update-existing-order",
      {
        orderId,
        paymentMethod,
        shippingAddress,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.message);
  }
};

export const addTransactionId = async (orderId, transactionId) => {
  try {
    const response = await userAPI.post("/cart/checkout/add-transaction-id", {
      orderId,
      transactionId,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.message);
  }
};

export const findWishListItem = async () => {
  try {
    const response = await userAPI.get("/account/wishlist");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};

export const addToWishList = async (productId, variantId) => {
  try {
    const response = await userAPI.put("/account/wishlist/add-product", {
      productId,
      variantId,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.error);
  }
};
