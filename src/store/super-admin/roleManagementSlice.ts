import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RoleManagementState {
  roles: RoleDefinition[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleManagementState = {
  roles: [
    {
      id: "ROLE-001",
      name: "Super Admin",
      description: "Full access to platform and all business data.",
      permissions: ["manage_users", "view_reports", "manage_settings", "manage_businesses"],
    },
    {
      id: "ROLE-002",
      name: "Admin",
      description: "Manage daily operations, products, orders, and reports.",
      permissions: ["manage_products", "manage_orders", "view_reports", "manage_staff"],
    },
    {
      id: "ROLE-003",
      name: "Cashier",
      description: "Access POS, sales, and customer checkout workflows.",
      permissions: ["access_pos", "create_sales", "view_customers"],
    },
  ],
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk<RoleDefinition[], void, { rejectValue: string }>(
  "superAdmin/fetchRoles",
  async (_, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/roles");
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch roles");
      }
      const data = (await response.json()) as RoleDefinition[];
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch roles");
    }
  }
);

export const roleManagementSlice = createSlice({
  name: "roleManagement",
  initialState,
  reducers: {
    addRole(state, action: PayloadAction<RoleDefinition>) {
      state.roles.push(action.payload);
    },
    updateRole(state, action: PayloadAction<RoleDefinition>) {
      state.roles = state.roles.map((role) => (role.id === action.payload.id ? action.payload : role));
    },
    deleteRole(state, action: PayloadAction<string>) {
      state.roles = state.roles.filter((role) => role.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load roles";
      });
  },
});

export const { addRole, updateRole, deleteRole } = roleManagementSlice.actions;
export default roleManagementSlice.reducer;
