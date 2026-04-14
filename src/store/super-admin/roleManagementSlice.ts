import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../apiClient";

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleQueryDto {
  page?: number;
  limit?: number;
  search?: string;
}

interface RoleManagementState {
  roles: RoleDefinition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoleManagementState = {
  roles: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk<RoleDefinition[], RoleQueryDto, { rejectValue: string }>(
  "superAdmin/fetchRoles",
  async (query = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);

      const url = `/super-admin/roles${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiFetch(url);
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text || "Failed to fetch roles");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to fetch roles");
    }
  }
);

export const createRole = createAsyncThunk<RoleDefinition, Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt' | 'isSystemRole'>, { rejectValue: string }>(
  "superAdmin/createRole",
  async (roleData, thunkAPI) => {
    try {
      const response = await apiFetch("/super-admin/roles", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to create role");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to create role");
    }
  }
);

export const updateRole = createAsyncThunk<RoleDefinition, { id: string; data: Partial<RoleDefinition> }, { rejectValue: string }>(
  "superAdmin/updateRole",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/roles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to update role");
      }
      const data_response = await response.json();
      return data_response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to update role");
    }
  }
);

export const deleteRoleAsync = createAsyncThunk<string, string, { rejectValue: string }>(
  "superAdmin/deleteRole",
  async (id, thunkAPI) => {
    try {
      const response = await apiFetch(`/super-admin/roles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        return thunkAPI.rejectWithValue(error.message || "Failed to delete role");
      }
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Failed to delete role");
    }
  }
);

export const roleManagementSlice = createSlice({
  name: "roleManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.pagination = {
          page: 1,
          limit: 20,
          total: action.payload.length,
          totalPages: Math.ceil(action.payload.length / 20),
        };
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load roles";
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.unshift(action.payload);
        if (state.pagination) {
          state.pagination.total += 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create role";
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.map((role) =>
          role.id === action.payload.id ? action.payload : role
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update role";
      })
      .addCase(deleteRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        if (state.pagination) {
          state.pagination.total -= 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete role";
      });
  },
});

export const { clearError } = roleManagementSlice.actions;
export default roleManagementSlice.reducer;
