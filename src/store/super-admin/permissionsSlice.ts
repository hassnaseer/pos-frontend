import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  active: boolean;
}

interface PermissionsState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionsState = {
  permissions: [],
  loading: false,
  error: null,
};

export const fetchPermissions = createAsyncThunk<Permission[], void, { rejectValue: string }>(
  "superAdmin/fetchPermissions",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/permissions");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch permissions");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch permissions");
    }
  }
);

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load permissions";
      });
  },
});

export const { clearError } = permissionsSlice.actions;
export default permissionsSlice.reducer;
