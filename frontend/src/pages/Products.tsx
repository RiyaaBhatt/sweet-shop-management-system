import React, { useEffect, useCallback, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { debounce } from "@/lib/utils";
import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  purchaseSweet,
} from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { cartApi } from "@/api/cart";
import { decrementStock } from "@/store/slices/productsSlice";
import { addToast } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sweet } from "@/api/sweets";
import Noimage from "../assets/traditional-sweets.jpg";

const CATEGORIES = ["All", "Traditional Sweets", "Dry Fruits", "Sugar-Free"];
const SORT_OPTIONS = [
  { label: "Name A-Z", value: "name:asc" },
  { label: "Name Z-A", value: "name:desc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Newest First", value: "createdAt:desc" },
];

const Products = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    meta,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    sortBy,
  } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const [field, order] = sortBy ? sortBy.split(":") : [undefined, undefined];
    dispatch(
      fetchProducts({
        search: searchQuery,
        category: selectedCategory === "ALL" ? undefined : selectedCategory,
        sortBy: field,
        sortOrder: order as "asc" | "desc" | undefined,
        page,
      })
    );
  }, [dispatch, searchQuery, selectedCategory, sortBy, page]);

  // stable debounced callback
  const debouncedRef = React.useRef(
    debounce((query: string) => {
      dispatch(setSearchQuery(query));
      setPage(1);
    }, 300)
  );

  const debouncedSearch = useCallback((query: string) => {
    debouncedRef.current(query);
  }, []);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
      setPage(1);
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      dispatch(setSortBy(sort));
      setPage(1);
    },
    [dispatch]
  );

  const handleQuantityChange = (id: number, value: number, max: number) => {
    if (value < 1) value = 1;
    if (value > max) value = max;
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = useCallback(
    async (sweet: Sweet) => {
      const qty = quantities[sweet.id] || 1;
      if (qty > sweet.quantity) {
        dispatch(
          addToast({
            message: `Only ${sweet.quantity} items available in stock.`,
            type: "error",
          })
        );
        return;
      }

      try {
        // Reserve stock on backend
        const res = await cartApi.reserve(sweet.id, qty);
        if (res.status === 200) {
          // Optimistically update product stock in UI
          dispatch(decrementStock({ id: sweet.id, qty }));

          dispatch(
            addToCart({
              id: sweet.id.toString(),
              name: sweet.name,
              price: sweet.price,
              image: sweet.image || Noimage,
              quantity: qty,
            })
          );

          dispatch(
            addToast({
              message: `Product has been added to your cart.`,
              type: "success",
            })
          );
        }
      } catch (err: unknown) {
        type ErrWithResp = { response?: { data?: { available?: number } } };
        const e = err as ErrWithResp;
        const avail = e.response?.data?.available;
        if (avail !== undefined) {
          dispatch(
            addToast({
              message: `Only ${avail} items available in stock.`,
              type: "error",
            })
          );
        } else {
          dispatch(
            addToast({ message: `Failed to add to cart.`, type: "error" })
          );
        }
      }
    },
    [dispatch, quantities]
  );

  const handlePurchase = useCallback(
    async (sweet: Sweet) => {
      const qty = quantities[sweet.id] || 1;
      if (qty > sweet.quantity) {
        dispatch(
          addToast({
            message: `Only ${sweet.quantity} items available in stock.`,
            type: "error",
          })
        );
        return;
      }

      try {
        await dispatch(purchaseSweet({ id: sweet.id, quantity: qty })).unwrap();
        dispatch(addToast({ message: "Purchase successful", type: "success" }));
      } catch (err) {
        dispatch(
          addToast({
            message: "Purchase failed due to insufficient quantity",
            type: "error",
          })
        );
      }
    },
    [dispatch, quantities]
  );

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search sweets..."
              onChange={handleSearch}
              defaultValue={searchQuery}
              className="w-full"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category === "All" ? "ALL" : category}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loader */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardHeader className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        // No products state
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((sweet) => (
              <Card key={sweet.id}>
                <CardHeader>
                  <CardTitle>{sweet.name}</CardTitle>
                  <CardDescription>{sweet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">₹{sweet.price}</span>
                    <div className="flex items-center gap-2">
                      {sweet.sugarFree && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Sugar Free
                        </span>
                      )}
                      {sweet.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user?.role !== "admin" ? (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="text-sm text-muted-foreground">
                        Quantity Available: {sweet.quantity}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          min={1}
                          max={sweet.quantity}
                          value={quantities[sweet.id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              sweet.id,
                              parseInt(e.target.value, 10),
                              sweet.quantity
                            )
                          }
                          className="w-20"
                        />
                        <Button
                          className="flex-1"
                          onClick={() => handleAddToCart(sweet)}
                          disabled={sweet.quantity < 1}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {sweet.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Admin view
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
