import React, { useEffect, useCallback, useState } from "react";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { debounce } from "@/lib/utils";
import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
} from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
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

const SORT_OPTIONS = [
  { label: "Name A-Z", value: "name:asc" },
  { label: "Name Z-A", value: "name:desc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Newest First", value: "createdAt:desc" },
];

const CATEGORIES = ["All", "Traditional Sweets", "Dry Fruits", "Sugar-Free"];

const Products: React.FC = () => {
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

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({
      search: searchQuery,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      sortBy: sortBy?.split(":")[0] as any,
      sortOrder: sortBy?.split(":")[1] as any,
      page,
    }));
  }, [dispatch, searchQuery, selectedCategory, sortBy, page]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(setSearchQuery(query));
      setPage(1);
    }, 300),
    [dispatch]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);
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

  const handleAddToCart = useCallback(
    (sweet: Sweet) => {
      dispatch(
        addToCart({
          id: sweet.id.toString(),
          name: sweet.name,
          price: sweet.price,
          image: sweet.image,
          quantity: 1,
        })
      );

      dispatch(
        addToast({
          title: "Added to cart",
          description: `${sweet.name} has been added to your cart.`,
          variant: "success",
        })
      );
    },
    [dispatch]
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search sweets..."
            onChange={handleSearch}
            defaultValue={searchQuery}
            className="w-full"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((sweet) => (
              <Card key={sweet.id}>
                <img
                  src={`/src/assets/${sweet.image}`}
                  alt={sweet.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
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
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(sweet)}
                    disabled={!sweet.isAvailable}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {sweet.isAvailable ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

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
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            Showing {filteredItems.length} sweet
            {filteredItems.length !== 1 ? "s" : ""}
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
