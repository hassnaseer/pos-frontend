import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface RevenueReport {
  id: string;
  period: string;
  totalSales: string;
  totalRevenue: string;
  activeBusinesses: number;
  newBusinesses: number;
  growth: string;
}

interface RevenueReportsState {
  reports: RevenueReport[];
  loading: boolean;
  error: string | null;
  selectedPeriod: string;
}

const initialState: RevenueReportsState = {
  reports: [
    {
      id: "REPORT-001",
      period: "This Week",
      totalSales: "1,128",
      totalRevenue: "$71,347",
      activeBusinesses: 74,
      newBusinesses: 12,
      growth: "+8.7%",
    },
    {
      id: "REPORT-002",
      period: "This Month",
      totalSales: "4,920",
      totalRevenue: "$294,180",
      activeBusinesses: 212,
      newBusinesses: 37,
      growth: "+11.2%",
    },
    {
      id: "REPORT-003",
      period: "This Year",
      totalSales: "56,802",
      totalRevenue: "$3,420,120",
      activeBusinesses: 1_174,
      newBusinesses: 482,
      growth: "+24.5%",
    },
  ],
  loading: false,
  error: null,
  selectedPeriod: "This Month",
};

export const fetchRevenueReports = createAsyncThunk<RevenueReport[], void, { rejectValue: string }>(
  "superAdmin/fetchRevenueReports",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/revenue-reports");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch revenue reports");
      }
      const json = await response.json();
      const data = (json?.data ?? json) as RevenueReport[];
      persistPosData("super-admin", "revenueReports", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch revenue reports");
    }
  }
);

export const revenueReportsSlice = createSlice({
  name: "revenueReports",
  initialState,
  reducers: {
    setSelectedPeriod(state, action: PayloadAction<string>) {
      state.selectedPeriod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchRevenueReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load revenue reports";
      });
  },
});

export const { setSelectedPeriod } = revenueReportsSlice.actions;
export default revenueReportsSlice.reducer;
