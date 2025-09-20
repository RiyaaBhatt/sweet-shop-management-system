import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  Sweet as ApiSweet,
  CreateSweetInput,
  UpdateSweetInput,
  sweetsApi,
  GetSweetsParams,
  PaginatedResponse,
} from "../../api/sweets";

export type Product = ApiSweet & { imageUrl: string; stock: number };

interface ProductsState {
  items: Product[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  meta: PaginatedResponse<ApiSweet>["meta"] | null;
}

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  searchQuery: "",
  selectedCategory: "All",
  sortBy: "createdAt:desc",
  meta: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: GetSweetsParams, { rejectWithValue }) => {
    try {
      const response = await sweetsApi.getAllSweets(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to fetch products"
          : "An unexpected error occurred"
      );
    }
  }
);

export const createSweet = createAsyncThunk(
  "products/createSweet",
  async (sweetData: CreateSweetInput, { rejectWithValue }) => {
    try {
      const response = await sweetsApi.createSweet(sweetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to create sweet"
          : "An unexpected error occurred"
      );
    }
  }
);

export const updateSweet = createAsyncThunk(
  "products/updateSweet",
  async (sweetData: UpdateSweetInput, { rejectWithValue }) => {
    try {
      const response = await sweetsApi.updateSweet(sweetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to update sweet"
          : "An unexpected error occurred"
      );
    }
  }
);

export const deleteSweet = createAsyncThunk(
  "products/deleteSweet",
  async (id: number | string, { rejectWithValue }) => {
    try {
      // sweetsApi expects string id
      await sweetsApi.deleteSweet(String(id));
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to delete sweet"
          : "An unexpected error occurred"
      );
    }
  }
);

export const purchaseSweet = createAsyncThunk(
  "products/purchaseSweet",
  async (
    { id, quantity }: { id: number | string; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await sweetsApi.purchaseSweet(id, quantity || 1);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to purchase sweet"
          : "An unexpected error occurred"
      );
    }
  }
);

export const restockSweet = createAsyncThunk(
  "products/restockSweet",
  async (
    { id, quantity }: { id: number | string; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await sweetsApi.restockSweet(id, quantity || 1);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to restock sweet"
          : "An unexpected error occurred"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "All";
      state.sortBy = "createdAt:desc";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items.map((sweet) => ({
          ...sweet,
          stock: typeof sweet.quantity === "number" ? sweet.quantity : 0,
          imageUrl: sweet.image || "/placeholder.svg",
        }));
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createSweet.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSweet.fulfilled, (state, action) => {
        state.isCreating = false;
        const newSweet = {
          ...action.payload,
          imageUrl: action.payload.image || "/placeholder.svg",
          stock:
            typeof action.payload.quantity === "number"
              ? action.payload.quantity
              : 0,
        } as Product;
        state.items.unshift(newSweet);
      })
      .addCase(createSweet.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(updateSweet.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSweet.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedSweet: Product = {
          ...action.payload,
          imageUrl: action.payload.image || "/placeholder.svg",
          stock:
            typeof action.payload.quantity === "number"
              ? action.payload.quantity
              : 0,
        } as Product;
        const index = state.items.findIndex(
          (item) => item.id === updatedSweet.id
        );
        if (index !== -1) state.items[index] = updatedSweet;
      })
      .addCase(updateSweet.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSweet.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSweet.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload)
        );
      })
      .addCase(deleteSweet.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(purchaseSweet.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(purchaseSweet.fulfilled, (state, action) => {
        state.isUpdating = false;
        // API returns updated sweet with reduced quantity
        const updated = action.payload;
        const idx = state.items.findIndex(
          (i) => String(i.id) === String(updated.id)
        );
        if (idx !== -1)
          state.items[idx] = {
            ...updated,
            imageUrl: updated.image || "/placeholder.svg",
            stock: typeof updated.quantity === "number" ? updated.quantity : 0,
          } as Product;
      })
      .addCase(purchaseSweet.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(restockSweet.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(restockSweet.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updated = action.payload;
        const idx = state.items.findIndex(
          (i) => String(i.id) === String(updated.id)
        );
        if (idx !== -1)
          state.items[idx] = {
            ...updated,
            imageUrl: updated.image || "/placeholder.svg",
            stock: typeof updated.quantity === "number" ? updated.quantity : 0,
          } as Product;
      })
      .addCase(restockSweet.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setSelectedCategory, setSortBy, clearFilters } =
  productsSlice.actions;

export default productsSlice.reducer;
