import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api/auth";
import { AxiosError } from "axios";

// Updated to match API schema
export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  name: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

// Normalized shape used throughout the slice
interface NormalizedAuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: ((): User | null => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

export const loginUser = createAsyncThunk<
  NormalizedAuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.login({ email, password });
      const data = response.data as AuthResponse;
      // Normalize to include token key expected by the slice
      const normalized: NormalizedAuthResponse = {
        token: data.accessToken,
        user: data.user,
      };
      return normalized;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const registerUser = createAsyncThunk<
  NormalizedAuthResponse,
  { email: string; password: string; name: string },
  { rejectValue: string }
>(
  "auth/register",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.register({ email, password, name });
      const data = response.data as AuthResponse;
      const normalized: NormalizedAuthResponse = {
        token: data.accessToken,
        user: data.user,
      };
      return normalized;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Registration failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  NormalizedAuthResponse,
  void,
  { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser();
    const data = response.data as AuthResponse;
    const normalized: NormalizedAuthResponse = {
      token: data.accessToken,
      user: data.user,
    };
    return normalized;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get current user"
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      authApi.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<NormalizedAuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (e) {
        // ignore serialization/localStorage errors in edge cases
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        try {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        } catch (e) {
          // ignore serialization/localStorage errors in edge cases
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        try {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        } catch (e) {
          // ignore serialization/localStorage errors in edge cases
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // getCurrentUser returns normalized payload; persist token if present
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
        try {
          if (action.payload.user) {
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          }
        } catch (e) {
          // ignore serialization/localStorage errors in edge cases
        }
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (e) {
          // ignore localStorage errors
        }
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
