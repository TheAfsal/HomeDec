import userAPI from "../apiConfigUser";

export const fetchMyDetails = async () => {
  try {
    const response = await userAPI.get("/account/profile");

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

// export const updateBasicDetails = async () => {
//   try {
//     const response = await userAPI.patch("/account/profile/edit-basic-details");
//

//     return response.data;
//   } catch (error) {
//
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
    throw new Error(error?.response?.data?.error);
  }
};

export const fetchMyAddresses = async () => {
  try {
    const response = await userAPI.get("/account/address/list");

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const addNewAddresses = async (updatedAddress) => {
  try {
    const response = await userAPI.put(
      "/account/address/add-new",
      updatedAddress
    );

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const removeAddress = async (id) => {
  try {
    const response = await userAPI.delete(`/account/address/delete/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const createOrder = async (cartItems, promoCode) => {
  try {
    
    const response = await userAPI.post("/cart/checkout/create-new-order", {
      cartItems,
      promoCode,
    });

    return response.data.orderId;
  } catch (error) {
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

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const addTransactionId = async (
  paymentStatus,
  orderId,
  razorpayOrderId
) => {
  try {
    const response = await userAPI.post("/cart/checkout/add-transaction-id", {
      paymentStatus,
      orderId,
      razorpayOrderId,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const findWishListItem = async () => {
  try {
    const response = await userAPI.get("/account/wishlist");

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const addToWishList = async (productId, variantId) => {
  try {
    const response = await userAPI.put("/account/wishlist/add-product", {
      productId,
      variantId,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

export const removeFromWishList = async (items) => {
  try {
    const response = await userAPI.patch("/account/wishlist/remove-product", {
      itemsToRemove: items,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const AddToCartFromWishList = async (products) => {
  try {
    const response = await userAPI.put("/account/wishlist/add-to-cart", {
      products,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const verifyPromoCode = async (promoCode, cartItems, finalAmount) => {
  try {
    const response = await userAPI.post("/cart/validate-promo-code", {
      promoCode,
      orderItems: cartItems,
      finalAmount,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const getWalletDetails = async () => {
  try {
    const response = await userAPI.get("/wallet/history");

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};
