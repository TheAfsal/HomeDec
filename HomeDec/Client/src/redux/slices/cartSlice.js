import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartProducts: [],
  isDataFetched: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartsItems: (state, action) => {
      state.cartProducts = action.payload;
      state.isDataFetched = true;
    },
    addProductToCart: (state, action) => {
      const newCartItem = action.payload;
      const existingCartItemIndex = state.cartProducts.findIndex(
        (item) =>
          item.productDetails._id === newCartItem.productDetails._id &&
          item.variantId === newCartItem.variantId
      );

      if (existingCartItemIndex >= 0) {
        // Item exists, update its quantity
        const updatedCartItem = {
          ...state.cartProducts[existingCartItemIndex],
          quantity: newCartItem.quantity,
        };

        // Replace the old item with the updated item
        state.cartProducts[existingCartItemIndex] = updatedCartItem;
      } else {
        // Item does not exist, add it to the cart
        console.log(newCartItem);

        state.cartProducts.push(newCartItem);
      }
    },
    removeProduct: (state, action) => {
      const { productId, variantId } = action.payload;
      state.cartProducts = state.cartProducts.filter(
        (item) =>
          !(item.productDetails._id === productId && item.variantId === variantId)
      );
    },    
    clearCart: (state) => {
      state.cartProducts = []; // Clear all cartProducts from the cart
    },
  },
});

// Export actions
export const { addProductToCart, removeProduct, clearCart, fetchCartsItems } =
  cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
