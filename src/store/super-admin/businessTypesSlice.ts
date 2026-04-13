import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface BusinessType {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

interface BusinessTypesState {
  businessTypes: BusinessType[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessTypesState = {
  businessTypes: [
    {
      id: "TYPE-001",
      name: "Repair Shop",
      description: "For workshops, electronics repair, and maintenance businesses.",
      active: true,
    },
    {
      id: "TYPE-002",
      name: "Factory Industry",
      description: "For manufacturing, production, and industrial businesses.",
      active: true,
    },
    {
      id: "TYPE-003",
      name: "Pharmacy",
      description: "For pharmacies, clinics, and healthcare supply businesses.",
      active: true,
    },
  ],
  loading: false,
  error: null,
};

export const fetchBusinessTypes = createAsyncThunk<BusinessType[], void, { rejectValue: string }>(
  "superAdmin/fetchBusinessTypes",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/business-types");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch business types");
      }
      const data = (await response.json()) as BusinessType[];
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch business types");
    }
  }
);

export const businessTypesSlice = createSlice({
  name: "businessTypes",
  initialState,
  reducers: {
    addBusinessType(state, action: PayloadAction<BusinessType>) {
      state.businessTypes.push(action.payload);
    },
    updateBusinessType(state, action: PayloadAction<BusinessType>) {
      state.businessTypes = state.businessTypes.map((type) =>
        type.id === action.payload.id ? action.payload : type
      );
    },
    deleteBusinessType(state, action: PayloadAction<string>) {
      state.businessTypes = state.businessTypes.filter((type) => type.id !== action.payload);
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
      })
      .addCase(fetchBusinessTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load business types";
      });
  },
});

export const { addBusinessType, updateBusinessType, deleteBusinessType } = businessTypesSlice.actions;
export default businessTypesSlice.reducer;
