import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface PlatformSettings {
  id: string;
  settingName: string;
  value: string | boolean;
  description: string;
}

interface PlatformSettingsState {
  settings: PlatformSettings[];
  loading: boolean;
  error: string | null;
}

const initialState: PlatformSettingsState = {
  settings: [
    {
      id: "SETTING-001",
      settingName: "Billing Cycle",
      value: "Monthly",
      description: "Select the default billing plan frequency for new businesses.",
    },
    {
      id: "SETTING-002",
      settingName: "Approval Workflow",
      value: true,
      description: "Require approval before a new business can be activated.",
    },
    {
      id: "SETTING-003",
      settingName: "Platform Status",
      value: "Online",
      description: "Global status shown to all platform users.",
    },
  ],
  loading: false,
  error: null,
};

export const fetchPlatformSettings = createAsyncThunk<PlatformSettings[], void, { rejectValue: string }>(
  "superAdmin/fetchPlatformSettings",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/platform-settings");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch platform settings");
      }
      const data = (await response.json()) as PlatformSettings[];
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch platform settings");
    }
  }
);

export const platformSettingsSlice = createSlice({
  name: "platformSettings",
  initialState,
  reducers: {
    updateSetting(state, action: PayloadAction<PlatformSettings>) {
      state.settings = state.settings.map((setting) =>
        setting.id === action.payload.id ? action.payload : setting
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchPlatformSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load platform settings";
      });
  },
});

export const { updateSetting } = platformSettingsSlice.actions;
export default platformSettingsSlice.reducer;
