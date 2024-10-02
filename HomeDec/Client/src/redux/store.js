import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import userProfileReducer from "./slices/userProfileSlice";

// Create and configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    userProfile: userProfileReducer,
  },
});

export default store;
