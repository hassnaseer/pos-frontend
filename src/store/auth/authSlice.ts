import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch, setAccessToken } from "../apiClient";

export type UserRole = "super-admin" | "admin" | "cashier" | "manager" | "technician";

export interface UserPermissions {
  canAccessPOS?: boolean;
  canManageProducts?: boolean;
  canManageTickets?: boolean;
  canManageCustomers?: boolean;
  canPostToSocialMedia?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessName?: string;
  businessType?: string;
  permissions?: UserPermissions;
}

export interface SignupData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  businessType: string;
  country: string;
}

export interface VerifyOTPResult {
  success: boolean;
  message?: string;
  user?: User;
  accessToken?: string;
  resetToken?: string;
}

const USER_KEY = "pos_user";

function loadStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  otpResult: VerifyOTPResult | null;
}

const initialState: AuthState = {
  user: loadStoredUser(),
  loading: false,
  error: null,
  otpResult: null,
};

const handleResponseError = async (response: Response, thunkAPI: { rejectWithValue: (v: string) => unknown }) => {
  let message = response.statusText || "Request failed";
  try {
    const body = await response.json();
    if (body?.message) message = typeof body.message === "string" ? body.message : JSON.stringify(body.message);
  } catch {
    const text = await response.text();
    if (text) message = text;
  }
  return thunkAPI.rejectWithValue(message);
};

/** Step 1: password OK → OTP sent (no session yet). */
export const login = createAsyncThunk<
  { email: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    const response = await apiFetch("/user/login", {
      method: "POST",
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });
    if (!response.ok) return handleResponseError(response, thunkAPI);
    const json = (await response.json()) as { data?: { email?: string } };
    const email = json.data?.email ?? payload.email;
    return { email };
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message || "Login failed");
  }
});

export const signup = createAsyncThunk<{ email: string }, SignupData, { rejectValue: string }>(
  "auth/signup",
  async (payload, thunkAPI) => {
    try {
      const response = await apiFetch("/user/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) return handleResponseError(response, thunkAPI);
      return { email: payload.email };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || "Signup failed");
    }
  }
);

export const verifyOTP = createAsyncThunk<
  VerifyOTPResult,
  { email: string; otp: string; flow: string },
  { rejectValue: string }
>("auth/verifyOTP", async (payload, thunkAPI) => {
  try {
    const response = await apiFetch("/user/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        otp: payload.otp,
        flow: payload.flow,
      }),
    });
    if (!response.ok) return handleResponseError(response, thunkAPI);
    const json = (await response.json()) as {
      data?: {
        user?: User;
        access_token?: string;
        accessToken?: string;
        success?: boolean;
      };
      message?: string;
    };
    const d = json.data;
    if (d?.user && (d.access_token || d.accessToken)) {
      const accessToken = d.access_token ?? d.accessToken ?? "";
      setAccessToken(accessToken);
      return {
        success: true,
        message: json.message,
        user: d.user,
        accessToken,
      };
    }
    return {
      success: true,
      message: json.message,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message || "OTP verification failed");
  }
});

export const resendOTP = createAsyncThunk<
  { success: boolean; message: string },
  { email: string; flow: string },
  { rejectValue: string }
>("auth/resendOTP", async (payload, thunkAPI) => {
  try {
    const response = await apiFetch("/user/resendCode", {
      method: "POST",
      body: JSON.stringify({ email: payload.email, flow: payload.flow }),
    });
    if (!response.ok) return handleResponseError(response, thunkAPI);
    const json = await response.json();
    return { success: true, message: (json.message as string) || "Sent" };
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message || "OTP resend failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.otpResult = null;
      setAccessToken(null);
      persistUser(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action: PayloadAction<VerifyOTPResult>) => {
        state.loading = false;
        state.otpResult = action.payload;
        state.error = null;
        if (action.payload.user) {
          state.user = action.payload.user;
          persistUser(action.payload.user);
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Verification failed";
      })
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Resend failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
