import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface DashboardSummary {
  totalBusinesses: number;
  activeSubscriptions: number;
  trialBusinesses: number;
  expiredBusinesses: number;
  totalRevenue: string;
  latestReport: {
    period: string;
    totalSales: string;
    totalRevenue: string;
    activeBusinesses: number;
    newBusinesses: number;
    growth: string;
  } | null;
}

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk<DashboardSummary, void, { rejectValue: string }>(
  "superAdmin/fetchDashboardSummary",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/dashboard");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch dashboard summary");
      }
      const json = await response.json();
      const data = (json?.data ?? json) as DashboardSummary;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch dashboard summary");
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load dashboard summary";
      });
  },
});

export default dashboardSlice.reducer;
