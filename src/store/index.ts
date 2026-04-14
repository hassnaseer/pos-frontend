import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import {
  businessesReducer,
  businessTypesReducer,
  roleManagementReducer,
  revenueReportsReducer,
  platformSettingsReducer,
  permissionsReducer,
  dashboardReducer,
} from "./super-admin";

const superAdminReducer = combineReducers({
  businesses: businessesReducer,
  businessTypes: businessTypesReducer,
  roleManagement: roleManagementReducer,
  revenueReports: revenueReportsReducer,
  platformSettings: platformSettingsReducer,
  permissions: permissionsReducer,
  dashboard: dashboardReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    superAdmin: superAdminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
