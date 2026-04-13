import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import {
  businessesReducer,
  businessTypesReducer,
  roleManagementReducer,
  revenueReportsReducer,
  platformSettingsReducer,
} from "./super-admin";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    superAdmin: {
      businesses: businessesReducer,
      businessTypes: businessTypesReducer,
      roleManagement: roleManagementReducer,
      revenueReports: revenueReportsReducer,
      platformSettings: platformSettingsReducer,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
