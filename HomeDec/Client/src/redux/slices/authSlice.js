import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/apiConfig";

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  role: null,
  loading: true, 
};

export const fetchUserRole = createAsyncThunk(
  "auth/fetchUserRole",
  async (_, { rejectWithValue }) => {
    console.log("calling API");
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await api.get("/admin/role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to fetch role");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("token"); // Clear token from local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.loading = false;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.role = null;
        state.error = action.payload; 
      });
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
