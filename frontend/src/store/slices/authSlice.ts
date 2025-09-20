import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Updated to match API schema
export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  tokenVersion: number;
  // Extended fields for UI
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('sweet_token'),
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Mock API calls - replace with real API
// Updated to match API response structure
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Mock API call to POST /api/auth/login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@sweetdelights.com') {
      return {
        accessToken: 'mock_admin_token_' + Date.now(),
        user: {
          id: 1,
          email: email,
          role: 'admin' as const,
          tokenVersion: 1,
          name: 'Sweet Admin',
          avatar: '/placeholder.svg',
        },
      };
    }
    
    return {
      accessToken: 'mock_token_' + Date.now(),
      user: {
        id: 2,
        email: email,
        role: 'user' as const,
        tokenVersion: 1,
        name: 'Sweet Customer',
        avatar: '/placeholder.svg',
      },
    };
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }) => {
    // Mock API call to POST /api/auth/register
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      accessToken: 'mock_token_' + Date.now(),
      user: {
        id: Date.now(),
        email: email,
        role: 'user' as const,
        tokenVersion: 1,
        name: email.split('@')[0], // Extract name from email
        avatar: '/placeholder.svg',
      },
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('sweet_token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('sweet_token', action.payload.accessToken);
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
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('sweet_token', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('sweet_token', action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;