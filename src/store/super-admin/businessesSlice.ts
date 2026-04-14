import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface Business {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  type: string;
  plan: string;
  status: string;
  signupDate: string;
  expiryDate: string;
  revenue: string;
}

export interface BusinessQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  plan?: string;
}

interface BusinessesState {
  businesses: Business[];
  selectedBusiness: Business | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessesState = {
  businesses: [],
  selectedBusiness: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchBusinesses = createAsyncThunk<Business[], BusinessQueryDto, { rejectValue: string }>(
  "superAdmin/fetchBusinesses",
  async (query = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.type) params.append('type', query.type);
      if (query.status) params.append('status', query.status);
      if (query.plan) params.append('plan', query.plan);

      const url = `/super-admin/businesses${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiFetch(url);
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch businesses");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch businesses");
    }
  }
);

export const createBusiness = createAsyncThunk<Business, Omit<Business, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  "superAdmin/createBusiness",
  async (businessData, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/businesses", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to create business");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to create business");
    }
  }
);

export const updateBusiness = createAsyncThunk<Business, { id: string; data: Partial<Business> }, { rejectValue: string }>(
  "superAdmin/updateBusiness",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/businesses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to update business");
      }
      const data_response = await response.json();
      return data_response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to update business");
    }
  }
);

export const fetchBusinessById = createAsyncThunk<Business, string, { rejectValue: string }>(
  "superAdmin/fetchBusinessById",
  async (id, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/businesses/${id}`);
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to fetch business");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch business");
    }
  }
);

export const deleteBusinessAsync = createAsyncThunk<string, string, { rejectValue: string }>(
  "superAdmin/deleteBusiness",
  async (id, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/businesses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to delete business");
      }
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to delete business");
    }
  }
);

export const businessesSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<BusinessQueryDto>) => {
      // This can be used to store current query params
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the API returns { data: Business[], pagination: {...} }
        // For now, since we're transitioning from mock data, we'll handle both formats
        if (Array.isArray(action.payload)) {
          state.businesses = action.payload;
          state.pagination = {
            page: 1,
            limit: 20,
            total: action.payload.length,
            totalPages: Math.ceil(action.payload.length / 20),
          };
        } else {
          state.businesses = action.payload.data || [];
          state.pagination = action.payload.pagination || null;
        }
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load businesses";
      })
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.unshift(action.payload);
        if (state.pagination) {
          state.pagination.total += 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create business";
      })
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = state.businesses.map((business) =>
          business.id === action.payload.id ? action.payload : business
        );
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update business";
      })
      .addCase(deleteBusinessAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusinessAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = state.businesses.filter((business) => business.id !== action.payload);
        if (state.pagination) {
          state.pagination.total -= 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(fetchBusinessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBusiness = action.payload;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load business";
      })
  },
});

export const { setQuery, clearError } = businessesSlice.actions;
export default businessesSlice.reducer;
