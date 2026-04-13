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

interface BusinessesState {
  businesses: Business[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessesState = {
  businesses: [
    {
      id: "BUS-001",
      name: "Tech Retail Store",
      owner: "John Smith",
      email: "john@techretail.com",
      phone: "+1 555-0101",
      type: "Retail",
      plan: "Monthly",
      status: "Active",
      signupDate: "2024-01-15",
      expiryDate: "2024-02-15",
      revenue: "$2,450"
    },
    {
      id: "BUS-002",
      name: "Mike's Repair Shop",
      owner: "Mike Johnson",
      email: "mike@repairshop.com",
      phone: "+1 555-0102",
      type: "Repair Shop",
      plan: "Annual",
      status: "Active",
      signupDate: "2024-01-10",
      expiryDate: "2025-01-10",
      revenue: "$1,890"
    },
    {
      id: "BUS-003",
      name: "Cafe Central",
      owner: "Sarah Williams",
      email: "sarah@cafecentral.com",
      phone: "+1 555-0103",
      type: "Restaurant",
      plan: "Monthly",
      status: "Trial",
      signupDate: "2024-04-01",
      expiryDate: "2024-04-15",
      revenue: "$0"
    },
  ],
  loading: false,
  error: null,
};

export const fetchBusinesses = createAsyncThunk<Business[], void, { rejectValue: string }>(
  "superAdmin/fetchBusinesses",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/businesses");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch businesses");
      }
      const data = (await response.json()) as Business[];
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch businesses");
    }
  }
);

export const businessesSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {
    addBusiness(state, action: PayloadAction<Business>) {
      state.businesses.unshift(action.payload);
    },
    updateBusiness(state, action: PayloadAction<Business>) {
      state.businesses = state.businesses.map((business) =>
        business.id === action.payload.id ? action.payload : business
      );
    },
    deleteBusiness(state, action: PayloadAction<string>) {
      state.businesses = state.businesses.filter((business) => business.id !== action.payload);
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
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load businesses";
      });
  },
});

export const { addBusiness, updateBusiness, deleteBusiness } = businessesSlice.actions;
export default businessesSlice.reducer;
