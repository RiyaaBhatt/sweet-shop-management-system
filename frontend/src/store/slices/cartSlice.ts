import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight?: string;
  category: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemsCount: number;
  isOpen: boolean;
  giftWrap: boolean;
  personalMessage: string;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemsCount: 0,
  isOpen: false,
  giftWrap: false,
  personalMessage: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Partial<CartItem> & { quantity?: number }>
    ) => {
      const payload = action.payload;
      const existingItem = state.items.find((item) => item.id === payload.id);
      const qtyToAdd =
        payload.quantity && payload.quantity > 0 ? payload.quantity : 1;

      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        state.items.push({ ...(payload as CartItem), quantity: qtyToAdd });
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemsCount = 0;
      state.giftWrap = false;
      state.personalMessage = "";
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setGiftWrap: (state, action: PayloadAction<boolean>) => {
      state.giftWrap = action.payload;
    },

    setPersonalMessage: (state, action: PayloadAction<string>) => {
      state.personalMessage = action.payload;
    },

    calculateTotals: (state) => {
      state.itemsCount = state.items.reduce(
        (count, item) => count + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Add gift wrap cost if selected
      if (state.giftWrap) {
        state.total += 50; // ₹50 for gift wrapping
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setGiftWrap,
  setPersonalMessage,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
