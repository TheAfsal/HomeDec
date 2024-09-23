import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Create and configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
