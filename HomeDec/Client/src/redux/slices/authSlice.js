import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../../api/apiConfigUser";
import api from "../../api/apiConfigAdmin";

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
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await api.get("/admin/role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || "Failed to fetch role");
    }
  }
);

export const verifyUserRole = createAsyncThunk(
  "auth/verifyUserRole",
  async (_, { rejectWithValue }) => {
    const key = localStorage.getItem("key");
    if (!key) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await userAPI.get("/verify-me", {
        headers: { Authorization: `Bearer ${key}` },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      
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
      localStorage.removeItem("key");
    },
    logoutAdmin(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
    },
    changeToken(state, action) {
      state.token = action.payload;
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
      })
      .addCase(verifyUserRole.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.loading = false;
      })
      .addCase(verifyUserRole.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.role = null;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, loginFailure, logout, changeToken, logoutAdmin } =
  authSlice.actions;

export default authSlice.reducer;
