import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  active: boolean;
}

export interface BusinessType {
  id: string;
  name: string;
  description: string;
  active: boolean;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessTypeQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

interface BusinessTypesState {
  businessTypes: BusinessType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessTypesState = {
  businessTypes: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchBusinessTypes = createAsyncThunk<BusinessType[], BusinessTypeQueryDto, { rejectValue: string }>(
  "superAdmin/fetchBusinessTypes",
  async (query = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.active !== undefined) params.append('active', query.active.toString());

      const url = `/super-admin/business-types${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiFetch(url);
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch business types");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch business types");
    }
  }
);

export const createBusinessType = createAsyncThunk<BusinessType, Omit<BusinessType, 'id' | 'createdAt' | 'updatedAt'> & { permissionIds?: string[] }, { rejectValue: string }>(
  "superAdmin/createBusinessType",
  async (typeData, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/business-types", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(typeData),
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to create business type");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to create business type");
    }
  }
);

export const updateBusinessType = createAsyncThunk<BusinessType, { id: string; data: Partial<BusinessType> & { permissionIds?: string[] } }, { rejectValue: string }>(
  "superAdmin/updateBusinessType",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/business-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to update business type");
      }
      const data_response = await response.json();
      return data_response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to update business type");
    }
  }
);

export const deleteBusinessTypeAsync = createAsyncThunk<string, string, { rejectValue: string }>(
  "superAdmin/deleteBusinessType",
  async (id, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/business-types/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to delete business type");
      }
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to delete business type");
    }
  }
);

export const businessTypesSlice = createSlice({
  name: "businessTypes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.businessTypes = action.payload;
        state.pagination = {
          page: 1,
          limit: 20,
          total: action.payload.length,
          totalPages: Math.ceil(action.payload.length / 20),
        };
      })
      .addCase(fetchBusinessTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load business types";
      })
      .addCase(createBusinessType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusinessType.fulfilled, (state, action) => {
        state.loading = false;
        state.businessTypes.unshift(action.payload);
        if (state.pagination) {
          state.pagination.total += 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(createBusinessType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create business type";
      })
      .addCase(updateBusinessType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusinessType.fulfilled, (state, action) => {
        state.loading = false;
        state.businessTypes = state.businessTypes.map((type) =>
          type.id === action.payload.id ? action.payload : type
        );
      })
      .addCase(updateBusinessType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update business type";
      })
      .addCase(deleteBusinessTypeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusinessTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.businessTypes = state.businessTypes.filter((type) => type.id !== action.payload);
        if (state.pagination) {
          state.pagination.total -= 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(deleteBusinessTypeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete business type";
      });
  },
});

export const { clearError } = businessTypesSlice.actions;
export default businessTypesSlice.reducer;
