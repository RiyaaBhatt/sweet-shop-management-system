import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Updated to match API schema
export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

// Extended interface for UI features
export interface Product extends Sweet {
  description?: string;
  weight?: string;
  ingredients?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  inStock?: boolean;
  featured?: boolean;
  occasions?: string[];
  sugarFree?: boolean;
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: 'name' | 'price' | 'popular' | 'newest';
}

// Admin management state
interface AdminState {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const initialState: ProductsState & AdminState = {
  items: [],
  filteredItems: [],
  categories: ['Traditional Sweets', 'Sugar-Free', 'Dry Fruits', 'Cakes', 'Seasonal Specials'],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  priceRange: [0, 2000],
  sortBy: 'popular',
  // Admin states
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

// Mock products data matching API schema
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Kaju Katli',
    category: 'Traditional Sweets',
    price: 800,
    quantity: 50,
    imageUrl: '/placeholder.svg',
    description: 'Premium cashew fudge made with pure ghee and silver leaf',
    weight: '500g',
    ingredients: ['Cashews', 'Sugar', 'Ghee', 'Silver Leaf'],
    nutritionInfo: { calories: 450, protein: 8, carbs: 35, fat: 28, sugar: 30 },
    inStock: true,
    featured: true,
    occasions: ['Diwali', 'Wedding', 'Birthday'],
    sugarFree: false,
  },
  {
    id: 2,
    name: 'Gulab Jamun',
    category: 'Traditional Sweets',
    price: 400,
    quantity: 75,
    imageUrl: '/placeholder.svg',
    description: 'Soft, spongy balls soaked in aromatic sugar syrup',
    weight: '1kg',
    ingredients: ['Milk Powder', 'Sugar', 'Cardamom', 'Rose Water'],
    nutritionInfo: { calories: 350, protein: 4, carbs: 45, fat: 18, sugar: 40 },
    inStock: true,
    featured: true,
    occasions: ['Festival', 'Celebration'],
    sugarFree: false,
  },
  {
    id: 3,
    name: 'Sugar-Free Laddu',
    category: 'Sugar-Free',
    price: 600,
    quantity: 30,
    imageUrl: '/placeholder.svg',
    description: 'Healthy besan laddu sweetened with dates and jaggery',
    weight: '500g',
    ingredients: ['Besan', 'Dates', 'Jaggery', 'Ghee', 'Nuts'],
    nutritionInfo: { calories: 280, protein: 6, carbs: 25, fat: 15, sugar: 12 },
    inStock: true,
    featured: false,
    occasions: ['Health Conscious', 'Diabetic Friendly'],
    sugarFree: true,
  },
];

// API thunks matching swagger endpoints
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (category?: string) => {
    // Mock API call to GET /api/sweets
    await new Promise(resolve => setTimeout(resolve, 1000));
    let products = [...mockProducts];
    if (category) {
      products = products.filter(p => p.category === category);
    }
    return products;
  }
);

export const createSweet = createAsyncThunk(
  'products/createSweet',
  async (sweetData: Omit<Sweet, 'id'>) => {
    // Mock API call to POST /api/sweets
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSweet: Sweet = {
      ...sweetData,
      id: Date.now(), // Mock ID generation
    };
    return newSweet;
  }
);

export const updateSweet = createAsyncThunk(
  'products/updateSweet',
  async ({ id, ...sweetData }: Sweet) => {
    // Mock API call to PUT /api/sweets/{id}
    await new Promise(resolve => setTimeout(resolve, 800));
    return { id, ...sweetData };
  }
);

export const deleteSweet = createAsyncThunk(
  'products/deleteSweet',
  async (id: number) => {
    // Mock API call to DELETE /api/sweets/{id}
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      productsSlice.caseReducers.filterProducts(state);
    },
    
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      productsSlice.caseReducers.filterProducts(state);
    },
    
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      productsSlice.caseReducers.filterProducts(state);
    },
    
    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'popular' | 'newest'>) => {
      state.sortBy = action.payload;
      productsSlice.caseReducers.sortProducts(state);
    },
    
    filterProducts: (state) => {
      let filtered = [...state.items];
      
      // Filter by search query
      if (state.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      
      // Filter by category
      if (state.selectedCategory) {
        filtered = filtered.filter(product => product.category === state.selectedCategory);
      }
      
      // Filter by price range
      filtered = filtered.filter(product =>
        product.price >= state.priceRange[0] && product.price <= state.priceRange[1]
      );
      
      state.filteredItems = filtered;
      productsSlice.caseReducers.sortProducts(state);
    },
    
    sortProducts: (state) => {
      switch (state.sortBy) {
        case 'name':
          state.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price':
          state.filteredItems.sort((a, b) => a.price - b.price);
          break;
        case 'popular':
          state.filteredItems.sort((a, b) => Number(b.featured) - Number(a.featured));
          break;
        case 'newest':
          state.filteredItems.sort((a, b) => b.id.localeCompare(a.id));
          break;
      }
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
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Create Sweet
      .addCase(createSweet.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSweet.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.push(action.payload);
        state.filteredItems.push(action.payload);
      })
      .addCase(createSweet.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || 'Failed to create sweet';
      })
      // Update Sweet
      .addCase(updateSweet.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSweet.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
          const filteredIndex = state.filteredItems.findIndex(item => item.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredItems[filteredIndex] = action.payload;
          }
        }
      })
      .addCase(updateSweet.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to update sweet';
      })
      // Delete Sweet
      .addCase(deleteSweet.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSweet.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload);
      })
      .addCase(deleteSweet.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || 'Failed to delete sweet';
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  setSortBy,
  filterProducts,
} = productsSlice.actions;

export default productsSlice.reducer;