import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UiState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  toasts: Toast[];
  modals: {
    cart: boolean;
    auth: boolean;
    productDetails: boolean;
  };
  mobileMenuOpen: boolean;
  searchOpen: boolean;
}

const initialState: UiState = {
  theme: (localStorage.getItem('sweet_theme') as 'light' | 'dark') || 'light',
  isLoading: false,
  toasts: [],
  modals: {
    cart: false,
    auth: false,
    productDetails: false,
  },
  mobileMenuOpen: false,
  searchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('sweet_theme', state.theme);
      
      // Apply theme to document
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('sweet_theme', action.payload);
      
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 5000,
      };
      state.toasts.push(toast);
    },
    
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    toggleModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UiState['modals']] = false;
      });
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    
    closeSearch: (state) => {
      state.searchOpen = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setLoading,
  addToast,
  removeToast,
  toggleModal,
  closeAllModals,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
  closeSearch,
} = uiSlice.actions;

export default uiSlice.reducer;