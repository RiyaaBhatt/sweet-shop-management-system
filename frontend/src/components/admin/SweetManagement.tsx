import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  fetchProducts,
  createSweet,
  updateSweet,
  deleteSweet,
  Product,
} from "@/store/slices/productsSlice";
import type { Sweet as ApiSweet, CreateSweetInput } from "@/api/sweets";
import { sweetsApi } from "@/api/sweets";
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
  SweetCard,
  SweetCardContent,
  SweetCardHeader,
  SweetCardTitle,
  SweetCardDescription,
} from "@/components/ui/sweet-card";
import { Loading, ErrorMessage } from "@/components/ui/loading-error";
import { useApiState } from "@/hooks/use-api-state";
import SweetForm from "./SweetForm";

const SweetManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Product | undefined>();
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const {
    isLoading,
    error: loadError,
    handleRequest: handleLoadProducts,
  } = useApiState({
    errorMessage: "Failed to load products",
    showSuccessToast: false,
  });

  useEffect(() => {
    handleLoadProducts(() => dispatch(fetchProducts({})).unwrap());
  }, [dispatch, handleLoadProducts]);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleAddSweet = () => {
    setEditingSweet(undefined);
    setIsFormOpen(true);
  };

  const handleEditSweet = async (product: ApiSweet) => {
    setIsFormOpen(true);
    setIsEditLoading(true);
    try {
      const resp = await sweetsApi.getSweetById(product.id);
      const full = resp.data;
      setEditingSweet({
        ...full,
        imageUrl: full.image || "/placeholder.svg",
        stock: typeof full.quantity === "number" ? full.quantity : 0,
      } as Product);
    } catch (err) {
      // fallback to product we have
      setEditingSweet({
        ...product,
        imageUrl: product.image || "/placeholder.svg",
        stock: typeof product.quantity === "number" ? product.quantity : 0,
      } as Product);
      console.error("Failed to fetch sweet details", err);
      // optionally show a user-facing error here
    } finally {
      setIsEditLoading(false);
    }
  };

  const {
    isLoading: isSaving,
    error: savingError,
    handleRequest: handleSaveSweet,
  } = useApiState({
    successMessage: editingSweet
      ? "Sweet updated successfully"
      : "Sweet added successfully",
    errorMessage: editingSweet
      ? "Failed to update sweet"
      : "Failed to add sweet",
  });

  const {
    isLoading: isDeleting,
    error: deleteError,
    handleRequest: handleDeleteSweet,
  } = useApiState({
    successMessage: "Sweet deleted successfully",
    errorMessage: "Failed to delete sweet",
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      await handleDeleteSweet(() => dispatch(deleteSweet(id)).unwrap());
    }
  };

  const handleFormSubmit = async (data: CreateSweetInput) => {
    await handleSaveSweet(async () => {
      if (editingSweet) {
        await dispatch(
          updateSweet({ ...data, id: String(editingSweet.id) })
        ).unwrap();
      } else {
        await dispatch(createSweet(data)).unwrap();
      }
      setIsFormOpen(false);
    });
  };

  const categories = [
    "Traditional Sweets",
    "Sugar-Free",
    "Dry Fruits",
    "Cakes",
    "Seasonal Specials",
  ];

  return (
    <div className="space-y-6">
      <SweetCard variant="default">
        <SweetCardContent className="p-6">
          <SweetCardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <SweetCardTitle className="text-2xl">
                  Sweet Management
                </SweetCardTitle>
                <SweetCardDescription>
                  Manage your sweet inventory - Add, edit and remove sweets
                </SweetCardDescription>
              </div>
              <Button
                variant="hero"
                onClick={handleAddSweet}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sweet
              </Button>
            </div>
          </SweetCardHeader>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table/List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg animate-pulse"
                >
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-muted rounded" />
                    <div className="h-8 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No sweets found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first sweet to the inventory"}
              </p>
              {!searchQuery && !selectedCategory && (
                <Button variant="hero" onClick={handleAddSweet}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Sweet
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-sweet-cream rounded-lg flex items-center justify-center shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : null}
                    <span className="text-2xl">🍯</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm font-medium text-primary">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Qty: {product.stock}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                      {product.stock > 0 && product.stock < 5 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSweet(product)}
                      disabled={isSaving}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(String(product.id))}
                      disabled={isDeleting}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} sweets
            </div>
          )}
        </SweetCardContent>
      </SweetCard>

      <SweetForm
        sweet={editingSweet}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSaving || isEditLoading}
        error={savingError}
      />
    </div>
  );
};

export default SweetManagement;
