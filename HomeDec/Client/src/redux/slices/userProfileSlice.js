import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyDetails } from "../../api/user/account";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunk for fetching user profile details
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const myProfileDetails = await fetchMyDetails();
      return myProfileDetails;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to fetch");
    }
  }
);

// Slice definition
const profileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    enableLoading: (state) => {
      state.loading = true;
    },
    disableLoading: (state) => {
      state.loading = false;
    },
    setProfile: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
      });
  },
});

// Selectors
export const selectProfile = (state) => state.userProfile.profile;
export const selectLoading = (state) => state.userProfile.loading;
export const selectError = (state) => state.userProfile.error;

export const { enableLoading, disableLoading, setProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
